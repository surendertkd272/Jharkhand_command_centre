import type {
  AtRiskAthlete,
  ExitPoint,
  ExitReason,
  InjuryLedgerRow,
  Severity,
} from "@/lib/types";
import { ATHLETE_BY_ID } from "@/lib/mock/athletes";
import { ACADEMY_BY_ID } from "@/lib/mock/academies";

// ============================================================================
// Welfare & retention mock. Pure data + helpers (NO "use client").
// Surfaces hero demo beat (d): athlete at-22 "Chandan Pandey" — coach tried to
// re-activate after an ACL injury WITHOUT independent state medical clearance.
// That re-activation override is BLOCKED and shown loudly in the ledger.
// ============================================================================

// ----------------------------------------------------------------------------
// Monthly exits — trailing 12 months (Jul .. Jun), slight recent improvement.
// ----------------------------------------------------------------------------
export const MONTHLY_EXITS: ExitPoint[] = [
  { month: "Jul", exits: 9 },
  { month: "Aug", exits: 11 },
  { month: "Sep", exits: 8 },
  { month: "Oct", exits: 12 },
  { month: "Nov", exits: 10 },
  { month: "Dec", exits: 13 },
  { month: "Jan", exits: 9 },
  { month: "Feb", exits: 8 },
  { month: "Mar", exits: 7 },
  { month: "Apr", exits: 6 },
  { month: "May", exits: 5 },
  { month: "Jun", exits: 4 },
];

// ----------------------------------------------------------------------------
// Exit reasons — counts sum to 84 (within the 70–90 band).
// ----------------------------------------------------------------------------
export const EXIT_REASONS: ExitReason[] = [
  { reason: "Economic hardship", count: 31 },
  { reason: "Coaching issues", count: 19 },
  { reason: "Relocation", count: 14 },
  { reason: "Injury", count: 12 },
  { reason: "Performance pressure", count: 8 },
];

// ----------------------------------------------------------------------------
// At-risk athletes — derived from real ATHLETES (status "at-risk") plus a few
// low-attendance actives whose biometric attendance is trending down.
// ----------------------------------------------------------------------------
interface RawAtRisk {
  athleteId: string;
  attendanceRate: number; // current (falling) %
  missedSessions: number;
  riskLevel: Severity;
}

const RAW_AT_RISK: RawAtRisk[] = [
  // Declared at-risk in the roster
  { athleteId: "at-08", attendanceRate: 48, missedSessions: 22, riskLevel: "critical" }, // Manish Gope — ac-05 Dhanbad Coalfields (paused funding context)
  { athleteId: "at-18", attendanceRate: 46, missedSessions: 24, riskLevel: "critical" }, // Albert Lakra Jr. — ac-09 Giridih Football
  { athleteId: "at-28", attendanceRate: 51, missedSessions: 19, riskLevel: "high" },     // Anita Kumari — ac-21 Lohardaga Kabaddi
  { athleteId: "at-32", attendanceRate: 53, missedSessions: 18, riskLevel: "high" },     // Etwari Devi Jr. — ac-20 Latehar (pending identity)
  // Low-attendance actives now slipping into the watch band
  { athleteId: "at-16", attendanceRate: 64, missedSessions: 12, riskLevel: "medium" },   // Naveen Mahto — ac-16 Saraikela Wrestling
  { athleteId: "at-33", attendanceRate: 61, missedSessions: 14, riskLevel: "medium" },   // Harish Gope — ac-29 Bokaro
];

export const AT_RISK: AtRiskAthlete[] = RAW_AT_RISK.map((r, i) => {
  const ath = ATHLETE_BY_ID[r.athleteId];
  const academy = ACADEMY_BY_ID[ath.academyId];
  return {
    id: `risk-${String(i + 1).padStart(2, "0")}`,
    athleteId: r.athleteId,
    athleteName: ath.name,
    district: ath.district,
    academyName: academy?.name ?? "",
    sport: ath.sport,
    attendanceRate: r.attendanceRate,
    trend: "falling",
    missedSessions: r.missedSessions,
    riskLevel: r.riskLevel,
  };
});

// ----------------------------------------------------------------------------
// Injury ledger — derived from ATHLETES carrying injuries (at-13 pending,
// at-22 BLOCKED override) plus four more across cleared / pending states.
// ----------------------------------------------------------------------------
interface RawInjury {
  athleteId: string;
  injury: string;
  reportedBy: string;
  date: string; // ISO
  clearance: "pending" | "cleared" | "blocked";
  overrideAttempt?: boolean;
  timeline: { label: string; at: string; done: boolean }[];
}

