import "server-only";

import { getItemBySlug } from "@/lib/data/items";
import { getUser, getEntitlement, type SessionUser } from "@/lib/auth";
import type { Item } from "@/lib/types";

export type GateOk = { ok: true; item: Item; user: SessionUser | null };
export type GateDenied = {
  ok: false;
  code: 401 | 403 | 404;
  error: string;
  item?: Item;
};
export type GateResult = GateOk | GateDenied;

/**
 * The single access gate for premium payloads. Server-side, authoritative.
 *
 *   • item not found / unpublished        → 404
 *   • free item                           → allowed (user optional)
 *   • premium + not signed in             → 401
 *   • premium + signed in, no entitlement → 403
 *   • premium + active entitlement        → allowed
 *
 * Never leaks secret content — it only decides yes/no and returns the public
 * item plus the resolved user. The caller fetches the secret on `ok`.
 */
export async function gateItemAccess(slug: string): Promise<GateResult> {
  const item = await getItemBySlug(slug);
  if (!item) return { ok: false, code: 404, error: "Item not found." };

  if (item.tier === "free") {
    const user = await getUser();
    return { ok: true, item, user };
  }

  const user = await getUser();
  if (!user) {
    return {
      ok: false,
      code: 401,
      error: "Sign in to unlock premium items.",
      item,
    };
  }

  const { hasAccess } = await getEntitlement(user.id);
  if (!hasAccess) {
    return {
      ok: false,
      code: 403,
      error: "An active subscription is required to unlock this item.",
      item,
    };
  }

  return { ok: true, item, user };
}
