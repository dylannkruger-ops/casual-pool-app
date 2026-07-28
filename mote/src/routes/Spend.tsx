import { spendStatus, useMote } from '../store/useMote';
import { byId } from '../data/roster';
import { Avatar } from '../components/Avatar';
import { Button, Card, Chip, PageHead, Row } from '../components/ui';
import type { CapBehaviour } from '../lib/types';

const usd = (n: number) => `$${n.toFixed(2)}`;

const AT_CAP: { id: CapBehaviour; label: string; sub: string }[] = [
  {
    id: 'ask',
    label: 'Ask me',
    sub: 'Everything pauses and MOTE asks whether to raise the cap or stop for the month.',
  },
  {
    id: 'pause',
    label: 'Stop starting new work',
    sub: 'Runs already going finish. Nothing new starts until the month rolls over or you raise the cap.',
  },
  {
    id: 'byo-key',
    label: 'Switch to my own API key',
    sub: 'Work carries on billed to your provider account instead of stopping. Needs a key in Settings.',
  },
];

/**
 * The spend guard. This is a ceiling on model cost — deliberately not a credit
 * meter: it never withholds a feature you have paid for, and it never stops an
 * export or your logs. It exists so a loop at 3am cannot empty your account.
 */
export function Spend() {
  const { spend, spendByEmployee, setCap, setAlertPct, setPerRunCeiling, setAtCap, plan } = useMote();
  const status = spendStatus({ spend, spendByEmployee });

  const rows = Object.entries(spendByEmployee).sort((a, b) => b[1] - a[1]);
  const barTone = status.blocked ? 'bg-[#ef7d8e]' : status.alerting ? 'bg-crown' : 'bg-glow';

  return (
    <>
      <PageHead
        title="Spend guard"
        sub="A hard ceiling on what your team can spend on model calls in a month. Set it once and stop worrying about a loop running you dry overnight."
        action={
          status.blocked ? (
            <Chip tone="stop">Cap reached</Chip>
          ) : status.alerting ? (
            <Chip tone="warn">{Math.round(status.pct)}% of cap</Chip>
          ) : (
            <Chip tone="good">Healthy</Chip>
          )
        }
      />

      <Card className="mb-4 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[28px] font-semibold tracking-[-.03em]">{usd(status.used)}</div>
            <p className="mt-0.5 text-[13px] muted">
              spent this month{spend.monthlyCapUsd !== null && ` of ${usd(spend.monthlyCapUsd)}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[12.5px] muted" htmlFor="cap">
              Monthly cap
            </label>
            <div className="flex items-center gap-1 rounded-xl border border-black/[.12] bg-white px-3">
              <span className="text-[13px] muted">$</span>
              <input
                id="cap"
                type="number"
                min={0}
                step={5}
                value={spend.monthlyCapUsd ?? ''}
                placeholder="none"
                onChange={(e) => setCap(e.target.value === '' ? null : Number(e.target.value))}
                className="h-9 w-20 bg-transparent text-[13.5px] focus-visible:ring-0"
              />
            </div>
            {spend.monthlyCapUsd !== null && (
              <Button size="sm" variant="quiet" onClick={() => setCap(null)}>
                Remove cap
              </Button>
            )}
          </div>
        </div>

        {spend.monthlyCapUsd !== null && (
          <div className="mt-4">
            <div className="h-2.5 overflow-hidden rounded-full bg-canvas-sunk">
              <div className={`h-full rounded-full ${barTone}`} style={{ width: `${status.pct}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[12px] muted">
              <span>Warns at {spend.alertAtPct}%</span>
              <span>{usd(Math.max(0, spend.monthlyCapUsd - status.used))} left</span>
            </div>
          </div>
        )}

        {spend.monthlyCapUsd === null && (
          <p className="mt-3 text-[13px] muted">
            No cap set — spend is unlimited. Put a number in if you would rather your team stopped
            than kept spending.
          </p>
        )}
      </Card>

      <div className="mb-4 grid gap-4 2xl:grid-cols-2">
        <Card className="px-5 py-1">
          <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
            Limits
          </div>
          <Row
            title="Warn me at"
            sub="A heads-up before you get there, not after."
            right={
              <select
                aria-label="Alert threshold"
                value={spend.alertAtPct}
                onChange={(e) => setAlertPct(Number(e.target.value))}
                className="h-9 rounded-lg border border-black/[.12] bg-white px-3 text-[13px]"
              >
                {[50, 70, 80, 90].map((p) => (
                  <option key={p} value={p}>
                    {p}% of cap
                  </option>
                ))}
              </select>
            }
          />
          <Row
            title="Stop any single run over"
            sub="Catches the runaway loop directly, without waiting for the monthly cap."
            right={
              <div className="flex items-center gap-1 rounded-lg border border-black/[.12] bg-white px-2.5">
                <span className="text-[13px] muted">$</span>
                <input
                  aria-label="Per-run ceiling"
                  type="number"
                  min={0}
                  step={0.1}
                  value={spend.perRunCeilingUsd}
                  onChange={(e) => setPerRunCeiling(Number(e.target.value))}
                  className="h-9 w-16 bg-transparent text-[13.5px] focus-visible:ring-0"
                />
              </div>
            }
          />
          <Row
            title="Free-tier overflow"
            sub="On Free the model is billed to your own key, so this cap is the only thing standing between a loop and your provider bill."
            right={<Chip tone="quiet">{plan === 'free' ? 'Your key' : 'Included'}</Chip>}
          />
        </Card>

        <Card className="px-5 py-1">
          <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
            When the cap is reached
          </div>
          {AT_CAP.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-start gap-3 border-b hairline py-4 last:border-0">
              <input
                type="radio"
                name="atcap"
                checked={spend.atCap === o.id}
                onChange={() => setAtCap(o.id)}
                className="mt-1 h-4 w-4 accent-[#16181b]"
              />
              <span>
                <span className="block text-sm font-medium">{o.label}</span>
                <span className="mt-0.5 block text-[13px] muted">{o.sub}</span>
              </span>
            </label>
          ))}
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b hairline px-5 py-4 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
          Where it went
        </div>
        {rows.map(([id, amount]) => {
          const e = byId(id);
          const share = status.used ? (amount / status.used) * 100 : 0;
          return (
            <div key={id} className="flex items-center gap-3.5 border-b hairline px-5 py-3.5 last:border-0">
              <Avatar id={id} size={30} />
              <span className="w-24 shrink-0 text-[13.5px] font-medium">{e?.name ?? id}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-canvas-sunk">
                <div className="h-full rounded-full bg-shell-ink/70" style={{ width: `${share}%` }} />
              </div>
              <span className="w-16 shrink-0 text-right text-[13px] tabular-nums">{usd(amount)}</span>
            </div>
          );
        })}
      </Card>

      <div className="mt-5 max-w-2xl space-y-2 text-[13px] muted">
        <p>
          This is a ceiling on model spend, not a credit meter. Your plan is never metered — nothing
          here withholds a feature you have paid for, pauses a run already in progress, or touches
          your logs and exports.
        </p>
        <p>
          Every run is also costed in the work log, so if one skill is quietly expensive you will see
          which one before the cap tells you.
        </p>
      </div>
    </>
  );
}
