import { Pill } from "@/components/glass/Pill";

/**
 * The premium-locked state. Renders a BLURRED placeholder block — pure filler
 * text, never the real prompt — so the actual secret is never sent to the
 * client for a non-subscriber. The gate is enforced server-side; this is only
 * the visual tease + the upgrade path.
 */
const FILLER = [
  "Role and stack — build a production landing with the following exact",
  "design thesis. One luminous idea, committed to across every section, so the",
  "page reads as inevitable rather than assembled from parts and templates.",
  "Tokens — base near-black, a single accent, a four-step spacing scale, one",
  "display face at three weights, hairline borders and a soft deep shadow.",
  "Signature element — a single moment specified to the millisecond and pixel.",
  "Layout, section by section, with structure, rhythm and exact spacing values.",
  "Motion doctrine, performance budget, and a build order you follow one block",
  "at a time — stopping after each so the whole thing stays coherent and fast.",
];

export function LockedTeaser({
  isAuthed,
  redirect,
}: {
  isAuthed: boolean;
  redirect: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-card border border-[var(--glass-border)]">
      {/* Blurred filler — decorative only, aria-hidden, never the real prompt. */}
      <div
        aria-hidden
        className="select-none space-y-2.5 p-6 blur-[7px] [mask-image:linear-gradient(180deg,#000_10%,transparent_92%)]"
      >
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
          Build prompt
        </p>
        {FILLER.map((line, i) => (
          <p
            key={i}
            className="text-sm leading-relaxed text-bone/70"
            style={{ width: `${92 - (i % 4) * 9}%` }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Lock overlay + CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gradient-to-t from-[rgba(5,6,8,0.92)] via-[rgba(5,6,8,0.55)] to-transparent px-6 text-center">
        <div className="grid size-11 place-items-center rounded-full border border-[var(--glass-border-strong)] bg-[rgba(5,6,8,0.6)] text-accent">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-bone">
            Unlock the full prompt and assets
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            The complete build prompt plus the bundled asset zip — for this and
            every premium layer in the library.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Pill href="/pricing" size="md">
            Unlock everything
          </Pill>
          {!isAuthed && (
            <Pill
              href={`/login?redirect=${encodeURIComponent(redirect)}`}
              variant="secondary"
              size="md"
            >
              Sign in
            </Pill>
          )}
        </div>
      </div>
    </div>
  );
}

export default LockedTeaser;
