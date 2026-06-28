import type { DBTTransaction, FundingRow, ROIRow } from "@/lib/types";
import { ACADEMY_BY_ID } from "@/lib/mock/academies";
import { ATHLETE_BY_ID } from "@/lib/mock/athletes";

// ============================================================================
// Finance pillar mock — funding release ledger, DBT stipend transfers and
// per-academy ROI scoring. Pure data + aggregates; no "use client".
//
// Every academyId / athleteId resolves to the core mock. Money is stored as
// raw rupee integers; screens render via formatRs(). Hero beat (b): ac-05
// "Dhanbad Coalfields Academy" funding is PAUSED with Rs 42 L withheld for
// biometric attendance falling below the 60% release threshold.
// ============================================================================

const FUNDING_THRESHOLD = 60;

interface RawFunding {
  academyId: string;
  /** Rs released to the academy this cycle. */
  amountActive: number;
  /** Rs withheld / on hold this cycle. */
  amountOnHold: number;
  /** Explicit reason override; else inherits academy.fundingNote. */
  reason?: string;
}

// Ordered roughly by risk so the table reads top-down. Status, district,
// complianceScore and the default reason all derive from the core academy.
const RAW_FUNDING: RawFunding[] = [
  // ---- PAUSED (compliance < 60, releases frozen) --------------------------
  // HERO BEAT (b): Dhanbad Coalfields Academy.
  { academyId: "ac-05", amountActive: 0, amountOnHold: 4_200_000, reason: "Biometric attendance 48% < 60%" },
  { academyId: "ac-34", amountActive: 0, amountOnHold: 3_100_000 },
  { academyId: "ac-16", amountActive: 0, amountOnHold: 2_650_000 },
  { academyId: "ac-29", amountActive: 0, amountOnHold: 2_350_000 },
  { academyId: "ac-08", amountActive: 0, amountOnHold: 1_900_000 },
  { academyId: "ac-20", amountActive: 0, amountOnHold: 1_450_000 },
  // ---- FLAGGED (compliance 60–69, partial release pending review) ---------
  { academyId: "ac-09", amountActive: 3_800_000, amountOnHold: 1_200_000, reason: "Age-verification dispute on 1 athlete" },
  { academyId: "ac-15", amountActive: 2_900_000, amountOnHold: 1_600_000, reason: "Kit reconciliation gap under review" },
  { academyId: "ac-25", amountActive: 2_400_000, amountOnHold: 900_000, reason: "Attendance audit pending sign-off" },
  { academyId: "ac-19", amountActive: 2_100_000, amountOnHold: 700_000, reason: "Compliance 62% — held pending re-audit" },
  { academyId: "ac-07", amountActive: 3_200_000, amountOnHold: 1_000_000, reason: "Phantom-roster review in progress" },
  { academyId: "ac-17", amountActive: 1_800_000, amountOnHold: 600_000, reason: "Compliance 66% — partial release" },
  { academyId: "ac-40", amountActive: 1_600_000, amountOnHold: 800_000, reason: "Compliance at 60% threshold floor" },
  { academyId: "ac-22", amountActive: 1_500_000, amountOnHold: 750_000, reason: "Compliance at 60% threshold floor" },
  // ---- ACTIVE (compliance >= 70, fully released — shown for contrast) ------
  { academyId: "ac-12", amountActive: 11_800_000, amountOnHold: 0 },
  { academyId: "ac-04", amountActive: 9_600_000, amountOnHold: 0 },
  { academyId: "ac-01", amountActive: 7_400_000, amountOnHold: 0 },
  { academyId: "ac-27", amountActive: 6_200_000, amountOnHold: 0 },
];

export const FUNDING_ROWS: FundingRow[] = RAW_FUNDING.map((r, i) => {
  const academy = ACADEMY_BY_ID[r.academyId];
  return {
    id: `fund-${String(i + 1).padStart(2, "0")}`,
    academyId: r.academyId,
    academyName: academy?.name ?? r.academyId,
    district: academy?.district ?? "",
    complianceScore: academy?.complianceScore ?? 0,
    threshold: FUNDING_THRESHOLD,
    status: academy?.fundingStatus ?? "active",
    amountActive: r.amountActive,
    amountOnHold: r.amountOnHold,
    reason: r.reason ?? academy?.fundingNote,
  };
});

// ----------------------------------------------------------------------------
// DBT stipend transfers — direct benefit transfer ledger to athlete accounts.
// Mostly "paid", with 3 "in-transit" and 2 "failed" (with failure reasons).
// Dates are within ~60 days of DEMO_NOW (2026-06-28).
// ----------------------------------------------------------------------------
interface RawDBT {
  athleteId: string;
  scheme: string;
  amount: number;
  bankAccount: string; // raw ~11-digit; UI masks via maskAccount()
  bankName: string;
  status: DBTTransaction["status"];
  date: string; // ISO
  failureReason?: string;
}

