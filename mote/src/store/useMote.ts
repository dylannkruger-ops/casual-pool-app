import { create } from 'zustand';
import { APPROVALS, RUNS } from '../data/runs';
import { COLLABORATORS, PROJECTS, TASKS } from '../data/workspace';
import { CONNECTORS } from '../data/connectors';
import { ROSTER, byId } from '../data/roster';
import type {
  Approval,
  CapBehaviour,
  CollabRole,
  Collaborator,
  Connector,
  MoteStateName,
  Plan,
  Project,
  Run,
  SpendGuard,
  Task,
} from '../lib/store-types';

export type { MoteStateName };

/** Employees a plan may keep hired at once (PRD §6). MOTE never takes a seat. */
export const seatsFor = (plan: Plan) => (plan === 'free' ? 1 : plan === 'pro' ? 6 : Infinity);

let seq = 100;
const nextId = (prefix: string) => `${prefix}-${++seq}`;

const PALETTE = ['#3b6fd4', '#35c8d8', '#a855f7', '#e5a13a', '#6f9e78', '#c8443c'];

type State = {
  plan: Plan;
  hired: string[];
  /** Trusted employees auto-run amber. Red is never in this set (FR-20). */
  trusted: string[];
  runs: Run[];
  approvals: Approval[];
  tasks: Task[];
  projects: Project[];
  collaborators: Collaborator[];
  connectors: Connector[];
  spend: SpendGuard;
  /** Model spend so far this month, in US$, by employee. */
  spendByEmployee: Record<string, number>;
  activeEmployee: string;
  widget: MoteStateName;
  discreet: boolean;
  telemetry: boolean;
  retentionDays: number;
  blocklist: string[];

  setPlan: (p: Plan) => void;
  hire: (id: string) => void;
  retire: (id: string) => void;
  toggleTrust: (id: string) => void;
  resolve: (approvalId: string, decision: 'approve' | 'deny') => void;

  createTask: (input: { title: string; employeeId: string; projectId?: string }) => string;
  createProject: (name: string) => string;
  toggleFavourite: (taskId: string) => void;
  sendMessage: (taskId: string, text: string) => void;
  resolveTaskApproval: (taskId: string, messageId: string, decision: 'approved' | 'denied') => void;
  invite: (taskId: string, email: string, role: CollabRole) => void;
  uninvite: (taskId: string, collaboratorId: string) => void;
  setTaskRole: (collaboratorId: string, role: CollabRole) => void;

  toggleConnector: (id: string) => void;
  addMcpServer: (input: { name: string; url: string; auth: 'token' | 'none'; permissions: string[] }) => void;
  removeConnector: (id: string) => void;

  setCap: (usd: number | null) => void;
  setAlertPct: (pct: number) => void;
  setPerRunCeiling: (usd: number) => void;
  setAtCap: (b: CapBehaviour) => void;

  setWidget: (s: MoteStateName) => void;
  setActive: (id: string) => void;
  kill: () => void;
  toggleDiscreet: () => void;
  toggleTelemetry: () => void;
  setRetention: (d: number) => void;
  addBlock: (pattern: string) => void;
  removeBlock: (pattern: string) => void;
};

/** Turn an email into a plausible display name and initials for the avatar stack. */
const personFromEmail = (email: string) => {
  const handle = email.split('@')[0].replace(/[._-]+/g, ' ').trim();
  const name = handle
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
  const parts = name.split(' ');
  const initials = ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?';
  return { name: name || email, initials };
};

