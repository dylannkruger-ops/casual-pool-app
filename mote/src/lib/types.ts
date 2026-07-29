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
  /** 4:5 head-and-torso portrait, framed to match across the team. */
  avatar: string;
  /** One line, in the employee's own voice. */
  blurb: string;
  /** How a person would actually ask for this employee's work. */
  suggest: string;
  status: EmployeeStatus;
  /** Set for onboarding employees only. */
  joining?: string;
  skills: Skill[];
  freeTier?: boolean;
  /** MOTE. Always present, never occupies a seat, never retired. */
  leader?: boolean;
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

export type Project = { id: string; name: string; tint: string };

/**
 * Layer 1 of the execution hierarchy (PRD §5.4). One MCP client, not a pile of
 * per-app integrations — an app connector and a custom server are the same
 * thing wearing different labels.
 */
export type Connector = {
  id: string;
  name: string;
  kind: 'app' | 'mcp';
  category: string;
  blurb: string;
  connected: boolean;
  /** Custom servers only. */
  url?: string;
  auth?: 'token' | 'oauth' | 'none';
  /** Declared at connect time and enforced at runtime (FR-37). */
  permissions: string[];
  tools?: string[];
  custom?: boolean;
};

/** What happens when the month's model spend reaches the cap. */
export type CapBehaviour = 'pause' | 'byo-key' | 'ask';

export type SpendGuard = {
  /** null means no cap set. */
  monthlyCapUsd: number | null;
  /** Warn at this share of the cap. */
  alertAtPct: number;
  /** A single run that would cost more than this halts and asks. */
  perRunCeilingUsd: number;
  atCap: CapBehaviour;
};

export type CollabRole = 'viewer' | 'approver';

export type Collaborator = {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: CollabRole;
  /** Invited but not yet accepted. */
  pending?: boolean;
};

export type Author =
  | { kind: 'you' }
  | { kind: 'employee'; id: string }
  | { kind: 'collaborator'; id: string }
  | { kind: 'system' };

export type Message = {
  id: string;
  at: string;
  author: Author;
  text?: string;
  /** An inline receipt — the same step records the work log stores. */
  steps?: Step[];
  /** A decision the user has to make, rendered as a crown card. */
  approval?: {
    what: string;
    tier: Exclude<Tier, 'green'>;
    resolved?: 'approved' | 'denied';
    /** Who resolved it — the owner, or a collaborator with approve rights. */
    by?: string;
  };
};

export type TaskStatus = 'working' | 'waiting' | 'done' | 'halted';

export type Task = {
  id: string;
  title: string;
  /** Who owns the work. MOTE means "not routed yet". */
  employeeId: string;
  projectId?: string;
  favourite: boolean;
  status: TaskStatus;
  createdAt: string;
  /** Human-readable recency label, used to group the history list. */
  bucket: 'today' | 'yesterday' | 'earlier';
  lastAt: string;
  collaborators: string[];
  messages: Message[];
};
