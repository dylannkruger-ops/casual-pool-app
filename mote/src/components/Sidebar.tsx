import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useMote } from '../store/useMote';
import { Avatar } from './Avatar';
import { Star } from './Star';
import { Crown } from './Crown';
import { NewProjectDialog, NewTaskDialog } from './dialogs';

const link = ({ isActive }: { isActive: boolean }) =>
  `flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13.5px] transition ${
    isActive ? 'bg-black/[.06] font-medium text-shell-ink' : 'text-shell-ink/60 hover:bg-black/[.035]'
  }`;

function SectionLabel({ children, action }: { children: string; action?: React.ReactNode }) {
  return (
    <div className="mb-1 mt-4 flex items-center justify-between px-3">
      <span className="text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">{children}</span>
      {action}
    </div>
  );
}

export function Sidebar() {
  const { tasks, projects, approvals, plan, toggleFavourite } = useMote();
  const [newTask, setNewTask] = useState(false);
  const [newProject, setNewProject] = useState(false);

  const favourites = tasks.filter((t) => t.favourite);
  const recent = tasks.filter((t) => !t.favourite).slice(0, 5);

  return (
    <aside className="flex h-screen w-[262px] shrink-0 flex-col overflow-y-auto border-r hairline bg-canvas px-3.5 py-5">
      <div className="mb-4 flex items-center gap-2.5 px-2">
        <Avatar id="mote" size={28} />
        <span className="text-[15px] font-semibold tracking-[-.01em]">MOTE</span>
      </div>

      <button
        onClick={() => setNewTask(true)}
        className="mb-1 flex h-10 items-center justify-center gap-2 rounded-full bg-shell-ink text-[13.5px] font-medium text-white transition hover:bg-shell-deep"
      >
        <span className="text-[15px] leading-none">+</span> New task
      </button>

      {favourites.length > 0 && (
        <>
          <SectionLabel>Favourites</SectionLabel>
          <nav className="space-y-0.5">
            {favourites.map((t) => (
              <NavLink key={t.id} to={`/task/${t.id}`} className={link}>
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar id={t.employeeId} size={20} />
                  <span className="truncate">{t.title}</span>
                </span>
                <Star on onClick={() => toggleFavourite(t.id)} size={12} />
              </NavLink>
            ))}
          </nav>
        </>
      )}

      <SectionLabel>Recent</SectionLabel>
      <nav className="space-y-0.5">
        {recent.map((t) => (
          <NavLink key={t.id} to={`/task/${t.id}`} className={link}>
            <span className="flex min-w-0 items-center gap-2">
              <Avatar id={t.employeeId} size={20} />
              <span className="truncate">{t.title}</span>
            </span>
          </NavLink>
        ))}
        <NavLink to="/" className={link}>
          <span className="text-shell-ink/45">All tasks</span>
        </NavLink>
      </nav>

      <SectionLabel
        action={
          <button
            onClick={() => setNewProject(true)}
            className="text-[15px] leading-none text-shell-ink/35 hover:text-shell-ink"
            aria-label="New project"
            title="New project"
          >
            +
          </button>
        }
      >
        Projects
      </SectionLabel>
      <nav className="space-y-0.5">
        {projects.map((p) => (
          <NavLink key={p.id} to={`/project/${p.id}`} className={link}>
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.tint }} />
              <span className="truncate">{p.name}</span>
            </span>
          </NavLink>
        ))}
      </nav>

      <SectionLabel>Workspace</SectionLabel>
      <nav className="space-y-0.5">
        <NavLink to="/approvals" className={link}>
          <span className="flex items-center gap-2">
            <Crown size={13} className="text-crown" />
            Approvals
          </span>
          {approvals.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-crown px-1.5 text-[11px] font-semibold text-white">
              {approvals.length}
            </span>
          )}
        </NavLink>
        <NavLink to="/team" className={link}>
          Your team
        </NavLink>
        <NavLink to="/runs" className={link}>
          Work log
        </NavLink>
        <NavLink to="/performance" className={link}>
          Performance
        </NavLink>
        <NavLink to="/trust" className={link}>
          Privacy
        </NavLink>
      </nav>

      <div className="mt-auto space-y-0.5 pt-5">
        <NavLink to="/settings" className={link}>
          Settings
        </NavLink>
        <NavLink to="/plan" className={link}>
          <span>Plan</span>
          <span className="text-[11px] capitalize text-shell-ink/40">{plan}</span>
        </NavLink>
      </div>

      <NewTaskDialog open={newTask} onClose={() => setNewTask(false)} />
      <NewProjectDialog open={newProject} onClose={() => setNewProject(false)} />
    </aside>
  );
}