export const useMote = create<State>((set, get) => ({
  plan: 'pro',
  hired: ['wren', 'tally', 'marlow', 'sage'],
  trusted: ['tally'],
  runs: RUNS,
  approvals: APPROVALS,
  tasks: TASKS,
  projects: PROJECTS,
  collaborators: COLLABORATORS,
  connectors: CONNECTORS,
  spend: { monthlyCapUsd: 40, alertAtPct: 80, perRunCeilingUsd: 0.5, atCap: 'ask' },
  spendByEmployee: { wren: 11.4, tally: 7.2, marlow: 9.8, sage: 3.1, mote: 1.2 },
  activeEmployee: 'wren',
  widget: 'needs-you',
  discreet: false,
  telemetry: false,
  retentionDays: 30,
  blocklist: ['*.bank.com', '1Password', '*.health.gov'],

  setPlan: (plan) =>
    set((s) => {
      const seats = seatsFor(plan);
      // Downgrading retires the overflow but never touches logs or settings (FR-40).
      return { plan, hired: s.hired.slice(0, seats === Infinity ? s.hired.length : seats) };
    }),

  hire: (id) =>
    set((s) => {
      if (byId(id)?.leader) return s; // MOTE is not hired, he is the one hiring.
      const seats = seatsFor(s.plan);
      if (s.hired.includes(id) || s.hired.length >= seats) return s;
      return { hired: [...s.hired, id] };
    }),

  retire: (id) =>
    set((s) =>
      byId(id)?.leader
        ? s
        : { hired: s.hired.filter((h) => h !== id), trusted: s.trusted.filter((t) => t !== id) },
    ),

  toggleTrust: (id) =>
    set((s) => ({
      trusted: s.trusted.includes(id) ? s.trusted.filter((t) => t !== id) : [...s.trusted, id],
    })),

  resolve: (approvalId, decision) => {
    const approval = get().approvals.find((a) => a.id === approvalId);
    if (!approval) return;
    set((s) => ({
      approvals: s.approvals.filter((a) => a.id !== approvalId),
      runs: s.runs.map((run) => {
        if (run.id !== approval.runId) return run;
        const steps = run.steps.map((step) =>
          step.tier === approval.tier && !step.verified
            ? { ...step, verified: decision === 'approve', ms: decision === 'approve' ? 940 : 0 }
            : step,
        );
        return { ...run, steps, outcome: decision === 'approve' ? 'done' : 'halted' } as Run;
      }),
      widget: decision === 'approve' ? 'done' : 'idle',
    }));
  },

  createTask: ({ title, employeeId, projectId }) => {
    // The spend guard is a floor on runaway model cost, not a credit meter:
    // it never touches features you have paid for, only new model work.
    if (spendStatus(get()).blocked && get().spend.atCap === 'pause') return '';
    const id = nextId('t');
    const employee = byId(employeeId);
    const routed = employeeId === 'mote';
    set((s) => ({
      tasks: [
        {
          id,
          title,
          employeeId,
          projectId,
          favourite: false,
          status: 'working',
          createdAt: 'Just now',
          bucket: 'today',
          lastAt: 'now',
          collaborators: [],
          messages: [
            { id: nextId('m'), at: 'now', author: { kind: 'you' }, text: title },
            {
              id: nextId('m'),
              at: 'now',
              author: { kind: 'employee', id: employeeId },
              text: routed
                ? 'Got it. I will work out whose job this is and hand it over — you will see who picked it up right here.'
                : `On it. I will check my preconditions first and tell you if anything is missing before I touch ${employee?.role.toLowerCase() ?? 'anything'} work.`,
            },
          ],
        },
        ...s.tasks,
      ],
      activeEmployee: routed ? s.activeEmployee : employeeId,
      widget: 'thinking',
    }));
    return id;
  },

  createProject: (name) => {
    const id = nextId('p');
    set((s) => ({
      projects: [...s.projects, { id, name, tint: PALETTE[s.projects.length % PALETTE.length] }],
    }));
    return id;
  },

  toggleFavourite: (taskId) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, favourite: !t.favourite } : t)),
    })),

  sendMessage: (taskId, text) => {
    if (!text.trim()) return;
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const employee = byId(t.employeeId);
        return {
          ...t,
          lastAt: 'now',
          messages: [
            ...t.messages,
            { id: nextId('m'), at: 'now', author: { kind: 'you' as const }, text: text.trim() },
            {
              id: nextId('m'),
              at: 'now',
              author: { kind: 'employee' as const, id: t.employeeId },
              text: `Understood. I will fold that into this job — ${employee?.name ?? 'I'} will post the receipt here when the step is verified.`,
            },
          ],
        };
      }),
    }));
  },

  resolveTaskApproval: (taskId, messageId, decision) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id !== taskId
          ? t
          : {
              ...t,
              status: decision === 'approved' ? 'done' : 'halted',
              messages: t.messages.map((m) =>
                m.id === messageId && m.approval
                  ? { ...m, approval: { ...m.approval, resolved: decision, by: 'You' } }
                  : m,
              ),
            },
      ),
      widget: decision === 'approved' ? 'done' : 'idle',
    })),

  invite: (taskId, email, role) => {
    const clean = email.trim();
    if (!clean) return;
    const existing = get().collaborators.find((c) => c.email.toLowerCase() === clean.toLowerCase());
    const collaborator: Collaborator =
      existing ?? { id: nextId('c'), ...personFromEmail(clean), email: clean, role, pending: true };
    set((s) => ({
      collaborators: existing ? s.collaborators : [...s.collaborators, collaborator],
      tasks: s.tasks.map((t) =>
        t.id === taskId && !t.collaborators.includes(collaborator.id)
          ? { ...t, collaborators: [...t.collaborators, collaborator.id] }
          : t,
      ),
    }));
  },

  uninvite: (taskId, collaboratorId) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, collaborators: t.collaborators.filter((c) => c !== collaboratorId) } : t,
      ),
    })),

  setTaskRole: (collaboratorId, role) =>
    set((s) => ({
      collaborators: s.collaborators.map((c) => (c.id === collaboratorId ? { ...c, role } : c)),
    })),

  toggleConnector: (id) =>
    set((s) => ({
      connectors: s.connectors.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c)),
    })),

  addMcpServer: ({ name, url, auth, permissions }) =>
    set((s) => ({
      connectors: [
        ...s.connectors,
        {
          id: nextId('mcp'),
          name,
          kind: 'mcp',
          category: 'Custom',
          blurb: 'Custom MCP server you added.',
          connected: true,
          custom: true,
          url,
          auth,
          permissions: permissions.length ? permissions : ['Declared by the server at connect time'],
        },
      ],
    })),

  removeConnector: (id) => set((s) => ({ connectors: s.connectors.filter((c) => c.id !== id) })),

  setCap: (monthlyCapUsd) => set((s) => ({ spend: { ...s.spend, monthlyCapUsd } })),
  setAlertPct: (alertAtPct) => set((s) => ({ spend: { ...s.spend, alertAtPct } })),
  setPerRunCeiling: (perRunCeilingUsd) => set((s) => ({ spend: { ...s.spend, perRunCeilingUsd } })),
  setAtCap: (atCap) => set((s) => ({ spend: { ...s.spend, atCap } })),

  setWidget: (widget) => set({ widget }),
  setActive: (activeEmployee) => set({ activeEmployee }),
  kill: () => set({ widget: 'idle' }),
  toggleDiscreet: () => set((s) => ({ discreet: !s.discreet })),
  toggleTelemetry: () => set((s) => ({ telemetry: !s.telemetry })),
  setRetention: (retentionDays) => set({ retentionDays }),
  addBlock: (pattern) =>
    set((s) => (pattern && !s.blocklist.includes(pattern) ? { blocklist: [...s.blocklist, pattern] } : s)),
  removeBlock: (pattern) => set((s) => ({ blocklist: s.blocklist.filter((b) => b !== pattern) })),
}));

/**
 * Month-to-date model spend against the cap. `blocked` only ever gates starting
 * new model work — never export, never your logs, never a run already going.
 */
export const spendStatus = (s: { spend: SpendGuard; spendByEmployee: Record<string, number> }) => {
  const used = Object.values(s.spendByEmployee).reduce((a, b) => a + b, 0);
  const cap = s.spend.monthlyCapUsd;
  const pct = cap ? Math.min(100, (used / cap) * 100) : 0;
  return {
    used,
    cap,
    pct,
    alerting: cap !== null && pct >= s.spend.alertAtPct,
    blocked: cap !== null && used >= cap,
  };
};

export const employeeTint = (id: string) => ROSTER.find((e) => e.id === id)?.tint ?? '#2fd463';
