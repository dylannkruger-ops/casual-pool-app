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
| Tasks | `/` | The front door: ask for something, and it becomes a task. Favourites, then Today / Yesterday / Earlier |
| Task | `/task/:id` | The chat log — you, MOTE routing it, the employee working, receipts inline, approvals as crown cards, collaborators commenting |
| Project | `/project/:id` | Tasks filed under one project |
| Team | `/team` | MOTE above the roster; hire and retire against plan seats |
| Employee | `/employee/:id` | The character's profile: portrait, what they own, preconditions, documented failure modes, trust profile, their tasks |
| Approvals | `/approvals` | The crown surface — red and amber decisions, redacted previews, deny-and-halt |
| Work log | `/runs`, `/runs/:id` | Step-by-step receipts: execution layer, action tier, verify result, and the expected/observed report on a halt |
| Performance | `/performance` | The bench numbers, including the skills that have not cleared the gate |
| Privacy | `/trust` | The eight commitments, each carrying its own exceptions |
| Plan | `/plan` | Free / Pro / Studio, with unshipped features labelled rather than sold |
| Connectors | `/connectors` | App connectors and your own MCP servers, each showing what it may do |
| Plans | `/plan` | Three cards, each stating its own case — no comparison table |
| Spend guard | `/spend` | A hard ceiling on monthly model spend, and where it went |
| Settings | `/settings` | Redaction blocklist, retention, telemetry opt-in, discreet mode |

## The shape of the app

Someone opens MOTE for one of three reasons: to **ask for something**, to **say
yes to something**, or to **check it worked**. The shell is built around exactly
those, and everything else is one click further away.

- **Home is a front door, not a dashboard.** A greeting, one large composer, and
  the team you can hand the job to. Pressing Enter starts the task — no dialog in
  the way. Suggestions are phrased the way a person would ask ("Reconcile June
  against the bank export"), pulled from each hired employee's `suggest` line.
- **The sidebar is task history, not a feature menu.** New task, search, anything
  waiting on you, your projects, and your recent tasks. That's it.
- **One account menu** holds team, connectors, spend, work log, performance,
  privacy, settings and plan — nine destinations that used to sit in the rail at
  the same volume as the work itself.
- **The widget is docked, not floating.** In the shipped product it sits over
  *other* apps; over MOTE's own window it was just covering content, and the
  layout had to reserve a 332px gutter to avoid it. Docked into the sidebar it
  keeps its job — which employee, what state, kill switch — and the content column
  is centred and comfortable again.
- **One interruption only.** Approvals get a single prominent card. Nothing else
  competes.
- **No comparison tables.** Plans and performance were the two pages built as
  wide grids, and they were the only things that had to scroll sideways on a
  phone. Plans is three cards that each state their own case; performance is a
  row per skill with the 95% gate drawn on the bar, so "above the bar or not" is
  answerable without reading a number.
- **⌘K reaches anything.** One palette searches tasks, people and pages — and if
  you type a sentence instead, the first option is to start it as a job. It
  replaced a rail-only search box, so there is one search rather than two. The
  logo goes home; on a phone the header carries the same search.

## Mobile

Below `lg` the sidebar and the face widget disappear and Sintra's shape takes
over: a header naming the screen, a floating pill tab bar (Home / History / Team
/ Approvals / More), a FAB for a new task, and a status strip where the widget
would be on a desktop. Mobile is for asking, watching and approving — the desk
work still happens at the machine, per the PRD's no-mobile-device-control rule.

## Spend guard

Deliberately **not** a credit meter. The PRD promises paid plans are never
metered, and this keeps that promise: the guard only ever gates *starting new
model work*. It never withholds a feature you paid for, never pauses a run
already going, and never touches your logs or exports.

- **Monthly cap** in dollars, with a warning threshold before you reach it
- **Per-run ceiling** — catches a runaway loop directly, without waiting for the month
- **At the cap**: ask, stop starting new work, or fall through to your own API key
- **Where it went**, broken down per employee

When the cap blocks work, the New task dialog says so and links to raising it —
it never accepts a job and quietly does nothing.

## Connectors

Layer 1 of the execution hierarchy. An app connector and a custom MCP server are
the same thing under the hood — one MCP client — so anything you can expose as an
MCP server becomes something the team can use, with no per-app integration to wait
for. Every connector declares what it may do before you connect it, and access
tokens go to the OS credential store, never to MOTE's servers.

## The team

MOTE leads: he takes the job, decides whose it is, and holds anything needing your
yes. He never occupies a plan seat and can't be retired. The other eight own one
narrow job each.

| | Who | Job | Portrait source |
|---|---|---|---|
| 👑 | **MOTE** | Chief of staff — routes the work | solo render |
| 🎧 | **Wren** | Front desk — inbox triage, drafted replies | group shot |
| 👓 | **Tally** | Bookkeeping — cross-app reconcile | group shot |
| 🧣 | **Marlow** | Research — sources into a brief | group shot |
| 📈 | **Sage** | Analyst — the week as one number | solo render |
| 👔 | **Vance** | Deals — quotes and proposals | group shot |
| 🎬 | **Juno** | Media — cuts, captions, filing | solo render (his clapperboard names him) |
| 🧰 | **Rig** | Operations — keeps the tools talking | solo render |
| 💻 | **Ash** | Data plumbing — A→B, forty times | solo render |

Portraits live in `public/team/` as 4:5 head-and-torso crops. Five came from solo
renders; four were framed out of the group shot, where the figures sit ~175px
apart — the crop boxes in the generator are sized to land just inside each
neighbour. Below 28px the portraits read as identical dark squares, so `Avatar`
adds the employee's eye tint as a ring at small sizes.

## Tasks, collaborators, favourites

A task is a conversation with a receipt attached. Messages come from you, from
MOTE, from the assigned employee, or from a collaborator, and the employee's
claims are backed by an inline step list — the same records the work log stores.

**Collaborators** are invited per task by email and see that task only. Roles are
"can view" and "can approve", where approve covers amber steps. Red actions —
sending, submitting, deleting — always come back to the owner, whoever else is on
the task. **Favourites** star a task into the sidebar and into a group at the top
of every list.

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
