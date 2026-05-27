# Replit Agent 4 — Continuation Prompt

Paste the prompt below into a fresh Replit Agent 4 session after importing this repo from GitHub. The agent will pick up exactly where the scaffold leaves off.

---

## Prompt

You are continuing development of **Casual Pool**, an Expo React Native + TypeScript app already scaffolded in this repo. It is a two-sided staffing marketplace where Australian businesses hire casual workers and workers find shifts. The business is charged a **flat $4.99 platform fee on hire**; the worker is charged **$4.99 on accepting a hired shift**. Read `README.md`, `docs/PRODUCT_BRIEF.md`, and `docs/SCHEMA.md` first.

### What's already built
- Expo Router app with `(auth)`, `(onboarding)`, `(tabs)` groups
- Design system in `constants/theme.ts` and `components/ui/*` (do not restyle without reason)
- Auth screens (role selection, signup, login, forgot password)
- Worker + Business onboarding (multi-step, ABN gate)
- Marketplace, worker directory, shift detail, post-a-shift, messaging, calendar, dashboard, profile
- Zustand stores in `stores/*` and mock data in `lib/mockData.ts`
- Mock ABN verifier in `lib/abn.ts` and permission gates in `lib/permissions.ts`

### Your goals (in order)
1. **Wire Supabase** as the backend. Use `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from `.env`. Create migrations matching `docs/SCHEMA.md`. Enable Row-Level Security with the rules described in that doc.
2. **Replace mock data** in stores with Supabase queries. Keep the same store shapes so screens don't change.
3. **Replace `verifyAbnMock`** with a live call to the Australian Business Register Search API. Put the GUID server-side (Supabase Edge Function) — never expose it in the client bundle.
4. **Wire Stripe Connect** for platform fees. Two charges per hired shift: business fee on hire (`business_hire_fee`), worker fee on accept (`worker_accept_fee`). Use Stripe Customer + PaymentMethod on file. Webhook into Supabase Edge Function to mark `payments.status`.
5. **Push notifications** with Expo Notifications: shortlisted, hired, new message, shift reminder T-2h.
6. **Map view** in `app/(tabs)/discover.tsx` — replace `<MapPlaceholder />` with `react-native-maps` `<MapView>` and seed pins from the active dataset (shifts for workers, workers for businesses).
7. **Date/time pickers** in `app/shift/new.tsx` — replace the text "Start" input with a proper native date+time picker; persist as ISO strings.
8. **Reviews flow** — after a shift is `completed`, prompt both sides to leave a 1-5 star review with optional text. Store in `reviews` table; recompute the denormalized `rating` on each profile via a Postgres trigger.
9. **Admin panel** — scaffold a new `apps/admin` Next.js 14 project per `docs/ADMIN_PANEL.md`. Use Supabase service-role on the server only. Add an `admin_actions` audit table.
10. **Tests** — add `@testing-library/react-native` tests for: ABN gate, apply-to-shift flow, message sending, dashboard range switching.

### Rules
- **Do not change the visual design** in `constants/theme.ts` or the look of `components/ui/*` without explicit approval — the design language is locked.
- **Type everything**. Mirror new Postgres tables in `types/index.ts`.
- **Keep platform fees as constants** (`PLATFORM_FEE_BUSINESS = 4.99`, `PLATFORM_FEE_WORKER = 4.99`) in `lib/pricing.ts`. Read them everywhere — never hardcode.
- **Server-enforce the ABN gate**. Client-side `canBusinessAct` is convenience; RLS must block writes when `abn_verified = false`.
- **Never expose secrets** in `EXPO_PUBLIC_*`. Anything secret goes in Edge Functions.

### Definition of done for this pass
- A new business user can sign up → verify ABN (live) → post a shift → see a worker apply → shortlist → hire → see a $4.99 charge recorded.
- A new worker user can sign up → onboard → apply to a shift → be hired → accept → see a $4.99 charge recorded → message the business.
- Real-time message delivery via Supabase Realtime.
- Push notification arrives within 5 seconds of a relevant event.

Begin by reading `README.md`, then propose your migration plan as a checklist before writing code.
