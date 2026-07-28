import { Link } from 'react-router-dom';
import { useMote } from '../store/useMote';
import { byId } from '../data/roster';
import { BossHeader, Crown } from '../components/Crown';
import { Button, Card, Chip, PageHead, TierChip } from '../components/ui';

/**
 * The crown surface. Red actions land here every single time — there is no
 * setting, no "remember this", no tier that removes the step (FR-20).
 */
export function Approvals() {
  const { approvals, resolve } = useMote();

  return (
    <>
      <PageHead
        title="Waiting on you"
        sub="Reading and extracting happens on its own. Writing needs a trusted employee. Sending, submitting or deleting always comes here."
      />

      {approvals.length === 0 ? (
        <Card className="flex flex-col items-center px-6 py-14 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-canvas-sunk text-shell-ink/25">
            <Crown size={19} />
          </span>
          <p className="mt-3.5 text-[15px] font-medium">Nothing needs your yes.</p>
          <p className="mt-1 text-[13.5px] muted">
            Your team keeps working; anything that leaves your machine stops here first.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvals.map((a) => {
            const employee = byId(a.employeeId);
            return (
              <Card key={a.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <BossHeader title={a.what} sub={a.detail} />
                  <div className="flex items-center gap-2">
                    <TierChip tier={a.tier} />
                    <Chip tone="quiet">Expires in {a.expiresInMin}m</Chip>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-canvas-sunk p-4">
                  <div className="mb-2 flex items-center justify-between text-[11.5px] muted">
                    <span>
                      {employee?.name} · asked at {a.requestedAt} ·{' '}
                      <Link to={`/runs/${a.runId}`} className="underline underline-offset-2">
                        {a.runId}
                      </Link>
                    </span>
                    <span>Redacted preview</span>
                  </div>
                  <div className="space-y-1 font-mono text-[12.5px] leading-relaxed text-shell-ink/75">
                    {a.preview.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <Button onClick={() => resolve(a.id, 'approve')}>Approve</Button>
                  <Button variant="danger" onClick={() => resolve(a.id, 'deny')}>
                    Deny and halt
                  </Button>
                  <span className="ml-auto text-[12.5px] muted">
                    Nothing is approved by letting this expire.
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <p className="mt-6 max-w-2xl text-[13px] muted">
        Payments and money movement are out of scope entirely — your employees have no way to move
        money, approved or not.
      </p>
    </>
  );
}
