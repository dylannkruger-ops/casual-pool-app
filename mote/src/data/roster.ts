import type { Employee } from '../lib/types';

/**
 * The team. MOTE leads — he takes the job, picks who it belongs to, and holds
 * anything that needs the boss's yes. The other eight own one narrow job each.
 *
 * Portraits are the rendered models: five had solo renders, four are framed out
 * of the group shot. `tint` is the employee's eye colour on the face widget —
 * one body, nine modes (PRD §5.3).
 */
export const ROSTER: Employee[] = [
  {
    id: 'mote',
    name: 'MOTE',
    role: 'Chief of staff',
    tint: '#2fd463',
    avatar: '/team/mote.png',
    portrait: '/team/mote-full.png',
    blurb: 'Takes the job, decides whose it is, and brings you anything that needs your yes.',
    status: 'hireable',
    leader: true,
    skills: [
      {
        id: 'mote.route',
        name: 'Route a job to the right employee',
        preconditions: ['At least one employee hired'],
        successRate: 98.2,
        runs: 1204,
        failureMode: 'A job spanning two employees — MOTE splits it and says so rather than picking one and hoping.',
      },
    ],
  },
  {
    id: 'wren',
    name: 'Wren',
    role: 'Front desk',
    tint: '#3b6fd4',
    avatar: '/team/wren.png',
    blurb: 'Reads every new message, files what matters, drafts the reply you would have written.',
    status: 'hireable',
    freeTier: true,
    skills: [
      {
        id: 'wren.intake',
        name: 'Inbox triage → logged → drafted reply',
        preconditions: ['Mail account connected', 'Orders sheet open in Excel'],
        successRate: 96.4,
        runs: 412,
        failureMode: 'A free-text order with no quantities — Wren halts and asks rather than guessing.',
      },
    ],
  },
  {
    id: 'tally',
    name: 'Tally',
    role: "Bookkeeper's assistant",
    tint: '#35c8d8',
    avatar: '/team/tally.png',
    blurb: 'Compares your orders against your sheet, your invoices against your bank export.',
    status: 'hireable',
    skills: [
      {
        id: 'tally.reconcile',
        name: 'Cross-app reconcile → mismatch report',
        preconditions: ['Both files open', 'Matching date range selected'],
        successRate: 95.8,
        runs: 288,
        failureMode: 'Merged cells in the export break row alignment — halts on the first ambiguous row.',
      },
    ],
  },
  {
    id: 'marlow',
    name: 'Marlow',
    role: 'Researcher',
    tint: '#e5a13a',
    avatar: '/team/marlow.png',
    blurb: 'Give Marlow a question and your sources; get back a brief with the gaps marked.',
    status: 'hireable',
    skills: [
      {
        id: 'marlow.brief',
        name: 'Sources → structured brief',
        preconditions: ['At least one source URL or document'],
        successRate: 95.1,
        runs: 236,
        failureMode: 'Source behind a login Marlow cannot reach — reports the gap instead of inventing the section.',
      },
    ],
  },
  {
    id: 'sage',
    name: 'Sage',
    role: 'Analyst',
    tint: '#6f9e78',
    avatar: '/team/sage.png',
    portrait: '/team/sage-full.png',
    blurb: 'Turns the week into a number, and tells you which number actually moved.',
    status: 'hireable',
    skills: [
      {
        id: 'sage.weekly',
        name: 'Weekly numbers → one-page report',
        preconditions: ['Source sheet or export available'],
        successRate: 95.4,
        runs: 204,
        failureMode: 'A renamed column mid-period — Sage stops rather than silently charting the wrong series.',
      },
    ],
  },
  {
    id: 'vance',
    name: 'Vance',
    role: 'Deals',
    tint: '#c8443c',
    avatar: '/team/vance.png',
    blurb: 'Builds the quote, chases the signature, never lets a proposal go cold.',
    status: 'onboarding',
    joining: 'September',
    skills: [
      {
        id: 'vance.quote',
        name: 'Quote from a price list → drafted proposal',
        preconditions: ['Price list open', 'Customer record reachable'],
        successRate: null,
        runs: 137,
        failureMode: 'Still gating — custom discount tiers are read inconsistently.',
      },
    ],
  },
  {
    id: 'juno',
    name: 'Juno',
    role: 'Media',
    tint: '#a855f7',
    avatar: '/team/juno.png',
    portrait: '/team/juno-full.png',
    blurb: 'Cuts the clip, writes the captions, files it where the rest of the team can find it.',
    status: 'onboarding',
    joining: 'October',
    skills: [
      {
        id: 'juno.cut',
        name: 'Raw clip → captioned cut, filed',
        preconditions: ['Editor installed', 'Source clip on disk'],
        successRate: null,
        runs: 74,
        failureMode: 'Still gating — timeline scrubbing drifts on long exports.',
      },
    ],
  },
  {
    id: 'rig',
    name: 'Rig',
    role: 'Operations',
    tint: '#64748b',
    avatar: '/team/rig.png',
    portrait: '/team/rig-full.png',
    blurb: 'Keeps the tools talking to each other, and fixes the one that stopped.',
    status: 'onboarding',
    joining: 'October',
    skills: [
      {
        id: 'rig.watch',
        name: 'Watch a condition → notify and repair',
        preconditions: ['Target window open'],
        successRate: null,
        runs: 51,
        failureMode: 'Still gating — false positives on lists that recycle their rows.',
      },
    ],
  },
  {
    id: 'ash',
    name: 'Ash',
    role: 'Data plumbing',
    tint: '#8b8f96',
    avatar: '/team/ash.png',
    portrait: '/team/ash-full.png',
    blurb: '"Move this from app A to app B, forty times, without me." That is Ash\'s whole personality.',
    status: 'onboarding',
    joining: 'November',
    skills: [
      {
        id: 'ash.transfer',
        name: 'A→B record transfer ×N',
        preconditions: ['Source and destination both open'],
        successRate: null,
        runs: 96,
        failureMode: 'Still gating — loses the destination window when a modal steals focus.',
      },
    ],
  },
];

export const byId = (id: string) => ROSTER.find((e) => e.id === id);

/** Everyone except the boss — the ones you actually hire into seats. */
export const HIREABLE_ROSTER = ROSTER.filter((e) => !e.leader);
