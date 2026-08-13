import Link from "next/link";

const GROUPS = [
  {
    heading: "Library",
    links: [
      { label: "Templates", href: "/?category=template" },
      { label: "Scenes", href: "/?category=scene" },
      { label: "Backgrounds", href: "/?category=background" },
      { label: "Sections", href: "/?category=section" },
    ],
  },
  {
    heading: "Product",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Account", href: "/account" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Licence", href: "/licence" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

/** Site-wide footer. Quiet, glass hairline, monospace headings. */
export function Footer() {
  return (
    <footer className="relative mx-auto mt-24 w-full max-w-6xl px-4 pb-16">
      <div className="glass rounded-card p-8 sm:p-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(79,227,232,0.6)]" />
              <span className="font-display text-lg font-semibold tracking-tight text-bone">
                lucen
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-faint">
              Premium website layers — with the prompt and assets included. New
              drops every Friday.
            </p>
          </div>

          {GROUPS.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                {group.heading}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-faint transition-colors hover:text-bone"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-[var(--glass-border)] pt-6 text-xs text-faint sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Lucen. Made in Australia.</p>
          <p className="font-mono">lucen.ai</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
