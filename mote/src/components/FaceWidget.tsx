import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mote, type MoteState } from './Mote';
import { employeeTint, useMote } from '../store/useMote';
import { byId } from '../data/roster';

const CAPTION: Record<MoteState, string> = {
  idle: 'Nothing running.',
  watching: 'Watching Excel — Orders.xlsx',
  thinking: 'Reading the order email…',
  acting: 'Typing row 118 — customer, date, 6 items',
  'needs-you': 'Needs your yes to send',
  done: 'Order #4471 logged and replied.',
};

/**
 * The body (PRD §5.3): always-on-top, zero chrome, collapses to a pill.
 * Esc halts mid-action — the kill switch is never blocked by anything,
 * including discreet mode (FR-21).
 */
export function FaceWidget() {
  const { widget, activeEmployee, discreet, toggleDiscreet, kill, approvals } = useMote();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const tint = employeeTint(activeEmployee);
  const employee = byId(activeEmployee);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') kill();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [kill]);

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-6 right-6 hidden h-6 w-6 items-center justify-center rounded-full bg-shell-ink shadow-widget lg:flex"
        aria-label="Expand Mote"
      >
        <span className="h-2 w-2 rounded-full" style={{ background: tint }} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 hidden w-[292px] overflow-hidden rounded-xl2 bg-shell-ink text-white shadow-widget lg:block">
      <div className="flex items-center gap-3 px-4 pt-4">
        <button onClick={kill} title="Click the face to halt (or press Esc)" className="shrink-0">
          <Mote state={widget} tint={tint} size={54} arms={false} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13.5px] font-medium">{employee?.name ?? 'Mote'}</span>
            <span className="text-[11px] text-white/40">{employee?.role}</span>
          </div>
          {/* Discreet mode hides the caption, never the state (§5.3). */}
          <p className="mt-0.5 truncate text-[12.5px] text-white/60">
            {discreet ? '—' : CAPTION[widget]}
          </p>
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between border-t border-white/[.08] px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={toggleDiscreet}
            className={`rounded-full px-2.5 py-1 text-[11.5px] transition ${
              discreet ? 'bg-white/15 text-white' : 'text-white/50 hover:text-white'
            }`}
          >
            Discreet
          </button>
          <button
            onClick={kill}
            className="rounded-full px-2.5 py-1 text-[11.5px] text-white/50 transition hover:text-white"
          >
            Esc — halt
          </button>
        </div>
        <div className="flex items-center gap-1">
          {approvals.length > 0 && (
            <button
              onClick={() => navigate('/approvals')}
              className="rounded-full bg-crown px-2.5 py-1 text-[11.5px] font-medium text-white"
            >
              {approvals.length} waiting
            </button>
          )}
          <button
            onClick={() => setCollapsed(true)}
            className="rounded-full px-2 py-1 text-[11.5px] text-white/40 hover:text-white"
            aria-label="Collapse"
          >
            —
          </button>
        </div>
      </div>
    </div>
  );
}
