import { Suspense } from "react";
import { Nav } from "@/components/glass/Nav";
import { Pill } from "@/components/glass/Pill";
import { Chip } from "@/components/glass/Chip";
import { KineticType } from "@/components/KineticType";
import { FilterRow } from "@/components/library/FilterRow";
import { ItemCard } from "@/components/library/ItemCard";
import { DropStrip } from "@/components/library/DropStrip";
import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/Footer";
import { getItems, getAllTags } from "@/lib/data/items";
import type { ItemCategory, ItemTier } from "@/lib/types";

// Filters live in the URL, so this page is dynamic on search params.
export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    tier?: string;
    new?: string;
    tags?: string;
    q?: string;
  }>;
}) {
  const sp = await searchParams;
  const filters = {
    category: sp.category as ItemCategory | undefined,
    tier: sp.tier as ItemTier | undefined,
    isNew: sp.new === "1",
    tags: sp.tags?.split(",").filter(Boolean),
    search: sp.q,
  };

  const [items, tags] = await Promise.all([getItems(filters), getAllTags()]);

  return (
    <div className="relative min-h-dvh">
      <Nav />

      {/* Hero — kinetic type signature behind one line of positioning. */}
      <section className="relative mx-auto flex min-h-[64vh] max-w-6xl flex-col items-center justify-center px-4 pb-10 pt-24 text-center">
        <KineticType word="lucen" className="top-6 opacity-90" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <Chip tone="accent">
            <span className="size-1.5 rounded-full bg-accent" />
            New drops every Friday
          </Chip>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-6xl">
            Premium website layers, with the prompt and assets included.
          </h1>
          <p className="max-w-xl text-balance text-base text-muted sm:text-lg">
            Browse templates, scenes, backgrounds and sections. Preview them
            live, then unlock the full build prompt and bundled assets.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Pill href="/pricing" size="lg">
              Unlock everything
            </Pill>
            <Pill href="#library" variant="secondary" size="lg">
              Browse the library
            </Pill>
          </div>
        </div>
      </section>

      {/* Library */}
      <section id="library" className="mx-auto max-w-6xl scroll-mt-24 px-4">
        <div className="mb-6">
          <Suspense
            fallback={<div className="h-9" aria-hidden />}
          >
            <FilterRow tags={tags} />
          </Suspense>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="No layers match those filters"
            message="Try clearing a filter or two — or browse everything. New layers land every Friday, so check back soon."
            action={
              <Pill href="/" variant="secondary">
                Clear filters
              </Pill>
            }
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <DropStrip />
        </div>
      </section>

      <Footer />
    </div>
  );
}
