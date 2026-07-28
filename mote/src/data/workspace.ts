import type { Collaborator, Project, Task } from '../lib/types';

export const PROJECTS: Project[] = [
  { id: 'p-ops', name: 'Daily operations', tint: '#3b6fd4' },
  { id: 'p-books', name: 'Books & compliance', tint: '#35c8d8' },
  { id: 'p-launch', name: 'Spring launch', tint: '#a855f7' },
];

export const COLLABORATORS: Collaborator[] = [
  { id: 'c-priya', name: 'Priya Raman', email: 'priya@brightwater.co', initials: 'PR', role: 'approver' },
  { id: 'c-dan', name: 'Dan Okafor', email: 'dan@brightwater.co', initials: 'DO', role: 'viewer' },
  { id: 'c-mel', name: 'Mel Ortiz', email: 'mel@halden.supply', initials: 'MO', role: 'viewer', pending: true },
];

/**
 * Chat history. A task reads as a conversation: you ask, MOTE routes it, the
 * employee works and posts its receipt, and anything red stops for a yes.
 */
export const TASKS: Task[] = [
  {
    id: 't-4471',
    title: 'Log order #4471 and reply to Brightwater',
    employeeId: 'wren',
    projectId: 'p-ops',
    favourite: true,
    status: 'waiting',
    createdAt: 'Today, 9:11',
    bucket: 'today',
    lastAt: '9:14',
    collaborators: ['c-priya'],
    messages: [
      {
        id: 'm1',
        at: '9:11',
        author: { kind: 'you' },
        text: 'New order came in from Brightwater Cafe — log it and draft the usual confirmation.',
      },
      {
        id: 'm2',
        at: '9:11',
        author: { kind: 'employee', id: 'mote' },
        text: "That's front desk work. Wren has it — she owns order intake and is running at 96.4%.",
      },
      {
        id: 'm3',
        at: '9:12',
        author: { kind: 'employee', id: 'wren' },
        text: 'Orders.xlsx is open and Gmail is signed in, so I can start. Six line items on this one.',
      },
      {
        id: 'm4',
        at: '9:13',
        author: { kind: 'employee', id: 'wren' },
        text: 'Logged as row 118 and checked the total against the email. Reply is drafted.',
        steps: [
          { n: 1, action: 'read', target: 'Gmail — thread "Order #4471"', layer: 'connector', tier: 'green', verified: true, ms: 610 },
          { n: 2, action: 'type', target: 'Row 118 — customer, date, 6 items, total', layer: 'a11y', tier: 'amber', verified: true, ms: 2210 },
          { n: 3, action: 'assert', target: 'Row 118 total = email total', layer: 'a11y', tier: 'green', verified: true, ms: 300 },
          { n: 4, action: 'type', target: 'Gmail — reply draft, confirmation template', layer: 'connector', tier: 'amber', verified: true, ms: 1180 },
        ],
      },
      {
        id: 'm5',
        at: '9:14',
        author: { kind: 'employee', id: 'wren' },
        approval: { what: 'Send the confirmation reply to orders@brightwatercafe.com', tier: 'red' },
        text: 'Sending is yours to approve. Nothing goes out until you say so.',
      },
      {
        id: 'm6',
        at: '9:16',
        author: { kind: 'collaborator', id: 'c-priya' },
        text: 'Dispatch is Thursday not Wednesday this week — worth checking the draft says Thursday before it goes.',
      },
    ],
  },
  {
    id: 't-june',
    title: 'Reconcile June invoices against the bank export',
    employeeId: 'tally',
    projectId: 'p-books',
    favourite: true,
    status: 'done',
    createdAt: 'Today, 7:00',
    bucket: 'today',
    lastAt: '7:08',
    collaborators: ['c-priya', 'c-dan'],
    messages: [
      { id: 'm1', at: '7:00', author: { kind: 'you' }, text: 'Run the June reconcile before the 9am call.' },
      {
        id: 'm2',
        at: '7:06',
        author: { kind: 'employee', id: 'tally' },
        text: '84 invoices against the bank export. 81 matched cleanly, 3 need a human eye.',
        steps: [
          { n: 1, action: 'read', target: 'Xero — 84 invoices, June', layer: 'connector', tier: 'green', verified: true, ms: 1450 },
          { n: 2, action: 'read', target: 'bank-export-june.csv', layer: 'connector', tier: 'green', verified: true, ms: 520 },
          { n: 3, action: 'assert', target: '81 rows matched on amount + date', layer: 'connector', tier: 'green', verified: true, ms: 980 },
          { n: 4, action: 'type', target: 'Mismatch report — 3 rows flagged', layer: 'a11y', tier: 'amber', verified: true, ms: 1640 },
        ],
      },
      {
        id: 'm3',
        at: '7:08',
        author: { kind: 'employee', id: 'tally' },
        text: 'INV-2214 has no bank match, INV-2231 differs by $20, INV-2240 looks like a duplicate payment. Report is saved to Books & compliance.',
      },
      { id: 'm4', at: '7:22', author: { kind: 'collaborator', id: 'c-dan' }, text: 'The $20 on 2231 is the FX fee. Safe to close that one.' },
    ],
  },
  {
    id: 't-4470',
    title: 'Log order #4470 — Halden Supply',
    employeeId: 'wren',
    projectId: 'p-ops',
    favourite: false,
    status: 'halted',
    createdAt: 'Yesterday, 16:45',
    bucket: 'yesterday',
    lastAt: '16:48',
    collaborators: [],
    messages: [
      { id: 'm1', at: '16:45', author: { kind: 'you' }, text: 'Same again for the Halden order.' },
      {
        id: 'm2',
        at: '16:48',
        author: { kind: 'employee', id: 'wren' },
        text: "I stopped on this one. The email has no line-item table — it just says \"the usual, plus two crates\". I am not going to guess quantities on an order.",
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
    ],
  },
  {
    id: 't-pricing',
    title: 'Competitor pricing — brief from 5 sources',
    employeeId: 'marlow',
    projectId: 'p-launch',
    favourite: false,
    status: 'done',
    createdAt: 'Yesterday, 11:10',
    bucket: 'yesterday',
    lastAt: '11:26',
    collaborators: ['c-dan'],
    messages: [
      {
        id: 'm1',
        at: '11:10',
        author: { kind: 'you' },
        text: 'Pull together what the five competitors on my list charge, and how they meter it.',
      },
      {
        id: 'm2',
        at: '11:26',
        author: { kind: 'employee', id: 'marlow' },
        text: 'Brief is written. Four of five sources gave me a public price table; the fifth is behind a login, so I marked that section as a gap rather than filling it in.',
        steps: [
          { n: 1, action: 'read', target: '5 source pages', layer: 'connector', tier: 'green', verified: true, ms: 4200 },
          { n: 2, action: 'read', target: 'Pricing tables extracted (4 of 5)', layer: 'vision', tier: 'green', verified: true, ms: 5100 },
          { n: 3, action: 'type', target: 'Brief.docx — 5 sections, source 5 flagged unreachable', layer: 'a11y', tier: 'amber', verified: true, ms: 2400 },
        ],
      },
    ],
  },
  {
    id: 't-weekly',
    title: 'Weekly numbers for the Monday call',
    employeeId: 'sage',
    favourite: false,
    status: 'working',
    createdAt: 'Today, 8:30',
    bucket: 'today',
    lastAt: '8:34',
    collaborators: [],
    messages: [
      { id: 'm1', at: '8:30', author: { kind: 'you' }, text: 'Same weekly one-pager as last week please.' },
      {
        id: 'm2',
        at: '8:34',
        author: { kind: 'employee', id: 'sage' },
        text: 'Pulling the week now. Orders are up 11% and refunds are flat — I will flag if anything else actually moved rather than listing everything.',
      },
    ],
  },
  {
    id: 't-supplier',
    title: 'Chase the three unanswered supplier threads',
    employeeId: 'wren',
    projectId: 'p-ops',
    favourite: false,
    status: 'done',
    createdAt: 'Last Thursday',
    bucket: 'earlier',
    lastAt: 'Thu 15:02',
    collaborators: [],
    messages: [
      { id: 'm1', at: '14:50', author: { kind: 'you' }, text: 'Anything from the suppliers that never got a reply, nudge it.' },
      {
        id: 'm2',
        at: '15:02',
        author: { kind: 'employee', id: 'wren' },
        text: 'Three threads had gone quiet for over a week. Nudges drafted for each, all approved and sent by you at 15:04.',
        steps: [
          { n: 1, action: 'read', target: 'Mail — 3 stale threads found', layer: 'connector', tier: 'green', verified: true, ms: 2100 },
          { n: 2, action: 'type', target: '3 nudge drafts', layer: 'connector', tier: 'amber', verified: true, ms: 3300 },
          { n: 3, action: 'click', target: 'Send ×3 — approved by you', layer: 'connector', tier: 'red', verified: true, ms: 900 },
        ],
      },
    ],
  },
];
