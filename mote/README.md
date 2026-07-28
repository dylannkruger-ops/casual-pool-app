# MOTE — app shell

> Hire AI employees that work everywhere you do — through the API when there is one,
> at your computer when there isn't.

A working front-end for the product described in [`docs/mote/PRD.md`](../docs/mote/PRD.md).
Vite + React + TypeScript + Tailwind, which is the UI half of the PRD's stack (§8:
Tauri v2 shell, React/Tailwind UI) — so this drops into a Tauri window without rework.

This lives alongside the Casual Pool Expo app but shares nothing with it: separate
`package.json`, separate dependency tree, separate build.

```bash
cd mote
npm install
npm run dev      # http://localhost:5180
npm run build    # tsc -b && vite build
```

## What's here

| Screen | Route | What it demonstrates |
|---|---|---|
| Roster | `/` | Hire and retire against plan seats; gated employees show live bench rates, onboarding ones show a date and never a number |
| Employee | `/employee/:id` | Skills with preconditions and documented failure modes; the trust profile |
| Approvals | `/approvals` | The crown surface — red and amber decisions, redacted previews, deny-and-halt |
| Work log | `/runs`, `/runs/:id` | Step-by-step receipts: execution layer, action tier, verify result, and the expected/observed report on a halt |
| Performance | `/performance` | The bench numbers, including the skills that have not cleared the gate |
| Privacy | `/trust` | The eight commitments, each carrying its own exceptions |
| Plan | `/plan` | Free / Pro / Studio, with unshipped features labelled rather than sold |
| Settings | `/settings` | Redaction blocklist, retention, telemetry opt-in, discreet mode |

State is Zustand over fixtures in `src/data/`. There is no backend — actions
(hire, approve, deny, downgrade, edit the blocklist) mutate the store and the rest
of the UI reacts, so the flows are real even though the work is mocked.

## Design notes

**One body, six states.** `components/Mote.tsx` draws Mote as SVG rather than shipping
the render, so the same component serves a 96 px roster card and a 24 px collapsed pill.
Employees are modes of that one body — only the eye tint and the nameplate change
(PRD §5.3). States: idle, watching, thinking, acting, needs-you, done.

**The crown is the boss motif, not Mote's hat.** It marks surfaces where the decision
belongs to the user: the approvals queue, the approval badge, the red row in a trust
profile. Mote never wears it in-product — the point is that the human does.

**One accent.** Mote green carries every affirmative signal; the crown gold is reserved
for "you decide"; a muted rose marks halts. Nothing else is coloured.

**Honesty is a UI rule, not copy polish.** Two constraints are enforced in the
components rather than left to whoever writes the strings:

- `ComingLabel` marks anything not yet shipped. The plan table and settings use it for
  cloud shift, event triggers, the builder, ambient memory and hold-my-screen, so no
  tier is ever sold on a capability that isn't there (PRD §6, §11).
- The red-action toggle renders `locked`. There is no code path that turns it off,
  because the PRD says no setting may exist (FR-20).

See [`docs/mote/COPY_COMPLIANCE.md`](../docs/mote/COPY_COMPLIANCE.md) for where the
existing landing copy conflicts with those rules.
