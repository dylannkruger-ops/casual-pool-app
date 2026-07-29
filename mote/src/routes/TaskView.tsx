import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMote } from '../store/useMote';
import { byId } from '../data/roster';
import { Avatar, AvatarStack, PersonAvatar } from '../components/Avatar';
import { Star } from '../components/Star';
import { Crown } from '../components/Crown';
import { StepReceipt } from '../components/Steps';
import { InviteDialog } from '../components/dialogs';
import { Button, Chip, TierChip } from '../components/ui';
import { STATUS } from '../components/TaskList';
import type { Message } from '../lib/types';

export function TaskView() {
  const { id = '' } = useParams();
  const { tasks, projects, collaborators, toggleFavourite, sendMessage, resolveTaskApproval } = useMote();
  const [draft, setDraft] = useState('');
  const [inviting, setInviting] = useState(false);

  const task = tasks.find((t) => t.id === id);
  if (!task) return <p className="muted">No such task.</p>;

  const employee = byId(task.employeeId);
  const project = projects.find((p) => p.id === task.projectId);
  const people = collaborators.filter((c) => task.collaborators.includes(c.id));
  const status = STATUS[task.status];

  const authorOf = (m: Message) => {
    if (m.author.kind === 'you') return { name: 'You', avatar: null, collab: null };
    if (m.author.kind === 'employee') {
      const e = byId(m.author.id);
      return { name: e?.name ?? 'Employee', avatar: m.author.id, collab: null };
    }
    if (m.author.kind === 'collaborator') {
      const c = collaborators.find((x) => x.id === (m.author as { id: string }).id);
      return { name: c?.name ?? 'Someone', avatar: null, collab: c ?? null };
    }
    return { name: 'MOTE', avatar: 'mote', collab: null };
  };

  return (
    <>
      <Link to="/" className="mb-4 inline-block text-[13px] muted hover:text-ink">
        ← All tasks
      </Link>

      <header className="mb-6 border-b hairline pb-5">
        <div className="flex items-start gap-3">
          <Star on={task.favourite} onClick={() => toggleFavourite(task.id)} size={19} />
          <h1 className="flex-1 text-[22px] font-semibold leading-tight tracking-[-.02em]">{task.title}</h1>
          <Chip tone={status.tone}>{status.label}</Chip>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-3 pl-8">
          <Link to={`/employee/${task.employeeId}`} className="flex items-center gap-2 hover:opacity-70">
            <Avatar id={task.employeeId} size={26} />
            <span className="text-[13px]">
              {employee?.name} <span className="muted">· {employee?.role}</span>
            </span>
          </Link>

          {project && (
            <Link to={`/project/${project.id}`} className="flex items-center gap-1.5 text-[13px] hover:opacity-70">
              <span className="h-2 w-2 rounded-full" style={{ background: project.tint }} />
              {project.name}
            </Link>
          )}

          <div className="flex items-center gap-2">
            <AvatarStack people={people} />
            <button
              onClick={() => setInviting(true)}
              className="rounded-full border border-line px-3 py-1 text-[12.5px] transition hover:bg-sunk"
            >
              {people.length ? 'Manage people' : '+ Invite someone'}
            </button>
          </div>

          <span className="text-[12.5px] muted">Started {task.createdAt}</span>
        </div>
      </header>

      <div className="space-y-6">
        {task.messages.map((m) => {
          const a = authorOf(m);
          const mine = m.author.kind === 'you';
          return (
            <article key={m.id} className="flex gap-3">
              <span className="mt-0.5 shrink-0">
                {a.avatar ? (
                  <Avatar id={a.avatar} size={32} />
                ) : a.collab ? (
                  <PersonAvatar initials={a.collab.initials} size={32} pending={a.collab.pending} />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-[11px] font-medium">
                    You
                  </span>
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[13.5px] font-semibold">{a.name}</span>
                  {a.collab && <Chip tone="quiet">{a.collab.role === 'approver' ? 'Can approve' : 'Can view'}</Chip>}
                  <span className="text-[11.5px] muted">{m.at}</span>
                </div>

                {m.text && (
                  <p
                    className={`mt-1 max-w-3xl text-[14px] leading-relaxed ${
                      mine ? 'text-ink' : 'text-ink/80'
                    }`}
                  >
                    {m.text}
                  </p>
                )}

                {m.steps && <StepReceipt steps={m.steps} who={a.name} />}

                {m.approval && (
                  <div className="mt-3 max-w-2xl rounded-xl2 border border-crown/40 bg-crown-soft/40 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crown-soft text-crown">
                          <Crown size={16} />
                        </span>
                        <div>
                          <p className="text-[14px] font-semibold">{m.approval.what}</p>
                          <p className="mt-0.5 text-[12.5px] muted">
                            {m.approval.tier === 'red'
                              ? 'This leaves your machine. It always needs your yes.'
                              : 'Writing into your files. A trusted employee could do this on its own.'}
                          </p>
                        </div>
                      </div>
                      <TierChip tier={m.approval.tier} />
                    </div>

                    {m.approval.resolved ? (
                      <p className="mt-3.5 text-[13px] font-medium">
                        {m.approval.resolved === 'approved'
                          ? `Approved by ${m.approval.by ?? 'you'} — sent.`
                          : `Denied by ${m.approval.by ?? 'you'} — the run halted here.`}
                      </p>
                    ) : (
                      <div className="mt-3.5 flex flex-wrap items-center gap-2">
                        <Button size="sm" onClick={() => resolveTaskApproval(task.id, m.id, 'approved')}>
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => resolveTaskApproval(task.id, m.id, 'denied')}>
                          Deny and halt
                        </Button>
                        <span className="text-[12px] muted">Letting it expire approves nothing.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <form
        className="sticky bottom-6 mt-8 flex gap-2 rounded-xl2 border border-line bg-surface p-2 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(task.id, draft);
          setDraft('');
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Reply to ${employee?.name ?? 'the team'}…`}
          className="h-10 flex-1 rounded-xl bg-transparent px-3 text-[14px] placeholder:text-ink/30 focus-visible:ring-0"
        />
        <Button size="sm" disabled={!draft.trim()}>
          Send
        </Button>
      </form>

      <InviteDialog open={inviting} onClose={() => setInviting(false)} taskId={task.id} />
    </>
  );
}
