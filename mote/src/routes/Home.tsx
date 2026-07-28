import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { spendStatus, useMote } from '../store/useMote';
import { byId } from '../data/roster';
import { Avatar } from '../components/Avatar';
import { TaskGroup } from '../components/TaskList';
import { NewTaskDialog } from '../components/dialogs';
import { Button, Card, PageHead } from '../components/ui';

/** The composer is the front door: type the job, MOTE works out whose it is. */
function Composer({ onOpen }: { onOpen: (seed: string) => void }) {
  const [text, setText] = useState('');
  const { hired } = useMote();
  const team = [byId('mote')!, ...hired.map((h) => byId(h)!).filter(Boolean)];

  return (
    <Card className="mb-8 p-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onOpen(text);
          setText('');
        }}
      >
        <div className="flex items-center gap-3">
          <Avatar id="mote" size={40} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What should the team do?"
            aria-label="What should the team do?"
            className="h-11 min-w-0 flex-1 rounded-xl bg-transparent text-[15px] placeholder:text-shell-ink/30 focus-visible:ring-0"
          />
          <span className="hidden sm:block">
            <Button disabled={!text.trim()}>Start task</Button>
          </span>
        </div>
        <div className="mt-2 sm:hidden">
          <Button disabled={!text.trim()}>Start task</Button>
        </div>
      </form>
      <div className="mt-4 flex items-center gap-2.5 border-t hairline pt-3.5">
        <span className="text-[12px] muted">On shift</span>
        {team.map((e) => (
          <Avatar key={e.id} id={e.id} size={24} alt={e.name} />
        ))}
      </div>
    </Card>
  );
}

export function Home() {
  const { tasks, spend, spendByEmployee } = useMote();
  const [seed, setSeed] = useState<string | null>(null);
  const status = spendStatus({ spend, spendByEmployee });

  const favourites = tasks.filter((t) => t.favourite);
  const today = tasks.filter((t) => t.bucket === 'today' && !t.favourite);

  return (
    <>
      <div className="hidden lg:block">
        <PageHead title="Home" sub="Ask for something, and it becomes a task with a receipt." />
      </div>

      {(status.blocked || status.alerting) && (
        <Link
          to="/spend"
          className={`mb-4 flex items-center justify-between gap-3 rounded-xl2 px-4 py-3 text-[13px] ${
            status.blocked ? 'bg-[#fbdfe5] text-[#a8455a]' : 'bg-[#faeecd] text-[#8a6a12]'
          }`}
        >
          <span>
            {status.blocked
              ? 'Spend cap reached. No new work starts until you raise it.'
              : `${Math.round(status.pct)}% of this month's spend cap used.`}
          </span>
          <span className="shrink-0 underline underline-offset-2">Spend guard</span>
        </Link>
      )}

      <Composer onOpen={setSeed} />

      <TaskGroup label="★ Favourites" tasks={favourites} />
      <TaskGroup label="Today" tasks={today} />

      {tasks.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <p className="text-[15px] font-medium">No tasks yet.</p>
          <p className="mt-1 text-[13.5px] muted">Ask for something above and MOTE will pick it up.</p>
        </Card>
      ) : (
        <Link to="/history" className="inline-block text-[13.5px] muted underline underline-offset-2 hover:text-shell-ink">
          See everything the team has done →
        </Link>
      )}

      <NewTaskDialog open={seed !== null} onClose={() => setSeed(null)} />
    </>
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
      <div className="hidden lg:block">
        <PageHead title="History" sub="Everything you have asked the team to do, and everything they said back." />
      </div>
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
      <button onClick={() => navigate('/')} className="mb-4 text-[13px] muted hover:text-shell-ink">
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
