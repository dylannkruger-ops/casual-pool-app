import { LayerChip, TierChip } from './ui';
import type { Step } from '../lib/types';

/**
 * The receipt, inline in a conversation. Same records the work log stores —
 * a chat message never claims something the step list can't back up.
 */
export function StepReceipt({ steps, who }: { steps: Step[]; who: string }) {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-line bg-sunk/70">
      <div className="border-b border-line px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-ink/35">
        What {who} actually did
      </div>
      {steps.map((s) => (
        <div key={s.n} className="flex gap-3 border-b border-line px-4 py-2.5 last:border-0">
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
              s.verified ? 'bg-glow' : s.halt ? 'bg-[#ef7d8e]' : 'bg-crown'
            }`}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-mono text-[12.5px] font-medium">{s.action}</span>
              <span className="text-[13px] text-ink/75">{s.target}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <LayerChip layer={s.layer} />
              <TierChip tier={s.tier} />
              <span className="text-[11px] muted">
                {s.verified ? `verified · ${s.ms}ms` : s.halt ? 'post-condition failed' : 'not run'}
              </span>
            </div>
            {s.halt && (
              <div className="mt-2 rounded-lg bg-surface px-3 py-2 text-[12px]">
                <p>
                  <span className="muted">Expected </span>
                  {s.halt.expected}
                </p>
                <p className="mt-0.5">
                  <span className="muted">Observed </span>
                  {s.halt.observed}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
