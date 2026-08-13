import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { getAdminItems } from "@/lib/admin";
import { togglePublish } from "./actions";
import { Nav } from "@/components/glass/Nav";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { Chip } from "@/components/glass/Chip";
import { Pill } from "@/components/glass/Pill";
import { isSeedMode } from "@/lib/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  await requireAdmin();
  const items = await getAdminItems();

  return (
    <div className="relative min-h-dvh">
      <Nav />
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-28">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              Admin
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-bone">
              Library items
            </h1>
          </div>
          <Pill href="/admin/items/new" size="md">
            New item
          </Pill>
        </div>

        {isSeedMode && (
          <div className="mb-6 rounded-panel border border-warning/30 bg-warning/5 p-4 text-sm text-warning">
            Seed mode — you&apos;re viewing the built-in demo items read-only.
            Configure Supabase (see the README) to create, edit and publish real
            items.
          </div>
        )}

        <GlassPanel className="divide-y divide-[var(--glass-border)]">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center gap-3 px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/items/${item.id}`}
                    className="truncate font-medium text-bone hover:text-accent"
                  >
                    {item.title}
                  </Link>
                  <Chip tone={item.tier === "free" ? "free" : "premium"}>
                    {item.tier}
                  </Chip>
                  {item.isNew && <Chip tone="new">new</Chip>}
                </div>
                <p className="mt-0.5 truncate font-mono text-xs text-faint">
                  /{item.slug} · {item.category} · sort {item.sortOrder}
                </p>
              </div>

              <Chip tone={item.published ? "accent" : "neutral"}>
                {item.published ? "published" : "draft"}
              </Chip>

              <form action={togglePublish}>
                <input type="hidden" name="id" value={item.id} />
                <input
                  type="hidden"
                  name="next"
                  value={(!item.published).toString()}
                />
                <button
                  type="submit"
                  disabled={isSeedMode}
                  className="rounded-pill border border-[var(--glass-border)] px-3 py-1.5 text-xs text-muted transition-colors hover:text-bone disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                  {item.published ? "Unpublish" : "Publish"}
                </button>
              </form>

              <Link
                href={`/admin/items/${item.id}`}
                className="rounded-pill px-3 py-1.5 text-xs text-accent hover:underline"
              >
                Edit
              </Link>
            </div>
          ))}

          {items.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted">
              No items yet. Create your first one.
            </div>
          )}
        </GlassPanel>
      </main>
    </div>
  );
}
