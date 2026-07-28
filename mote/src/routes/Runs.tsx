import { Link, useParams } from 'react-router-dom';
import { useMote } from '../store/useMote';
import { byId } from '../data/roster';
import { MotePill } from '../components/Mote';
import { Button, Card, Chip, LayerChip, PageHead, TierChip } from '../components/ui';
import type { RunOutcome } from '../lib/types';

const OUTCOME: Record<RunOutcome, { label: string; tone: 'good' | 'warn' | 'stop' | 'neutral' }> = {
  done: { label: 'Done', tone: 'good' },
  waiting: { label: 'Waiting on you', tone: 'warn' },
  halted: { label: 'Halted', tone: 'stop' },
  running: { label: 'Running', tone: 'neutral' },
};

export function Runs() {
  const { runs } = useMote();

  return (
    <>
      <PageHead
        title="Work log"
        sub="Every run, step by step: what they saw, what they did, what they checked. Exportable, deletable, kept on this machine."
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="ghost">
              Export
            </Button>
            <Button size="sm" variant="quiet">
              Delete all
            </Button>
          </div>
        }
      />

      <Card className="divide-y divide-black/[.06]">
        {runs.map((r) => {
          const e = byId(r.employeeId);
          const o = OUTCOME[r.outcome];
          return (
            <Link key={r.id} to={`/runs/${r.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-canvas-sunk/60">
              <MotePill tint={e?.tint} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-medium">{r.title}</div>
                <div className="mt-0.5 text-[12.5px] muted">
                  {e?.name} · {r.startedAt} · {r.steps.length} steps · {r.shift} shift
                </div>
              </div>
              <Chip tone={o.tone}>{o.label}</Chip>
            </Link>
          );
        })}
      </Card>
    </>
  );
}

export function RunDetail() {
  const { id } = useParams();
  const run = useMote((s) => s.runs.find((r) => r.id === id));
  if (!run) return <p className="muted">No such run.</p>;

  const e = byId(run.employeeId);
  const o = OUTCOME[run.outcome];

  return (
    <>
      <Link to="/runs" className="mb-4 inline-block text-[13px] muted hover:text-shell-ink">
        ← Work log
      </Link>
      <PageHead
        title={run.title}
        sub={`${e?.name} · ${run.startedAt} · ${run.shift} shift · run ${run.id}`}
        action={<Chip tone={o.tone}>{o.label}</Chip>}
      />

      <Card className="overflow-hidden">
        {run.steps.map((s) => (
          <div key={s.n} className="flex gap-4 border-b hairline px-5 py-4 last:border-0">
            <span className="mt-0.5 w-5 shrink-0 text-[12.5px] tabular-nums text-shell-ink/30">
              {s.n}
            </span>

            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                s.verified ? 'bg-glow' : s.halt ? 'bg-[#ef7d8e]' : 'bg-crown'
              }`}
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2.5">
                <span className="font-mono text-[13px] font-medium">{s.action}</span>
                <span className="text-[13.5px] text-shell-ink/75">{s.target}</span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <LayerChip layer={s.layer} />
                <TierChip tier={s.tier} />
                <span className="text-[11.5px] muted">
                  {s.verified ? `verified · ${s.ms}ms` : s.halt ? 'post-condition failed' : 'not run'}
                </span>
              </div>

              {s.halt && (
                <div className="mt-3 rounded-xl bg-canvas-sunk px-4 py-3 text-[12.5px]">
                  <p>
                    <span className="muted">Expected </span>
                    {s.halt.expected}
                  </p>
                  <p className="mt-1">
                    <span className="muted">Observed </span>
                    {s.halt.observed}
                  </p>
                  <p className="mt-2 text-shell-ink/60">
                    One retry with an alternate strategy also failed, so {e?.name} stopped here rather
                    than guessing.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </Card>

      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="ghost">
          Export this run
        </Button>
        <Button size="sm" variant="quiet">
          Delete this run
        </Button>
      </div>
    </>
  );
}
