import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, mapStripeStatus, planForPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { env, isStripeConfigured } from "@/lib/env";

/**
 * POST /api/webhooks/stripe — the source of truth for subscription state.
 *
 * Verifies the Stripe signature against the raw body, then upserts the
 * subscriptions row. Idempotent: every relevant event recomputes the row from
 * the current Stripe subscription, so replays and out-of-order delivery
 * converge to the same state. Writes use the service-role client (RLS bypass);
 * the client never writes subscriptions.
 */
export async function POST(request: Request) {
  if (!isStripeConfigured || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const stripe = getStripe();
  const admin = createAdminClient();
  if (!stripe || !admin) {
    return NextResponse.json({ error: "Server not ready." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "bad signature";
    return NextResponse.json({ error: `Invalid signature: ${message}` }, { status: 400 });
  }

  /** Recompute + upsert a subscriptions row from a Stripe subscription. */
  async function upsertFromSubscription(subscription: Stripe.Subscription) {
    const userId =
      (subscription.metadata?.userId as string | undefined) ?? null;
    if (!userId) return; // Can't attribute — skip rather than orphan a row.

    const priceId = subscription.items.data[0]?.price?.id ?? null;
    const periodEnd = subscription.items.data[0]?.current_period_end
      ?? (subscription as unknown as { current_period_end?: number }).current_period_end
      ?? null;

    await admin!
      .from("subscriptions")
      .upsert(
        {
          user_id: userId,
          stripe_customer_id:
            typeof subscription.customer === "string"
              ? subscription.customer
              : subscription.customer.id,
          stripe_subscription_id: subscription.id,
          status: mapStripeStatus(subscription.status),
          current_period_end: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null,
          plan: planForPriceId(priceId),
        },
        { onConflict: "user_id" },
      );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const subscription = await stripe.subscriptions.retrieve(subId);
          // Ensure userId is present on the subscription for later events.
          if (!subscription.metadata?.userId && session.client_reference_id) {
            subscription.metadata = {
              ...subscription.metadata,
              userId: session.client_reference_id,
            };
          }
          await upsertFromSubscription(subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await upsertFromSubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subField = (invoice as unknown as { subscription?: string | { id: string } })
          .subscription;
        const subId =
          typeof subField === "string" ? subField : subField?.id;
        if (subId) {
          const subscription = await stripe.subscriptions.retrieve(subId);
          await upsertFromSubscription(subscription);
        }
        break;
      }
      default:
        // Unhandled event types are acknowledged, not errored.
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "handler error";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
