// ============================================================================
// State Sports Command Center — shared type contracts
// Every mock module and screen imports from here. Keep IDs referential.
// ============================================================================

export type Pillar =
  | "integrity"
  | "resources"
  | "finance"
  | "welfare"
  | "academies";

export type Severity = "critical" | "high" | "medium" | "low";

// Status vocabulary used by the StatusBadge across the whole app.
export type StatusKind =
  | "compliant"
  | "flagged"
  | "paused"
  | "verified"
  | "pending"
  | "breach"
  | "resolved"
  | "paid"
  | "failed"
  | "active"
  | "in-transit"
  | "escalated"
  | "in-progress"
  | "open"
  | "cleared"
  | "blocked"
  | "at-risk";

export type Sport =
  | "Archery"
  | "Hockey"
  | "Football"
  | "Athletics"
  | "Wrestling"
  | "Weightlifting"
  | "Kabaddi"
  | "Boxing";

export type FundingStatus = "active" | "flagged" | "paused";
export type FacilityType = "Academy" | "PEC";

// ----------------------------------------------------------------------------
// Districts (for the inline SVG map)
// ----------------------------------------------------------------------------
export interface District {
  id: string;
  name: string;
  /** Approximate centroid in the map's 0–1000 x / 0–700 y viewBox space. */
  cx: number;
  cy: number;
  /** Optional SVG polygon path (stylized) for the district cell. */
  path?: string;
}

// ----------------------------------------------------------------------------
// Academies & PECs — the referential backbone
// ----------------------------------------------------------------------------
export interface Academy {
  id: string;
  name: string;
  districtId: string;
  district: string;
  type: FacilityType;
  sports: Sport[];
  athletesCount: number;
  /** 0–100 */
  complianceScore: number;
  fundingStatus: FundingStatus;
  /** Position on the SVG map (0–1000 x / 0–700 y viewBox). */
  x: number;
  y: number;
  leadCoach: string;
  openAlerts: number;
  established: number;
  /** Short reason chip shown when funding is paused/flagged. */
  fundingNote?: string;
}

// ----------------------------------------------------------------------------
// Athletes
// ----------------------------------------------------------------------------
export type IdentityStatus = "verified" | "pending" | "flagged";

export interface AttendancePoint {
  label: string; // e.g. week label "W1"
  value: number; // biometric attendance %
}

export interface StipendRecord {
  id: string;
  scheme: string;
  amount: number;
  date: string; // ISO
  status: "paid" | "in-transit" | "failed";
}

export interface InjuryRecord {
  id: string;
  injury: string;
  reportedBy: string;
  date: string; // ISO
  clearance: "pending" | "cleared" | "blocked";
  note?: string;
}

export interface Athlete {
  id: string;
  name: string;
  age: number;
  ageVerified: boolean;
  district: string;
  districtId: string;
  sport: Sport;
  academyId: string;
  photo: string; // initials-based avatar; URL optional
  gender: "M" | "F";
  identityStatus: IdentityStatus;
  status: "active" | "at-risk" | "exited" | "injured";
  attendance: AttendancePoint[];
  attendanceRate: number; // current %
  stipendHistory: StipendRecord[];
  injuries: InjuryRecord[];
  trialScore: number; // subjective evaluator score 0–100
  baselineScore: number; // objective performance baseline 0–100
}

// ----------------------------------------------------------------------------
// Alerts (cross-pillar feed)
// ----------------------------------------------------------------------------
export interface Alert {
  id: string;
  pillar: Pillar;
  severity: Severity;
  title: string;
  description: string;
  academyId: string;
  academyName: string;
  district: string;
  status: "open" | "acknowledged" | "escalated" | "resolved";
  createdAt: string; // ISO
  assignedTo?: string;
}

// ----------------------------------------------------------------------------
// Integrity
// ----------------------------------------------------------------------------
export interface VerificationRow {
  id: string;
  athleteId: string;
  athleteName: string;
  district: string;
  age: number;
  ageLocked: boolean; // locked via DigiLocker
  residencyProof: string;
  digiLockerStatus: IdentityStatus;
  sealedAt?: string; // ISO — when data was sealed on registration
  documents: { label: string; sealed: boolean }[];
}

export interface DebiasPoint {
  id: string;
  athleteName: string;
  district: string;
  sport: Sport;
  evaluator: string;
  baseline: number; // x — objective 0–100
  trialScore: number; // y — subjective 0–100
  deviation: number; // signed deviation from fair band
  flagged: boolean;
}

export interface DualRegistrationMatch {
  id: string;
  athleteName: string;
  districtA: string;
  districtB: string;
  trialDateA: string;
  trialDateB: string;
  matchConfidence: number; // %
  biometric: "face" | "fingerprint";
  status: "flagged" | "frozen" | "cleared";
}

