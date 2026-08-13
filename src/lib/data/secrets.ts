import "server-only";

import { createAdminClient } from "@/lib/supabase/server";
import { isSeedMode, env } from "@/lib/env";
import { SEED_SECRETS } from "./seed-secrets";
import type { ItemSecret } from "@/lib/types";

/**
 * Fetch the gated secret (prompt text + asset path) for an item. This is the
 * ONLY module that touches item_secrets, and it is server-only. Callers MUST
 * have already verified access (free tier, or an active entitlement) before
 * invoking this — it performs no auth of its own.
 */
export async function getItemSecret(
  slug: string,
  itemId: string,
): Promise<ItemSecret | null> {
  if (isSeedMode) {
    return SEED_SECRETS[slug] ?? null;
  }

  const admin = createAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("item_secrets")
    .select("item_id, prompt_text, iteration_notes, asset_bundle_path")
    .eq("item_id", itemId)
    .maybeSingle();

  if (!data) return null;
  return {
    itemId: data.item_id,
    promptText: data.prompt_text,
    iterationNotes: data.iteration_notes,
    assetBundlePath: data.asset_bundle_path,
  };
}

/**
 * Mint a short-lived signed URL for an item's asset bundle. Returns null when
 * there is no bundle, or in seed mode (no real storage to sign against).
 */
export async function getSignedAssetUrl(
  assetBundlePath: string | null,
  expiresInSeconds = 120,
): Promise<string | null> {
  if (!assetBundlePath || isSeedMode) return null;

  const admin = createAdminClient();
  if (!admin) return null;

  const { data } = await admin.storage
    .from(env.assetBucket)
    .createSignedUrl(assetBundlePath, expiresInSeconds);

  return data?.signedUrl ?? null;
}
