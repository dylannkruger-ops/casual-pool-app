#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Lucen — Stripe webhook test harness.
#
# Verifies the /api/webhooks/stripe handler end to end in test mode. Requires
# the Stripe CLI (https://stripe.com/docs/stripe-cli) and `stripe login`.
#
# Usage:
#   1. In terminal A, run the app:            npm run dev
#   2. In terminal B, forward webhooks:       ./scripts/stripe-test.sh listen
#      → copy the printed "whsec_..." into STRIPE_WEBHOOK_SECRET in .env.local
#        and restart the dev server.
#   3. In terminal C, fire test events:       ./scripts/stripe-test.sh fire
#
# The real end-to-end path (recommended): open /pricing in the browser, sign
# in, click a plan, and pay with test card 4242 4242 4242 4242 (any future
# expiry, any CVC). The forwarded checkout.session.completed event will upsert
# your subscriptions row; /account should then show "Active".
# ---------------------------------------------------------------------------
set -euo pipefail

PORT="${PORT:-3000}"
ENDPOINT="http://localhost:${PORT}/api/webhooks/stripe"

case "${1:-help}" in
  listen)
    echo "Forwarding Stripe events to ${ENDPOINT}"
    echo "Copy the whsec_... secret below into STRIPE_WEBHOOK_SECRET, then restart the app."
    stripe listen --forward-to "${ENDPOINT}"
    ;;

  fire)
    # Note: triggered events carry synthetic objects without our userId in
    # subscription.metadata, so they exercise signature verification + routing
    # but won't attribute a row. Use the browser checkout flow for a full
    # attributed upsert. These confirm the handler ACKs each event type 2xx.
    echo "→ checkout.session.completed"
    stripe trigger checkout.session.completed
    echo "→ customer.subscription.updated"
    stripe trigger customer.subscription.updated
    echo "→ customer.subscription.deleted"
    stripe trigger customer.subscription.deleted
    echo "→ invoice.payment_failed"
    stripe trigger invoice.payment_failed
    echo "Done. Check the app logs and the Stripe CLI output for 200s."
    ;;

  prices)
    # One-time helper: create the two test-mode products/prices and print the
    # price IDs to paste into STRIPE_PRICE_MONTHLY / STRIPE_PRICE_ANNUAL.
    echo "Creating test-mode products + prices…"
    MONTHLY=$(stripe prices create \
      --unit-amount 1900 --currency usd \
      -d "recurring[interval]=month" \
      -d "product_data[name]=Lucen Pro Monthly" \
      --format json | grep -o '"id": "price_[^"]*"' | head -1)
    ANNUAL=$(stripe prices create \
      --unit-amount 19000 --currency usd \
      -d "recurring[interval]=year" \
      -d "product_data[name]=Lucen Pro Annual" \
      --format json | grep -o '"id": "price_[^"]*"' | head -1)
    echo "STRIPE_PRICE_MONTHLY = ${MONTHLY}"
    echo "STRIPE_PRICE_ANNUAL  = ${ANNUAL}"
    ;;

  *)
    grep '^#' "$0" | sed 's/^# \{0,1\}//'
    ;;
esac
