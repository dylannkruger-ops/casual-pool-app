import { Link, useParams } from 'react-router-dom';
import { byId } from '../data/roster';
import { useMote } from '../store/useMote';
import { LeaderBadge } from '../components/Avatar';
import { Crown } from '../components/Crown';
import { TaskRow } from '../components/TaskList';
import { Button, Card, Chip, Row, Toggle } from '../components/ui';

export function EmployeePage() {
  const { id = '' } = useParams();
  const employee = byId(id);
  const { hired, trusted, toggleTrust, hire, tasks, setActive } = useMote();

  if (!employee) return <p className="muted">No such employee.</p>;

  const isHired = hired.includes(employee.id) || employee.leader;
  const isTrusted = trusted.includes(employee.id);
  const theirTasks = tasks.filter((t) => t.employeeId === employee.id);
  const skill = employee.skills[0];

  return (
    <>
      <Link to="/team" className="mb-4 inline-block text-[13px] muted hover:text-shell-ink">
        ← Your team
      </Link>

      <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Every profile uses the same 4:5 head-and-torso portrait. A full-figure
            render for some and a squared-off head crop for others made the roster
            look like two different products. The panel is white because the
            renders carry their own white background — any wash showed as scruffy
            corners — so the character's colour comes back as a ring instead. */}
        <div
          className="w-fit shrink-0 self-start overflow-hidden rounded-xl2 bg-white"
          style={{ boxShadow: `0 0 0 2px ${employee.tint}` }}
        >
          <img
            src={employee.avatar}
            alt={employee.name}
            width={176}
            height={220}
            className="h-[220px] w-[176px] object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h1 className="text-[26px] font-semibold tracking-[-.02em]">{employee.name}</h1>
            <span className="text-[14px] muted">{employee.role}</span>
            {employee.leader ? (
              <LeaderBadge />
            ) : isHired ? (
              <Chip tone="good">Hired</Chip>
            ) : employee.status === 'hireable' ? (
              <Chip tone="quiet">Available</Chip>
            ) : (
              <Chip tone="quiet">Joining {employee.joining}</Chip>
            )}
          </div>

          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-shell-ink/75">{employee.blurb}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {isHired ? (
              <Button variant="ghost" size="sm" onClick={() => setActive(employee.id)}>
                Put on the widget
              </Button>
            ) : employee.status === 'hireable' ? (
              <Button size="sm" onClick={() => hire(employee.id)}>
                Hire {employee.name}
              </Button>
            ) : (
              <Chip tone="quiet">In onboarding — {skill.runs} bench runs, not yet at 95%</Chip>
            )}
            <span
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[.08] px-3 py-1 text-[12px] muted"
              title="This employee's eye colour on the face widget"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: employee.tint }} />
              Eye tint
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 2xl:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-4">
          <Card className="px-5 py-1">
            <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
              What {employee.name} owns
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
                <div className="mt-2.5 text-[13px] muted">Needs before starting: {s.preconditions.join(' · ')}</div>
                <div className="mt-1.5 text-[13px] text-shell-ink/60">
                  <span className="muted">Known failure. </span>
                  {s.failureMode}
                </div>
              </div>
            ))}
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b hairline px-5 py-4 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
              Tasks
            </div>
            {theirTasks.length === 0 ? (
              <div className="px-5 py-6 text-[13.5px] muted">Nothing assigned yet.</div>
            ) : (
              theirTasks.map((t) => <TaskRow key={t.id} task={t} />)
            )}
          </Card>
        </div>

        <Card className="px-5 py-1">
          <div className="border-b hairline py-4 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
            Trust profile
          </div>

          <Row title="Reading and extracting" sub="Runs on its own, on every plan." right={<Chip tone="good">Automatic</Chip>} />
          <Row
            title="Writing into your documents"
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
            right={<Toggle on locked lockedReason="Red actions always require your confirmation" label="Always confirmed" />}
          />
          <Row title="Payments" sub="Out of scope entirely — no employee can move money." right={<Chip tone="quiet">Not built</Chip>} />
        </Card>
      </div>
    </>
  );
}
