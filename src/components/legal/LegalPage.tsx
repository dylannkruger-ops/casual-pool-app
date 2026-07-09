import type { ReactNode } from "react";
import { Nav } from "@/components/glass/Nav";
import { Footer } from "@/components/Footer";

/** Shared shell for legal pages — quiet, readable, on-brand prose. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-dvh">
      <Nav />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-28">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          Legal
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-bone sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-faint">Last updated {updated}</p>

        <div className="legal-prose mt-8 space-y-6 text-[15px] leading-relaxed text-bone/80">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

/** A titled section within a legal page. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-2.5">
      <h2 className="font-display text-lg font-semibold text-bone">{heading}</h2>
      {children}
    </section>
  );
}

export default LegalPage;
