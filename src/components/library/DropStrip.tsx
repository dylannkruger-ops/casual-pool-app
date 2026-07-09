"use client";

import { useEffect, useState } from "react";

/** Ms until the next Friday 00:00 UTC. Drops land every Friday. */
function msToNextFriday(now: Date): number {
  const d = new Date(now);
  const day = d.getUTCDay(); // 0 Sun … 5 Fri
  let delta = (5 - day + 7) % 7;
  if (delta === 0) delta = 7; // if today is Friday, count to the next one
  const target = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + delta, 0, 0, 0),
  );
  return target.getTime() - now.getTime();
}

function format(ms: number): { d: number; h: number; m: number; s: number } {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

/**
 * "Drops every Friday" strip with a live countdown to the next drop. Hydrates
 * client-side (the first server paint shows the label without the ticking
 * clock, so there's no hydration mismatch and no layout shift).
 */
export function DropStrip() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(msToNextFriday(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const t = remaining !== null ? format(remaining) : null;

  return (
    <div className="glass flex flex-col items-center justify-between gap-4 rounded-card px-6 py-5 sm:flex-row">
      <div className="flex items-center gap-3">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
        </span>
        <div>
          <p className="font-display text-base font-semibold text-bone">
            New layers drop every Friday
          </p>
          <p className="text-sm text-muted">
            Fresh templates, scenes and sections — free and premium.
          </p>
        </div>
      </div>

      {t && (
        <div
          className="flex items-center gap-2 font-mono"
          aria-label="Time until the next drop"
        >
          <TimeCell value={t.d} unit="d" />
          <TimeCell value={t.h} unit="h" />
          <TimeCell value={t.m} unit="m" />
          <TimeCell value={t.s} unit="s" />
        </div>
      )}
    </div>
  );
}

function TimeCell({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex min-w-[3rem] flex-col items-center rounded-panel border border-[var(--glass-border)] px-2.5 py-1.5">
      <span className="text-lg font-semibold tabular-nums text-bone">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-faint">
        {unit}
      </span>
    </div>
  );
}

export default DropStrip;
