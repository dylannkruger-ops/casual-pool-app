/**
 * Mote's body. One body, six states (PRD §5.3) — employees are modes of it,
 * expressed through eye tint and nameplate, never through a different shape.
 * Drawn as SVG rather than the render so it stays crisp at 24px and can be
 * re-tinted per employee without shipping six bitmaps.
 */
export type MoteState = 'idle' | 'watching' | 'thinking' | 'acting' | 'needs-you' | 'done';

const EYE_OFFSET: Record<MoteState, number> = {
  idle: 0,
  watching: 3.5,
  thinking: 0,
  acting: -2,
  'needs-you': 0,
  done: 0,
};

export function Mote({
  state = 'idle',
  tint = '#2fd463',
  size = 96,
  arms = true,
  className = '',
}: {
  state?: MoteState;
  tint?: string;
  size?: number;
  arms?: boolean;
  className?: string;
}) {
  const dx = EYE_OFFSET[state];
  const bodyAnim =
    state === 'idle' ? 'animate-breathe' : state === 'done' ? 'animate-bloom' : '';
  const ringAnim = state === 'thinking' ? 'animate-pulse2' : '';
  const ringWidth = state === 'needs-you' ? 3.4 : 2;

  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={`${bodyAnim} ${className}`}
      role="img"
      aria-label={`Mote — ${state}`}
    >
      <defs>
        <filter id={`mote-glow-${state}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {arms && (
        <>
          <rect x="6" y="52" width="15" height="34" rx="7.5" fill="#3a3d42" />
          <rect x="99" y="52" width="15" height="34" rx="7.5" fill="#3a3d42" />
        </>
      )}

      {/* shell */}
      <rect x="17" y="14" width="86" height="92" rx="30" fill="#3a3d42" />
      {/* feet */}
      <rect x="34" y="98" width="20" height="14" rx="6" fill="#34373c" />
      <rect x="66" y="98" width="20" height="14" rx="6" fill="#34373c" />

      {/* face plate */}
      <rect x="26" y="24" width="68" height="56" rx="20" fill="#141618" />
      <rect
        x="26"
        y="24"
        width="68"
        height="56"
        rx="20"
        fill="none"
        stroke={tint}
        strokeWidth={ringWidth}
        className={ringAnim}
        filter={`url(#mote-glow-${state})`}
      />

      <g filter={`url(#mote-glow-${state})`} className={ringAnim}>
        <rect x={44 + dx} y="38" width="10" height="17" rx="5" fill={tint} />
        <rect x={66 + dx} y="38" width="10" height="17" rx="5" fill={tint} />
        {state !== 'needs-you' && (
          <path
            d="M53 65 q7 6 14 0"
            fill="none"
            stroke={tint}
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}
        {state === 'needs-you' && (
          <path d="M53 66 h14" stroke={tint} strokeWidth="3" strokeLinecap="round" />
        )}
      </g>

      {/* acting: a sweep across the face plate */}
      {state === 'acting' && (
        <g clipPath="inset(0)">
          <rect x="26" y="24" width="68" height="56" rx="20" fill="none" />
          <rect
            x="26"
            y="24"
            width="18"
            height="56"
            fill={tint}
            opacity="0.14"
            className="animate-sweep"
          />
        </g>
      )}
    </svg>
  );
}

/** The 24px collapsed pill (PRD §5.3). */
export function MotePill({ tint = '#2fd463' }: { tint?: string }) {
  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-shell"
      aria-hidden
    >
      <span className="h-2 w-2 rounded-full" style={{ background: tint }} />
    </span>
  );
}
