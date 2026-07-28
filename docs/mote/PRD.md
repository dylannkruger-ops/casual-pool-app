# MOTE — Product Requirements Document

| | |
|---|---|
| **Product** | MOTE — AI employees that actually use your computer |
| **Version** | PRD v1.1 (consolidates Scope v1, Employee Addendum v2, Concept v3.1; v1.1 = post gap-review, 25 findings resolved) |
| **Owner** | Dylan Kruger |
| **Status** | Draft for review |
| **Date** | 28 July 2026 |
| **Related docs** | Critique (28 Jul), Competitive research (28 Jul), Weeks 1–8 build plan, Landing copy v2 |

> **Legal note:** the legal and policy material in §12–§13 and Appendices A–C is a working draft prepared without a lawyer. It is structured for counsel review, not a substitute for it. Engage a lawyer (privacy + commercial) before beta, in the company's jurisdiction of incorporation.

---

## 1. Vision and summary

MOTE is a desktop application (Windows first, macOS second) that gives solo operators and small teams a roster of named AI employees. Each employee owns a narrow, boring, high-frequency job — logging orders, reconciling lists, chasing invoices — and does it with real hands: through an app's API when one exists, and by operating the user's actual screen (keyboard, mouse, accessibility tree) when one doesn't. Employees are reachable by message, work a 24/7 cloud shift for cloud-native tasks and a desk shift for local ones, verify every step they take, and produce an auditable receipt of everything they do.

The category is Sintra's ("hire AI employees," proven at ~$97 list price with 40k+ customers). The reach is Marcus's (message your employee; it works around the clock through connectors). The differentiated core is MOTE's alone: **execution that spans APIs, accessibility trees, and vision — so it works with everything, including software that has no API** — plus published, measured, per-skill reliability.

One sentence: *Hire AI employees that work everywhere you do — through the API when there is one, at your computer when there isn't.*

## 2. Strategic context

- **Market gap:** prosumer desktop automation below enterprise pricing. RPA incumbents (UiPath, Automation Anywhere) start at enterprise; $20/mo AI bundles (ChatGPT, Claude Pro/Cowork) are generalists, browser- or files-first; Sintra-class "AI employee" products have no execution depth; Marcus-class connector agents fail wherever there is no API.
- **Benchmark reality:** frontier computer-use models score ~85% on short-horizon OSWorld tasks and ~21% long-horizon. General-purpose reliability claims are indefensible. Narrow, precondition-gated, per-skill 95% is achievable and is the entire product strategy.
- **Positioning shelf:** MOTE competes in the "AI employee / VA replacement" aisle (anchors: Sintra $97 list, human VA $500–2,000/mo), not the "AI chat subscription" aisle (anchor: $20).
- **Named threats:** Microsoft (Copilot Actions / Agent Workspace absorbing screen agency into Windows), Anthropic Cowork ($20 bundle on Win+Mac), pure-plays (Ace, Simular), Sintra (category owner pivoting into execution), Marcus (connector reach), Violoop (hardware flank, v2 horizon).

## 3. Goals and non-goals

### 3.1 Goals (in priority order)

1. **G1 — Reliability:** every shipped skill sustains ≥95% autonomous success (definition in §9.1). This gate outranks every other goal.
2. **G2 — Legibility:** at any moment, a glance at MOTE tells the user what state their work is in (the face widget; the run log; channel reports).
3. **G3 — Trust:** privacy and control commitments (§12) that survive hostile scrutiny, including the "Recall with a face" attack.
4. **G4 — Employee-model economics:** Free → Pro ($29) → Studio ($79) with no usage meters; unit cost <US$0.15 per median desk-shift run.
5. **G5 — Reach:** employees usable and approvable away from the desk (channels, cloud shift).

### 3.2 Non-goals for v1.x (say no loudly)

- No harvesting or storing of credentials from the user's machine (cloud-shift-provisioned logins are the sole, explicit exception — §7.6).
- No unattended financial transactions: payments, transfers, trades are out of scope entirely, at any tier, under any setting. Marketing copy must never imply payment actions exist in the product, even as approval-gated actions.
- No CAPTCHA solving or bypass of anti-bot measures.
- No gaming automation, social-media engagement automation, or scraping-at-scale.
- No enterprise SSO, SOC 2, or on-prem in v1 (SOC 2 becomes a v2 revenue decision).
- No mobile-device control (mobile is for messaging and approvals only).
- No multi-user/team seats in v1.
- No community skill marketplace at v1.0 (v1.5 at earliest, signed manifests + declared permissions — §7.10).
- **No employee ships without a gated skill.** The roster may show "in onboarding"; it never shows vaporware as hireable.
- No freeform chat companion. Employees accept jobs, report results, and take approvals; they are not a chatbot.

## 4. Users

**Primary:** solo operators — founders, agency owners, freelancers, ops-of-one. Live in 6–10 apps; daily repetitive cross-app work; no budget or appetite for integration building.
**Secondary:** SMB back office — bookkeepers, admin, order processing; high-volume, high-tedium, legacy software.
**Explicitly not v1:** enterprises, developers (they will use code tools), consumers without repetitive workflows, anyone under 18.

### Jobs to be done

1. "Move this data from app A to app B, forty times, without me." (Dot, Otto)
2. "Watch for X and tell me when it happens." (Watch)
3. "Do this whole multi-step thing while I'm away." (all employees; split runtime)
4. "Chase the things nobody answered." (Remi)
5. "Prove to me it did it right." (run log, performance reviews — a job in itself for this buyer)

## 5. Product model

### 5.1 The employee

**Employee = persona (name, look, caption voice) + a bundle of skills + a trust profile + its own work log.** Personas are configuration and art, never logic forks: one engine, one DSL, one bench.

### 5.2 Launch roster (six)

| Employee | Role | Launch skill(s) | Status at v1.0 |
|---|---|---|---|
| **Otto** | Order clerk | Order email → spreadsheet row → drafted reply (approval-gated send) | Gated, hireable (current pick for the Free-tier employee — open decision §17.2) |
| **Tally** | Bookkeeper's assistant | Cross-app reconcile (orders vs sheet; invoices vs bank export) → mismatch report | Gated, hireable |
| **Scout** | Researcher | Sources → structured brief | Gated, hireable *(swap candidate: if week-7 telemetry favors Dot, Dot gates third and Scout moves to onboarding)* |
| **Dot** | Data-entry operator | A→B record transfer ×N; form-filling from a sheet | In onboarding, dated |
| **Remi** | Follow-up admin | Stale-thread/unpaid-invoice detection → drafted nudges (approval-gated) | In onboarding, dated |
| **Watch** | Monitor | Screen-condition watch → notification (local a11y polling; LLM only on candidate hits) | In onboarding, dated |

