"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Item } from "@/lib/types";

/** Deterministic tint from a slug, for the solid-colour placeholder. */
function tintFor(slug: string): string {
  const tints = [
    "#1c2b3a",
    "#25313a",
    "#171a22",
    "#111d2e",
    "#241f2e",
    "#1a2530",
  ];
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return tints[h % tints.length];
}

/**
 * The card's preview surface. Priority:
 *   1. Looping muted video — lazy: only its source is attached once the card
 *      scrolls into view (IntersectionObserver), and it plays on hover.
 *   2. Poster image.
 *   3. A branded solid-colour placeholder (seed items), clearly marked.
 *
 * Reduced motion: the video is never auto-played; the poster/placeholder shows.
 */
export function PreviewMedia({
  item,
  active,
}: {
  item: Item;
  /** Whether the parent card is hovered/focused — triggers playback. */
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !item.previewVideoUrl) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [item.previewVideoUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduced) return;
    if (active && inView) {
      v.play().catch(() => undefined);
    } else {
      v.pause();
    }
  }, [active, inView, reduced]);

  const tint = tintFor(item.slug);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]"
      style={{ backgroundColor: tint }}
    >
      {item.previewVideoUrl ? (
        <video
          ref={videoRef}
          className="size-full object-cover"
          muted
          loop
          playsInline
          preload="none"
          poster={item.previewImageUrl ?? undefined}
          src={inView ? item.previewVideoUrl : undefined}
        />
      ) : item.previewImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.previewImageUrl}
          alt={`${item.title} preview`}
          className="size-full object-cover"
          loading="lazy"
        />
      ) : (
        <Placeholder tint={tint} label={item.category} active={active} />
      )}

      {/* Top light sheen so the glass rule holds even over the placeholder. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, rgba(125,238,241,0.14), transparent 55%)",
        }}
      />
    </div>
  );
}

/** Solid-colour placeholder with a moving accent glint — clearly a stand-in. */
function Placeholder({
  tint,
  label,
  active,
}: {
  tint: string;
  label: string;
  active: boolean;
}) {
  return (
    <div className="absolute inset-0" style={{ backgroundColor: tint }}>
      <div
        aria-hidden
        className={cn(
          "absolute -inset-1/2 opacity-40 transition-transform duration-700 ease-out",
          active ? "translate-x-[10%]" : "-translate-x-[10%]",
        )}
        style={{
          background:
            "conic-gradient(from 210deg at 50% 50%, transparent, rgba(79,227,232,0.25), transparent 55%)",
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">
          {label} · preview
        </span>
      </div>
    </div>
  );
}

export default PreviewMedia;
