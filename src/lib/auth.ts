import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/env";
import type { Subscription, SubscriptionStatus } from "@/lib/types";

export interface SessionUser {
  id: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
}

/** The signed-in user (revalidated), or null. Safe to call in seed mode. */
export async function getUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    displayName:
      (user.user_metadata?.display_name as string | undefined) ??
      (user.user_metadata?.full_name as string | undefined) ??
      null,
    isAdmin: isAdminEmail(user.email),
  };
}

/** The user's subscription row, or null if they've never subscribed. */
export async function getSubscription(
  userId: string,
): Promise<Subscription | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select(
      "id, user_id, stripe_customer_id, stripe_subscription_id, status, current_period_end, plan",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return null;
  return {
    id: data.id,
    userId: data.user_id,
    stripeCustomerId: data.stripe_customer_id,
    stripeSubscriptionId: data.stripe_subscription_id,
    status: data.status as SubscriptionStatus,
    currentPeriodEnd: data.current_period_end,
    plan: data.plan,
  };
}

/**
 * Does this subscription currently grant premium access?
 *   • active / trialing        → yes
 *   • past_due                 → yes (grace period; UI shows a banner)
 *   • canceled                 → yes until current_period_end, then no
 *   • none                     → no
 */
export function subscriptionGrantsAccess(
  sub: Subscription | null,
  now: Date = new Date(),
): boolean {
  if (!sub) return false;
  switch (sub.status) {
    case "active":
    case "trialing":
    case "past_due":
      return true;
    case "canceled": {
      if (!sub.currentPeriodEnd) return false;
      return new Date(sub.currentPeriodEnd).getTime() > now.getTime();
    }
    default:
      return false;
  }
}

/** Convenience: is the current user entitled to premium content right now? */
export async function getEntitlement(userId: string): Promise<{
  hasAccess: boolean;
  subscription: Subscription | null;
}> {
  const subscription = await getSubscription(userId);
  return { hasAccess: subscriptionGrantsAccess(subscription), subscription };
}
