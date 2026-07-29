import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMote } from '../store/useMote';
import { ROSTER } from '../data/roster';
import { Avatar } from './Avatar';
import { Crown } from './Crown';

type Item = {
  key: string;
  label: string;
  hint?: string;
  employeeId?: string;
  icon?: 'crown' | 'page';
  run: () => void;
};

const PAGES: [string, string, string][] = [
  ['Home', '/', 'Ask the team for something'],
  ['History', '/history', 'Everything the team has done'],
  ['Your team', '/team', 'Hire, retire, trust profiles'],
  ['Needs your yes', '/approvals', 'Approvals waiting on you'],
  ['Connectors', '/connectors', 'Apps and your own MCP servers'],
  ['Spend guard', '/spend', 'Cap what the team can spend'],
  ['Work log', '/runs', 'Every run, step by step'],
  ['Performance', '/performance', 'Live success rates'],
  ['Privacy', '/trust', 'What we promise, and where it stops'],
  ['Settings', '/settings', 'Redaction, retention, the widget'],
  ['Plan', '/plan', 'Free, Pro, Studio'],
];

/**
 * One way to reach anything: ⌘K. Type to jump to a task, a person or a page —
 * or just describe a job and press Enter to start it, without going Home first.
 */
export function CommandPalette() {
  const { paletteOpen, setPalette, tasks, approvals, createTask } = useMote();
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement>(null);

  // ⌘K / Ctrl+K from anywhere, including inside an input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette(!useMote.getState().paletteOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setPalette]);

  useEffect(() => {
    if (paletteOpen) {
      setQ('');
      setCursor(0);
    }
  }, [paletteOpen]);

  const items = useMemo<Item[]>(() => {
    const query = q.trim();
    const lower = query.toLowerCase();
    const match = (s: string) => s.toLowerCase().includes(lower);
    const out: Item[] = [];

    // Typing a sentence is the common case — offer it as the first action.
    if (query.length > 2) {
      out.push({
        key: 'ask',
        label: `Ask the team: “${query}”`,
        hint: 'MOTE decides who takes it',
        employeeId: 'mote',
        run: () => {
          const id = createTask({ title: query, employeeId: 'mote' });
          setPalette(false);
          if (id) navigate(`/task/${id}`);
        },
      });
    }

    if (approvals.length > 0 && (!query || match('approvals') || match('yes'))) {
      out.push({
        key: 'approvals',
        label: `${approvals.length} ${approvals.length === 1 ? 'thing needs' : 'things need'} your yes`,
        icon: 'crown',
        run: () => {
          setPalette(false);
          navigate('/approvals');
        },
      });
    }

    for (const t of tasks.filter((t) => !query || match(t.title)).slice(0, 6)) {
      out.push({
        key: `task-${t.id}`,
        label: t.title,
        hint: 'Task',
        employeeId: t.employeeId,
        run: () => {
          setPalette(false);
          navigate(`/task/${t.id}`);
        },
      });
    }

    for (const e of ROSTER.filter((e) => query && (match(e.name) || match(e.role))).slice(0, 4)) {
      out.push({
        key: `emp-${e.id}`,
        label: e.name,
        hint: e.role,
        employeeId: e.id,
        run: () => {
          setPalette(false);
          navigate(`/employee/${e.id}`);
        },
      });
    }

    for (const [label, to, hint] of PAGES.filter(([l, , h]) => !query || match(l) || match(h))) {
      out.push({
        key: `page-${to}`,
        label,
        hint,
        icon: 'page',
        run: () => {
          setPalette(false);
          navigate(to);
        },
      });
    }

    return out;
  }, [q, tasks, approvals, createTask, navigate, setPalette]);

  useEffect(() => setCursor(0), [q]);

  if (!paletteOpen) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setPalette(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      items[cursor]?.run();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-shell-ink/25 p-4 pt-[12vh]">
      <div className="absolute inset-0" onClick={() => setPalette(false)} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search and commands"
        className="relative w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-widget"
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search, or describe a job…"
          aria-label="Search, or describe a job"
          className="h-14 w-full border-b hairline px-5 text-[15px] placeholder:text-shell-ink/30 focus-visible:ring-0"
        />

        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-1.5">
          {items.length === 0 && (
            <p className="px-5 py-6 text-[13.5px] muted">Nothing matches “{q}”.</p>
          )}
          {items.map((it, i) => (
            <button
              key={it.key}
              onMouseEnter={() => setCursor(i)}
              onClick={it.run}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition ${
                i === cursor ? 'bg-canvas-sunk' : ''
              }`}
            >
              {it.employeeId ? (
                <Avatar id={it.employeeId} size={22} />
              ) : it.icon === 'crown' ? (
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-crown-soft text-crown">
                  <Crown size={12} />
                </span>
              ) : (
                <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-canvas-sunk text-[11px] text-shell-ink/40">
                  ↗
                </span>
              )}
              <span className="min-w-0 flex-1 truncate text-[14px]">{it.label}</span>
              {it.hint && <span className="shrink-0 text-[12px] muted">{it.hint}</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 border-t hairline px-4 py-2 text-[11.5px] muted">
          <span>↑↓ move</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
