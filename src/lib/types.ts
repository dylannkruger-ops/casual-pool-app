/**
 * Domain types for Lucen. These mirror the Supabase schema
 * (supabase/migrations/0001_init.sql) and are the shape the data layer
 * returns whether it is reading from Postgres or from the local seed.
 */

export type ItemCategory = "template" | "scene" | "background" | "section";
export type ItemTier = "free" | "premium";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled";

export type SubscriptionPlan = "monthly" | "annual";

/** Public item shape — safe to send to the client. Never carries secrets. */
export interface Item {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ItemCategory;
  tags: string[];
  tier: ItemTier;
  previewVideoUrl: string | null;
  previewImageUrl: string | null;
  liveDemoUrl: string | null;
  techStack: string[];
  isNew: boolean;
  dropWeek: string | null; // ISO date (YYYY-MM-DD)
  sortOrder: number;
  published: boolean;
  createdAt: string; // ISO timestamp
}

/**
 * The gated payload. Lives only in `item_secrets` (RLS: no client reads) or,
 * in seed mode, in a server-only module. Reaches the browser exclusively as
 * the response of an authorised server route.
 */
export interface ItemSecret {
  itemId: string;
  promptText: string;
  iterationNotes: string | null;
  assetBundlePath: string | null;
}

export interface Profile {
  id: string;
  displayName: string | null;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null; // ISO timestamp
  plan: SubscriptionPlan | null;
}

export interface DownloadRecord {
  id: string;
  userId: string;
  itemId: string;
  createdAt: string;
  // Joined item fields for the account history view.
  itemSlug?: string;
  itemTitle?: string;
}

/** Filters accepted by the library grid, parsed from URL search params. */
export interface ItemFilters {
  category?: ItemCategory;
  tags?: string[];
  tier?: ItemTier;
  isNew?: boolean;
  search?: string;
}