// ----------------------------------------------------------------------------
// Resources
// ----------------------------------------------------------------------------
export interface KitReconRow {
  id: string;
  item: string;
  academyId: string;
  academyName: string;
  dispatched: number;
  receivedAtAcademy: number;
  biometricReceipt: number; // received by athlete (biometric)
  unitValue: number; // Rs per unit
}

export interface NutritionRow {
  id: string;
  academyId: string;
  academyName: string;
  platesBilled: number;
  verifiedCheckIns: number;
  ratePerPlate: number;
  /** 7-day biometric meal check-in heat strip (0–100 of capacity). */
  dailyCheckIns: number[];
}

export interface SLATicket {
  id: string;
  academyId: string;
  academyName: string;
  issue: string;
  category: string;
  raisedAt: string; // ISO
  slaHours: number; // SLA window
  hoursRemaining: number; // negative => breached
  status: "open" | "in-progress" | "escalated" | "resolved";
  assignedTo?: string;
}

// ----------------------------------------------------------------------------
// Finance
// ----------------------------------------------------------------------------
export interface FundingRow {
  id: string;
  academyId: string;
  academyName: string;
  district: string;
  complianceScore: number;
  threshold: number;
  status: FundingStatus;
  amountActive: number; // Rs released
  amountOnHold: number; // Rs held
  reason?: string; // why paused/flagged
}

export interface DBTTransaction {
  id: string;
  athleteId: string;
  athleteName: string;
  scheme: string;
  amount: number;
  bankAccount: string; // raw, masked in UI
  bankName: string;
  status: "paid" | "in-transit" | "failed";
  date: string; // ISO
  failureReason?: string;
}

export interface ROIRow {
  id: string;
  academyId: string;
  academyName: string;
  district: string;
  annualCost: number; // Rs
  athletesDeveloped: number;
  stateSelections: number;
  nationalSelections: number;
  costPerAthlete: number; // Rs
  roiGrade: "A" | "B" | "C" | "D" | "E";
}

// ----------------------------------------------------------------------------
// Welfare
// ----------------------------------------------------------------------------
export interface ExitPoint {
  month: string; // e.g. "Jan"
  exits: number;
}

export interface ExitReason {
  reason: string;
  count: number;
}

export interface AtRiskAthlete {
  id: string;
  athleteId: string;
  athleteName: string;
  district: string;
  academyName: string;
  sport: Sport;
  attendanceRate: number;
  trend: "falling" | "stable";
  missedSessions: number;
  riskLevel: Severity;
}

export interface InjuryLedgerRow {
  id: string;
  athleteId: string;
  athleteName: string;
  academyName: string;
  injury: string;
  reportedBy: string;
  date: string;
  clearance: "pending" | "cleared" | "blocked";
  /** Demo beat: a coach tried to re-activate without state medical clearance. */
  overrideAttempt?: boolean;
  timeline: { label: string; at: string; done: boolean }[];
}

// ----------------------------------------------------------------------------
// Rewards & Engagement
// ----------------------------------------------------------------------------
export type BadgeKind =
  | "consistency"
  | "rising-talent"
  | "perfect-attendance"
  | "recovery-champion"
  | "district-topper";

export interface AcademyStreakRow {
  id: string;
  academyId: string;
  academyName: string;
  district: string;
  type: "Academy" | "PEC";
  /** Consecutive weeks of on-time submission. 0 = streak broken. */
  streakWeeks: number;
  /** Longest streak ever reached — what a broken streak cost them. */
  bestStreakWeeks: number;
  onTimeRate: number; // % of weekly submissions filed before cut-off
  badgesEarned: number;
  /** Engagement points — the currency behind grant priority. */
  points: number;
  status: StatusKind;
}

export interface AthleteBadgeRow {
  id: string;
  athleteId: string;
  athleteName: string;
  district: string;
  academyName: string;
  sport: Sport;
  attendanceRate: number; // 0-100
  points: number;
  badges: BadgeKind[];
}

export interface DistrictStanding {
  districtId: string;
  district: string;
  facilities: number;
  points: number;
  avgStreakWeeks: number;
}

/** Type alias (not an interface) so it satisfies AreaTrend's index signature. */
export type EngagementPoint = {
  label: string; // week label, W1..W8
  onTime: number; // % of facilities filing before the weekly cut-off
};

// ----------------------------------------------------------------------------
// Misc UI helpers
// ----------------------------------------------------------------------------
export interface SignoffItem {
  id: string;
  title: string;
  context: string;
  pillar: Pillar;
}

export interface InspectionDay {
  date: number; // day of month
  label?: string; // academy/district
  state: "none" | "scheduled" | "today" | "done";
}
