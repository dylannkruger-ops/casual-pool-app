/** Execution hierarchy, in strict order of preference (PRD §5.4). */
export type Layer = 'connector' | 'a11y' | 'vision';

/** Action tiers (PRD FR-20). Red is never delegable — there is no setting. */
export type Tier = 'green' | 'amber' | 'red';

export type EmployeeStatus = 'hireable' | 'onboarding';

export type Skill = {
  id: string;
  name: string;
  /** What must be true before a single action fires (FR-11). */
  preconditions: string[];
  /** Live bench number (PRD §9.1). Null while the skill is still gating. */
  successRate: number | null;
  runs: number;
  failureMode: string;
};

export type Employee = {
  id: string;
  name: string;
  role: string;
  tint: string;
  /** One line, in the employee's own voice. */
  blurb: string;
  status: EmployeeStatus;
  /** Set for onboarding employees only. */
  joining?: string;
  skills: Skill[];
  freeTier?: boolean;
};

export type Step = {
  n: number;
  action: string;
  target: string;
  layer: Layer;
  tier: Tier;
  verified: boolean;
  ms: number;
  /** Present when the step stopped the run. */
  halt?: { expected: string; observed: string };
};

export type RunOutcome = 'done' | 'waiting' | 'halted' | 'running';

export type Run = {
  id: string;
  employeeId: string;
  skillId: string;
  title: string;
  startedAt: string;
  shift: 'desk' | 'cloud';
  outcome: RunOutcome;
  steps: Step[];
};

export type Approval = {
  id: string;
  runId: string;
  employeeId: string;
  tier: Exclude<Tier, 'green'>;
  what: string;
  detail: string;
  /** Lines shown in place of a redacted step screenshot. */
  preview: string[];
  requestedAt: string;
  /** FR-23: nothing auto-approves on timeout. */
  expiresInMin: number;
};

export type Plan = 'free' | 'pro' | 'studio';
