import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMote } from '../store/useMote';
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
            className="h-11 flex-1 rounded-xl bg-transparent text-[15px] placeholder:text-shell-ink/30 focus-visible:ring-0"
          />
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
  const { tasks } = useMote();
  const [seed, setSeed] = useState<string | null>(null);

  const favourites = tasks.filter((t) => t.favourite);
  const today = tasks.filter((t) => t.bucket === 'today' && !t.favourite);
  const yesterday = tasks.filter((t) => t.bucket === 'yesterday' && !t.favourite);
  const earlier = tasks.filter((t) => t.bucket === 'earlier' && !t.favourite);

  return (
    <>
      <PageHead title="Tasks" sub="Everything you have asked the team to do, and everything they said back." />

      <Composer onOpen={setSeed} />

      <TaskGroup label="★ Favourites" tasks={favourites} />
      <TaskGroup label="Today" tasks={today} />
      <TaskGroup label="Yesterday" tasks={yesterday} />
      <TaskGroup label="Earlier" tasks={earlier} />

      {tasks.length === 0 && (
        <Card className="px-6 py-14 text-center">
          <p className="text-[15px] font-medium">No tasks yet.</p>
          <p className="mt-1 text-[13.5px] muted">Ask for something above and MOTE will pick it up.</p>
        </Card>
      )}

      <NewTaskDialog open={seed !== null} onClose={() => setSeed(null)} />
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
