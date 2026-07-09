import { Nav } from "@/components/glass/Nav";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { Pill } from "@/components/glass/Pill";
import { Chip } from "@/components/glass/Chip";
import { KineticType } from "@/components/KineticType";

/**
 * Block 1 home — the scaffold made visible. This is a foundations showcase:
 * the kinetic-type hero signature, the glass nav, and a live preview of the
 * component primitives with their states. The real library grid, filters and
 * drop strip arrive in Block 3.
 */
export default function Home() {
  return (
    <div className="relative min-h-dvh">
      <Nav />

      {/* Hero — kinetic type behind, one line of positioning over glass. */}
      <section className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col items-center justify-center px-4 pt-24 text-center">
        <KineticType word="lucen" className="top-10 opacity-90" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <Chip tone="accent">
            <span className="size-1.5 rounded-full bg-accent" />
            New drops every Friday
          </Chip>

          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-bone sm:text-6xl">
            Premium website layers, with the prompt and assets included.
          </h1>

          <p className="max-w-xl text-balance text-base text-muted sm:text-lg">
            Browse, preview live, then unlock the full build prompt and bundled
            assets. The grid is the product — this is just the foundation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Pill href="/pricing" size="lg">
              Unlock everything
            </Pill>
            <Pill href="/?category=template" variant="secondary" size="lg">
              Browse the library
            </Pill>
          </div>
        </div>
      </section>

      {/* Foundations preview — primitives + states, so Block 1 is reviewable. */}
      <section className="mx-auto max-w-6xl px-4 pb-32">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              Block 1 · foundations
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-bone">
              Glass primitives
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-faint sm:block">
            Every interactive element ships hover, focus, active, disabled and
            loading states. Reduced motion respected globally.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Pills */}
          <GlassPanel className="p-6">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              Pill · variants &amp; states
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Pill>Primary</Pill>
              <Pill variant="secondary">Secondary</Pill>
              <Pill variant="ghost">Ghost</Pill>
              <Pill loading>Loading</Pill>
              <Pill disabled>Disabled</Pill>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Pill size="sm">Small</Pill>
              <Pill size="md">Medium</Pill>
              <Pill size="lg">Large</Pill>
            </div>
          </GlassPanel>

          {/* Chips */}
          <GlassPanel className="p-6">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              Chip · tones &amp; filter toggles
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Chip tone="new">New</Chip>
              <Chip tone="free">Free</Chip>
              <Chip tone="premium">Premium</Chip>
              <Chip tone="accent">Accent</Chip>
              <Chip>Neutral</Chip>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Chip as="button" selected>
                Selected filter
              </Chip>
              <Chip as="button">Toggle filter</Chip>
              <Chip as="button">Nextjs</Chip>
              <Chip as="button">WebGL</Chip>
            </div>
          </GlassPanel>

          {/* Glass panels */}
          <GlassPanel variant="strong" className="p-6 md:col-span-2">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              GlassPanel · default vs strong (something luminous always behind)
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <GlassPanel className="flex h-28 items-center justify-center p-4">
                <span className="text-sm text-muted">default glass</span>
              </GlassPanel>
              <GlassPanel
                variant="strong"
                className="flex h-28 items-center justify-center p-4"
              >
                <span className="text-sm text-bone">strong glass</span>
              </GlassPanel>
            </div>
          </GlassPanel>
        </div>
      </section>
    </div>
  );
}
