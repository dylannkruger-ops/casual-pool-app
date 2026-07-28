import type { Approval, Run } from '../lib/types';

/**
 * Work log fixtures (PRD §7.8). Every step carries the layer that executed it
 * and the tier it fell under — that pairing is the receipt.
 */
export const RUNS: Run[] = [
  {
    id: 'r-1041',
    employeeId: 'otto',
    skillId: 'otto.order-intake',
    title: 'Order #4471 — Brightwater Cafe',
    startedAt: 'Today, 9:12',
    shift: 'desk',
    outcome: 'waiting',
    steps: [
      { n: 1, action: 'read', target: 'Gmail — thread "Order #4471"', layer: 'connector', tier: 'green', verified: true, ms: 610 },
      { n: 2, action: 'read', target: '6 line items extracted', layer: 'connector', tier: 'green', verified: true, ms: 840 },
      { n: 3, action: 'click', target: 'Excel — Orders.xlsx, sheet "July"', layer: 'a11y', tier: 'green', verified: true, ms: 420 },
      { n: 4, action: 'type', target: 'Row 118 — customer, date, 6 items, total', layer: 'a11y', tier: 'amber', verified: true, ms: 2210 },
      { n: 5, action: 'assert', target: 'Row 118 total = email total', layer: 'a11y', tier: 'green', verified: true, ms: 300 },
      { n: 6, action: 'type', target: 'Gmail — reply draft, confirmation template', layer: 'connector', tier: 'amber', verified: true, ms: 1180 },
      { n: 7, action: 'click', target: 'Send reply — waiting on you', layer: 'connector', tier: 'red', verified: false, ms: 0 },
    ],
  },
  {
    id: 'r-1040',
    employeeId: 'tally',
    skillId: 'tally.reconcile',
    title: 'June invoices vs bank export',
    startedAt: 'Today, 7:02',
    shift: 'cloud',
    outcome: 'done',
    steps: [
      { n: 1, action: 'read', target: 'Xero — 84 invoices, June', layer: 'connector', tier: 'green', verified: true, ms: 1450 },
      { n: 2, action: 'read', target: 'bank-export-june.csv', layer: 'connector', tier: 'green', verified: true, ms: 520 },
      { n: 3, action: 'assert', target: '84 rows matched on amount + date', layer: 'connector', tier: 'green', verified: true, ms: 980 },
      { n: 4, action: 'type', target: 'Mismatch report — 3 rows flagged', layer: 'a11y', tier: 'amber', verified: true, ms: 1640 },
      { n: 5, action: 'assert', target: 'Report saved, 3 rows present', layer: 'a11y', tier: 'green', verified: true, ms: 260 },
    ],
  },
  {
    id: 'r-1039',
    employeeId: 'otto',
    skillId: 'otto.order-intake',
    title: 'Order #4470 — Halden Supply',
    startedAt: 'Yesterday, 16:48',
    shift: 'desk',
    outcome: 'halted',
    steps: [
      { n: 1, action: 'read', target: 'Gmail — thread "Order #4470"', layer: 'connector', tier: 'green', verified: true, ms: 590 },
      { n: 2, action: 'click', target: 'Excel — Orders.xlsx', layer: 'a11y', tier: 'green', verified: true, ms: 400 },
      {
        n: 3,
        action: 'read',
        target: 'Line-item table in email body',
        layer: 'vision',
        tier: 'green',
        verified: false,
        ms: 3120,
        halt: {
          expected: 'A table with quantity and unit price per line',
          observed: 'Free-text order ("the usual, plus two crates") — no quantities to read',
        },
      },
    ],
  },
  {
    id: 'r-1038',
    employeeId: 'scout',
    skillId: 'scout.brief',
    title: 'Competitor pricing — 5 sources',
    startedAt: 'Yesterday, 11:20',
    shift: 'cloud',
    outcome: 'done',
    steps: [
      { n: 1, action: 'read', target: '5 source pages', layer: 'connector', tier: 'green', verified: true, ms: 4200 },
      { n: 2, action: 'read', target: 'Pricing tables extracted (4 of 5)', layer: 'vision', tier: 'green', verified: true, ms: 5100 },
      { n: 3, action: 'type', target: 'Brief.docx — 5 sections, source 5 flagged unreachable', layer: 'a11y', tier: 'amber', verified: true, ms: 2400 },
    ],
  },
];

export const APPROVALS: Approval[] = [
  {
    id: 'a-1',
    runId: 'r-1041',
    employeeId: 'otto',
    tier: 'red',
    what: 'Send the confirmation reply for Order #4471',
    detail: 'To: orders@brightwatercafe.com · Subject: Re: Order #4471 — confirmed',
    preview: [
      'Hi Brightwater team,',
      'Confirming order #4471 — 6 items, dispatch Thursday.',
      'Total ████████ (ex GST). Invoice to follow.',
    ],
    requestedAt: '9:14',
    expiresInMin: 214,
  },
  {
    id: 'a-2',
    runId: 'r-1040',
    employeeId: 'tally',
    tier: 'amber',
    what: 'Write 3 flagged rows into Reconciliation-July.xlsx',
    detail: 'Sheet "Mismatches" · rows 12–14 · no existing data overwritten',
    preview: ['INV-2214  $840.00  no bank match', 'INV-2231  $1,120.00  amount differs by $20', 'INV-2240  $310.00  duplicate payment'],
    requestedAt: '7:06',
    expiresInMin: 41,
  },
];