const RAW_INJURY: RawInjury[] = [
  // HERO BEAT (d): coach re-activation override BLOCKED pending state board.
  {
    athleteId: "at-22",
    injury: "Knee ligament strain (ACL grade II)",
    reportedBy: "Coach Chandan Pandey (academy)",
    date: "2026-06-10",
    clearance: "blocked",
    overrideAttempt: true,
    timeline: [
      { label: "Injury reported", at: "2026-06-10", done: true },
      { label: "Academy physio assessment", at: "2026-06-11", done: true },
      { label: "State medical board review", at: "2026-06-24", done: false },
      { label: "Coach re-activation attempt — BLOCKED", at: "2026-06-26", done: false },
      { label: "Clearance issued", at: "", done: false },
    ],
  },
  // Pending — awaiting state board, no override.
  {
    athleteId: "at-13",
    injury: "Shoulder dislocation (left)",
    reportedBy: "Academy Physio",
    date: "2026-05-22",
    clearance: "pending",
    timeline: [
      { label: "Injury reported", at: "2026-05-22", done: true },
      { label: "Academy physio assessment", at: "2026-05-23", done: true },
      { label: "State medical board review", at: "2026-06-20", done: false },
      { label: "Clearance issued", at: "", done: false },
    ],
  },
  // Additional injured athletes (active roster, mix of cleared / pending).
  {
    athleteId: "at-08",
    injury: "Lower-back strain (lumbar)",
    reportedBy: "Academy Physio",
    date: "2026-04-18",
    clearance: "cleared",
    timeline: [
      { label: "Injury reported", at: "2026-04-18", done: true },
      { label: "Academy physio assessment", at: "2026-04-19", done: true },
      { label: "State medical board review", at: "2026-05-02", done: true },
      { label: "Clearance issued", at: "2026-05-09", done: true },
    ],
  },
  {
    athleteId: "at-14",
    injury: "Wrist sprain (right)",
    reportedBy: "Academy Physio",
    date: "2026-05-30",
    clearance: "cleared",
    timeline: [
      { label: "Injury reported", at: "2026-05-30", done: true },
      { label: "Academy physio assessment", at: "2026-05-31", done: true },
      { label: "State medical board review", at: "2026-06-09", done: true },
      { label: "Clearance issued", at: "2026-06-14", done: true },
    ],
  },
  {
    athleteId: "at-06",
    injury: "Hamstring tear (grade I)",
    reportedBy: "State Medical Officer",
    date: "2026-06-02",
    clearance: "pending",
    timeline: [
      { label: "Injury reported", at: "2026-06-02", done: true },
      { label: "Academy physio assessment", at: "2026-06-03", done: true },
      { label: "State medical board review", at: "2026-06-22", done: false },
      { label: "Clearance issued", at: "", done: false },
    ],
  },
  {
    athleteId: "at-21",
    injury: "Ankle ligament sprain (right)",
    reportedBy: "Academy Physio",
    date: "2026-03-28",
    clearance: "cleared",
    timeline: [
      { label: "Injury reported", at: "2026-03-28", done: true },
      { label: "Academy physio assessment", at: "2026-03-29", done: true },
      { label: "State medical board review", at: "2026-04-10", done: true },
      { label: "Clearance issued", at: "2026-04-15", done: true },
    ],
  },
];

export const INJURY_LEDGER: InjuryLedgerRow[] = RAW_INJURY.map((r, i) => {
  const ath = ATHLETE_BY_ID[r.athleteId];
  const academy = ACADEMY_BY_ID[ath.academyId];
  return {
    id: `inj-${String(i + 1).padStart(2, "0")}`,
    athleteId: r.athleteId,
    athleteName: ath.name,
    academyName: academy?.name ?? "",
    injury: r.injury,
    reportedBy: r.reportedBy,
    date: r.date,
    clearance: r.clearance,
    overrideAttempt: r.overrideAttempt,
    timeline: r.timeline,
  };
});

// ----------------------------------------------------------------------------
// Aggregates
// ----------------------------------------------------------------------------
export const RETENTION_RATE = 88; // % of roster retained over trailing year

/** Exits booked in the most recent quarter (Apr + May + Jun). */
export const EXITS_THIS_QUARTER = MONTHLY_EXITS.slice(-3).reduce(
  (sum, m) => sum + m.exits,
  0,
);

export const AT_RISK_TOTAL = AT_RISK.length;
