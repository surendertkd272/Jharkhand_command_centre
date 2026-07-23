// ============================================================================
// Normalized physiological-monitoring model. Firstbeat (HRV / training load /
// recovery) and Myoact (EMG muscle load / asymmetry) are mapped into ONE shape
// so the command center never depends on a vendor's raw schema. Swapping demo
// data for live APIs happens inside the adapters (firstbeat.ts / myoact.ts) —
// the UI and this model do not change.
// ============================================================================

export type IntegrationId = "firstbeat" | "myoact";
export type ConnectionState = "connected" | "syncing" | "error" | "disconnected";
export type Readiness = "optimal" | "moderate" | "compromised";
export type RiskLevel = "low" | "moderate" | "high";

export interface IntegrationStatus {
  id: IntegrationId;
  name: string;
  vendor: string;
  state: ConnectionState;
  /** ISO timestamp of the last successful pull. */
  lastSync: string;
  metrics: string;
  athletesTracked: number;
  /** How data is fetched (auth + transport) — shown in the UI + docs. */
  api: string;
  live: boolean;
}

export interface SamplePoint {
  label: string;
  value: number;
  // index signature so it's assignable to recharts/AreaTrend data rows
  [k: string]: string | number;
}

export interface MuscleGroupLoad {
  group: string;
  left: number; // activation %
  right: number;
}

/** Firstbeat-derived slice. */
export interface LoadRecovery {
  trainingLoad: SamplePoint[]; // 14 daily TRIMP
  weeklyLoad: number; // total TRIMP, last 7 days
  acwr: number; // acute:chronic workload ratio
  hrvRmssd: number; // ms
  hrvTrend: SamplePoint[]; // 14 daily rMSSD
  recoveryScore: number; // 0–100
  restingHr: number; // bpm
}

/** Myoact-derived slice. */
export interface MuscleActivity {
  muscleLoad: number; // 0–100 overall
  asymmetryPct: number; // left/right imbalance
  fatigueIndex: number; // 0–100
  muscleGroups: MuscleGroupLoad[];
}

/** One athlete, fully merged + derived. */
export interface AthletePhysiology extends LoadRecovery, MuscleActivity {
  athleteId: string;
  sources: IntegrationId[];
  lastSync: string;
  readiness: Readiness;
  injuryRisk: RiskLevel;
  flags: string[];
}

export interface FleetSummary {
  tracked: number;
  optimal: number;
  compromised: number;
  highRisk: number;
  acwrOutOfRange: number;
  avgRecovery: number;
  loadTrend: SamplePoint[]; // fleet-average daily load, 14 days
}

export interface FleetPhysiology {
  status: IntegrationStatus[];
  athletes: AthletePhysiology[];
  summary: FleetSummary;
}

/** ACWR "sweet spot" is 0.8–1.3; >1.5 is the danger zone. */
export const ACWR_LOW = 0.8;
export const ACWR_HIGH = 1.3;
export const ACWR_DANGER = 1.5;
