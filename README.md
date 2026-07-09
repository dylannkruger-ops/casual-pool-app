# Lucen

> Premium website layers — with the prompt and assets included.

Lucen is a digital product library. Creators browse premium website/UI
"layers" (templates, 3D scenes, backgrounds, sections), preview them live, and
unlock the full build prompts + bundled assets via subscription. Free items are
the bait, premium items are gated, and new drops land every Friday.

Built with **Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase
· Stripe**, deployed on **Vercel**.

---

## Seed mode vs. live mode

Lucen runs with **zero backend** out of the box. With no environment variables
set, it serves six built-in demo items (`src/lib/data/seed.ts`) so the entire
site — grid, filters, item detail, free-item prompt copy, pricing, legal — is
browsable and demoable. Add the Supabase and Stripe env blocks to flip it to
**live mode**: real auth, database, storage, and subscription billing. The
capability flags live in [`src/lib/env.ts`](src/lib/env.ts); every server route
degrades gracefully when a capability is absent.

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
cp .env.example .env.local   # optional — leave empty to run in seed mode
npm run dev                  # http://localhost:3000
```

Scripts:

```bash
npm run build       # production build
npm run start       # run the production build
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
```

---

## The gating architecture (read this)

The paid payload — `prompt_text` and asset bundle paths — lives **only** in the
`item_secrets` table, which has RLS enabled and **no client-read policy**. The
anon and authenticated roles therefore get zero rows; the service-role key
(server-side) is the only way in. Access flows exclusively through two server
routes, both `POST`-only:

| Route | Check | Returns |
| --- | --- | --- |
| `POST /api/items/[slug]/prompt` | free tier, or active subscription | the prompt text |
| `POST /api/items/[slug]/download` | same | a short-lived signed URL for the asset zip |

The single gate is [`src/lib/gate.ts`](src/lib/gate.ts):

- item not found / unpublished → **404**
- free item → allowed (no auth needed)
- premium + not signed in → **401**
- premium + signed in, no entitlement → **403**
- premium + active entitlement → allowed

For a **locked** premium item the detail page renders a *blurred filler* block
(`LockedTeaser`) — never the real prompt. The secret never appears in any client
bundle, RSC payload, or public response. (Verified: on `/l/obsidian-studio` the
real prompt heading appears **0** times in the served HTML, and the API returns
401/403 without leaking `promptText`.)

Access rules by subscription status: `active`/`trialing` → full; `past_due` →
grace access with a banner; `canceled` → access until `current_period_end`.

---

## Supabase setup (live mode)

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migrations (SQL editor, or `supabase db push` with the CLI):
   - [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) —
     tables, enums, RLS policies, the new-user → profile trigger.
   - [`supabase/migrations/0002_storage.sql`](supabase/migrations/0002_storage.sql)
     — `preview-media` (public) + `asset-bundles` (private) buckets.
   - [`supabase/seed.sql`](supabase/seed.sql) — optional: the six demo items +
     starter secrets. (The full 800+ word reference prompts ship in
     `src/lib/data/seed-secrets.ts`; paste/expand them in `/admin` or edit the
     seed as you like.)
3. Enable auth providers: **Email** (magic link) and **Google** (add OAuth
   credentials; set the redirect URL to `<site>/auth/callback`).
4. Copy the values into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...            # server only — never expose
ADMIN_EMAILS=you@example.com             # gates /admin
```

RLS sanity check: as an anon/authenticated user, `select * from item_secrets`
returns **no rows**. Only the service role reads it.

---

## Stripe setup (live mode)

1. Create two recurring **Prices** in test mode — Pro Monthly and Pro Annual
   (annual = two months free). Quick path:
   ```bash
   ./scripts/stripe-test.sh prices
   ```
2. Put the keys/IDs in `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PRICE_MONTHLY=price_...
   STRIPE_PRICE_ANNUAL=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...        # from `stripe listen`, step 3
   ```
3. Forward webhooks locally and grab the signing secret:
   ```bash
   ./scripts/stripe-test.sh listen        # copy the whsec_... it prints
   ```
4. Full end-to-end test: open `/pricing`, sign in, pick a plan, pay with test
   card `4242 4242 4242 4242`. The `checkout.session.completed` webhook upserts
   your `subscriptions` row (attributed via `subscription.metadata.userId`), and
   `/account` shows **Active**. Fire raw events with
   `./scripts/stripe-test.sh fire`.

