# Lucen

> Premium website layers — with the prompt and assets included.

Lucen is a digital product library. Creators browse premium website/UI
"layers" (templates, 3D scenes, backgrounds, sections), preview them live, and
unlock the full build prompts + bundled assets via subscription. Free items are
the bait, premium items are gated, and new drops land every Friday.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase
· Stripe**, deployed on **Vercel**.

---

## Design system

- Dark base (`#050608` family, never pure black) with a single luminous accent:
  **signal cyan `#4FE3E8`**.
- **Glassmorphism** is the core language — dark-tinted frosted panels, hairline
  accent borders, inner top highlight, soft deep shadows. Something luminous
  always lives behind the blur.
- Display face: **Clash Display**. Body: **Inter**. Labels/metadata:
  **JetBrains Mono**.
- Pill-shaped controls, film grain overlay site-wide, `prefers-reduced-motion`
  respected globally.
- Homepage signature: **kinetic type** — a giant ghosted wordmark behind the
  hero glass that responds to pointer and scroll.
- All design tokens live in [`src/lib/tokens.ts`](src/lib/tokens.ts), mirrored
  into the Tailwind v4 theme in [`src/app/globals.css`](src/app/globals.css).
  No scattered hex values.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values as blocks are wired up
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build       # production build
npm run typecheck   # tsc --noEmit
npm run lint        # next lint
```

Environment variables are documented in [`.env.example`](.env.example).
Supabase, Stripe, and admin config land in their respective build blocks.

---

## Project structure

```
src/
  app/
    layout.tsx         # fonts, backdrop, film grain, metadata
    globals.css        # Tailwind v4 theme (mirrors tokens.ts) + glass utilities
    page.tsx           # home (foundations showcase in Block 1)
  components/
    Backdrop.tsx       # the luminous layer behind all glass
    FilmGrain.tsx      # site-wide grain overlay
    KineticType.tsx    # homepage signature element
    glass/
      GlassPanel.tsx   # base frosted surface
      Pill.tsx         # button/link pill (primary/secondary/ghost, all states)
      Chip.tsx         # metadata + filter chip
      Nav.tsx          # glass pill nav
  lib/
    tokens.ts          # design tokens — single source of truth
    utils.ts           # cn() class merge helper
```

---

## Build progress

Delivered one block at a time.

- [x] **Block 1** — Scaffold, design tokens, glass primitives, kickoff picks.
- [ ] **Block 2** — Supabase schema + RLS + auth.
- [ ] **Block 3** — Library home (grid, filters, cards) + seed items.
- [ ] **Block 4** — Item detail + gating API routes.
- [ ] **Block 5** — Stripe checkout + webhooks + account.
- [ ] **Block 6** — Admin + storage uploads.
- [ ] **Block 7** — Pricing + legal + quality-floor polish.

### Kickoff decisions (locked)

| Decision  | Choice                                            |
| --------- | ------------------------------------------------- |
| Brand     | **Lucen** (lucen.ai)                              |
| Accent    | **Signal cyan `#4FE3E8`**                         |
| Display   | **Clash Display**                                 |
| Signature | **Kinetic type** behind the hero                  |