const RAW_DBT: RawDBT[] = [
  { athleteId: "at-01", scheme: "Khelo India Scholarship", amount: 12500, bankAccount: "30412785609", bankName: "SBI", status: "paid", date: "2026-06-01" },
  { athleteId: "at-02", scheme: "State Stipend Scheme", amount: 10000, bankAccount: "51920837461", bankName: "Bank of India", status: "paid", date: "2026-06-01" },
  { athleteId: "at-03", scheme: "Mukhyamantri Pratibha Grant", amount: 11000, bankAccount: "62731904855", bankName: "PNB", status: "paid", date: "2026-06-02" },
  { athleteId: "at-05", scheme: "SAI Fellowship", amount: 12000, bankAccount: "40918273645", bankName: "Canara Bank", status: "paid", date: "2026-06-02" },
  { athleteId: "at-06", scheme: "State Stipend Scheme", amount: 10500, bankAccount: "73625108492", bankName: "SBI", status: "paid", date: "2026-06-03" },
  { athleteId: "at-07", scheme: "Khelo India Scholarship", amount: 11500, bankAccount: "29384756102", bankName: "Jharkhand Gramin Bank", status: "paid", date: "2026-06-03" },
  { athleteId: "at-09", scheme: "Mukhyamantri Pratibha Grant", amount: 10000, bankAccount: "84019283746", bankName: "Bank of India", status: "paid", date: "2026-06-04" },
  { athleteId: "at-11", scheme: "Khelo India Scholarship", amount: 11000, bankAccount: "57382910465", bankName: "PNB", status: "paid", date: "2026-06-04" },
  { athleteId: "at-12", scheme: "State Stipend Scheme", amount: 10000, bankAccount: "61209384751", bankName: "Canara Bank", status: "paid", date: "2026-06-05" },
  { athleteId: "at-17", scheme: "SAI Fellowship", amount: 12000, bankAccount: "39201847562", bankName: "SBI", status: "paid", date: "2026-06-05" },
  { athleteId: "at-19", scheme: "Mukhyamantri Pratibha Grant", amount: 11000, bankAccount: "48576102938", bankName: "Jharkhand Gramin Bank", status: "paid", date: "2026-06-06" },
  { athleteId: "at-25", scheme: "Khelo India Scholarship", amount: 10500, bankAccount: "92038475610", bankName: "Bank of India", status: "paid", date: "2026-06-06" },
  { athleteId: "at-34", scheme: "State Stipend Scheme", amount: 10000, bankAccount: "10293847561", bankName: "PNB", status: "paid", date: "2026-06-07" },
  // ---- in-transit (3) ------------------------------------------------------
  { athleteId: "at-18", scheme: "State Stipend Scheme", amount: 8000, bankAccount: "67482910375", bankName: "Jharkhand Gramin Bank", status: "in-transit", date: "2026-06-24" },
  { athleteId: "at-08", scheme: "Mukhyamantri Pratibha Grant", amount: 9000, bankAccount: "53019287465", bankName: "Canara Bank", status: "in-transit", date: "2026-06-25" },
  { athleteId: "at-29", scheme: "Khelo India Scholarship", amount: 9500, bankAccount: "81920374658", bankName: "SBI", status: "in-transit", date: "2026-06-26" },
  // ---- failed (2) ----------------------------------------------------------
  { athleteId: "at-32", scheme: "State Stipend Scheme", amount: 8000, bankAccount: "74018263549", bankName: "Jharkhand Gramin Bank", status: "failed", date: "2026-06-12", failureReason: "Account frozen" },
  { athleteId: "at-28", scheme: "Khelo India Scholarship", amount: 8500, bankAccount: "29107483652", bankName: "Bank of India", status: "failed", date: "2026-06-15", failureReason: "Name mismatch with Aadhaar" },
];

export const DBT_TRANSACTIONS: DBTTransaction[] = RAW_DBT.map((r, i) => {
  const athlete = ATHLETE_BY_ID[r.athleteId];
  return {
    id: `dbt-${String(i + 1).padStart(2, "0")}`,
    athleteId: r.athleteId,
    athleteName: athlete?.name ?? r.athleteId,
    scheme: r.scheme,
    amount: r.amount,
    bankAccount: r.bankAccount,
    bankName: r.bankName,
    status: r.status,
    date: r.date,
    failureReason: r.failureReason,
  };
});

