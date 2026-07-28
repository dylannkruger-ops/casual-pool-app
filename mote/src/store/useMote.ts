import { create } from 'zustand';
import { APPROVALS, RUNS } from '../data/runs';
import { ROSTER } from '../data/roster';
import type { Approval, MoteStateName, Plan, Run } from '../lib/store-types';

export type { MoteStateName };

/** Employees a plan may keep hired at once (PRD §6). */
export const seatsFor = (plan: Plan) => (plan === 'free' ? 1 : plan === 'pro' ? 6 : Infinity);

type State = {
  plan: Plan;
  hired: string[];
  /** Trusted employees auto-run amber. Red is never in this set (FR-20). */
  trusted: string[];
  runs: Run[];
  approvals: Approval[];
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
  setWidget: (s: MoteStateName) => void;
  setActive: (id: string) => void;
  kill: () => void;
  toggleDiscreet: () => void;
  toggleTelemetry: () => void;
  setRetention: (d: number) => void;
  addBlock: (pattern: string) => void;
  removeBlock: (pattern: string) => void;
};

export const useMote = create<State>((set, get) => ({
  plan: 'pro',
  hired: ['otto', 'tally'],
  trusted: ['tally'],
  runs: RUNS,
  approvals: APPROVALS,
  activeEmployee: 'otto',
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
      const seats = seatsFor(s.plan);
      if (s.hired.includes(id) || s.hired.length >= seats) return s;
      return { hired: [...s.hired, id] };
    }),

  retire: (id) =>
    set((s) => ({ hired: s.hired.filter((h) => h !== id), trusted: s.trusted.filter((t) => t !== id) })),

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

export const employeeTint = (id: string) => ROSTER.find((e) => e.id === id)?.tint ?? '#2fd463';
