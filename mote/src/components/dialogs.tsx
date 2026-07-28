import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROSTER, byId } from '../data/roster';
import { spendStatus, useMote } from '../store/useMote';
import { Avatar, PersonAvatar } from './Avatar';
import { Field, Modal, inputClass } from './Modal';
import { Button, Chip } from './ui';
import type { CollabRole } from '../lib/types';

export function NewTaskDialog({ open, onClose, projectId }: { open: boolean; onClose: () => void; projectId?: string }) {
  const { hired, projects, createTask, spend, spendByEmployee } = useMote();
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('mote');
  const [project, setProject] = useState(projectId ?? '');
  const navigate = useNavigate();

  // Over the cap with "stop starting new work", createTask refuses. Say so
  // here rather than appearing to accept the job and doing nothing.
  const status = spendStatus({ spend, spendByEmployee });
  const capBlocked = status.blocked && spend.atCap === 'pause';

  // You can hand a job straight to someone, or let MOTE work out whose it is.
  const options = [byId('mote')!, ...ROSTER.filter((e) => hired.includes(e.id))];

  const submit = () => {
    if (!title.trim()) return;
    const id = createTask({ title: title.trim(), employeeId: assignee, projectId: project || undefined });
    if (!id) return; // refused by the spend guard
    setTitle('');
    setAssignee('mote');
    onClose();
    navigate(`/task/${id}`);
  };

  return (
    <Modal open={open} onClose={onClose} title="New task" sub="Say what you want done. MOTE routes it unless you pick someone.">
      {capBlocked && (
        <div className="mb-4 rounded-xl bg-[#fbdfe5] px-4 py-3 text-[13px] text-[#a8455a]">
          You are at this month's spend cap and your team is set to stop starting new work.{' '}
          <Link to="/spend" onClick={onClose} className="underline underline-offset-2">
            Raise the cap
          </Link>{' '}
          to carry on. Work already running is unaffected.
        </div>
      )}

      <Field label="What needs doing?">
        <textarea
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
          }}
          rows={3}
          aria-label="What needs doing?"
          placeholder="Log the new Brightwater order and draft the confirmation"
          className="w-full rounded-xl border border-black/[.12] bg-white px-3.5 py-2.5 text-[13.5px] placeholder:text-shell-ink/30"
        />
      </Field>

      <Field label="Who takes it">
        <div className="flex flex-wrap gap-2">
          {options.map((e) => (
            <button
              key={e.id}
              onClick={() => setAssignee(e.id)}
              className={`flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-[13px] transition ${
                assignee === e.id ? 'border-shell-ink bg-shell-ink text-white' : 'border-black/[.12] hover:bg-canvas-sunk'
              }`}
            >
              <Avatar id={e.id} size={24} />
              {e.leader ? 'Let MOTE decide' : e.name}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Project (optional)">
        <select
          aria-label="Project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className={inputClass}
        >
          <option value="">No project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="mt-6 flex items-center gap-2">
        <Button onClick={submit} disabled={!title.trim() || capBlocked}>
          Start task
        </Button>
        <Button variant="quiet" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

export function NewProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { createProject } = useMote();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const submit = () => {
    if (!name.trim()) return;
    const id = createProject(name.trim());
    setName('');
    onClose();
    navigate(`/project/${id}`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New project"
      sub="A folder for related tasks — the books, a launch, one client."
      width={420}
    >
      <Field label="Project name">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Spring launch"
          aria-label="Project name"
          className={inputClass}
        />
      </Field>
      <div className="mt-6 flex items-center gap-2">
        <Button onClick={submit} disabled={!name.trim()}>
          Create project
        </Button>
        <Button variant="quiet" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

export function InviteDialog({ open, onClose, taskId }: { open: boolean; onClose: () => void; taskId: string }) {
  const { tasks, collaborators, invite, uninvite, setTaskRole } = useMote();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<CollabRole>('viewer');
  const task = tasks.find((t) => t.id === taskId);
  const onTask = collaborators.filter((c) => task?.collaborators.includes(c.id));

  const submit = () => {
    if (!email.trim()) return;
    invite(taskId, email.trim(), role);
    setEmail('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Invite someone to help"
      sub="They see this task's conversation and receipts — nothing else in your workspace."
      width={520}
    >
      <div className="mb-5 flex gap-2">
        <input
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="name@company.com"
          aria-label="Email address"
          className={inputClass}
        />
        <select
          value={role}
          aria-label="Permission"
          onChange={(e) => setRole(e.target.value as CollabRole)}
          className="h-10 shrink-0 rounded-xl border border-black/[.12] bg-white px-3 text-[13px]"
        >
          <option value="viewer">Can view</option>
          <option value="approver">Can approve</option>
        </select>
        <Button onClick={submit} disabled={!email.trim()}>
          Invite
        </Button>
      </div>

      {onTask.length === 0 ? (
        <p className="text-[13px] muted">Nobody else is on this task yet.</p>
      ) : (
        <div className="rounded-xl border border-black/[.07]">
          {onTask.map((c) => (
            <div key={c.id} className="flex items-center gap-3 border-b border-black/[.06] px-3.5 py-3 last:border-0">
              <PersonAvatar initials={c.initials} pending={c.pending} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[13.5px] font-medium">
                  {c.name}
                  {c.pending && <Chip tone="quiet">Invited</Chip>}
                </div>
                <div className="truncate text-[12.5px] muted">{c.email}</div>
              </div>
              <select
                value={c.role}
                aria-label={`Permission for ${c.name}`}
                onChange={(e) => setTaskRole(c.id, e.target.value as CollabRole)}
                className="h-8 rounded-lg border border-black/[.12] bg-white px-2 text-[12.5px]"
              >
                <option value="viewer">Can view</option>
                <option value="approver">Can approve</option>
              </select>
              <button
                onClick={() => uninvite(taskId, c.id)}
                className="rounded-lg px-2 py-1 text-[12.5px] text-shell-ink/40 hover:text-shell-ink"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-[12.5px] muted">
        “Can approve” lets them clear amber steps for you. Red actions — sending, submitting,
        deleting — always come back to you, whoever else is on the task.
      </p>
    </Modal>
  );
}
