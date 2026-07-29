import { useEffect } from 'react';
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
 * The body (PRD §5.3), docked into the shell rather than floating over it.
 *
 * In the shipped product the widget is always-on-top over *other* apps — that
 * is the whole point of it. Over MOTE's own window it was just covering the
 * app, and the layout had to reserve a 332px gutter to avoid it. Docked here it
 * keeps its job (which employee, what state, kill switch) and gives the gutter
 * back to the content.
 */
export function DockedStatus() {
  const { widget, activeEmployee, discreet, toggleDiscreet, kill } = useMote();
  const tint = employeeTint(activeEmployee);
  const employee = byId(activeEmployee);
  const busy = widget !== 'idle';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') kill();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [kill]);

  return (
    <div className="rounded-2xl bg-widget px-3 py-2.5 text-widget-ink">
      <div className="flex items-center gap-2.5">
        <button onClick={kill} title="Click the face to halt (or press Esc)" className="shrink-0">
          <Mote state={widget} tint={tint} size={34} arms={false} />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12.5px] font-medium">{employee?.name ?? 'Mote'}</div>
          {/* Discreet mode hides the caption, never the state (§5.3). */}
          <div className="truncate text-[11.5px] text-widget-ink/55">
            {discreet ? '—' : CAPTION[widget]}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-1 border-t border-widget-ink/10 pt-2">
        <button
          onClick={toggleDiscreet}
          className={`rounded-full px-2 py-0.5 text-[11px] transition ${
            discreet ? 'bg-widget-ink/15 text-widget-ink' : 'text-widget-ink/45 hover:text-widget-ink'
          }`}
        >
          Discreet
        </button>
        <button
          onClick={kill}
          disabled={!busy}
          className="rounded-full px-2 py-0.5 text-[11px] text-widget-ink/45 transition hover:text-widget-ink disabled:opacity-40"
        >
          Esc — halt
        </button>
      </div>
    </div>
  );
}
