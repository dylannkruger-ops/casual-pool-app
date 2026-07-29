import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { spendStatus, useMote } from '../store/useMote';
import { byId } from '../data/roster';
import { Avatar } from '../components/Avatar';
import { Crown } from '../components/Crown';
import { TaskGroup, TaskRowCompact } from '../components/TaskList';
import { NewTaskDialog } from '../components/dialogs';
import { Button, Card, PageHead } from '../components/ui';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * The front door. One question, one box, and the team you can hand it to —
 * pressing Enter starts the task, no dialog in the way. The old home buried
 * this input between a warning banner and two list groups.
 */
function Composer() {
  const { hired, createTask, spend, spendByEmployee } = useMote();
  const [text, setText] = useState('');
  const [assignee, setAssignee] = useState('mote');
  const navigate = useNavigate();

  const status = spendStatus({ spend, spendByEmployee });
  const capBlocked = status.blocked && spend.atCap === 'pause';
  const team = [byId('mote')!, ...hired.map((h) => byId(h)!).filter(Boolean)];

  const submit = () => {
    if (!text.trim() || capBlocked) return;
    const id = createTask({ title: text.trim(), employeeId: assignee });
    if (id) navigate(`/task/${id}`);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-card ring-1 ring-black/[.05] focus-within:ring-shell-ink/25"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask the team for something…"
          aria-label="Ask the team for something"
          className="h-11 min-w-0 flex-1 bg-transparent px-3 text-[15px] placeholder:text-shell-ink/30 focus-visible:ring-0"
        />
        <button
          type="submit"
          disabled={!text.trim() || capBlocked}
          aria-label="Start task"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-shell-ink text-white transition hover:bg-shell-deep disabled:opacity-25"
        >
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-[12px] muted">Hand it to</span>
        {team.map((e) => (
          <button
            key={e.id}
            onClick={() => setAssignee(e.id)}
            title={e.role}
            className={`flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 text-[12.5px] transition ${
              assignee === e.id
                ? 'bg-shell-ink text-white'
                : 'text-shell-ink/65 hover:bg-black/[.05]'
            }`}
          >
            <Avatar id={e.id} size={20} />
            {e.leader ? 'MOTE decides' : e.name}
          </button>
        ))}
      </div>

      {capBlocked && (
        <p className="mt-3 text-[13px] text-[#a8455a]">
          You are at this month's spend cap.{' '}
          <Link to="/spend" className="underline underline-offset-2">
            Raise it
          </Link>{' '}
          to start new work — anything already running carries on.
        </p>
      )}
    </div>
  );
}

/** Suggestions come from what the hired team can actually do, not from a list of platitudes. */
function Suggestions() {
  const { hired, createTask } = useMote();
  const navigate = useNavigate();

  const ideas = hired
    .map((id) => byId(id))
    .filter(Boolean)
    .slice(0, 4)
    .map((e) => ({ employeeId: e!.id, name: e!.name, text: e!.suggest }));

  if (ideas.length === 0) return null;

  return (
    <div className="mt-8">
      {ideas.map((i) => (
        <button
          key={i.employeeId}
          onClick={() => {
            const id = createTask({ title: i.text, employeeId: i.employeeId });
            if (id) navigate(`/task/${id}`);
          }}
          className="flex w-full items-center justify-between gap-3 border-b hairline py-3 text-left transition last:border-0 hover:opacity-60"
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <Avatar id={i.employeeId} size={22} />
            <span className="truncate text-[14px]">{i.text}</span>
          </span>
          <span className="shrink-0 text-[13px] text-shell-ink/30">↗</span>
        </button>
      ))}
    </div>
  );
}

export function Home() {
  const { tasks, approvals } = useMote();
  const recent = tasks.slice(0, 3);

  return (
    <div className="mx-auto max-w-[680px]">
      <div className="pt-6 lg:pt-16">
        <h1 className="text-[26px] font-semibold tracking-[-.025em] lg:text-[34px]">{greeting()}, Dylan</h1>
        <p className="mb-6 mt-1.5 text-[14.5px] muted lg:mb-7 lg:text-[15px]">
          What should the team do?
        </p>

        <Composer />

        {/* The one thing that genuinely interrupts: something waiting on a human. */}
        {approvals.length > 0 && (
          <Link
            to="/approvals"
            className="mt-6 flex items-center gap-3 rounded-2xl bg-crown-soft/60 px-4 py-3 transition hover:bg-crown-soft"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-crown">
              <Crown size={15} />
            </span>
            <span className="min-w-0 flex-1 text-[13.5px]">
              <span className="font-medium">
                {approvals.length} {approvals.length === 1 ? 'thing needs' : 'things need'} your yes
              </span>
              <span className="block truncate muted">{approvals[0].what}</span>
            </span>
            <span className="shrink-0 text-[13px] text-shell-ink/30">→</span>
          </Link>
        )}

        <Suggestions />

        {recent.length > 0 && (
          <div className="mt-10">
            <div className="mb-1 flex items-baseline justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
                Recent
              </h2>
              <Link to="/history" className="text-[12.5px] muted hover:text-shell-ink">
                All tasks →
              </Link>
            </div>
            <div className="-mx-3">
              {recent.map((t) => (
                <TaskRowCompact key={t.id} task={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** The full log, grouped by when it happened — Sintra's History tab. */
export function History() {
  const { tasks } = useMote();
  const favourites = tasks.filter((t) => t.favourite);
  const today = tasks.filter((t) => t.bucket === 'today' && !t.favourite);
  const yesterday = tasks.filter((t) => t.bucket === 'yesterday' && !t.favourite);
  const earlier = tasks.filter((t) => t.bucket === 'earlier' && !t.favourite);

  return (
    <>
      <PageHead title="History" sub="Everything you have asked the team to do, and everything they said back." />
      <TaskGroup label={`★ Favourites · ${favourites.length}`} tasks={favourites} />
      <TaskGroup label={`Today · ${today.length}`} tasks={today} />
      <TaskGroup label={`Yesterday · ${yesterday.length}`} tasks={yesterday} />
      <TaskGroup label={`Earlier · ${earlier.length}`} tasks={earlier} />
    </>
  );
}

export function ProjectView() {
  const { id = '' } = useParams();
  const { tasks, projects } = useMote();
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const project = projects.find((p) => p.id === id);
  if (!project) return <p className="muted">No such project.</p>;

  const mine = tasks.filter((t) => t.projectId === id);
  const favourites = mine.filter((t) => t.favourite);
  const rest = mine.filter((t) => !t.favourite);

  return (
    <>
      <button onClick={() => navigate('/history')} className="mb-4 text-[13px] muted hover:text-shell-ink">
        ← All tasks
      </button>
      <PageHead
        title={project.name}
        sub={`${mine.length} task${mine.length === 1 ? '' : 's'} in this project.`}
        action={<Button onClick={() => setCreating(true)}>New task</Button>}
      />

      <TaskGroup label="★ Favourites" tasks={favourites} />
      <TaskGroup label="All tasks" tasks={rest} />

      {mine.length === 0 && (
        <Card className="px-6 py-14 text-center">
          <p className="text-[15px] font-medium">Nothing in {project.name} yet.</p>
          <p className="mt-1 text-[13.5px] muted">Start a task and it will file itself here.</p>
        </Card>
      )}

      <NewTaskDialog open={creating} onClose={() => setCreating(false)} projectId={id} />
    </>
  );
}
