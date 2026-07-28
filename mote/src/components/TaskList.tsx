import { Link } from 'react-router-dom';
import { useMote } from '../store/useMote';
import { byId } from '../data/roster';
import { Avatar, AvatarStack } from './Avatar';
import { Star } from './Star';
import { Chip } from './ui';
import type { Task, TaskStatus } from '../lib/types';

export const STATUS: Record<TaskStatus, { label: string; tone: 'good' | 'warn' | 'stop' | 'neutral' }> = {
  working: { label: 'Working', tone: 'neutral' },
  waiting: { label: 'Waiting on you', tone: 'warn' },
  done: { label: 'Done', tone: 'good' },
  halted: { label: 'Halted', tone: 'stop' },
};

export function TaskRow({ task }: { task: Task }) {
  const { toggleFavourite, collaborators, projects } = useMote();
  const employee = byId(task.employeeId);
  const project = projects.find((p) => p.id === task.projectId);
  const people = collaborators.filter((c) => task.collaborators.includes(c.id));
  const status = STATUS[task.status];
  const last = task.messages[task.messages.length - 1];

  return (
    <Link
      to={`/task/${task.id}`}
      className="flex items-center gap-3.5 border-b hairline px-5 py-3.5 transition last:border-0 hover:bg-canvas-sunk/60"
    >
      <Star on={task.favourite} onClick={() => toggleFavourite(task.id)} />
      <Avatar id={task.employeeId} size={34} />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[14px] font-medium">{task.title}</span>
          {project && (
            <span className="flex shrink-0 items-center gap-1.5 text-[11.5px] muted">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: project.tint }} />
              {project.name}
            </span>
          )}
        </div>
        <div className="mt-0.5 truncate text-[12.5px] muted">
          {employee?.name} · {last?.text?.slice(0, 90) ?? 'No messages yet'}
        </div>
      </div>

      <AvatarStack people={people} size={24} />
      <span className="w-[92px] shrink-0 text-right text-[12px] muted">{task.lastAt}</span>
      <Chip tone={status.tone}>{status.label}</Chip>
    </Link>
  );
}

export function TaskGroup({ label, tasks }: { label: string; tasks: Task[] }) {
  if (tasks.length === 0) return null;
  return (
    <section className="mb-6">
      <h2 className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
        {label}
      </h2>
      <div className="card overflow-hidden">
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} />
        ))}
      </div>
    </section>
  );
}
