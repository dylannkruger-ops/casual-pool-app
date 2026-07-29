import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { spendStatus, useMote } from '../store/useMote';
import { applyTheme, readTheme, watchSystemTheme, type Theme } from '../lib/theme';

/**
 * One door for everything that isn't daily. Team, connectors, spend, the logs,
 * the policies and the plan used to sit in the sidebar at the same volume as
 * the work itself — nine destinations competing with the three that matter.
 */
const ITEMS: [string, string, string][] = [
  ['Your team', '/team', 'Hire, retire, trust profiles'],
  ['Connectors', '/connectors', 'Apps and your own MCP servers'],
  ['Spend guard', '/spend', 'Cap what the team can spend'],
  ['Work log', '/runs', 'Every run, step by step'],
  ['Performance', '/performance', 'Live success rates'],
  ['Privacy', '/trust', 'What we promise, and where it stops'],
  ['Settings', '/settings', 'Redaction, retention, the widget'],
  ['Plan', '/plan', 'Free, Pro, Studio'],
];

export function AccountMenu() {
  const { plan, spend, spendByEmployee } = useMote();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => readTheme());
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const status = spendStatus({ spend, spendByEmployee });

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  // "System" has to keep tracking the OS after the app has loaded.
  useEffect(() => watchSystemTheme(() => applyTheme(readTheme())), []);

  const pick = (t: Theme) => {
    setTheme(t);
    applyTheme(t);
  };

  return (
    <div ref={ref} className="relative">
      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-[248px] overflow-hidden rounded-2xl border border-line bg-surface py-1.5 shadow-widget">
          <div className="border-b border-line px-3.5 pb-2.5 pt-1.5">
            <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-ink/35">
              Appearance
            </div>
            <div className="flex gap-1 rounded-full bg-sunk p-0.5">
              {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => pick(t)}
                  aria-pressed={theme === t}
                  className={`flex-1 rounded-full py-1 text-[11.5px] capitalize transition ${
                    theme === t ? 'bg-surface font-medium text-ink shadow-card' : 'text-ink/50 hover:text-ink'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {ITEMS.map(([label, to, sub]) => (
            <button
              key={to}
              onClick={() => {
                setOpen(false);
                navigate(to);
              }}
              className="flex w-full flex-col items-start px-3.5 py-2 text-left transition hover:bg-sunk"
            >
              <span className="flex w-full items-center justify-between gap-2 text-[13.5px] font-medium">
                {label}
                {to === '/spend' && status.alerting && (
                  <span className="h-1.5 w-1.5 rounded-full bg-crown" title="Near your spend cap" />
                )}
              </span>
              <span className="text-[11.5px] muted">{sub}</span>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Account and settings"
        className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition hover:bg-hover"
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-btn text-[11px] font-semibold text-btn-ink">
          DK
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium">Dylan</span>
          <span className="block text-[11px] capitalize muted">{plan} plan</span>
        </span>
        <span className="text-[13px] text-ink/30">⋯</span>
      </button>
    </div>
  );
}
