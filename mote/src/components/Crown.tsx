/**
 * The crown is the boss/owner motif — it marks surfaces where the decision is
 * the user's, not Mote's. It never sits on Mote's head in the product UI:
 * the point is that the human wears it.
 */
export function Crown({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 18"
      width={size}
      height={(size * 18) / 24}
      className={className}
      aria-hidden
    >
      <path
        d="M2 15.2 L1 3.6 l6.2 4.3 L12 1 l4.8 6.9 L23 3.6 l-1 11.6 Z"
        fill="currentColor"
      />
      <circle cx="1" cy="2.6" r="1.6" fill="currentColor" />
      <circle cx="12" cy="1.4" r="1.6" fill="currentColor" />
      <circle cx="23" cy="2.6" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Header used on every surface where the user is being asked to decide. */
export function BossHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-crown-soft text-crown">
        <Crown size={16} />
      </span>
      <div>
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
        {sub && <p className="mt-0.5 text-[13px] muted">{sub}</p>}
      </div>
    </div>
  );
}
