import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useMote } from '../store/useMote';
import { Avatar } from './Avatar';
import { Crown } from './Crown';
import { DockedStatus } from './DockedStatus';
import { AccountMenu } from './AccountMenu';
import { NewProjectDialog, NewTaskDialog } from './dialogs';

const row = ({ isActive }: { isActive: boolean }) =>
  `flex items-center justify-between gap-2 rounded-xl px-2.5 py-[7px] text-[13px] transition ${
    isActive ? 'bg-hover font-medium text-ink' : 'text-ink/65 hover:bg-hover'
  }`;

function Label({ children }: { children: string }) {
  return (
    <div className="mb-1 mt-5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-ink/30">
      {children}
    </div>
  );
}

/**
 * The sidebar is the task history, not a feature menu. Anything you touch once
 * a month lives behind the account button at the bottom.
 */
export function Sidebar() {
  const { tasks, projects, approvals, setPalette } = useMote();
  const [newTask, setNewTask] = useState(false);
  const [newProject, setNewProject] = useState(false);
  const favourites = tasks.filter((t) => t.favourite);
  const rest = tasks.filter((t) => !t.favourite);

  return (
    <aside className="hidden h-screen w-[268px] shrink-0 flex-col border-r hairline bg-rail px-3 py-4 lg:flex">
      <Link to="/" className="mb-3 flex items-center gap-2.5 rounded-xl px-2 py-1 transition hover:bg-hover">
        <Avatar id="mote" size={26} />
        <span className="text-[14.5px] font-semibold tracking-[-.01em]">MOTE</span>
      </Link>

      <button
        onClick={() => setNewTask(true)}
        className="mb-2.5 flex h-9 items-center justify-center gap-1.5 rounded-full bg-btn text-[13px] font-medium text-btn-ink transition hover:opacity-90"
      >
        <span className="text-[15px] leading-none">+</span> New task
      </button>

      {/* One search for the whole app, rather than a rail filter plus a jump box. */}
      <button
        onClick={() => setPalette(true)}
        className="mb-1 flex h-8 items-center justify-between rounded-full bg-hover px-3.5 text-[12.5px] text-ink/45 transition hover:bg-hover"
      >
        Search
        <span className="text-[11px] text-ink/35">⌘K</span>
      </button>

      {approvals.length > 0 && (
        <NavLink to="/approvals" className={row}>
          <span className="flex items-center gap-2">
            <Crown size={13} className="text-crown" />
            Needs your yes
          </span>
          <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-crown px-1 text-[10.5px] font-semibold text-white">
            {approvals.length}
          </span>
        </NavLink>
      )}

      <div className="-mr-1 min-h-0 flex-1 overflow-y-auto pr-1">
        {favourites.length > 0 && (
          <>
            <Label>Favourites</Label>
            <nav className="space-y-0.5">
              {favourites.map((t) => (
                <NavLink key={t.id} to={`/task/${t.id}`} className={row}>
                  <span className="flex min-w-0 items-center gap-2">
                    <Avatar id={t.employeeId} size={18} />
                    <span className="truncate">{t.title}</span>
                  </span>
                </NavLink>
              ))}
            </nav>
          </>
        )}

        <Label>Recent</Label>
        <nav className="space-y-0.5">
          {rest.slice(0, 8).map((t) => (
            <NavLink key={t.id} to={`/task/${t.id}`} className={row}>
              <span className="flex min-w-0 items-center gap-2">
                <Avatar id={t.employeeId} size={18} />
                <span className="truncate">{t.title}</span>
              </span>
            </NavLink>
          ))}
          <NavLink to="/history" className={row}>
            <span className="text-ink/45">All tasks</span>
          </NavLink>
        </nav>

        <div className="mb-1 mt-5 flex items-center justify-between px-2.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-ink/30">
            Projects
          </span>
          <button
            onClick={() => setNewProject(true)}
            className="text-[14px] leading-none text-ink/30 hover:text-ink"
            aria-label="New project"
            title="New project"
          >
            +
          </button>
        </div>
        <nav className="space-y-0.5">
          {projects.map((p) => (
            <NavLink key={p.id} to={`/project/${p.id}`} className={row}>
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: p.tint }} />
                <span className="truncate">{p.name}</span>
              </span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-3 space-y-2 border-t hairline pt-3">
        <DockedStatus />
        <AccountMenu />
      </div>

      <NewTaskDialog open={newTask} onClose={() => setNewTask(false)} />
      <NewProjectDialog open={newProject} onClose={() => setNewProject(false)} />
    </aside>
  );
}
