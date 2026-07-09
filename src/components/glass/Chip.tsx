"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ChipTone = "neutral" | "accent" | "new" | "free" | "premium";

const tones: Record<ChipTone, string> = {
  neutral: "border-[var(--glass-border)] text-muted",
  accent: "border-[var(--glass-border-strong)] text-accent",
  // NEW badge — accent-filled, quiet glow.
  new: "border-transparent bg-accent/15 text-accent",
  // Free tier — bone outline.
  free: "border-[rgba(236,234,227,0.22)] text-bone/80",
  // Premium tier — warm gold to read distinctly from the cyan accent.
  premium: "border-warning/40 text-warning",
};

type ChipProps = {
  tone?: ChipTone;
  /** When true the chip is a toggle button (filters). Otherwise a static label. */
  selected?: boolean;
  as?: "span" | "button";
  className?: string;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/**
 * Small metadata / filter chip. Monospace label, hairline border. Use as a
 * static `<span>` for badges (NEW, tier, tech) or as a `<button>` toggle for
 * filter rows (pass `as="button"` + `selected`).
 */
export function Chip({
  tone = "neutral",
  selected = false,
  as = "span",
  className,
  children,
  ...rest
}: ChipProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-chip border px-2.5 py-1",
    "font-mono text-[11px] uppercase tracking-[0.08em] leading-none",
    "transition-colors duration-150",
    tones[tone],
    as === "button" &&
      "cursor-pointer hover:text-bone hover:border-[var(--glass-border-strong)] " +
        "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    as === "button" && selected && "bg-accent/15 text-accent border-transparent",
    className,
  );

  if (as === "button") {
    return (
      <button
        type="button"
        aria-pressed={selected}
        className={classes}
        {...rest}
      >
        {children}
      </button>
    );
  }
  return <span className={classes}>{children}</span>;
}

export default Chip;
