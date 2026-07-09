import Link from "next/link";
import { Pill } from "@/components/glass/Pill";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      {/* Ghost 404 behind the glass, echoing the homepage signature. */}
      <span
        aria-hidden
        className="ghost-type pointer-events-none absolute select-none leading-none"
        style={{ fontSize: "clamp(9rem, 40vw, 30rem)" }}
      >
        404
      </span>

      <div className="relative z-10 flex flex-col items-center gap-5">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(79,227,232,0.6)]" />
          <span className="font-display text-lg font-semibold tracking-tight text-bone">
            lucen
          </span>
        </Link>
        <h1 className="font-display text-3xl font-semibold text-bone sm:text-4xl">
          This layer isn&apos;t here.
        </h1>
        <p className="max-w-sm text-muted">
          The page may have moved, or the item was retired. The library is the
          best place to pick up the thread.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Pill href="/">Back to the library</Pill>
          <Pill href="/pricing" variant="secondary">
            See pricing
          </Pill>
        </div>
      </div>
    </main>
  );
}