The webhook ([`/api/webhooks/stripe`](src/app/api/webhooks/stripe/route.ts))
verifies signatures, is idempotent (every event recomputes the row from the
current Stripe subscription), and handles `checkout.session.completed`,
`customer.subscription.{created,updated,deleted}`, and `invoice.payment_failed`.
The **Customer Portal** (cancel/upgrade/card) opens from `/account` via
`POST /api/portal`.

---

## Deploy to Vercel

1. Push this repo and import it at [vercel.com](https://vercel.com).
2. Add every variable from `.env.example` in **Project → Settings → Environment
   Variables**. Set `NEXT_PUBLIC_SITE_URL` to your production URL.
3. In the Stripe dashboard, add a **webhook endpoint** at
   `<site>/api/webhooks/stripe` for the four event types above; put its signing
   secret in `STRIPE_WEBHOOK_SECRET`.
4. In Supabase auth settings, add `<site>/auth/callback` to the allowed redirect
   URLs and set the site URL.
5. Deploy. `middleware.ts` refreshes the auth session and guards `/account` and
   `/admin`.

---

## Project structure

```
src/
  app/
    layout.tsx                     # fonts, backdrop, film grain, modal slot, metadata
    globals.css                    # Tailwind v4 theme + glass utilities
    page.tsx                       # library home (hero, filters, grid, drop strip)
    l/[slug]/page.tsx              # item detail (full route) + OG image
    @modal/(.)l/[slug]/page.tsx    # item detail as an intercepting-route modal
    pricing/ account/ login/       # pricing, account, auth
    admin/                         # item + secret CRUD, uploads, publish (ADMIN_EMAILS)
    terms/ privacy/ licence/       # legal
    api/
      items/[slug]/prompt          # gated prompt route
      items/[slug]/download        # gated signed-URL route
      checkout/ portal/            # Stripe session creation
      webhooks/stripe/             # signed, idempotent subscription sync
    auth/callback/                 # OAuth / magic-link code exchange
    robots.ts sitemap.ts           # SEO
  components/                      # glass primitives, library, item, pricing, legal, account
  lib/
    tokens.ts env.ts               # tokens + capability flags
    auth.ts gate.ts stripe.ts      # session, entitlement, gate, billing
    supabase/                      # browser / server / service-role clients
    data/                          # items, secrets (server-only), seed, downloads
  middleware.ts                    # session refresh + route guards
supabase/migrations/               # schema, RLS, storage
scripts/stripe-test.sh             # Stripe CLI harness
```

---

## Quality floor

- Production build green; `/` and `/l/[slug]` render server-side; First Load JS
  ~103–118 kB. Videos are lazy (IntersectionObserver) with poster fallback;
  seed items draw a solid-colour placeholder marked "preview" for replacement.
- Every interactive element ships hover / focus-visible / active / disabled /
  loading states; focus rings are always visible and accent-cyan.
- Designed empty states (no results, no downloads) and on-brand 404.
- Dynamic OG image per item + site-wide; robots + sitemap.
- `prefers-reduced-motion` respected globally (kinetic type, previews,
  transitions all stand down).
- Security: a non-subscriber's premium prompt/download request returns 401/403
  and the secret never reaches the client.

### Kickoff decisions (locked)

| Decision  | Choice                            |
| --------- | --------------------------------- |
| Brand     | **Lucen** (lucen.ai)              |
| Accent    | **Signal cyan `#4FE3E8`**         |
| Display   | **Clash Display**                 |
| Signature | **Kinetic type** behind the hero  |

### Build blocks

- [x] **Block 1** — Scaffold, tokens, glass primitives, kickoff picks.
- [x] **Block 2** — Supabase schema + RLS + auth flow.
- [x] **Block 3** — Library home (grid, filters, cards) + seed items.
- [x] **Block 4** — Item detail + gating API routes.
- [x] **Block 5** — Stripe checkout + webhooks + account.
- [x] **Block 6** — Admin + storage uploads.
- [x] **Block 7** — Pricing + legal + polish.

---

## What still needs your hands

- Register **lucen.ai** and rename the GitHub repo to match.
- Provide real Supabase + Stripe credentials (seed mode until then).
- Replace the solid-colour placeholder previews with real looping video +
  posters via `/admin`.
- Configure the Google OAuth consent screen.
