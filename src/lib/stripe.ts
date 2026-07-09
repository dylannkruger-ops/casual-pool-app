import "server-only";

import Stripe from "stripe";
import { env, isStripeConfigured } from "@/lib/env";
import type { SubscriptionPlan, SubscriptionStatus } from "@/lib/types";

/** Lazily-constructed Stripe client. Null when Stripe isn't configured. */
let _stripe: Stripe | null = null;
export function getStripe(): Stripe | null {
  if (!isStripeConfigured) return null;
  if (!_stripe) {
    _stripe = new Stripe(env.stripeSecretKey, {
      // Pin nothing here: the installed SDK's default API version is used,
      // which avoids a literal-type mismatch across SDK upgrades.
      appInfo: { name: "Lucen", url: env.siteUrl },
      typescript: true,
    });
  }
  return _stripe;
}

export function priceIdForPlan(plan: SubscriptionPlan): string {
  return plan === "annual" ? env.stripePriceAnnual : env.stripePriceMonthly;
}

export function planForPriceId(priceId: string | null | undefined): SubscriptionPlan | null {
  if (!priceId) return null;
  if (priceId === env.stripePriceAnnual) return "annual";
  if (priceId === env.stripePriceMonthly) return "monthly";
  return null;
}

/** Map a Stripe subscription status onto our narrower enum. */
export function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      // incomplete / paused — treat as no-access until it resolves.
      return "canceled";
  }
}
