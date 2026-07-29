import { Link } from 'react-router-dom';
import { HIREABLE_ROSTER, byId } from '../data/roster';
import { seatsFor, useMote } from '../store/useMote';
import { Avatar, LeaderBadge } from '../components/Avatar';
import { Button, Card, Chip, PageHead } from '../components/ui';

export function Team() {
  const { hired, plan, hire, retire, tasks } = useMote();
  const seats = seatsFor(plan);
  const full = hired.length >= seats;
  const mote = byId('mote')!;

  const taskCount = (id: string) => tasks.filter((t) => t.employeeId === id).length;

  return (
    <>
      <PageHead
        title="Your team"
        sub="MOTE runs the floor. Everyone else owns one narrow job and does it the same way every time — and nobody joins the roster before clearing 95% on the bench."
        action={
          <Chip tone="quiet">
            {hired.length} hired{seats === Infinity ? '' : ` · ${seats} seat${seats > 1 ? 's' : ''}`}
          </Chip>
        }
      />

      {/* The leader sits above the roster — he is not a seat you buy. */}
      <Card className="mb-6 flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
        <Link to={`/employee/${mote.id}`} className="shrink-0">
          <Avatar id={mote.id} size={96} ring />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <h2 className="text-[19px] font-semibold tracking-tight">{mote.name}</h2>
            <span className="text-[13.5px] muted">{mote.role}</span>
            <LeaderBadge />
          </div>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-ink/70">{mote.blurb}</p>
          <p className="mt-2 text-[12.5px] muted">
            {mote.skills[0].successRate}% routing accuracy over {mote.skills[0].runs} jobs · always on, never
            takes a seat
          </p>
        </div>
        <Link to={`/employee/${mote.id}`}>
          <Button variant="ghost" size="sm">
            Open profile
          </Button>
        </Link>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {HIREABLE_ROSTER.map((e) => {
          const isHired = hired.includes(e.id);
          const skill = e.skills[0];
          const gated = e.status === 'hireable';

          return (
            <Card key={e.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <Link to={`/employee/${e.id}`}>
                  <Avatar id={e.id} size={68} />
                </Link>
                {isHired ? (
                  <Chip tone="good">Hired</Chip>
                ) : gated ? (
                  <Chip tone="quiet">Available</Chip>
                ) : (
                  <Chip tone="quiet">Joining {e.joining}</Chip>
                )}
              </div>

              <div className="mt-3.5">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-[16px] font-semibold tracking-tight">{e.name}</h3>
                  <span className="text-[13px] muted">{e.role}</span>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink/70">{e.blurb}</p>
              </div>

              <div className="mt-4 border-t hairline pt-3.5 text-[12.5px]">
                {gated ? (
                  <span className="muted">
                    <span className="font-medium text-ink">{skill.successRate}%</span> over {skill.runs}{' '}
                    measured runs
                    {isHired &&
                      taskCount(e.id) > 0 &&
                      ` · ${taskCount(e.id)} task${taskCount(e.id) === 1 ? '' : 's'} here`}
                  </span>
                ) : (
                  <span className="muted">In onboarding — {skill.runs} bench runs so far, not yet at 95%</span>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2">
                {isHired ? (
                  <>
                    <Link to={`/employee/${e.id}`}>
                      <Button size="sm" variant="ghost">
                        Open
                      </Button>
                    </Link>
                    <Button size="sm" variant="quiet" onClick={() => retire(e.id)}>
                      Retire
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => hire(e.id)}
                    disabled={!gated || full}
                    title={
                      !gated
                        ? `${e.name} is still in onboarding`
                        : full
                          ? 'No free seat on your plan'
                          : undefined
                    }
                  >
                    {gated ? `Hire ${e.name}` : 'In onboarding'}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {full && (
        <p className="mt-5 text-[13px] muted">
          Every seat on your plan is filled. Retire someone, or{' '}
          <Link to="/plan" className="underline underline-offset-2">
            look at plans
          </Link>
          .
        </p>
      )}
    </>
  );
}
