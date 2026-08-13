"use client";

import Link from "next/link";
import { useState } from "react";
import { PreviewMedia } from "./PreviewMedia";
import { Chip } from "@/components/glass/Chip";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";

const CATEGORY_LABEL: Record<Item["category"], string> = {
  template: "Template",
  scene: "Scene",
  background: "Background",
  section: "Section",
};

/**
 * A library card. Glass surface with a luminous preview behind, title, category
 * + tier + NEW badges. Hovers lift the card and start the preview. The whole
 * card is a link to the item detail (which opens as a modal via intercepting
 * routes when navigated client-side).
 */
export function ItemCard({ item }: { item: Item }) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={`/l/${item.slug}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={cn(
        "group glass block rounded-card p-3 transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:border-[var(--glass-border-strong)]",
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
      )}
    >
      <div className="relative">
        <PreviewMedia item={item} active={active} />

        {/* Badges float over the preview. */}
        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          {item.isNew && <Chip tone="new">New</Chip>}
        </div>
        <div className="absolute right-2.5 top-2.5 flex gap-1.5">
          <Chip tone={item.tier === "free" ? "free" : "premium"}>
            {item.tier === "free" ? "Free" : "Premium"}
          </Chip>
        </div>
      </div>

      <div className="px-1.5 pb-1 pt-3.5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight text-bone">
            {item.title}
          </h3>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.1em] text-faint">
            {CATEGORY_LABEL[item.category]}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{item.tagline}</p>

        {item.techStack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.techStack.slice(0, 3).map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default ItemCard;