Names are placeholders pending Dylan's naming pass. Each hireable employee ships with: preconditions, a demo GIF, a 60-second setup, a documented failure mode, and a live performance review (measured success rate).

### 5.3 The body (face widget)

One always-on-top widget; the active employee is expressed via nameplate, eye tint, and caption voice — employees are modes of a single body (preserves brand and the dormant hardware path; all state animations built as a reusable Lottie/sprite set).

States: Idle (slow breathe) · Watching (eyes track active window) · Thinking (fast pulse) · Acting (sweep + one-line step caption) · Needs-you (solid ring + gentle chime) · Done (soft bloom). Draggable, snaps to edges, collapses to 24 px pill, zero chrome, right-click for everything. **Discreet mode:** one click hides captions (states only) for shared/visible screens.

### 5.4 Execution hierarchy (the moat)

For every skill step, in strict order of preference:

1. **Connector (MCP)** — when a connected MCP server/API covers the step. Fastest, cheapest, most reliable. Implemented as one MCP client, not per-app integrations.
2. **Accessibility tree** — UIA (Windows) / AXUIElement (macOS): real element handles, roles, names, bounds; UIA patterns (Invoke/SetValue) preferred over synthetic input.
3. **Vision** — screenshot + set-of-marks, only when the tree is empty or ambiguous (canvas apps, poor Electron a11y, remote desktop).

Every step records which layer executed it; layer mix is a tracked reliability and cost metric.

### 5.5 Split runtime

- **Cloud shift (24/7):** connector steps and browser-based steps run in an isolated per-user cloud browser session on MOTE infrastructure. Runs with the user's machine off. Studio: standing always-on. Pro: scheduled cloud windows. Free: none.
- **Desk shift:** steps touching local desktop apps queue until the user's machine is awake and unlocked, then execute locally. A run in progress acquires a keep-awake guard (never unlocks or bypasses the OS lock screen); if the machine locks mid-run, the run pauses safely and notifies.
- The planner splits jobs across shifts automatically and reports honestly: "cloud half done overnight; 3 desk steps queued — approve from your phone and I'll finish when you sit down."
- **Hard privacy boundary:** the local screen is never streamed to the cloud shift. Cloud sessions touch only cloud-native surfaces.

### 5.6 Verification loop

After every action: wait-for-quiescence → re-read state → evaluate the step's expected post-condition. On failure: one retry with an alternate strategy (pattern↔input, or layer change), then halt with a structured report (step, expected, observed, screenshot) and notify. Per-step verification time budget (default 2 s, per-step override). Chains never proceed past an unverified step.

### 5.7 Model router

Per-step model-class routing: frontier for planning and failure recovery; small/fast for deterministic extraction, formatting, narration, and channel messages; vision-capable only on layer-3 fallback; local on-device model deferred to the hardware era. The bench measures reliability per model route; no routing change ships to a skill without the skill re-clearing its gate. Free tier's BYO key drives the same router with the user's key. Studio "priority models" = frontier-first routing + newest models day one.

## 6. Tiers and pricing

| | **Free** | **Pro — US$29/mo** | **Studio — US$79/mo** |
|---|---|---|---|
| Employees | 1 (Otto) | All 6 | Unlimited employee slots + custom builder *(builder from v1.5)* |
| Model | BYO API key | Included | Included, priority models |
| Approvals | Green auto; amber + red confirmed (no trusted mode) | Green auto; trusted-employee mode (amber auto for trusted); red confirmed | Pro, plus unattended runs with approvals via phone/channel |
| Scheduling | — | Daily/weekly | Daily/weekly *(+ event triggers from v1.5)* |
| Cloud shift | — | *(Scheduled windows from v1.5)* | *(Always-on from v1.5)* |
| Machines | 1 | 1 | 3 |

Green actions (read/navigate/extract) are automatic at every tier — the tiers vary amber/red handling only, consistent with FR-20.

**Availability honesty rule:** cloud shift, event triggers, and the builder are v1.5 features (§11). At v1.0, Studio sells on unlimited employee slots, priority models, 3 machines, and unattended runs with remote approvals — the v1.5 features arrive at no extra charge and the pricing page marks them "coming to Studio," never as present-tense features. No tier may be marketed on capabilities that are not yet shipped without a "coming" label.

Annual = 2 months free. **No credits, no meters on paid tiers, ever** — stated on the pricing page. Free is limited by features (one employee, BYO key, no scheduling), not by a usage meter; because Free runs on the user's own key, model cost is theirs, and the critique's support-tax concern is mitigated by community-first support for Free rather than a run cap. Cost control on paid tiers = architecture (hierarchy + router) + published fair-use policy on scheduled/unattended volume framed as anti-abuse; pressure valve is BYO-key overflow, never a hard stop. Regional pricing and tax handled by the payment processor (§13.6). Refunds per §13.5; payment failure per FR-40.

## 7. Functional requirements

Numbered for traceability. Priority: **P0** = v1.0 blocker, **P1** = v1.0 target, **P2** = v1.5.

### 7.1 Onboarding and account

- **FR-1 (P0):** Account creation via email + password or OAuth (Google/Apple); email verification; 18+ self-attestation checkbox; ToS + Privacy Policy acceptance recorded with timestamp and document version; a **separate, unchecked marketing-email opt-in** (transactional email is distinct and always on; every marketing email carries one-click unsubscribe).
- **FR-1b (P0):** Account recovery: email-based password reset with rate limiting; optional TOTP MFA for all accounts; **MFA required to enable the cloud-shift credential vault** (FR-19) and to change the approval channel destination.
- **FR-2 (P0):** First-run permission flow: explain-then-request for OS permissions (Windows: none beyond install for capture/UIA/SendInput, but explain anyway; macOS: Screen Recording, Accessibility, Input Monitoring — each with a plain-language why, a test button, and graceful degradation if denied).
- **FR-3 (P0):** Guided first hire: pick Otto → 60-second setup → run on sample fixture data before touching real data. Target: first successful run <10 minutes from install.
- **FR-4 (P1):** BYO-key entry (Free): key stored in OS credential store (Windows Credential Manager / macOS Keychain), validated with a test call, never transmitted to MOTE servers.

### 7.2 Employee roster and management

