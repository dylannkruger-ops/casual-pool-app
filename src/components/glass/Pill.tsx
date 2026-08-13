"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-pill font-medium " +
  "whitespace-nowrap select-none transition-[transform,box-shadow,background-color,color,opacity] " +
  "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const sizes: Record<Size, string> = {
  sm: "h-8 px-4 text-[13px]",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-[15px]",
};

const variants: Record<Variant, string> = {
  // Solid accent, glow on hover, lifts 2px. The one loud element.
  primary:
    "bg-accent text-void font-semibold shadow-[0_8px_24px_-8px_rgba(79,227,232,0.5)] " +
    "hover:-translate-y-0.5 hover:bg-accent-bright hover:accent-glow " +
    "active:translate-y-0 active:bg-accent-dim",
  // Glass pill — quiet secondary action.
  secondary:
    "glass text-bone hover:-translate-y-0.5 hover:border-[var(--glass-border-strong)] " +
    "active:translate-y-0",
  // Text-only, for tertiary / nav actions.
  ghost:
    "text-muted hover:text-bone hover:bg-[rgba(236,234,227,0.04)] active:text-bone",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children?: ReactNode;
};

/** Spinner shown in the loading state; hides label but preserves width. */
function Spinner() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 grid place-items-center"
    >
      <span className="size-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
    </span>
  );
}

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
    href: string;
  };

export type PillProps = ButtonProps | LinkProps;

/**
 * The universal pill control — primary/secondary/ghost, three sizes.
 * Renders as a Next `<Link>` when `href` is passed, otherwise a `<button>`.
 * Every state is covered: hover, focus-visible, active, disabled, loading.
 */
export const Pill = forwardRef<HTMLButtonElement | HTMLAnchorElement, PillProps>(
  function Pill(
    { variant = "primary", size = "md", loading = false, className, children, ...rest },
    ref,
  ) {
    const classes = cn(base, sizes[size], variants[variant], className);
    const inner = (
      <>
        {loading && <Spinner />}
        <span className={cn("contents", loading && "invisible")}>{children}</span>
      </>
    );

    if ("href" in rest && rest.href !== undefined) {
      const { href, ...anchorRest } = rest as LinkProps;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          aria-busy={loading || undefined}
          {...anchorRest}
        >
          {inner}
        </Link>
      );
    }

    const { disabled, ...btnRest } = rest as ButtonProps;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...btnRest}
      >
        {inner}
      </button>
    );
  },
);

export default Pill;
