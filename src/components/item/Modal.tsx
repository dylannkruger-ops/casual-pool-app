"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * Dialog shell for the intercepted item detail. Closes on Escape, backdrop
 * click, or the close button — all via router.back() so the URL and history
 * stay correct. Locks body scroll and traps initial focus. Honoured under
 * reduced motion (the enter transition is disabled globally via CSS).
 */
export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => router.back(), [router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [close]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:p-6"
    >
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={close}
        className="fixed inset-0 cursor-default bg-[rgba(3,4,6,0.72)] backdrop-blur-sm"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="glass-strong relative z-10 my-4 w-full max-w-3xl rounded-card p-5 outline-none sm:my-8 sm:p-7"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-pill text-muted transition-colors hover:bg-[rgba(236,234,227,0.06)] hover:text-bone focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
