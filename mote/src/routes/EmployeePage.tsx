import { Link, useParams } from 'react-router-dom';
import { byId } from '../data/roster';
import { useMote } from '../store/useMote';
import { Mote } from '../components/Mote';
import { Crown } from '../components/Crown';
import { Button, Card, Chip, Row, Toggle } from '../components/ui';

export function EmployeePage() {
  const { id = '' } = useParams();
  const employee = byId(id);
  const { hired, trusted, toggleTrust, runs, setActive } = useMote();

  if (!employee) return <p className="muted">No such employee.</p>;

  const isHired = hired.includes(employee.id);
  const isTrusted = trusted.includes(employee.id);
  const theirRuns = runs.filter((r) => r.employeeId === employee.id);

  return (
    <>
      <div className="mb-7 flex items-start gap-5">
        <Mote state="idle" tint={employee.tint} size={84} />
        <div className="flex-1">
          <div className="flex items-baseline gap-2.5">
            <h1 className="text-[26px] font-semibold tracking-[-.02em]">{employee.name}</h1>
            <span className="text-[14px] muted">{employee.role}</span>
            {isHired && <Chip tone="good">Hired</Chip>}
          </div>
          <p className="mt-1.5 max-w-2xl text-[14px] text-shell-ink/70">{employee.blurb}</p>
        </div>
        {isHired && (
          <Button variant="ghost" size="sm" onClick={() => setActive(employee.id)}>
            Put on the widget
          </Button>
        )}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Card className="px-5 py-1">
            <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
              Skills
            </div>
            {employee.skills.map((s) => (
              <div key={s.id} className="border-b hairline py-4 last:border-0">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-medium">{s.name}</span>
                  {s.successRate ? (
                    <Chip tone="good">
                      {s.successRate}% · {s.runs} runs
                    </Chip>
                  ) : (
                    <Chip tone="quiet">Gating — {s.runs} runs</Chip>
                  )}
                </div>
                <div className="mt-2.5 text-[13px] muted">
                  Needs before starting: {s.preconditions.join(' · ')}
                </div>
                <div className="mt-1.5 text-[13px] text-shell-ink/60">
                  <span className="muted">Known failure. </span>
                  {s.failureMode}
                </div>
              </div>
            ))}
          </Card>

          <Card className="px-5 py-1">
            <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
              Recent work
            </div>
            {theirRuns.length === 0 ? (
              <div className="py-5 text-[13.5px] muted">No runs yet.</div>
            ) : (
              theirRuns.map((r) => (
                <Link
                  key={r.id}
                  to={`/runs/${r.id}`}
                  className="flex items-center justify-between border-b hairline py-4 last:border-0 hover:opacity-70"
                >
                  <span className="text-sm">{r.title}</span>
                  <span className="text-[12.5px] muted">{r.startedAt}</span>
                </Link>
              ))
            )}
          </Card>
        </div>

        <Card className="px-5 py-1">
          <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
            Trust profile
          </div>

          <Row
            title="Reading and extracting"
            sub="Runs on its own, on every plan."
            right={<Chip tone="good">Automatic</Chip>}
          />
          <Row
            title={`Writing into your documents`}
            sub={
              isTrusted
                ? `${employee.name} is trusted — writes go ahead without asking.`
                : `${employee.name} asks first before writing anything.`
            }
            right={
              <Toggle
                on={isTrusted}
                onChange={() => toggleTrust(employee.id)}
                label="Trusted employee"
              />
            }
          />
          <Row
            title={
              <span className="flex items-center gap-2">
                Sending, submitting, deleting
                <Crown size={13} className="text-crown" />
              </span>
            }
            sub="Always comes to you. There is no setting here, on any plan."
            right={
              <Toggle
                on
                locked
                lockedReason="Red actions always require your confirmation"
                label="Always confirmed"
              />
            }
          />
          <Row title="Payments" sub="Out of scope entirely — no employee can move money." right={<Chip tone="quiet">Not built</Chip>} />
        </Card>
      </div>
    </>
  );
}