- **FR-5 (P0):** Roster screen: hireable employees (with live performance review %) and in-onboarding employees (with dates). Hire/retire per tier limits.
- **FR-6 (P0):** Per-employee page: skills owned, trust profile, work log, schedule, channel settings.
- **FR-7 (P1):** Trust profile per employee: untrusted (confirm amber + red) or trusted (auto-amber, confirm red). Red is never delegable (§7.5).
- **FR-8 (P1):** Employee skill growth: new skills appear as employee updates ("Tally learned payroll-export reconcile") with changelog and per-skill success rate at ship.

### 7.3 Skills and execution

- **FR-9 (P0):** Skill = versioned manifest: name, owner employee, preconditions, parameters, step plan, per-step layer declaration (connector/a11y/vision-permitted), per-step action-tier declaration (green/amber/red), hard post-condition assertions, documented failure modes.
- **FR-10 (P0):** Action DSL: `click`, `type`, `key`, `scroll`, `wait`, `read`, `assert`, `call` (MCP). Versioned schema.
- **FR-11 (P0):** Precondition check before any action; on failure, halt with a human-readable reason ("Otto needs the Orders sheet open and Gmail signed in"). Preconditions may pin a **specific window/document** (title or document-name match); when multiple windows of the same app match ambiguously (two Excel workbooks, two browser profiles), the run halts and asks rather than guessing.
- **FR-12 (P0):** Planner constraint: the model may only target elements present in the current snapshot (no hallucinated targets); invalid actions are rejected and re-prompted.
- **FR-13 (P0):** Verification loop per §5.6, including retry policy and structured halt reports.
- **FR-14 (P1):** Per-run cost and latency instrumentation (tokens by route, vision-call count, wall-clock, per-step p95, layer mix).
- **FR-14b (P0):** Error-state catalogue with defined safe behavior for each: target app crash or window closed mid-run (halt, structured report); model API rate-limit/outage (§9.5 behavior); disk-full on the encrypted store (pause runs, alert, never silently drop log data); cloud-shift session death mid-job (job re-queued or halted with report); machine sleep/lock mid-run (FR-16). Every catalogued error ends in a notified, resumable-or-halted state — never a silent failure. QA matrix covers all of them.

### 7.4 Split runtime

- **FR-15 (P1):** Desk-shift queue: jobs (or job halves) wait for machine-available; user notified of queued work; queue visible and cancellable.
- **FR-16 (P1):** Keep-awake guard during desk runs; safe pause on lock/sleep; never bypasses OS lock.
- **FR-16b (P1):** **Hold-my-screen mode:** during a desk run the user may enable an overlay (face + step caption over a dimmed screen) so the work-in-progress isn't readable to passers-by; the kill switch and the underlying OS lock behavior are never blocked by the overlay. (This backs the "MOTE holds the screen" marketing claim — no copy may promise it unless this FR ships.)
- **FR-16c (P0):** Concurrency and takeover: desk-shift runs are **serialized — one at a time per machine**; colliding schedules queue FIFO with a user-visible order; any user mouse/keyboard input during a desk run pauses it immediately (human-takeover detection) with a resume/abort prompt; cloud-shift runs may proceed in parallel with a desk run.
- **FR-17 (P2):** Cloud shift: isolated per-user browser session; session lifecycle (start/stop/idle-teardown); Studio always-on vs Pro windows; run logs unified with desk runs.
- **FR-18 (P2):** Shift-splitting planner: automatic partition of a job into cloud/desk halves with honest reporting.
- **FR-19 (P2):** Cloud-shift credential vault: user-provisioned logins for cloud browser only; encrypted (per-user key); labelled, listable, revocable one-click; never sourced from the local machine (§12.4).

### 7.5 Approvals and control

