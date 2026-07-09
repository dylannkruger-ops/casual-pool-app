import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { DownloadRecord } from "@/lib/types";

/** A user's download history, most recent first, with item title/slug joined. */
export async function getDownloads(userId: string): Promise<DownloadRecord[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("downloads")
    .select("id, user_id, item_id, created_at, items(slug, title)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (!data) return [];

  return data.map((row) => {
    const item = row.items as unknown as
      | { slug: string; title: string }
      | { slug: string; title: string }[]
      | null;
    const joined = Array.isArray(item) ? item[0] : item;
    return {
      id: row.id as string,
      userId: row.user_id as string,
      itemId: row.item_id as string,
      createdAt: row.created_at as string,
      itemSlug: joined?.slug,
      itemTitle: joined?.title,
    };
  });
}
