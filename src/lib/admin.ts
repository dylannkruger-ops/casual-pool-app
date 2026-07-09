import "server-only";

import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { isSeedMode } from "@/lib/env";
import { SEED_ITEMS } from "@/lib/data/seed";
import type { Item, ItemSecret } from "@/lib/types";

/** Redirect non-admins away. Returns the admin user on success. */
export async function requireAdmin() {
  const user = await getUser();
  if (!user) redirect("/login?redirect=/admin");
  if (!user.isAdmin) redirect("/");
  return user;
}

type AdminItemRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: Item["category"];
  tags: string[] | null;
  tier: Item["tier"];
  preview_video_url: string | null;
  preview_image_url: string | null;
  live_demo_url: string | null;
  tech_stack: string[] | null;
  is_new: boolean;
  drop_week: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

function toItem(r: AdminItemRow): Item {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    tagline: r.tagline,
    description: r.description,
    category: r.category,
    tags: r.tags ?? [],
    tier: r.tier,
    previewVideoUrl: r.preview_video_url,
    previewImageUrl: r.preview_image_url,
    liveDemoUrl: r.live_demo_url,
    techStack: r.tech_stack ?? [],
    isNew: r.is_new,
    dropWeek: r.drop_week,
    sortOrder: r.sort_order,
    published: r.published,
    createdAt: r.created_at,
  };
}

/** All items including unpublished (admin view). Seed fallback when no DB. */
export async function getAdminItems(): Promise<Item[]> {
  if (isSeedMode) return [...SEED_ITEMS].sort((a, b) => a.sortOrder - b.sortOrder);

  const admin = createAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("items")
    .select("*")
    .order("sort_order", { ascending: true });
  return ((data as AdminItemRow[] | null) ?? []).map(toItem);
}

/** One item + its secret for the editor. Seed fallback (secret omitted). */
export async function getAdminItem(
  id: string,
): Promise<{ item: Item | null; secret: ItemSecret | null }> {
  if (isSeedMode) {
    const item = SEED_ITEMS.find((i) => i.id === id) ?? null;
    return { item, secret: null };
  }

  const admin = createAdminClient();
  if (!admin) return { item: null, secret: null };

  const { data: itemRow } = await admin
    .from("items")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!itemRow) return { item: null, secret: null };

  const { data: secretRow } = await admin
    .from("item_secrets")
    .select("item_id, prompt_text, iteration_notes, asset_bundle_path")
    .eq("item_id", id)
    .maybeSingle();

  return {
    item: toItem(itemRow as AdminItemRow),
    secret: secretRow
      ? {
          itemId: secretRow.item_id,
          promptText: secretRow.prompt_text,
          iterationNotes: secretRow.iteration_notes,
          assetBundlePath: secretRow.asset_bundle_path,
        }
      : null,
  };
}
