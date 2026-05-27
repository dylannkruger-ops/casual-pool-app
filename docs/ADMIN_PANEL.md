# Admin Panel — Plan

Build as a separate Next.js app under `/admin` (or a protected web route) with Supabase service-role access. Not part of the mobile bundle.

## Roles
- **Admin** — full access.
- **Support** — read everything, write to moderation/disputes only.
- **Finance** — payments, refunds, payouts.

## Modules

### 1. Verification queue
- ABN verifications awaiting manual review (when ABR returns ambiguous results).
- Worker document verification: ID, licences, work rights.
- Actions: approve, reject with reason, request resubmission.

### 2. Moderation
- Reported users, reported shifts, reported messages.
- Auto-flag rules: profanity, off-platform contact attempts, off-rate offers.
- Actions: warn, suspend, ban; soft-delete messages.

### 3. Disputes
- Worker no-show, business no-pay, mis-scoped shift.
- Evidence upload (screenshots, messages, geolocation pings).
- Resolution: refund platform fee, partial credit, account action.

### 4. Payments
- Daily ledger: business fees collected, worker fees collected.
- Refund tool with reason codes.
- Stripe reconciliation report.

### 5. Users
- Search by email, name, ABN.
- Suspend / reinstate.
- Manual rating adjustments (rare).

### 6. Shifts
- Full-text search.
- Re-open, cancel, transfer ownership (account closure cases).

### 7. Insights
- Funnel: sign-up → onboarded → first shift posted/applied → first hire.
- Liquidity heatmap (postcode × profession).
- Cohort retention.

### 8. System
- Feature flags.
- Pricing experiments (e.g. $4.99 vs $6.99 in a market).
- Maintenance banners.

## Tech
- Next.js 14 App Router.
- Supabase service-role on server only.
- shadcn/ui + Tailwind for speed.
- Auth: Supabase + email allow-list of staff domains.
- Audit log: every admin action writes to `admin_actions` (`actor_id`, `entity`, `entity_id`, `action`, `metadata`, `ts`).
