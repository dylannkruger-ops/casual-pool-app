import type { Metadata } from "next";
import { Nav } from "@/components/glass/Nav";
import { Footer } from "@/components/Footer";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { Chip } from "@/components/glass/Chip";
import { Pill } from "@/components/glass/Pill";
import { PlanButton } from "@/components/pricing/PlanButton";
import { Faq } from "@/components/pricing/Faq";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Unlock every premium build prompt and asset bundle. Monthly or annual — two months free on annual. Cancel anytime.",
};

const FREE_FEATURES = [
  "Browse the entire library",
  "Live previews on every item",
  "Every free layer, prompt + assets",
  "New free drops each Friday",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Every premium build prompt",
  "Every bundled asset zip",
  "All new premium drops, weekly",
  "Commercial licence on output",
  "Cancel anytime, keep the period",
];

export default function PricingPage() {
  return (
    <div className="relative min-h-dvh">
      <Nav />

      {/* Giant background word behind the cards. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-40 z-0 flex justify-center overflow-hidden"
      >
        <span className="ghost-type text-center leading-none" style={{ fontSize: "clamp(6rem,26vw,26rem)" }}>
          unlock
        </span>
      </div>

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-28">
        <header className="mx-auto max-w-2xl text-center">
          <Chip tone="accent">Pricing</Chip>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-bone sm:text-5xl">
            One subscription. The whole library.
          </h1>
          <p className="mt-3 text-balance text-muted">
            Free items stay free. Go Pro to unlock every premium prompt and
            asset — and everything that drops each Friday.
          </p>
        </header>

        {/* Plan cards */}
        <div className="mt-12 grid items-start gap-4 md:grid-cols-3">
          {/* Free */}
          <GlassPanel className="flex flex-col p-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Free
            </p>
            <div className="mt-3 flex items-end gap-1">
              <span className="font-display text-4xl font-semibold text-bone">$0</span>
              <span className="mb-1 text-sm text-faint">forever</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Everything you need to browse and try Lucen.
            </p>
            <FeatureList features={FREE_FEATURES} />
            <div className="mt-6">
              <Pill href="/" variant="secondary" size="lg" className="w-full">
                Start browsing
              </Pill>
            </div>
          </GlassPanel>

          {/* Pro monthly */}
          <GlassPanel className="flex flex-col p-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
              Pro monthly
            </p>
            <div className="mt-3 flex items-end gap-1">
              <span className="font-display text-4xl font-semibold text-bone">$19</span>
              <span className="mb-1 text-sm text-faint">/ month</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              The full library, billed monthly. Cancel whenever.
            </p>
            <FeatureList features={PRO_FEATURES} />
            <div className="mt-6">
              <PlanButton plan="monthly" label="Go Pro monthly" variant="secondary" />
            </div>
          </GlassPanel>

          {/* Pro annual — highlighted */}
          <GlassPanel
            variant="strong"
            className="relative flex flex-col p-6 accent-glow"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Chip tone="new">Best value · 2 months free</Chip>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-accent">
              Pro annual
            </p>
            <div className="mt-3 flex items-end gap-1">
              <span className="font-display text-4xl font-semibold text-bone">$190</span>
              <span className="mb-1 text-sm text-faint">/ year</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Two months free versus monthly. Same full access.
            </p>
            <FeatureList features={PRO_FEATURES} accent />
            <div className="mt-6">
              <PlanButton plan="annual" label="Go Pro annual" />
            </div>
          </GlassPanel>
        </div>

        <p className="mt-6 text-center text-xs text-faint">
          Prices in USD. Taxes may apply at checkout. Secure billing by Stripe.
        </p>

        {/* FAQ */}
        <section className="mt-20">
          <h2 className="mb-8 text-center font-display text-2xl font-semibold text-bone">
            Questions, answered
          </h2>
          <Faq />
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureList({
  features,
  accent = false,
}: {
  features: string[];
  accent?: boolean;
}) {
  return (
    <ul className="mt-5 space-y-2.5">
      {features.map((f) => (
        <li key={f} className="flex items-start gap-2.5 text-sm text-bone/85">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden
            className={`mt-0.5 shrink-0 ${accent ? "text-accent" : "text-muted"}`}
          >
            <path d="m5 12 4.5 4.5L19 7" />
          </svg>
          {f}
        </li>
      ))}
    </ul>
  );
}
