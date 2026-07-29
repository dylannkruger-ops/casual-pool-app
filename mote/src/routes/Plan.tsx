import { seatsFor, useMote } from '../store/useMote';
import { Button, Card, Chip, ComingLabel, PageHead } from '../components/ui';
import type { Plan as PlanId } from '../lib/types';

type Feature = { label: string; free: string; pro: string; studio: string; coming?: boolean };

/**
 * Availability honesty rule (PRD §6): anything not shipped is labelled, never
 * sold present-tense. Green actions are automatic on every tier — the plans
 * differ on amber and red handling only (FR-20).
 */
const FEATURES: Feature[] = [
  { label: 'Employees', free: 'Otto', pro: 'All 6', studio: 'Unlimited slots' },
  { label: 'Model', free: 'Your own API key', pro: 'Included', studio: 'Included, priority models' },
  { label: 'Reading and extracting', free: 'Automatic', pro: 'Automatic', studio: 'Automatic' },
  { label: 'Writing into documents', free: 'You confirm', pro: 'Trusted employees auto', studio: 'Trusted employees auto' },
  { label: 'Sending and deleting', free: 'You confirm', pro: 'You confirm', studio: 'You confirm' },
  { label: 'Scheduling', free: '—', pro: 'Daily & weekly', studio: 'Daily & weekly' },
  { label: 'Machines', free: '1', pro: '1', studio: '3' },
  { label: 'Unattended runs, approvals by phone', free: '—', pro: '—', studio: 'Yes' },
  { label: 'Cloud shift', free: '—', pro: 'Scheduled windows', studio: 'Always-on', coming: true },
  { label: 'Event triggers', free: '—', pro: '—', studio: 'Yes', coming: true },
  { label: 'Custom employee builder', free: '—', pro: '—', studio: 'Yes', coming: true },
];

const PLANS: { id: PlanId; name: string; price: string; line: string }[] = [
  { id: 'free', name: 'Free', price: '$0', line: 'One employee, your own key.' },
  { id: 'pro', name: 'Pro', price: '$29', line: 'The whole team, scheduled.' },
  { id: 'studio', name: 'Studio', price: '$79', line: 'Unlimited slots, three machines.' },
];

export function PlanPage() {
  const { plan, setPlan, hired } = useMote();

  return (
    <>
      <PageHead
        title="No credits. No meters."
        sub="Your team doesn't stop mid-month. Paid plans are never metered — what you pay is what you pay."
        action={<Chip tone="quiet">Annual: 2 months free</Chip>}
      />

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const current = plan === p.id;
          const seats = seatsFor(p.id);
          const wouldRetire = seats !== Infinity && hired.length > seats;
          return (
            <Card key={p.id} className={`p-5 ${current ? 'ring-1 ring-shell-ink' : ''}`}>
              <div className="flex items-baseline justify-between">
                <span className="text-[15px] font-semibold">{p.name}</span>
                {current && <Chip tone="good">Current</Chip>}
              </div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-[28px] font-semibold tracking-[-.03em]">{p.price}</span>
                <span className="text-[13px] muted">/mo</span>
              </div>
              <p className="mt-1.5 text-[13.5px] muted">{p.line}</p>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant={current ? 'ghost' : 'primary'}
                  disabled={current}
                  onClick={() => setPlan(p.id)}
                >
                  {current ? 'You are here' : `Switch to ${p.name}`}
                </Button>
              </div>
              {wouldRetire && !current && (
                <p className="mt-2.5 text-[12px] muted">
                  Retires {hired.length - seats} employee{hired.length - seats > 1 ? 's' : ''}. Your
                  logs and settings stay exactly as they are.
                </p>
              )}
            </Card>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-[13.5px]">
          <thead>
            <tr className="border-b hairline text-[11px] uppercase tracking-wider text-shell-ink/35">
              <th className="px-5 py-3 text-left font-medium">What you get</th>
              <th className="px-4 py-3 text-left font-medium">Free</th>
              <th className="px-4 py-3 text-left font-medium">Pro</th>
              <th className="px-4 py-3 text-left font-medium">Studio</th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map((f) => (
              <tr key={f.label} className="border-b hairline last:border-0">
                <td className="px-5 py-3.5">
                  <span className="flex flex-wrap items-center gap-2">
                    {f.label}
                    {f.coming && <ComingLabel />}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-shell-ink/70">{f.free}</td>
                <td className="px-4 py-3.5 text-shell-ink/70">{f.pro}</td>
                <td className="px-4 py-3.5 text-shell-ink/70">{f.studio}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>

      <div className="mt-5 max-w-2xl space-y-2 text-[13px] muted">
        <p>
          Rows marked <span className="whitespace-nowrap">“Coming v1.5”</span> are not built yet.
          They arrive on your plan at no extra charge — we would rather label them than let you buy
          something that isn't there.
        </p>
        <p>
          Free runs on your own API key, so the model cost is yours and there is no run cap. Paid
          plans have a published fair-use policy on scheduled and unattended volume — an anti-abuse
          floor, not a meter.
        </p>
      </div>
    </>
  );
}
