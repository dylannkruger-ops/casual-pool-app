import "server-only";

import { createClient } from "@/lib/supabase/server";
import { isSeedMode } from "@/lib/env";
import { SEED_ITEMS } from "./seed";
import type { Item, ItemCategory, ItemFilters, ItemTier } from "@/lib/types";

/** Map a DB row (snake_case) to the public Item shape (camelCase). */
type ItemRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ItemCategory;
  tags: string[] | null;
  tier: ItemTier;
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

function rowToItem(r: ItemRow): Item {
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

const ITEM_COLUMNS =
  "id, slug, title, tagline, description, category, tags, tier, preview_video_url, preview_image_url, live_demo_url, tech_stack, is_new, drop_week, sort_order, published, created_at";

/** Apply filters in-memory (used for the seed path and as a shared helper). */
function applyFilters(items: Item[], filters: ItemFilters): Item[] {
  let out = items;
  if (filters.category)
    out = out.filter((i) => i.category === filters.category);
  if (filters.tier) out = out.filter((i) => i.tier === filters.tier);
  if (filters.isNew) out = out.filter((i) => i.isNew);
  if (filters.tags?.length)
    out = out.filter((i) =>
      filters.tags!.every((t) => i.tags.includes(t)),
    );
  if (filters.search) {
    const q = filters.search.toLowerCase();
    out = out.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.tagline.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some((t) => t.toLowerCase().includes(q)) ||
        i.techStack.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return out;
}

/** All published items, filtered + sorted. Seed fallback when no backend. */
export async function getItems(filters: ItemFilters = {}): Promise<Item[]> {
  if (isSeedMode) {
    const published = SEED_ITEMS.filter((i) => i.published);
    return applyFilters(published, filters).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    );
  }

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("items")
    .select(ITEM_COLUMNS)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return applyFilters((data as ItemRow[]).map(rowToItem), filters);
}

/** One published item by slug, or null. */
export async function getItemBySlug(slug: string): Promise<Item | null> {
  if (isSeedMode) {
    return SEED_ITEMS.find((i) => i.slug === slug && i.published) ?? null;
  }

  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("items")
    .select(ITEM_COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  return data ? rowToItem(data as ItemRow) : null;
}

/** Every distinct tag across published items, for the filter row. */
export async function getAllTags(): Promise<string[]> {
  const items = await getItems();
  return Array.from(new Set(items.flatMap((i) => i.tags))).sort();
}

/** Slugs for generateStaticParams / sitemap. */
export async function getAllSlugs(): Promise<string[]> {
  const items = await getItems();
  return items.map((i) => i.slug);
}
