import type { ReactNode } from 'react';
import type { Layer, Tier } from '../lib/types';

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'quiet' | 'danger';
  size?: 'sm' | 'md';
  disabled?: boolean;
  title?: string;
}) {
  const base =
    'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition disabled:opacity-40 disabled:cursor-not-allowed';
  const sizes = size === 'sm' ? 'h-8 px-3.5 text-[13px]' : 'h-10 px-5 text-sm';
  const variants = {
    primary: 'bg-shell-ink text-white hover:bg-shell-deep',
    ghost: 'border border-black/[.10] bg-white hover:bg-canvas-sunk',
    quiet: 'text-shell-ink/70 hover:text-shell-ink hover:bg-black/[.04]',
    danger: 'border border-black/[.10] bg-white text-shell-ink/80 hover:bg-canvas-sunk',
  }[variant];
  return (
    <button className={`${base} ${sizes} ${variants}`} onClick={onClick} disabled={disabled} title={title}>
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function Chip({
  children,
  tone = 'neutral',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'good' | 'warn' | 'stop' | 'quiet';
}) {
  // Explicit tints rather than opacity modifiers — the 12% washes were too
  // faint to read as chips at all.
  const tones = {
    neutral: 'bg-black/[.05] text-shell-ink/70',
    good: 'bg-[#dcf5e6] text-[#1a7a41]',
    warn: 'bg-[#faeecd] text-[#8a6a12]',
    stop: 'bg-[#fbdfe5] text-[#a8455a]',
    quiet: 'bg-transparent text-shell-ink/45 border border-black/[.08]',
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium ${tones}`}
    >
      {children}
    </span>
  );
}

const TIER_LABEL: Record<Tier, string> = { green: 'Green', amber: 'Amber', red: 'Red' };
const TIER_TONE = { green: 'good', amber: 'warn', red: 'stop' } as const;

export function TierChip({ tier }: { tier: Tier }) {
  return <Chip tone={TIER_TONE[tier]}>{TIER_LABEL[tier]}</Chip>;
}

const LAYER_LABEL: Record<Layer, string> = {
  connector: 'Connector',
  a11y: 'Accessibility tree',
  vision: 'Vision',
};

/** Which of the three layers did the work — a tracked reliability metric (§5.4). */
export function LayerChip({ layer }: { layer: Layer }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] text-shell-ink/45">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          background: layer === 'connector' ? '#2fd463' : layer === 'a11y' ? '#5b9bf0' : '#e5a13a',
        }}
      />
      {LAYER_LABEL[layer]}
    </span>
  );
}

export function Toggle({
  on,
  onChange,
  label,
  locked,
  lockedReason,
}: {
  on: boolean;
  onChange?: () => void;
  label: string;
  locked?: boolean;
  lockedReason?: string;
}) {
  return (
    <button
      onClick={locked ? undefined : onChange}
      aria-pressed={on}
      aria-label={label}
      title={locked ? lockedReason : label}
      className={`relative h-6 w-10 shrink-0 rounded-full transition ${
        on ? 'bg-shell-ink' : 'bg-black/[.14]'
      } ${locked ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? 'left-[1.125rem]' : 'left-0.5'
        }`}
      />
    </button>
  );
}

export function Row({
  title,
  sub,
  right,
}: {
  title: ReactNode;
  sub?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b hairline py-4 last:border-0">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        {sub && <div className="mt-0.5 text-[13px] muted">{sub}</div>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col items-start gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div>
        {/* The mobile header already names the screen — no need to say it twice. */}
        <h1 className="hidden text-[26px] font-semibold tracking-[-.02em] lg:block">{title}</h1>
        {sub && <p className="mt-1.5 max-w-2xl text-[14px] muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/** Availability honesty rule (PRD §6) — nothing unshipped is sold present-tense. */
export function ComingLabel({ when = 'v1.5' }: { when?: string }) {
  return <Chip tone="quiet">Coming {when}</Chip>;
}
