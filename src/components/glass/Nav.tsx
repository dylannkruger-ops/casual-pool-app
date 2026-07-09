"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import { Pill } from "./Pill";

const CATEGORIES = [
  { label: "Templates", value: "template" },
  { label: "Scenes", value: "scene" },
  { label: "Backgrounds", value: "background" },
  { label: "Sections", value: "section" },
] as const;

/** Lucen wordmark — set in the display face, accent dot as the luminous glow. */
function Wordmark() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 rounded-pill px-1 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      aria-label="Lucen home"
    >
      <span
        aria-hidden
        className="size-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(79,227,232,0.6)] transition-transform duration-200 group-hover:scale-125"
      />
      <span className="font-display text-lg font-semibold tracking-tight text-bone">
        lucen
      </span>
    </Link>
  );
}

/**
 * The primary glass pill nav. Sticky, floats over the luminous background.
 * Category tabs deep-link into the library via `?category=`. Search + auth
 * are placeholders in this block; wired up in later blocks.
 *
 * `useSearchParams` requires a Suspense boundary for static prerendering, so
 * the reading component is wrapped below.
 */
export function Nav() {
  return (
    <Suspense fallback={<NavShell />}>
      <NavContent />
    </Suspense>
  );
}

/** Nav frame with no active-state resolution — used as the Suspense fallback. */
function NavShell() {
  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-6xl px-4">
      <nav
        className="glass-strong flex h-14 items-center gap-2 rounded-pill pl-4 pr-2"
        aria-label="Primary"
      >
        <Wordmark />
      </nav>
    </header>
  );
}

function NavContent() {
  const pathname = usePathname();
  const params = useSearchParams();
  const activeCategory = params.get("category");
  const onHome = pathname === "/";

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-6xl px-4">
      <nav
        className="glass-strong flex h-14 items-center gap-2 rounded-pill pl-4 pr-2"
        aria-label="Primary"
      >
        <Wordmark />

        <div className="mx-1 hidden h-6 w-px bg-[var(--glass-border)] md:block" />

        {/* Category tabs */}
        <ul className="hidden items-center gap-1 md:flex">
          {CATEGORIES.map((cat) => {
            const active = onHome && activeCategory === cat.value;
            return (
              <li key={cat.value}>
                <Link
                  href={`/?category=${cat.value}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center rounded-pill px-3.5 text-sm transition-colors duration-150",
                    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
                    active
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:text-bone hover:bg-[rgba(236,234,227,0.04)]",
                  )}
                >
                  {cat.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2">
          {/* Search — placeholder trigger, wired in Block 3. */}
          <button
            type="button"
            aria-label="Search the library"
            className="grid size-9 place-items-center rounded-pill text-muted transition-colors duration-150 hover:text-bone hover:bg-[rgba(236,234,227,0.04)] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* Auth — placeholder, wired in Block 2. */}
          <Pill href="/login" variant="secondary" size="sm">
            Sign in
          </Pill>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
