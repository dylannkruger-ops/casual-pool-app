import { NextResponse } from "next/server";
import { z } from "zod";
import { getUser } from "@/lib/auth";
import { getStripe, priceIdForPlan } from "@/lib/stripe";
import { getSubscription } from "@/lib/auth";
import { env, isStripeConfigured } from "@/lib/env";

const bodySchema = z.object({
  plan: z.enum(["monthly", "annual"]),
  // Where to send the user after a successful checkout (intent preservation).
  redirect: z.string().startsWith("/").optional(),
});

/**
 * POST /api/checkout — create a Stripe Checkout Session for the chosen plan.
 * Requires a signed-in user. Preserves the intended post-checkout destination.
 */
export async function POST(request: Request) {
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

  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const { plan, redirect } = parsed.data;

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Billing unavailable." }, { status: 503 });
  }

  // Reuse an existing customer if we already have one for this user.
  const existing = await getSubscription(user.id);
  const dest = redirect ?? "/account";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceIdForPlan(plan), quantity: 1 }],
    allow_promotion_codes: true,
    client_reference_id: user.id,
    ...(existing?.stripeCustomerId
      ? { customer: existing.stripeCustomerId }
      : { customer_email: user.email ?? undefined }),
    subscription_data: {
      metadata: { userId: user.id, plan },
    },
    metadata: { userId: user.id, plan },
    success_url: `${env.siteUrl}${dest}?checkout=success`,
    cancel_url: `${env.siteUrl}/pricing?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
