import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { spendStatus, useMote } from '../store/useMote';
import { byId } from '../data/roster';
import { Avatar } from './Avatar';
import { Crown } from './Crown';
import { Modal } from './Modal';
import { NewTaskDialog } from './dialogs';

const ICONS = {
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  history: 'M12 7v5l3.5 2M21 12a9 9 0 1 1-3-6.7',
  team: 'M8 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm9 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M15.5 14.6c2.6.3 4.5 2.3 4.5 5.4',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
};

function TabIcon({ d, filled = false }: { d: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const tab = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-[10.5px] font-medium transition ${
    isActive ? 'bg-black/[.06] text-shell-ink' : 'text-shell-ink/45'
  }`;

/** Sintra-style header: who you are, where you are, and one actions button. */
export function MobileHeader({ title }: { title: string }) {
  const { approvals } = useMote();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-canvas/95 px-5 pb-3 pt-5 backdrop-blur lg:hidden">
      <Avatar id="mote" size={40} />
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[19px] font-semibold leading-tight tracking-[-.02em]">{title}</h1>
      </div>
      <button
        onClick={() => navigate('/approvals')}
        aria-label="Approvals"
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-crown shadow-card"
      >
        <Crown size={17} />
        {approvals.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-crown px-1 text-[10px] font-semibold text-white">
            {approvals.length}
          </span>
        )}
      </button>
    </header>
  );
}

function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const items = [
    ['Connectors', '/connectors', 'Apps and your own MCP servers'],
    ['Spend guard', '/spend', 'Cap what the team can spend'],
    ['Work log', '/runs', 'Every run, step by step'],
    ['Performance', '/performance', 'Live success rates'],
    ['Privacy', '/trust', 'What we promise, and where it stops'],
    ['Settings', '/settings', 'Redaction, retention, the widget'],
    ['Plan', '/plan', 'Free, Pro, Studio'],
  ];
  return (
    <Modal open={open} onClose={onClose} title="More" width={520}>
      <div className="-mx-2">
        {items.map(([label, to, sub]) => (
          <button
            key={to}
            onClick={() => {
              onClose();
              navigate(to);
            }}
            className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-3.5 text-left transition hover:bg-canvas-sunk"
          >
            <span>
              <span className="block text-[14.5px] font-medium">{label}</span>
              <span className="mt-0.5 block text-[12.5px] muted">{sub}</span>
            </span>
            <span className="text-shell-ink/25">›</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

/**
 * Floating pill tab bar. Mobile is for asking, watching and approving — the
 * desk work still happens at the machine (PRD §3.2: no mobile device control).
 */
export function MobileTabBar() {
  const { approvals, widget, activeEmployee, spend, spendByEmployee } = useMote();
  const [more, setMore] = useState(false);
  const [newTask, setNewTask] = useState(false);
  const employee = byId(activeEmployee);
  const status = spendStatus({ spend, spendByEmployee });

  return (
    <>
      {/* One bottom stack: new-task button, status, tabs. Previously the status
          strip floated at a fixed offset and landed on top of whatever content
          happened to be there, which read as a bug rather than as chrome. */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col items-stretch gap-2 px-4 pb-4 lg:hidden">
        <button
          onClick={() => setNewTask(true)}
          aria-label="New task"
          className="flex h-14 w-14 items-center justify-center self-end rounded-full bg-shell-ink text-[26px] font-light text-white shadow-widget"
        >
          +
        </button>

        {status.blocked ? (
          <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-full bg-[#a8455a] px-4 py-2 text-[12.5px] text-white shadow-widget">
            Spend cap reached — no new work starting.
          </div>
        ) : (
          widget !== 'idle' && (
            <div className="mx-auto flex w-full max-w-md items-center gap-2.5 rounded-full bg-shell-ink px-3 py-2 text-white shadow-widget">
              <Avatar id={activeEmployee} size={22} />
              <span className="truncate text-[12.5px]">
                {widget === 'needs-you'
                  ? `${employee?.name} needs your yes`
                  : `${employee?.name} is working`}
              </span>
            </div>
          )
        )}

        <nav className="mx-auto flex w-full max-w-md items-center gap-1 rounded-[26px] border border-black/[.05] bg-white/95 p-1.5 shadow-widget backdrop-blur">
          <NavLink to="/" end className={tab}>
            {({ isActive }) => (
              <>
                <TabIcon d={ICONS.home} filled={isActive} />
                Home
              </>
            )}
          </NavLink>
          <NavLink to="/history" className={tab}>
            <TabIcon d={ICONS.history} />
            History
          </NavLink>
          <NavLink to="/team" className={tab}>
            <TabIcon d={ICONS.team} />
            Team
          </NavLink>
          <NavLink to="/approvals" className={tab}>
            <span className="relative">
              <Crown size={19} />
              {approvals.length > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-crown px-1 text-[9.5px] font-semibold text-white">
                  {approvals.length}
                </span>
              )}
            </span>
            Approvals
          </NavLink>
          <button onClick={() => setMore(true)} className={`${tab({ isActive: false })} cursor-pointer`}>
            <TabIcon d={ICONS.more} />
            More
          </button>
        </nav>
      </div>

      <MoreSheet open={more} onClose={() => setMore(false)} />
      <NewTaskDialog open={newTask} onClose={() => setNewTask(false)} />
    </>
  );
}
