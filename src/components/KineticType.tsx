"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The homepage signature element — kinetic type.
 *
 * A giant ghosted word set in the display face sits behind the hero glass and
 * responds to the pointer (parallax drift + a soft accent light that tracks
 * the cursor) and to scroll (gentle vertical parallax). Glass content floats
 * over it. Everything else on the site stays quiet.
 *
 * prefers-reduced-motion: all movement is disabled — the word renders static,
 * centred, with no cursor tracking. Honoured both via CSS (globals) and by
 * skipping the pointer listeners entirely.
 */
export function KineticType({
  word = "underlay",
  className,
}: {
  word?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Pointer position as -0.5..0.5 offsets from centre; scroll as px.
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        setPointer({ x: e.clientX / w - 0.5, y: e.clientY / h - 0.5 });
      });
    };
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  // Drift is intentionally small — quiet, premium, not a toy.
  const driftX = reduced ? 0 : pointer.x * 26;
  const driftY = reduced ? 0 : pointer.y * 16 + scrollY * 0.08;
  const lightX = reduced ? 50 : 50 + pointer.x * 60;
  const lightY = reduced ? 40 : 40 + pointer.y * 40;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 flex select-none justify-center overflow-hidden",
        className,
      )}
    >
      {/* Accent light that tracks the cursor, refracting through the glass above. */}
      <div
        className="absolute inset-0 transition-[background] duration-300 ease-out"
        style={{
          background: `radial-gradient(40rem 24rem at ${lightX}% ${lightY}%, rgba(79,227,232,0.16), transparent 65%)`,
        }}
      />
      <div
        className="ghost-type translate-y-0 whitespace-nowrap text-center leading-[0.8] transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${driftX}px, ${driftY}px, 0)`,
          fontSize: "clamp(5rem, 22vw, 20rem)",
        }}
      >
        {word}
      </div>
    </div>
  );
}

export default KineticType;
