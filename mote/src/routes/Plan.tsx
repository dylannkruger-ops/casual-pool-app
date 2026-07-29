import { seatsFor, useMote } from '../store/useMote';
import { Button, Card, Chip, PageHead } from '../components/ui';
import type { Plan as PlanId } from '../lib/types';

type Line = { text: string; coming?: boolean; off?: boolean };

type PlanDef = {
  id: PlanId;
  name: string;
  price: string;
  line: string;
  inherits?: string;
  features: Line[];
};

/**
 * Cards, not a comparison table. An 11-row grid made you read across four
 * columns to answer "what do I get", and it was the one thing on a phone that
 * had to scroll sideways. Each plan now states its own case.
 *
 * Availability honesty rule (PRD §6): anything not shipped is labelled, never
 * sold present-tense.
 */
const PLANS: PlanDef[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    line: 'One employee, running on your own API key.',
    features: [
      { text: 'One employee — Wren, on the front desk' },
      { text: 'Bring your own API key' },
      { text: 'Reading and extracting runs on its own' },
      { text: 'You confirm every write and every send' },
      { text: 'One machine' },
      { text: 'Scheduling', off: true },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    line: 'The whole team, working to a schedule.',
    inherits: 'Everything in Free, plus',
    features: [
      { text: 'All eight employees' },
      { text: 'Model included — no key to manage' },
      { text: 'Trusted employees write without asking' },
      { text: 'Daily and weekly schedules' },
      { text: 'Cloud shift — scheduled windows', coming: true },
    ],
  },
  {
    id: 'studio',
    name: 'Studio',
    price: '$79',
    line: 'Unlimited slots, three machines, hands off.',
    inherits: 'Everything in Pro, plus',
    features: [
      { text: 'Unlimited employee slots' },
      { text: 'Priority models, newest first' },
      { text: 'Three machines' },
      { text: 'Unattended runs, approvals on your phone' },
      { text: 'Cloud shift — always on', coming: true },
      { text: 'Event triggers', coming: true },
      { text: 'Custom employee builder', coming: true },
    ],
  },
];

function Tick({ off }: { off?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`mt-[3px] shrink-0 ${off ? 'text-shell-ink/20' : 'text-glow-dim'}`}
    >
      {off ? <path d="M6 10h8" /> : <path d="m4 10.5 4 4 8-9" />}
    </svg>
  );
}

export function PlanPage() {
  const { plan, setPlan, hired } = useMote();

  return (
    <>
      <PageHead
        title="Plans"
        sub="No credits and no meters — what you pay is what you pay, and your team never stops mid-month."
        action={<Chip tone="quiet">Annual: 2 months free</Chip>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => {
          const current = plan === p.id;
          const seats = seatsFor(p.id);
          const wouldRetire = seats !== Infinity && hired.length > seats;

          return (
            <Card
              key={p.id}
              className={`flex flex-col p-5 ${current ? 'ring-2 ring-shell-ink' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] font-semibold">{p.name}</span>
                {current && <Chip tone="good">Current</Chip>}
              </div>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[30px] font-semibold tracking-[-.03em]">{p.price}</span>
                <span className="text-[13px] muted">/mo</span>
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed muted">{p.line}</p>

              <div className="mt-4">
                <Button
                  size="sm"
                  variant={current ? 'ghost' : 'primary'}
                  disabled={current}
                  onClick={() => setPlan(p.id)}
                >
                  {current ? 'You are here' : `Switch to ${p.name}`}
                </Button>
                {wouldRetire && !current && (
                  <p className="mt-2.5 text-[12px] muted">
                    Retires {hired.length - seats} employee{hired.length - seats > 1 ? 's' : ''}.
                    Your logs and settings stay exactly as they are.
                  </p>
                )}
              </div>

              <div className="mt-5 border-t hairline pt-4">
                {p.inherits && (
                  <p className="mb-2.5 text-[12px] font-medium text-shell-ink/55">{p.inherits}</p>
                )}
                <ul className="space-y-2">
                  {p.features.map((f) => (
                    <li key={f.text} className="flex gap-2.5 text-[13px] leading-relaxed">
                      <Tick off={f.off} />
                      <span className={f.off ? 'text-shell-ink/35' : 'text-shell-ink/75'}>
                        {f.text}
                        {f.coming && (
                          <span className="ml-1.5 whitespace-nowrap rounded-full border border-black/[.10] px-1.5 py-px text-[10.5px] text-shell-ink/45">
                            Coming v1.5
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4 p-5">
        <h2 className="text-[13px] font-semibold">True on every plan</h2>
        <ul className="mt-2.5 grid gap-2 text-[13px] text-shell-ink/70 sm:grid-cols-2">
          <li className="flex gap-2.5">
            <Tick />
            Sending, submitting and deleting always need your yes. There is no setting.
          </li>
          <li className="flex gap-2.5">
            <Tick />
            Payments are out of scope — no employee can move money.
          </li>
          <li className="flex gap-2.5">
            <Tick />
            Your logs stay on your machine, and export works even on a lapsed plan.
          </li>
          <li className="flex gap-2.5">
            <Tick />
            Cancel any time; you keep the rest of the period.
          </li>
        </ul>
      </Card>

      <div className="mt-5 max-w-2xl space-y-2 text-[13px] muted">
        <p>
          Anything marked <span className="whitespace-nowrap">“Coming v1.5”</span> is not built yet.
          It arrives on your plan at no extra charge — we would rather label it than let you buy
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