// ----------------------------------------------------------------------------
// ROI scoring — annual cost vs. talent output per academy.
// roiGrade: A = lean + high selections; E = over-funded under-performer.
// ----------------------------------------------------------------------------
interface RawROI {
  academyId: string;
  annualCost: number; // Rs
  athletesDeveloped: number;
  stateSelections: number;
  nationalSelections: number;
  roiGrade: ROIRow["roiGrade"];
}

const RAW_ROI: RawROI[] = [
  // ---- Stars (A): lean cost, strong selection pipeline --------------------
  { academyId: "ac-12", annualCost: 9_800_000, athletesDeveloped: 142, stateSelections: 34, nationalSelections: 9, roiGrade: "A" },
  { academyId: "ac-37", annualCost: 7_200_000, athletesDeveloped: 90, stateSelections: 22, nationalSelections: 6, roiGrade: "A" },
  { academyId: "ac-14", annualCost: 8_600_000, athletesDeveloped: 134, stateSelections: 28, nationalSelections: 5, roiGrade: "A" },
  // ---- Solid (B) -----------------------------------------------------------
  { academyId: "ac-04", annualCost: 21_000_000, athletesDeveloped: 290, stateSelections: 41, nationalSelections: 8, roiGrade: "B" },
  { academyId: "ac-01", annualCost: 16_500_000, athletesDeveloped: 184, stateSelections: 26, nationalSelections: 5, roiGrade: "B" },
  { academyId: "ac-27", annualCost: 18_400_000, athletesDeveloped: 212, stateSelections: 24, nationalSelections: 4, roiGrade: "B" },
  // ---- Average (C) ---------------------------------------------------------
  { academyId: "ac-18", annualCost: 12_800_000, athletesDeveloped: 152, stateSelections: 15, nationalSelections: 2, roiGrade: "C" },
  { academyId: "ac-31", annualCost: 9_400_000, athletesDeveloped: 108, stateSelections: 11, nationalSelections: 2, roiGrade: "C" },
  { academyId: "ac-06", annualCost: 14_200_000, athletesDeveloped: 204, stateSelections: 16, nationalSelections: 1, roiGrade: "C" },
  // ---- Weak (D): cost rising faster than output ---------------------------
  { academyId: "ac-08", annualCost: 11_600_000, athletesDeveloped: 96, stateSelections: 6, nationalSelections: 0, roiGrade: "D" },
  { academyId: "ac-29", annualCost: 13_500_000, athletesDeveloped: 94, stateSelections: 5, nationalSelections: 0, roiGrade: "D" },
  // ---- Over-funded under-performers (E) -----------------------------------
  { academyId: "ac-05", annualCost: 24_500_000, athletesDeveloped: 138, stateSelections: 4, nationalSelections: 0, roiGrade: "E" },
  { academyId: "ac-16", annualCost: 15_800_000, athletesDeveloped: 88, stateSelections: 3, nationalSelections: 0, roiGrade: "E" },
  { academyId: "ac-34", annualCost: 14_900_000, athletesDeveloped: 80, stateSelections: 2, nationalSelections: 0, roiGrade: "E" },
];

export const ROI_ROWS: ROIRow[] = RAW_ROI.map((r, i) => {
  const academy = ACADEMY_BY_ID[r.academyId];
  return {
    id: `roi-${String(i + 1).padStart(2, "0")}`,
    academyId: r.academyId,
    academyName: academy?.name ?? r.academyId,
    district: academy?.district ?? "",
    annualCost: r.annualCost,
    athletesDeveloped: r.athletesDeveloped,
    stateSelections: r.stateSelections,
    nationalSelections: r.nationalSelections,
    costPerAthlete: Math.round(r.annualCost / r.athletesDeveloped),
    roiGrade: r.roiGrade,
  };
});

// ----------------------------------------------------------------------------
// Aggregates
// ----------------------------------------------------------------------------
export const FUNDS_ACTIVE = FUNDING_ROWS.reduce((s, r) => s + r.amountActive, 0);
export const FUNDS_ON_HOLD = FUNDING_ROWS.reduce((s, r) => s + r.amountOnHold, 0);

export const DBT_TOTAL_DISBURSED = DBT_TRANSACTIONS.filter(
  (t) => t.status === "paid",
).reduce((s, t) => s + t.amount, 0);
export const DBT_PAID_COUNT = DBT_TRANSACTIONS.filter(
  (t) => t.status === "paid",
).length;
export const DBT_IN_TRANSIT_COUNT = DBT_TRANSACTIONS.filter(
  (t) => t.status === "in-transit",
).length;
export const DBT_FAILED_COUNT = DBT_TRANSACTIONS.filter(
  (t) => t.status === "failed",
).length;
