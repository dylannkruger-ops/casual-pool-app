import { useEffect, type ReactNode } from 'react';

export function Modal({
  open,
  onClose,
  title,
  sub,
  children,
  width = 460,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  sub?: string;
  children: ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Don't let Esc reach the kill switch while a dialog is up.
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/25 p-6 pt-[12vh]">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full rounded-xl2 border border-line bg-surface p-6 shadow-widget"
        style={{ maxWidth: width }}
      >
        <div className="mb-5">
          <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
          {sub && <p className="mt-1 text-[13px] muted">{sub}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Deliberately a div, not a label. Some fields hold a group of buttons, and a
 * <label> wrapping them folds its text into every button's accessible name
 * ("Who takes it Wren Wren Tally"). Inputs carry their own aria-label instead.
 */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-4">
      <span className="mb-1.5 block text-[12px] font-medium text-ink/60">{label}</span>
      {children}
    </div>
  );
}

export const inputClass =
  'h-10 w-full rounded-xl border border-line bg-surface px-3.5 text-[13.5px] placeholder:text-ink/30';
