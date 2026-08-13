"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What exactly do I get when I unlock an item?",
    a: "Two things: the complete build prompt — role, design thesis, exact tokens, section-by-section layout, motion and performance budgets, written to build one block at a time — and the bundled asset zip where an item ships one (fonts, textures, config, starter files).",
  },
  {
    q: "What can I do with the output? What's the licence?",
    a: "A commercial licence. Ship what you build with a Lucen prompt in client work, commercial products and paid projects. You can't resell the prompts or asset bundles themselves, or pass them off as your own product. Full terms on the licence page.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from the customer portal in your account in two clicks. You keep access until the end of the period you've already paid for — no clawbacks, no exit fees.",
  },
  {
    q: "Monthly or annual?",
    a: "Annual is two months free versus paying monthly. Same access either way: every premium prompt and asset, plus every new layer that drops each Friday while you're subscribed.",
  },
  {
    q: "Do the free items really have no catch?",
    a: "None. Free items give you the full prompt and any bundled assets with no subscription. They're a fair sample of the quality — the premium library is simply larger and refreshed weekly.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-2xl divide-y divide-[var(--glass-border)] overflow-hidden rounded-card border border-[var(--glass-border)]">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[rgba(236,234,227,0.03)] focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2"
            >
              <span className="text-[15px] font-medium text-bone">{item.q}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
                className={cn(
                  "shrink-0 text-faint transition-transform duration-200",
                  isOpen && "rotate-45",
                )}
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <div
              className={cn(
                "grid transition-all duration-200 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Faq;