- **FR-20 (P0):** Action tiers: **Green** (read/navigate/extract) auto. **Amber** (write into a document, create a draft) auto only for trusted employees, else confirm. **Red** (send, submit, delete, anything leaving the user's machine/account boundary) always confirm — no exceptions, no "remember this," no tier or setting that disables it. Payments are not red; they are out of scope (§3.2).
- **FR-21 (P0):** Kill switch: Esc or click the face halts mid-action (input injection stops within one action; run state saved; log records the halt). Works in every state including cloud shift (cancels the session's current run).
- **FR-22 (P1):** Remote approvals: red/amber confirms delivered via the channel (§7.7) with step context + a **redacted** step screenshot (an explicit, user-visible exception to local-only screen data — §12.1). Mechanics per channel generation: v1.0 email = single-use expiring secure link; v1.5 inbound channel = approve/deny by reply. Deny halts the run.
- **FR-23 (P1):** Approval timeout: unanswered approvals expire (default 4 h, configurable); run halts safely; nothing auto-approves on timeout.

### 7.6 Scheduling

- **FR-24 (P1):** Daily/weekly schedules per skill; schedule owner is an employee; runs report results via channel. Schedules store an explicit timezone (default: machine-local; cloud-shift windows use account timezone), with defined DST behavior (spring-forward skipped slots run at next valid time; fall-back does not double-fire).
- **FR-25 (P1):** Scheduled-run preconditions: check before start; on failure, notify with what's needed ("unlock and sign into Xero") instead of failing silently.
- **FR-26 (P2):** Event triggers (Studio): Watch-style conditions can trigger skills.

### 7.7 Channels (messaging)

- **FR-27 (P1):** Outbound v1.0: email — run reports, halt notifications, approval requests (approve via secure link; links single-use, expiring).
- **FR-28 (P2):** Inbound v1.5: one messaging channel (recommendation: WhatsApp; decision open) — job requests to named employees, approvals by reply.
- **FR-29 (P0 for any channel):** Channel security: verified sender identity (bound at setup, re-verified on change); message *content* from any third party is never treated as instructions; inbound commands limited to a closed grammar (run skill X, approve/deny, status) — no freeform instruction passthrough to the planner.

### 7.8 Run log and audit

- **FR-30 (P0):** Every run: step-by-step record — timestamp, action, target, execution layer, model route, verify result, duration, screenshot reference. Per-employee filtered views.
- **FR-31 (P0):** Export (PDF/JSON) and delete (per-run, per-employee, all). Deletion is real deletion, including screenshots.
- **FR-32 (P0):** Redaction applies to the log itself, not only to model inputs (§12.3).

### 7.9 Memory

- **FR-33 (P1):** Run history/log memory: local SQLite, encrypted at rest (§12.2). Retention default 30 days, user-configurable, one-click purge.
- **FR-34 (P2):** Ambient screen memory (semantic search — "what was that invoice number on Tuesday"): **off by default**, explicit opt-in, local-only (SQLite + sqlite-vec local embeddings), 7-day rolling default, encrypted, excluded apps/domains honored. No cloud sync in v1.x.

### 7.10 Custom employee builder (Studio) and marketplace (deferred)

- **FR-35 (P2):** Builder phase 1: recording mode captures an annotated trace (screens + a11y context + user actions, redaction applied) of the user demonstrating a job; MOTE drafts a skill; human-in-the-loop review ("your new hire is ready in 48 h") before it runs; user names the employee and sets its trust profile. Custom skills run with every safety property of first-party skills (tiers, verification, red-action rule). **Trace consent:** phase-1 review requires sending the recorded trace to MOTE — an explicit, per-recording consent screen states exactly this (a named exception to local-only screen data, §12.1/§12.2); traces are encrypted in transit and at rest, access-limited, and deleted ≤30 days after the skill is delivered.
- **FR-36 (P2):** Builder phase 2 (self-serve synthesis) gated on measured draft quality; no date commitment.
- **FR-37 (v1.5 at earliest):** Marketplace: signed skill manifests, declared permissions ("reads Chrome, writes Excel, nothing else") enforced at runtime, publisher identity, static analysis of DSL, revocation/kill-list, report mechanism, submission terms (App. C.4). Not in v1.0.

### 7.11 Settings, updates, licensing

- **FR-38 (P0):** Settings: redaction blocklist editor (apps + URL patterns), retention, channel config, discreet mode, telemetry opt-in/out, data export/delete-all.
- **FR-39 (P0):** Signed auto-update (Tauri updater; Authenticode on Windows, notarized + stapled on macOS); staged rollout (canary %) with forced-update path for security fixes.
- **FR-40 (P0):** Licence check: entitlement verification with offline grace (7 days) so a network blip never bricks paid features mid-run; downgrade rules defined (Pro→Free retires employees but preserves logs and settings; data never held hostage). **Payment failure/dunning:** Stripe smart retries; 14-day grace with in-app banner and email; mid-flight runs always complete; at grace end, paid features suspend (standing cloud shift stops, schedules pause) but nothing is deleted and export always works; restoring payment restores state.
- **FR-42 (P0):** Uninstall and removal: the uninstaller offers a purge of all local encrypted stores (logs, memory, queues) with a keep-my-data alternative; documented manual-removal paths; cloud vault and account are separate — revocable/deletable from the web app without the desktop app installed (App. A §9 deletion pipeline, §14).
- **FR-41 (P1):** Multi-machine (Studio, 3): per-machine registration and revocation; queues and schedules are per-machine; cloud shift is account-level.

## 8. Platform requirements

- **Windows 10 (20H2+) / Windows 11**, x64 + ARM64: Windows.Graphics.Capture; UI Automation; SendInput; DPAPI for at-rest keys; Credential Manager for secrets. Installer: signed MSIX or NSIS. Decide and document posture toward Windows agentic features (Agent Workspace / Copilot Actions) per ADR-002 — revisit each Windows release.
- **macOS 14+** (v1.0): ScreenCaptureKit; AXUIElement; CGEvent; Keychain; TCC permission flows (Screen Recording, Accessibility, Input Monitoring) with recovery UX for revocation; notarization + hardened runtime. **Permission revocation mid-run** (either OS): detected within one step; run safe-halts with a structured report; guided re-grant flow before the queue resumes.
- Stack: Tauri v2 (Rust core: capture, UIA/AX, input, store, router) + React/Tailwind UI; SQLite + sqlite-vec; Supabase (accounts, entitlements, telemetry ingest); Stripe (billing); cloud-shift browser infra (vendor decision open, §17).
- Locales: en launch; UI strings externalized day one. High-DPI and multi-monitor correctness is a P0 test axis, not a nice-to-have.

## 9. Non-functional requirements

### 9.1 Reliability — the gate (G1)

A skill is **shippable** only when: success ≥95% where success = run completes with **zero unplanned human interventions** and all post-condition assertions pass programmatically. **Designed approval checkpoints** (red/amber confirmations declared in the skill manifest, e.g. Otto's send) are part of the skill, not interventions — the bench harness auto-approves them against fixture ground truth; an *intervention* is any unplanned human help: recovering a halt, correcting a mis-typed field, re-pointing a lost window. This definition makes the gate passable for approval-gated skills without weakening it (fixtures know ground truth; never eyeballed); measured over ≥200 runs per skill; across ≥3 environments (dev machine; 125/150% DPI laptop; clean default-settings VM incl. dark mode; non-English-locale VM when feasible); with randomized variation (window positions, data volumes, input ordering). Interventions are tracked separately (target <0.3 per completed task) and are not counted as success at the gate. Regression rule: routing, model, or skill changes require re-clearing the gate before ship. Public "performance reviews" surface live per-skill rates from the same bench.

### 9.2 Performance

Desk-shift step latency: median ≤3 s connector/a11y steps; vision steps ≤8 s. Tree extraction <500 ms for typical windows. Widget: <1% CPU idle, no GC hitches in animations (it is watched literally all day). Cloud-shift job start <60 s from trigger.

### 9.3 Cost

Median desk run <US$0.15 model cost; cloud-shift session compute budgeted per tier with alerting at 80% of internal fair-use thresholds (internal alert, not a user-facing meter). Weekly cost review vs. router mix.

### 9.4 Security

See §12. Additionally: all client-server traffic TLS 1.2+; update packages signed and verified before apply; secrets only in OS credential stores; SQLCipher (or equivalent) for local DBs; dependency audit in CI; third-party pen test before public launch (budget line).

### 9.5 Availability and support

Cloud services (accounts, entitlements, cloud shift, channels) target 99.5% monthly; desk-shift execution has no cloud dependency once a run has its plan cached except model calls. **Model-provider outage contingency:** the router (§5.7) supports a secondary provider for failover on sustained outage; transient errors/rate limits get bounded exponential-backoff retries; on hard outage, in-flight runs pause safely at the last verified step, queued work waits, and the widget + channel state the cause honestly ("our AI provider is down") rather than failing silently. Status page public from beta. Support: email, 2-business-day first response (published); crash reporting opt-in.

### 9.6 Accessibility and quality

The app's own UI meets WCAG 2.1 AA where applicable (an automation product built on accessibility APIs should not itself be inaccessible); full keyboard operability; captions readable at 100–200% scaling. The website and purchase flow meet the **European Accessibility Act** requirements (in force for consumer digital services since June 2025) and publish an accessibility statement. **[Counsel]** confirm EAA scope for the app itself.

## 10. Analytics and telemetry

Product telemetry is **opt-in at onboarding** (unchecked by default), pseudonymous, and never includes screen content, extracted text, file contents, or personal data from automated apps. Collected when opted in: run outcomes (success/halt/intervention), layer mix, latency buckets, feature usage, crash reports. Bench/performance-review data from the user's machine is contributed only under the same opt-in. Deletion of account deletes telemetry link. (This restraint is a marketing asset; say it publicly.)

North-star and guardrail metrics: per-skill success ≥95% (gate); interventions <0.3/task; time-to-first-successful-run <10 min; D30 >40%; weekly runs per active user >8; Free→Pro 6–10%; Studio attach and builder usage; churn reason capture at cancel; **employee-level retention** (hypothesis: users with 3+ hired employees churn less — this is the expansion loop, instrument it from beta); monthly roster/skill-release cadence tracked against the "employees learn new skills" promise.

## 11. Release plan

| Phase | When | Contents | Exit criteria |
|---|---|---|---|
| **v0.1 internal alpha** | Week 8 | Engine + CLI, 3 skills, bench | **The gate (§9.1) on 3 skills — else stop (kill criterion)** |
| **v0.5 private beta** | ~Week 16 | Face widget, approval gate, roster UI (6 with 3 hireable), run log, email outbound channel, scheduling, model router, redaction v1, encrypted store | 50 beta users recruited per-skill-fit; crash-free sessions >99%; interventions <0.5 |
| **v1.0 public launch** | Month 7–8 *(honest revision of "month 6")* | macOS, billing live, signed auto-update, 8–12 gated skills, remote approvals, performance-review page, privacy commitments + threat model published, legal docs live | 500 paying users target; all P0s closed; pen test remediated |
| **v1.5** | Month 10–12 | Inbound channel, cloud shift GA, builder phase 1, ambient memory (opt-in), marketplace (if review pipeline ready), event triggers | Cloud-shift unit economics validated |
| **v2.0** | Month 15+ | Hardware exploration (reuses state animations), local model, team seats decision, SOC 2 decision | Separate PRD |

Weeks 1–8 are frozen per the build plan; nothing in this PRD alters them.

## 12. Privacy and security model

### 12.1 Commitments (published verbatim on the site)

1. **Your screen never leaves your machine** — with exactly three exceptions, each triggered only by you and stated wherever this commitment appears: (a) redacted step screenshots inside approval requests you receive (FR-22); (b) run logs you explicitly export or share; (c) builder recording traces you explicitly consent to send for review (FR-35). Otherwise: the model receives extracted text and element descriptions for the active task only; no frame streaming; no background capture outside active runs (Watch uses local tree polling; ambient memory is opt-in and local).
2. **Memory and logs are local and encrypted** — at rest, keys held in the OS credential store, tied to the OS login. No cloud copy unless the user explicitly enables a future sync feature (none in v1.x).
3. **Redaction by default:** password fields (UIA IsPassword / secure text fields) never captured; a maintained default blocklist of banking/health domains; user-editable app + URL blocklists; redaction applies to model inputs **and** to stored logs/screenshots.
4. **Every run is auditable** — exportable, deletable, per §7.8.
5. **Kill switch** — Esc or click the face, halts mid-action, works everywhere.
6. **No stored credentials** from the local machine, ever. Sole exception, clearly labelled: logins the user explicitly provisions for their cloud-shift browser (§12.4). **Marketing rule:** every marketing surface that states this commitment (or commitment 1) must carry its exception in the same breath — an absolute claim that a footnote later contradicts is the Recall playbook, and existing copy (landing v2) must be revised to match before publication.
7. **The cloud shift never sees your screen.** Cloud sessions operate only on cloud-native surfaces in an isolated per-user session.
8. **Our threat model is public** (App. D summary): what MOTE defends against and what it honestly cannot.

### 12.2 Data inventory and flows

| Data | Where it lives | Leaves the machine? | Retention |
|---|---|---|---|
| Screen frames (during runs) | Local, encrypted | Only per §12.1's three user-triggered exceptions | With run log (30 d default) |
| Approval screenshots (redacted) | Transient → approval channel | Yes — to the user's own channel, at their request | Expires with the approval link |
| Builder recording traces (opt-in, per recording) | Local → MOTE review (encrypted) | Yes — explicit per-recording consent | Deleted ≤30 d after skill delivery |
| Extracted text/element descriptions | Transient → model API | Yes, to model provider, active task only, TLS | Not stored server-side by MOTE; provider terms apply (DPA, App. B ref) |
| Run logs + step screenshots | Local, encrypted | Only if user exports/shares | 30 d default, configurable |
| Ambient memory (opt-in, v1.5) | Local, encrypted | Never | 7 d rolling default |
| Account data (email, entitlements) | Supabase (cloud) | n/a | Life of account + legal minimum |
| Billing | Stripe | n/a | Stripe retention; MOTE stores no card numbers |
| Cloud-shift credentials (opt-in) | Cloud vault, per-user encryption | n/a (cloud-native) | Until revoked; auto-revoke on account close |
| Cloud-shift session artifacts | Cloud, per-user isolated | n/a | Purged ≤30 d; run log copied to local |
| Telemetry (opt-in) | Cloud, pseudonymous | Yes (if opted in) | 24 months |
| BYO API key | OS credential store only | Only to the model provider directly | Until removed |

### 12.3 Threat model summary (full doc: App. D)

Defends against: cloud exfiltration of screen content (frames never leave); other local apps casually reading MOTE stores (encryption at rest; keys in OS store); malicious instruction injection via channels (closed inbound grammar, verified senders); prompt injection from on-screen content attempting red actions (red always requires human confirm — the approval tier is the injection backstop); rogue marketplace skills (deferred; signed manifests + runtime-enforced permissions when it ships); MOTE server compromise exposing screen data (impossible by architecture — servers never hold it).
Does **not** defend against: an attacker with the user's unlocked session and OS credentials (same power as the user); a compromised OS/kernel; the model provider's handling of task text beyond its DPA; user-approved actions that were unwise. Published honestly — this is the anti-Recall posture: local-only *plus* encryption *plus* minimal retention *plus* stated limits.

### 12.4 Cloud-shift security specifics

Per-user isolated browser sessions (no co-tenancy in a session); session storage encrypted per user; credentials in a dedicated vault encrypted per user, never in logs, redacted from screenshots; sessions have no route to the user's local machine (queue messages only, via the MOTE service, signed); regional hosting choice documented (App. B); session teardown wipes state except the run log.

### 12.5 Vulnerability handling

security@ address + published disclosure policy (90-day coordinated); security fixes ride the forced-update path; dependency and CVE monitoring in CI; incident response runbook (detect → contain → assess scope → notify per §13.4 → post-mortem) drafted before beta.

## 13. Legal and compliance

> Working analysis for counsel review; jurisdiction of incorporation TBD (placeholder: "the Company"). Items marked **[Counsel]** need professional signoff.

### 13.1 Document set required at each stage

| Document | Needed by | Draft |
|---|---|---|
| Privacy Policy | Private beta (first real user data) | App. A |
| Terms of Service / EULA | Private beta | App. B |
| Acceptable Use Policy | Private beta (referenced by ToS) | App. C.1 |
| Beta Agreement (pre-release disclaimer, feedback licence) | Private beta | App. C.2 |
| Data Processing Addendum + subprocessor list | v1.0 (EU/UK users) | App. C.3 **[Counsel]** |
| Refund & Cancellation Policy | v1.0 (billing live) | §13.5 → ToS |
| Threat Model / Security page | v1.0 | App. D |
| Marketplace Submission Terms | v1.5 | App. C.4 |
| Cookie notice (website only; app uses no cookies) | With marketing site | App. C.5 |

### 13.2 Privacy regimes

- **GDPR/UK GDPR** (EU/UK users): lawful bases — contract (service delivery), legitimate interest (fraud/security), consent (telemetry, ambient memory, marketing). Data-subject rights honored via in-app export/delete + email; local-first architecture means most personal data never reaches the Company (document this in the RoPA). DPAs required with all subprocessors (model provider, Supabase, Stripe, email/channel provider, cloud-shift host). International transfer mechanism (SCCs) where applicable. **[Counsel]** DPIA recommended before launch given screen-content processing — likely favorable outcome due to local-only design, but do it and keep it.
- **US state laws (CCPA/CPRA, VCDPA, etc.):** privacy policy disclosures, right to know/delete, "do not sell/share" statement (MOTE does not sell or share personal information for advertising — state it), contractual terms with service providers.
- **Australia (Privacy Act/APPs)** if the Company or a marketed audience is AU: APP-compliant policy, notifiable data breaches scheme (§13.4).
- Children: service is 18+; no directed collection from minors; state in policy.

### 13.3 AI-specific regulation

- **EU AI Act** (phased through 2026–27): MOTE is plausibly a general-purpose-AI-integrating deployer/provider of a limited-risk system; obligations trend toward transparency (disclose AI involvement — inherent in the product), and avoiding prohibited practices (none applicable). Not high-risk under Annex III on current reading — **[Counsel]** confirm, and monitor guidance; the automated-decision question is mitigated by design: red actions always have a human in the loop.
- Model-provider terms: Anthropic (and any routed provider) commercial terms bind MOTE's usage; usage policies flow down to users via the AUP; providers' data-use commitments (no training on API data, retention windows) referenced in the Privacy Policy.

### 13.4 Breach notification

Runbook (§12.5) maps scope → duties: GDPR 72-hour supervisory notification where risk; AU NDB scheme "eligible data breaches"; US state timelines vary. Because screen content never reaches Company servers, the realistic notifiable surface is account/billing/cloud-vault data — architecture shrinks the blast radius; say so in the policy honestly, not as a promise that breaches are impossible.

### 13.5 Consumer and subscription law

Auto-renewal disclosures and one-click cancellation (US state auto-renewal laws; EU/UK consumer rights incl. 14-day withdrawal for digital services with the standard performance-consent carve-out; AU ACL guarantees non-excludable). Refund policy: 14-day money-back on first subscription, pro-rata not required but goodwill refunds allowed; stated in ToS. Price-change notice ≥30 days. Cancel keeps data locally (never hostage); export always available.

### 13.6 Payments and tax

Stripe (Billing + Tax) for processing, PCI-DSS SAQ-A posture (no card data touches MOTE systems), VAT/GST/sales-tax collection via Stripe Tax; invoices available. **[Counsel/accountant]** confirm nexus/registration duties as revenue grows; consider merchant-of-record alternative if tax ops become a burden.

### 13.7 Automation-specific legal risk (the honest section)

- **Third-party ToS:** automating a website or app may breach *that service's* terms even when it is lawful. Position: MOTE is a general-purpose tool operating the user's own authenticated sessions at human-plausible rates for the user's own business tasks; responsibility for compliance with third-party terms sits with the user (ToS App. B §6); AUP bans the categories that draw fire (scraping-at-scale, CAPTCHA bypass, social-engagement automation, spam). No skill ships whose *primary purpose* is breaching a named service's terms. **[Counsel]** review this allocation.
- **Anti-spam** (CAN-SPAM, GDPR/PECR, AU Spam Act): Otto/Remi draft; the human sends (red action). Keep it that way — the human-send step is both a safety and a legal feature.
- **Recording/interception law:** MOTE captures the user's own screen for the user; it does not intercept third-party communications in transit. Edge case (user automates a communications app displaying others' messages) is the user's context; note in AUP that users are responsible for consent obligations in their jurisdiction.
- **Liability posture for autonomous actions:** ToS: user supervises and approves; red actions require confirmation; liability cap (greater of fees paid in the prior 12 months or US$100, matching App. B §12); consequential damages excluded; no clause attempts to disclaim what consumer law forbids. **[Counsel]** jurisdiction-tune. Obtain **cyber liability + tech E&O insurance** before public launch (budget line, not optional).
- **Export/sanctions:** standard encryption (TLS/at-rest) — generally mass-market exempt **[Counsel confirm if distributing globally]**; screen for sanctioned regions at signup per processor requirements.
- **IP:** MOTE owns the app/marks (register **MOTE** trademark in launch markets early — the name is a brand asset); users own their data and run outputs; skill format openly documented but first-party skill *content* proprietary; OSS dependency licence audit (no copyleft contamination in the shipped binary) in CI.
- **Open-source posture:** decision open (§17) — none of v1 is required to be open; if the DSL/skill format is opened later, do it deliberately with a licence choice, not by leak.

## 14. Support and operations

Runbooks: incident response (§12.5), status page, on-call = founder (v1 reality, write it down anyway), backup/restore for cloud services (Supabase PITR), key-loss story for users (encrypted local data is unrecoverable without OS account — document loudly in FAQ), account deletion pipeline (30-day grace, then purge incl. cloud vault + telemetry link), law-enforcement request policy (App. A §10: minimal data exists; policy says exactly what can and cannot be produced).

## 15. Risks

| Risk | Mitigation |
|---|---|
| Reliability plateaus < 95% | A11y-first + hierarchy; narrow skills; verify loop; **week-8 kill criterion stands** |
| Microsoft absorbs the category (Agent Workspace) | ADR-002 posture review each Windows release; moat = per-skill measured reliability + employee UX + cross-layer hierarchy, not "can click" |
| $20 bundles squeeze $29 | Compete in the employee/VA aisle; performance-review page is the justification; Sintra $97 is the anchor |
| Sintra pivots into execution | They need perceive/act/verify from scratch; the public bench is the unfakeable moat |
| Privacy backlash ("Recall with a face") | §12 posture: encryption + minimal retention + published threat model + opt-in telemetry; lead with it |
| Cloud-shift costs blow up Studio margin | Tier gating, fair-use, idle teardown, BYO-key overflow; validate unit economics in v1.5 before GA |
| Model cost/run drift | Router + hierarchy + weekly review; bench catches quality regressions from cheap routes |
| Recording-mode over-promise | Builder ships human-in-the-loop first (48 h SLA), self-serve only when draft quality earns it |
| Marketplace imports OpenClaw's disaster | Deferred to v1.5+; signed manifests, enforced permissions, revocation — or it doesn't ship |
| Founder starts something else | The 8-week gate; this PRD adds nothing to weeks 1–8 |
| Legal gap bites post-launch | §13.1 document set gated to release phases; counsel review before beta and v1.0 |

## 16. Definition of done — v1.0

Windows + macOS signed and auto-updating · 8–12 first-party skills each ≥95% per §9.1 · roster with ≥6 employees (all hireable ones gated) · face widget 6 states + discreet mode · green/amber/red enforced with red never delegable · run log export/delete · redaction incl. logs · encrypted local stores · email channel (reports + secure-link approvals) · scheduling with precondition checks · model router live · billing (Free/Pro/Studio) with no meters · performance-review page live with real bench data · Privacy Policy, ToS, AUP, DPA, threat model published · pen-test findings remediated · 500 paying users or the v2 hardware exploration does not start.

## 17. Open decisions

1. Employee names (Otto/Tally/Scout/Dot/Remi/Watch are placeholders).
2. Free-tier employee: Otto (demos better) vs Dot (may convert better).
3. Third gated launch skill: Scout vs Dot (week-7 telemetry decides).
4. Inbound channel: WhatsApp vs Slack vs Telegram (recommend WhatsApp for the solo-operator audience).
5. Cloud-shift gating detail (Pro windows sizing) and browser-infra vendor (rent first, revisit at scale).
6. Builder taste for Pro (recommend: hard Studio exclusive at launch).
7. Jurisdiction of incorporation → drives every **[Counsel]** item.
8. Open-source posture for the DSL/skill format.
9. Company/brand legal name and trademark filing markets.

---

# Appendix A — Privacy Policy (draft for counsel review)

**MOTE Privacy Policy — DRAFT v0.1 — not yet in force**

*Plain-language summary (non-binding): MOTE works on your screen, so we built it to keep your screen to yourself. Screen images never leave your computer. Task text goes to our AI provider only while an employee is working for you. Almost everything MOTE knows lives encrypted on your machine, where you can see it and delete it.*

**1. Who we are.** [Company legal name, address, contact]. "MOTE" is our desktop application and related cloud services. Contact: privacy@[domain]. [EU/UK representative if required.]

**2. What this covers.** The MOTE app, our websites, cloud services (accounts, cloud shift, messaging), and support channels. It does not cover third-party services you automate with MOTE or the terms of your AI model provider if you use your own key.

**3. Information we process.**
(a) *Account*: email, name (optional), password hash, plan, settings synced to your account (never your screen content).
(b) *Screen content — processed locally*: during runs, MOTE captures frames and accessibility data **on your device**. Frames are stored only on your device, encrypted. They are never transmitted to us.
(c) *Task text sent to AI providers*: extracted text and element descriptions needed for the current task are sent, over encrypted connections, to our AI provider(s) [list] solely to perform the task. Under our agreements, providers do not use this data to train models and retain it only per the windows stated in our subprocessor list. If you use your own API key (Free tier), this data flows directly from your device to your provider under **your** agreement with them.
(d) *Run logs*: stored on your device, encrypted; sent to us only if you export and share them with support.
(e) *Cloud-shift data* (paid features, if enabled): credentials you explicitly provision for your cloud browser (encrypted per-user, revocable), session state, and run logs, in an isolated session. We never source credentials from your device.
(e2) *Builder recording traces* (Studio, only if you use the builder): when you record a demonstration and consent on the per-recording consent screen, the annotated trace (screens, interface data, and your actions, with redaction applied) is sent to us, encrypted, solely to draft your custom skill; access-limited; deleted within 30 days of delivery.
(e3) *Approval screenshots*: when a run needs your approval remotely, a redacted screenshot of the relevant step is delivered to the channel you configured; it expires with the approval link.
(f) *Billing*: handled by Stripe; we never receive card numbers.
(g) *Telemetry* (opt-in only): pseudonymous product events (run outcomes, feature usage, crashes). Never screen content, never automated-app data.
(h) *Support*: what you send us.
(i) *Website*: see Cookie Notice.

**4. Purposes and legal bases.** Providing the service (contract); security and fraud prevention (legitimate interests); telemetry, ambient memory, and marketing (consent, withdrawable); legal compliance (legal obligation).

**5. What we do not do.** We do not sell or share personal information for cross-context advertising. We do not train AI models on your content. We do not stream, mirror, or store your screen on our servers. We do not read your local logs.

**6. Sharing.** Subprocessors under contract (AI provider(s), hosting, billing, email/messaging, cloud-browser infrastructure — current list at [url]); authorities where legally compelled (see §10); a successor in a merger/acquisition under this policy's protections.

**7. International transfers.** [Mechanism: SCCs/adequacy as applicable; hosting regions listed at subprocessor page.]

**8. Retention.** On-device data: under your control (defaults — run logs 30 days; ambient memory, if enabled, 7 days). Account data: life of account + 30 days grace, then deletion. Cloud-shift artifacts: ≤30 days. Builder recording traces (if you use the builder): ≤30 days after skill delivery. Telemetry: 24 months. Backups: purged within [X ≤ 35] days **[set to backup provider's cycle]**.

**9. Your rights.** Access, export, correction, deletion, restriction, objection, portability, consent withdrawal, and complaint to your supervisory authority — most exercisable directly in-app (Settings → Data). Otherwise: privacy@[domain]. We do not discriminate for exercising rights.

**10. Government and legal requests.** Because your screen content and logs exist only on your device, we cannot produce them. What we can produce is limited to account, billing, cloud-vault (encrypted), and opted-in telemetry data, and we require valid legal process. Policy details at [url].

**11. Security.** Encryption in transit (TLS 1.2+) and at rest (device stores via OS-protected keys; cloud stores per-user); OS credential stores for secrets; coordinated disclosure program (security@[domain]). No method is perfect; breach notification per applicable law.

**12. Children.** MOTE is not for under-18s and we do not knowingly process their data.

**13. Changes.** Material changes notified in-app/email ≥30 days ahead; version history kept.

**14. Jurisdiction-specific notices.** [California; EU/UK; Australia — inserted by counsel.]

---

# Appendix B — Terms of Service / EULA (draft skeleton for counsel)

1. **Agreement & eligibility** — 18+; business use; acceptance on signup; entity users warrant authority.
2. **Licence** — personal, non-exclusive, non-transferable licence to install/use per plan; machines per tier; no reverse engineering except as law permits.
3. **The service** — description incl. AI nature and limits: outputs may be imperfect; user supervises; approval tiers described; **red actions always require user confirmation and this cannot be varied by contract or setting**.
4. **Accounts & security** — user responsibilities; truthfulness; key custody (BYO keys are user's own contract with the provider).
5. **Plans, billing, renewal** — auto-renewal disclosure, cancellation anytime effective end of period, 14-day first-purchase refund, 30-day price-change notice, taxes; fair-use policy referenced (no meters; anti-abuse).
6. **Acceptable use & third-party services** — AUP incorporated; user is responsible for compliance with the terms of services they automate and for consent/notice obligations applicable to their content; prohibited-use list (App. C.1).
7. **User content & outputs** — user owns their data and run outputs; user grants us only the licence needed to operate cloud features they enable; feedback licence.
8. **Custom skills & (future) marketplace** — custom skills run at user's direction and risk within MOTE's safety rails; marketplace terms separate when live.
9. **Beta features** — flagged, as-is, may change or be withdrawn.
10. **IP** — our ownership of app/brand; DMCA/notice-and-takedown agent [when marketplace live].
11. **Disclaimers** — as-is within limits of law; no warranty of uninterrupted or error-free operation; consumer guarantees not excluded where non-excludable (AU ACL etc.).
12. **Liability cap** — greater of fees paid in prior 12 months or [US$100]; exclusion of indirect/consequential damages; carve-outs per law.
13. **Indemnity** — user indemnifies for breach of AUP/third-party terms in their use.
14. **Suspension & termination** — for breach (esp. AUP), non-payment; effect: local data stays with user; export window; our deletion timelines.
15. **Governing law & disputes** — [jurisdiction]; informal-resolution first; [arbitration decision — counsel].
16. **Changes to terms** — notice ≥30 days for material changes; continued use = acceptance where lawful.

# Appendix C — Supporting policies (drafts/outlines)

**C.1 Acceptable Use Policy (draft).** Prohibited: unlawful activity; CAPTCHA or anti-bot circumvention; unattended financial transactions of any kind; scraping-at-scale or bulk data harvesting; social-media engagement automation (likes/follows/mass posting); spam or unsolicited bulk messaging; automating accounts/systems you are not authorized to access; interception of others' private communications without required consents; malware interaction; gaming automation; harassment; circumventing MOTE's safety tiers; reselling access. Violations → suspension/termination per ToS. Rate norms: human-plausible interaction rates enforced product-side.

**C.2 Beta Agreement (outline).** Pre-release quality disclaimer; data may be reset; feedback licence; confidentiality of unreleased features (light-touch); no fee during beta or discounted founder pricing; the ToS + Privacy Policy apply; extra encouragement to use fixture/sandbox data for first runs.

**C.3 DPA + subprocessor list (outline).** Controller (user, for their business data) / processor (Company, for cloud features) roles mapped — note most user business data never reaches the Company (processing happens locally under user control; document this clearly — it is unusual and favorable); Art. 28 clauses; subprocessor list with regions and purposes (model provider, Supabase, Stripe, email/messaging provider, cloud-browser infra) + change-notice mechanism; SCCs annexed as needed. **[Counsel]**

**C.4 Marketplace Submission Terms (v1.5 outline).** Publisher identity verification; manifest + declared-permissions accuracy warranty; static review + right to reject/remove; revocation/kill-list consent; security-issue disclosure duty; rev-share terms [TBD]; DMCA agent.

**C.5 Cookie notice (website).** Strictly-necessary + analytics (consent-gated in EU/UK); the desktop app itself sets no cookies and embeds no ad trackers — say so.

# Appendix D — Threat model (public page, summary)

Assets: screen content; run logs; cloud-vault credentials; account/billing data; the input-injection capability itself. Adversaries and coverage: remote attacker (no local screen data exists server-side — architecture, not policy); local malware/other users (encrypted stores, OS-keyed; honest limit: an attacker *with your unlocked session* has your powers — MOTE does not expand them, and red actions still require interactive confirmation); network attacker (TLS, cert pinning for update/licence endpoints); prompt injection via on-screen content or inbound messages (planner acts only on snapshot-present elements; closed inbound command grammar; red actions human-gated — the tier system is the backstop); supply chain (signed updates, dependency audit, pen test); rogue future marketplace skills (signed manifests, runtime permission enforcement, revocation). Residual risks stated plainly. Full page kept current with each release.

---

*End of PRD. Sections cross-checked against: Scope v1 (all sections carried or explicitly superseded), Critique priority fixes 1–6 (all incorporated), v2 employee addendum (roster, tiers, no-meter rule), v3.1 concept (hierarchy, split runtime, router, channels, refusals), and the weeks 1–8 build plan (unchanged, referenced).*

*v1.1 change log (independent gap review, 25 findings): tier table availability-tagged so v1.5 features aren't sold as present at v1.0; green-action behavior unified across tiers; the three user-triggered exceptions to "screen never leaves your machine" (approval screenshots, exports, builder traces) made explicit in commitments, data inventory, and Privacy Policy; gate definition amended so designed approval checkpoints aren't counted as interventions; hold-my-screen mode added as FR-16b to back the marketing claim; payments-language corrected in marketing rules and landing copy; concurrency/takeover, timezone/DST, dunning, uninstall/purge, account recovery + MFA, error-state catalogue, permission-revocation handling, provider-outage contingency, same-app window disambiguation, marketing-consent capture, EAA statement, liability-cap alignment, retention-number alignment, and employee-level retention metrics all added; Free-tier cap tension resolved (feature-limited, not metered).* 
