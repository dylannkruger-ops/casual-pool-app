import { NextResponse } from "next/server";
import { getUser, getSubscription } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { env, isStripeConfigured } from "@/lib/env";

/**
 * POST /api/portal — open the Stripe Customer Portal for the signed-in user so
 * they can upgrade, change card, or cancel. Requires an existing customer.
 */
export async function POST() {
  if (!isStripeConfigured) {
    return NextResponse.json(
      { error: "Billing isn't configured on this deployment." },
      { status: 503 },
    );
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }

  const sub = await getSubscription(user.id);
  if (!sub?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account yet — subscribe first." },
      { status: 400 },
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Billing unavailable." }, { status: 503 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${env.siteUrl}/account`,
  });

  return NextResponse.json({ url: session.url });
}
