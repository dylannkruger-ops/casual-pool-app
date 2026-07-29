import { ROSTER } from '../data/roster';
import { Card, Chip, PageHead } from '../components/ui';
import { Avatar } from '../components/Avatar';

/**
 * Performance reviews (PRD §9.1) — the same bench numbers the gate uses.
 *
 * Shown as rows against the 95% line rather than as a five-column table: the
 * only question anyone asks here is "is this above the bar or not", and a bar
 * with the gate marked answers it without reading a number.
 */
export function Performance() {
  const rows = ROSTER.flatMap((e) => e.skills.map((s) => ({ e, s })));
  const shipped = rows.filter((r) => r.s.successRate !== null);
  const gating = rows.filter((r) => r.s.successRate === null);

  return (
    <>
      <PageHead
        title="Performance reviews"
        sub="Live success rates from the test bench, not from marketing. Success means the run finished with zero unplanned help from you and every post-condition checked out."
        action={<Chip tone="quiet">Updated hourly</Chip>}
      />

      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink/35">
        Shipped · {shipped.length}
      </h2>
      <Card className="mb-6 overflow-hidden">
        {shipped.map(({ e, s }) => (
          <div key={s.id} className="flex flex-col gap-3 border-b hairline p-4 last:border-0 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar id={e.id} size={30} />
              <div className="min-w-0">
                <div className="text-[14px] font-medium">{e.name}</div>
                <div className="truncate text-[12.5px] muted">{s.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:w-[280px]">
              {/* The bar runs 90–100%, so the 95% gate sits mid-scale and the
                  difference between 95.1 and 96.4 is actually visible. */}
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-sunk">
                <div
                  className="h-full rounded-full bg-glow"
                  style={{ width: `${Math.max(0, Math.min(100, (s.successRate! - 90) * 10))}%` }}
                />
                <span
                  className="absolute inset-y-0 w-px bg-ink/30"
                  style={{ left: '50%' }}
                  title="95% gate"
                />
              </div>
              <span className="w-14 shrink-0 text-right text-[13.5px] font-medium tabular-nums">
                {s.successRate}%
              </span>
              <span className="w-20 shrink-0 text-right text-[12.5px] muted">{s.runs} runs</span>
            </div>
          </div>
        ))}
      </Card>

      <h2 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink/35">
        Still gating · {gating.length}
      </h2>
      <Card className="overflow-hidden">
        {gating.map(({ e, s }) => (
          <div key={s.id} className="flex items-center gap-3 border-b hairline px-4 py-3.5 last:border-0 sm:px-5">
            <Avatar id={e.id} size={30} />
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium">{e.name}</div>
              <div className="truncate text-[12.5px] muted">{s.name}</div>
            </div>
            <span className="hidden shrink-0 text-[12.5px] muted sm:block">{s.runs} runs so far</span>
            <Chip tone="quiet">Joins {e.joining}</Chip>
          </div>
        ))}
      </Card>

      <div className="mt-5 max-w-2xl space-y-2 text-[13px] muted">
        <p>
          The line at the middle of each bar is the 95% gate. Nothing ships below it, and nothing
          in the second list is offered to you as hireable.
        </p>
        <p>
          Measured over at least 200 runs per skill, across three environments — a normal desk, a
          scaled laptop display, and a clean default-settings machine — with window positions and
          data volumes shuffled between runs.
        </p>
        <p>
          Approval steps built into a skill are part of the job, not interventions. An intervention
          is unplanned help: recovering a halt, fixing a mistyped field, re-pointing a lost window.
          Those are counted separately and never as success. If a number slips, it changes here
          first, before anything else happens.
        </p>
      </div>
    </>
  );
}
