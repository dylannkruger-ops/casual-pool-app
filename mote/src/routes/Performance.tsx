import { ROSTER } from '../data/roster';
import { Card, Chip, PageHead } from '../components/ui';
import { MotePill } from '../components/Mote';

/**
 * Performance reviews (PRD §9.1) — the same bench numbers the gate uses.
 * A skill that has not cleared 95% shows as gating, never as a rounded-up win.
 */
export function Performance() {
  return (
    <>
      <PageHead
        title="Performance reviews"
        sub="Live success rates from the test bench, not from marketing. Success means the run finished with zero unplanned help from you and every post-condition checked out."
        action={<Chip tone="quiet">Updated hourly</Chip>}
      />

      <Card className="overflow-hidden">
        <table className="w-full text-[13.5px]">
          <thead>
            <tr className="border-b hairline text-[11px] uppercase tracking-wider text-shell-ink/35">
              <th className="px-5 py-3 text-left font-medium">Employee</th>
              <th className="px-4 py-3 text-left font-medium">Skill</th>
              <th className="px-4 py-3 text-right font-medium">Success</th>
              <th className="px-4 py-3 text-right font-medium">Runs</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROSTER.flatMap((e) =>
              e.skills.map((s) => (
                <tr key={s.id} className="border-b hairline last:border-0">
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2.5">
                      <MotePill tint={e.tint} />
                      {e.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-shell-ink/70">{s.name}</td>
                  <td className="px-4 py-3.5 text-right tabular-nums">
                    {s.successRate ? `${s.successRate}%` : <span className="muted">—</span>}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-shell-ink/60">{s.runs}</td>
                  <td className="px-4 py-3.5">
                    {s.successRate ? (
                      <Chip tone="good">Shipped</Chip>
                    ) : (
                      <Chip tone="quiet">Gating — joins {e.joining}</Chip>
                    )}
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </Card>

      <div className="mt-5 max-w-2xl space-y-2 text-[13px] muted">
        <p>
          Measured over at least 200 runs per skill, across three environments — a normal desk, a
          scaled laptop display, and a clean default-settings machine — with window positions and
          data volumes shuffled between runs.
        </p>
        <p>
          Approval steps built into a skill are part of the job, not interventions. An intervention
          is unplanned help: recovering a halt, fixing a mistyped field, re-pointing a lost window.
          Those are counted separately and never as success.
        </p>
        <p>If a number slips, it changes here first, before anything else happens.</p>
      </div>
    </>
  );
}
