# Casual Pool

> Australia's casual workforce, on tap.

A two-sided staffing marketplace built with **Expo + React Native + TypeScript**. Businesses post shifts, workers apply, both sides pay a flat **$4.99** platform fee per hired shift.

This repo contains the **mobile app scaffold** (iOS-first, also runs on Android and web).

---

## What's in the box

- **Expo Router** app with grouped routes: `(auth)`, `(onboarding)`, `(tabs)`
- **Design system** — warm neutral background, premium dark feature panels, teal accents
- Auth: role selection, sign-up, sign-in, forgot password (mocked)
- Worker onboarding (4 steps): basics, skills & rate, availability, documents
- Business onboarding (3 steps): company details, ABN verification, payment setup
- Marketplace: shift list + worker directory + map placeholder
- Shift detail, applicants, shortlist, hire
- Post-a-shift flow (ABN-gated)
- Messaging (thread list + chat)
- Calendar with weekly view
- Dashboards (worker + business, week/month/year)
- Profile screens for both roles
- Zustand state stores with seeded mock data
- Mock ABN verifier and permissions gate
- Database schema in `docs/SCHEMA.md`
- Admin panel plan in `docs/ADMIN_PANEL.md`
- Investor-quality product brief in `docs/PRODUCT_BRIEF.md`
- Replit Agent 4 continuation prompt in `docs/REPLIT_AGENT_PROMPT.md`

---

## Quick start

### 1. Install dependencies

```bash
npm install
```

> Node 18+ recommended. The project pins Expo SDK 51.

### 2. Run the app

```bash
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # browser
npm run start     # Expo Dev Tools
```

### 3. Demo login

From the landing screen, tap **Sign in**, then either:
- **Sign in as Worker (demo)** — preloads Amelia Chen's profile
- **Sign in as Business (demo)** — preloads Bowery & Vine's profile

You can also tap **Create an account** to walk through the real onboarding flow.

---

## Project structure

```
casual-pool/
├── app/                       # Expo Router pages
│   ├── _layout.tsx
│   ├── index.tsx              # Landing
│   ├── dashboard.tsx          # Worker/business dashboard
│   ├── (auth)/                # Sign-up, sign-in, forgot password, role
│   ├── (onboarding)/          # Worker + business onboarding flows
│   ├── (tabs)/                # Home, Discover, Calendar, Messages, Profile
│   ├── shift/                 # [id].tsx, new.tsx
│   ├── worker/                # [id].tsx
│   └── messages/              # [threadId].tsx
├── components/
│   └── ui/                    # Design-system primitives (Button, Card, Input, …)
├── constants/
│   └── theme.ts               # Colors, type, spacing, radius, shadows
├── hooks/                     # (add custom hooks here)
├── lib/
│   ├── abn.ts                 # ABN format + mock verifier
│   ├── format.ts              # Date / currency helpers
│   ├── mockData.ts            # Seeded workers, businesses, shifts, messages
│   └── permissions.ts         # ABN/payment gate
├── stores/                    # Zustand stores: auth, profile, shifts, messaging
├── types/                     # Domain types matching the Postgres schema
├── docs/
│   ├── SCHEMA.md
│   ├── ADMIN_PANEL.md
│   ├── PRODUCT_BRIEF.md
│   └── REPLIT_AGENT_PROMPT.md
├── app.json
├── babel.config.js
├── tsconfig.json
└── package.json
```

---

## Environment

Copy `.env.example` to `.env` and fill in when you wire backends. Nothing in this scaffold requires real keys — the mock data and mock ABN verifier work out of the box.

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
ABR_GUID=
EXPO_PUBLIC_GOOGLE_MAPS_KEY=
```

---

## Design language

- **Background** `#F4F1EC` warm neutral
- **Surfaces** white cards with 16–20px radius and very soft shadow
- **Feature panels** charcoal `#171717` with cream text
- **Accent** teal/green `#0F7B6C`
- **Type** system stack (SF Pro on iOS, Roboto on Android); 700 for headings, 500 for emphasis
- **Spacing** 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 56

Do not restyle the design system without intent — it's tuned to feel like a premium native iOS product, not a generic React Native template.

---

## Continuing development

Open `docs/REPLIT_AGENT_PROMPT.md` and paste it into a fresh Replit Agent 4 session after importing the repo. The prompt explains:

- What's already built
- What to build next (Supabase, Stripe, live ABN, push, map, reviews, admin)
- Rules to follow (design lock, type everything, server-enforce gates)
- A clear "definition of done" for the next pass

---

## License

Proprietary — © 2026 Casual Pool. All rights reserved.
