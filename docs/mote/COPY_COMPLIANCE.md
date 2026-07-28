# Landing copy v2 vs PRD v1.1 — conflicts and how the app resolves them

The PRD sets two rules that bind marketing and product copy alike:

- **Availability honesty rule (§6):** no tier may be marketed on capabilities that are
  not yet shipped without a "coming" label.
- **Marketing rule (§12.1, commitment 6):** every surface stating an absolute
  commitment must carry its exceptions *in the same breath* — "an absolute claim that a
  footnote later contradicts is the Recall playbook."

Landing copy v2 (`LANDING_COPY_V2.md`) breaks both. The app's own copy resolves each
conflict; the landing page still needs the same pass before publication.

| # | Where | Conflict | PRD | Resolved in app |
|---|---|---|---|---|
| 1 | Pricing table + "The Studio builder" | The custom employee builder is sold present-tense — "show MOTE a workflow once… it drafts a new employee" — and Studio's team row reads "Unlimited — build your own" | Builder is FR-35, **v1.5**; §6 requires it marked "coming to Studio" | `Plan.tsx` lists the builder with a `Coming v1.5` label; Studio sells on unlimited slots, priority models, 3 machines, unattended runs |
| 2 | Trust commitment 1 | Lists **two** exceptions to "your screen stays on your machine" (approval screenshots, exports) | §12.1 requires **three** — builder recording traces is the third | `Trust.tsx` lists all three, with the builder one marked as v1.5 |
| 3 | Pricing table, Free column | "Approvals: Every action" | §6 and FR-20: green actions are automatic at *every* tier; tiers vary amber/red only | Plan table splits approvals into three rows — reading (automatic everywhere), writing, sending |
| 4 | FAQ, "Does my computer need to stay on?" | "MOTE holds the screen and shows the face over your work" stated as shipped | FR-16b is **P1**, not P0 — §7.4 says no copy may promise it unless FR-16b ships | Settings shows "Hold my screen during desk runs" with a `Coming v1.0` label |
| 5 | Trust commitment 4 | Refers to "if you enable cloud always-on" as if available | Cloud shift is FR-17/FR-19, **v1.5** | `Trust.tsx` and Settings both label cloud shift as coming |
| 6 | Pricing table | Row reads `Scheduling ǀ — ǀ Daily & weekly ǀ Plus 3 machines` — the Studio cell answers a different question, and machines never get their own row | §6 tier table | Plan table gives scheduling and machines separate rows |
| 7 | Hero | "No credit cards, no credit meters" — the first half is untrue of Pro and Studio | §6: no meters is the real claim | App states "No credits. No meters." only |
| 8 | Roster section | Scout is listed as hireable with a fixed rate | §5.2 marks Scout a swap candidate — if week-7 telemetry favours Dot, Scout moves to onboarding | Roster reads status from `data/roster.ts`; swapping Scout to `onboarding` changes the card, the hire button, and the performance row with no copy edits |

## Two claims that were already correct

Worth keeping as-is when the landing copy is revised:

- **Payments.** "Your employees don't touch money at all" matches §3.2 exactly — payments
  are out of scope, not an approval-gated feature. The app repeats the same line on the
  approvals page and in every trust profile.
- **The 95% gate.** "Nobody gets hired on a nice CV" matches §9.1. The app additionally
  shows *what success means* — zero unplanned interventions, post-conditions passing —
  on the performance page, because the definition is the part competitors cannot fake.

## Not addressed here

The landing copy itself has not been rewritten — the deliverable was the app. This table
is the punch list for that rewrite when it happens.
