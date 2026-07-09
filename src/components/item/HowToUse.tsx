"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Copy the prompt",
    body: "Use the copy button above. The full build prompt lands on your clipboard — role, design thesis, exact tokens, section-by-section layout, motion and performance budgets.",
  },
  {
    title: "Paste into Claude",
    body: "Open a fresh Claude session and paste the prompt as your opening message. Claude Code or the desktop app both work. Attach any bundled assets you downloaded.",
  },
  {
    title: "Iterate block by block",
    body: "The prompt is written to build one block at a time. Let Claude finish a block, review it, then say continue. Resist the urge to ask for everything at once.",
  },
  {
    title: "Wire up your data",
    body: "Swap the placeholder copy, images and links for yours. The prompt keeps structure and tokens fixed, so your content drops straight into a coherent system.",
  },
  {
    title: "Deploy on Vercel",
    body: "Push to a repo and import it into Vercel. The prompt targets an edge-friendly build with a strict performance budget, so first deploys come up green.",
  },
];

/** The 5-step "How to use" accordion shown to entitled users. */
export function HowToUse() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--glass-border)] overflow-hidden rounded-card border border-[var(--glass-border)]">
      {STEPS.map((step, i) => {
        const isOpen = open === i;
        return (
          <div key={step.title}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[rgba(236,234,227,0.03)] focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent/12 font-mono text-[11px] text-accent">
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-medium text-bone">
                {step.title}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
                className={cn(
                  "text-faint transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              className={cn(
                "grid transition-all duration-200 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 pl-14 text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HowToUse;
