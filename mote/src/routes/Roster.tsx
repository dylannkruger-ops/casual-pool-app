import { Link } from 'react-router-dom';
import { ROSTER } from '../data/roster';
import { seatsFor, useMote } from '../store/useMote';
import { Mote } from '../components/Mote';
import { Button, Card, Chip, PageHead } from '../components/ui';

export function Roster() {
  const { hired, plan, hire, retire } = useMote();
  const seats = seatsFor(plan);
  const full = hired.length >= seats;

  return (
    <>
      <PageHead
        title="Meet your team"
        sub="Each employee owns one narrow job and does it the same way every time. Nobody joins the roster before clearing 95% on the bench."
        action={
          <Chip tone="quiet">
            {hired.length} hired{seats === Infinity ? '' : ` · ${seats} seat${seats > 1 ? 's' : ''}`}
          </Chip>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
        {ROSTER.map((e) => {
          const isHired = hired.includes(e.id);
          const skill = e.skills[0];
          const gated = e.status === 'hireable';

          return (
            <Card key={e.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between">
                <Mote state={isHired ? 'idle' : 'watching'} tint={e.tint} size={64} />
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
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-shell-ink/70">{e.blurb}</p>
              </div>

              <div className="mt-4 border-t hairline pt-3.5 text-[12.5px]">
                {gated ? (
                  <span className="muted">
                    <span className="font-medium text-shell-ink">{skill.successRate}%</span> over{' '}
                    {skill.runs} measured runs
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
