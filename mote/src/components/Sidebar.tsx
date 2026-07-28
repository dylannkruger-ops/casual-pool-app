import { NavLink } from 'react-router-dom';
import { ROSTER } from '../data/roster';
import { useMote } from '../store/useMote';
import { MotePill } from './Mote';
import { Crown } from './Crown';

const link = ({ isActive }: { isActive: boolean }) =>
  `flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13.5px] transition ${
    isActive ? 'bg-black/[.06] font-medium text-shell-ink' : 'text-shell-ink/60 hover:bg-black/[.035]'
  }`;

export function Sidebar() {
  const { hired, approvals, plan } = useMote();
  const team = ROSTER.filter((e) => hired.includes(e.id));

  return (
    <aside className="flex h-screen w-[248px] shrink-0 flex-col border-r hairline bg-canvas px-3.5 py-5">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-shell-ink">
          <span className="h-2.5 w-2.5 rounded-full bg-glow" />
        </span>
        <span className="text-[15px] font-semibold tracking-[-.01em]">MOTE</span>
      </div>

      <div className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-shell-ink/35">
        Your team
      </div>
      <nav className="mb-5 space-y-0.5">
        {team.map((e) => (
          <NavLink key={e.id} to={`/employee/${e.id}`} className={link}>
            <span className="flex items-center gap-2.5">
              <MotePill tint={e.tint} />
              <span>{e.name}</span>
            </span>
          </NavLink>
        ))}
        <NavLink to="/" className={link}>
          <span className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-black/20 text-[13px] text-shell-ink/40">
              +
            </span>
            <span>Hire</span>
          </span>
        </NavLink>
      </nav>

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

      <div className="mt-auto space-y-0.5 pt-4">
        <NavLink to="/settings" className={link}>
          Settings
        </NavLink>
        <NavLink to="/plan" className={link}>
          <span>Plan</span>
          <span className="text-[11px] capitalize text-shell-ink/40">{plan}</span>
        </NavLink>
      </div>
    </aside>
  );
}
