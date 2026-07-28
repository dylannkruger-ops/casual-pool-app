import type { Employee } from '../lib/types';

/**
 * Launch roster (PRD §5.2). Names are placeholders pending the naming pass.
 * Nobody appears as hireable without a gated skill (§3.2) — onboarding
 * employees carry a date instead of a number.
 */
export const ROSTER: Employee[] = [
  {
    id: 'otto',
    name: 'Otto',
    role: 'Order clerk',
    tint: '#2fd463',
    blurb: 'New order email → logged in your sheet → reply drafted for your OK.',
    status: 'hireable',
    freeTier: true,
    skills: [
      {
        id: 'otto.order-intake',
        name: 'Order email → sheet row → drafted reply',
        preconditions: ['Orders sheet open in Excel', 'Gmail signed in'],
        successRate: 96.4,
        runs: 412,
        failureMode: 'Order email with no line-item table — Otto halts and asks rather than guessing quantities.',
      },
    ],
  },
  {
    id: 'tally',
    name: 'Tally',
    role: "Bookkeeper's assistant",
    tint: '#35c8d8',
    blurb: 'Compares orders against your sheet, invoices against your bank export.',
    status: 'hireable',
    skills: [
      {
        id: 'tally.reconcile',
        name: 'Cross-app reconcile → mismatch report',
        preconditions: ['Both files open', 'Matching date range selected'],
        successRate: 95.8,
        runs: 288,
        failureMode: 'Merged cells in the export break row alignment — halts with the first ambiguous row.',
      },
    ],
  },
  {
    id: 'scout',
    name: 'Scout',
    role: 'Researcher',
    tint: '#8b7cf6',
    blurb: 'Give Scout a topic and your sources; get back a structured brief.',
    status: 'hireable',
    skills: [
      {
        id: 'scout.brief',
        name: 'Sources → structured brief',
        preconditions: ['At least one source URL or document'],
        successRate: 95.1,
        runs: 236,
        failureMode: 'Source behind a login Scout cannot reach — reports the gap instead of inventing the section.',
      },
    ],
  },
  {
    id: 'dot',
    name: 'Dot',
    role: 'Data-entry operator',
    tint: '#e5a13a',
    blurb: '"Move this from app A to app B, forty times, without me."',
    status: 'onboarding',
    joining: 'September',
    skills: [
      {
        id: 'dot.transfer',
        name: 'A→B record transfer ×N',
        preconditions: ['Source and destination both open'],
        successRate: null,
        runs: 137,
        failureMode: 'Still gating — currently loses the destination window when a modal steals focus.',
      },
    ],
  },
  {
    id: 'remi',
    name: 'Remi',
    role: 'Follow-up admin',
    tint: '#ef7d8e',
    blurb: 'Finds the invoices nobody paid, queues the polite nudges for your OK.',
    status: 'onboarding',
    joining: 'September',
    skills: [
      {
        id: 'remi.nudge',
        name: 'Stale-thread detection → drafted nudges',
        preconditions: ['Mail account connected', 'Invoice list reachable'],
        successRate: null,
        runs: 74,
        failureMode: 'Still gating — threads with quoted replies read as fresh activity.',
      },
    ],
  },
  {
    id: 'watch',
    name: 'Watch',
    role: 'Monitor',
    tint: '#5b9bf0',
    blurb: 'Keeps an eye out for the thing you are waiting for, and pings you.',
    status: 'onboarding',
    joining: 'October',
    skills: [
      {
        id: 'watch.condition',
        name: 'Screen-condition watch → notification',
        preconditions: ['Target window open'],
        successRate: null,
        runs: 51,
        failureMode: 'Still gating — false positives on virtualised lists that recycle rows.',
      },
    ],
  },
];

export const byId = (id: string) => ROSTER.find((e) => e.id === id);
