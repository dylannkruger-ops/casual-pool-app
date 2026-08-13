"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Chip } from "@/components/glass/Chip";
import { cn } from "@/lib/utils";
import type { ItemCategory, ItemTier } from "@/lib/types";

const CATEGORIES: { label: string; value: ItemCategory }[] = [
  { label: "Templates", value: "template" },
  { label: "Scenes", value: "scene" },
  { label: "Backgrounds", value: "background" },
  { label: "Sections", value: "section" },
];

/**
 * The library filter row: category tabs, tier + new toggles, and tag chips.
 * State lives entirely in the URL (search params) so filtered views are
 * shareable and the server renders the right grid. Uses `scroll: false` so
 * toggling a filter never jumps the page.
 */
export function FilterRow({ tags }: { tags: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const category = params.get("category") as ItemCategory | null;
  const tier = params.get("tier") as ItemTier | null;
  const isNew = params.get("new") === "1";
  const activeTags = (params.get("tags")?.split(",") ?? []).filter(Boolean);

  const push = useCallback(
    (next: URLSearchParams) => {
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null) next.delete(key);
      else next.set(key, value);
      push(next);
    },
    [params, push],
  );

  const toggleTag = useCallback(
    (tag: string) => {
      const set = new Set(activeTags);
      if (set.has(tag)) set.delete(tag);
      else set.add(tag);
      const next = new URLSearchParams(params.toString());
      if (set.size) next.set("tags", Array.from(set).join(","));
      else next.delete("tags");
      push(next);
    },
    [activeTags, params, push],
  );

  const hasAnyFilter = category || tier || isNew || activeTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Row 1: category tabs + tier/new toggles */}
      <div className="flex flex-wrap items-center gap-2">
        <TabButton
          active={!category}
          onClick={() => setParam("category", null)}
        >
          All
        </TabButton>
        {CATEGORIES.map((c) => (
          <TabButton
            key={c.value}
            active={category === c.value}
            onClick={() =>
              setParam("category", category === c.value ? null : c.value)
            }
          >
            {c.label}
          </TabButton>
        ))}

        <span className="mx-1 hidden h-5 w-px bg-[var(--glass-border)] sm:block" />

        <Chip
          as="button"
          tone="free"
          selected={tier === "free"}
          onClick={() => setParam("tier", tier === "free" ? null : "free")}
        >
          Free
        </Chip>
        <Chip
          as="button"
          tone="premium"
          selected={tier === "premium"}
          onClick={() => setParam("tier", tier === "premium" ? null : "premium")}
        >
          Premium
        </Chip>
        <Chip
          as="button"
          tone="new"
          selected={isNew}
          onClick={() => setParam("new", isNew ? null : "1")}
        >
          New
        </Chip>

        {hasAnyFilter && (
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="ml-1 rounded-pill px-3 py-1 text-xs text-faint transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Row 2: tag chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Chip
              key={tag}
              as="button"
              selected={activeTags.includes(tag)}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 items-center rounded-pill px-4 text-sm transition-colors duration-150",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
        active
          ? "bg-accent/15 text-accent"
          : "glass text-muted hover:text-bone",
      )}
    >
      {children}
    </button>
  );
}

export default FilterRow;
