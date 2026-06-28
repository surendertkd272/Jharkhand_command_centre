import type { Alert, Pillar } from "@/lib/types";
import { ACADEMY_BY_ID } from "@/lib/mock/academies";

// ============================================================================
// Cross-pillar alert feed. Every alert resolves to a real academy in
// ACADEMIES so the dashboard, pillar screens and alert rows stay referential.
// Anchored to DEMO_NOW = 2026-06-28T09:15 IST; createdAt timestamps fall
// within the last ~5 days, several within the last few hours.
//
// Includes the four hero demo beats:
//  (a) flagged dual-registration — integrity (ac-15 / ac-25 districts)
//  (b) Dhanbad ac-05 funding paused — finance
//  (c) Saraikela ac-16 mess billing variance — resources
//  (d) Chandan Pandey (at-22 / ac-34) injury override blocked — welfare
// ============================================================================

interface RawAlert {
  id: string;
  pillar: Pillar;
  severity: Alert["severity"];
  title: string;
  description: string;
  academyId: string;
  status: Alert["status"];
  createdAt: string;
  assignedTo?: string;
}

// District helper from the academy backbone (keeps academyName/district synced).
function resolve(r: RawAlert): Alert {
  const a = ACADEMY_BY_ID[r.academyId];
  return {
    id: r.id,
    pillar: r.pillar,
    severity: r.severity,
    title: r.title,
    description: r.description,
    academyId: r.academyId,
    academyName: a?.name ?? "Unknown Academy",
    district: a?.district ?? "Unknown",
    status: r.status,
    createdAt: r.createdAt,
    assignedTo: r.assignedTo,
  };
}

const RAW: RawAlert[] = [
  // --- HERO BEAT (a): dual-registration flag — integrity, unresolved critical
  {
    id: "al-01",
    pillar: "integrity",
    severity: "critical",
    title: "Dual registration — same biometric in two districts",
    description:
      "Face match (97.4%) links athlete Rohit Kumar to live trials in both West Singhbhum and Sahibganj; both registrations frozen pending review.",
    academyId: "ac-15",
    status: "escalated",
    createdAt: "2026-06-28T07:40:00+05:30",
    assignedTo: "Identity Cell — R. Mahato",
  },

  // --- HERO BEAT (b): Dhanbad ac-05 funding paused — finance, unresolved critical
  {
    id: "al-02",
    pillar: "finance",
    severity: "critical",
    title: "Funding auto-paused — biometric attendance below threshold",
    description:
      "Dhanbad Coalfields Academy held at Rs 1.42 Cr on hold after biometric attendance dropped to 48% against the 60% release threshold.",
    academyId: "ac-05",
    status: "open",
    createdAt: "2026-06-28T06:25:00+05:30",
  },

  // --- HERO BEAT (c): Saraikela ac-16 mess billing variance — resources, unresolved high
  {
    id: "al-03",
    pillar: "resources",
    severity: "high",
    title: "Mess billing variance flagged",
    description:
      "Saraikela Wrestling Academy billed Rs 3.20 L above verified biometric meal check-ins this cycle — nutrition leakage under review.",
    academyId: "ac-16",
    status: "open",
    createdAt: "2026-06-28T08:10:00+05:30",
    assignedTo: "Audit Desk — S. Tudu",
  },

  // --- HERO BEAT (d): Chandan Pandey at-22 / ac-34 injury override blocked — welfare, unresolved critical
  {
    id: "al-04",
    pillar: "welfare",
    severity: "critical",
    title: "Injury re-activation blocked — no state medical clearance",
    description:
      "Coach attempted to re-activate Chandan Pandey (ACL grade II) for district trials; override blocked pending independent state medical sign-off.",
    academyId: "ac-34",
    status: "escalated",
    createdAt: "2026-06-28T05:50:00+05:30",
    assignedTo: "State Medical Board — Dr. P. Kujur",
  },

  // --- Infra SLA breach — resources, unresolved high
  {
    id: "al-05",
    pillar: "resources",
    severity: "high",
    title: "Infrastructure SLA breached — synthetic track",
    description:
      "Floodlight and drainage repair ticket at Hazaribagh Athletics Academy is 31 hours past its 72-hour SLA window with no field visit logged.",
    academyId: "ac-07",
    status: "open",
    createdAt: "2026-06-28T08:45:00+05:30",
    assignedTo: "PWD Liaison — D. Oraon",
  },

  // --- Phantom inventory flag ac-29 — resources, unresolved high
  {
    id: "al-06",
    pillar: "resources",
    severity: "high",
    title: "Phantom inventory flag — kit never received",
    description:
      "Rs 1.80 L of dispatched equipment at Bokaro Aquatics & Athletics Academy shows zero biometric receipts from athletes — suspected phantom stock.",
    academyId: "ac-29",
    status: "open",
    createdAt: "2026-06-27T18:20:00+05:30",
  },

  // --- Failed DBT transfer — finance, unresolved high
  {
    id: "al-07",
    pillar: "finance",
    severity: "high",
    title: "DBT stipend transfer failed — account frozen",
    description:
      "Direct benefit transfer to an athlete at Latehar Forest Sports Centre bounced (beneficiary account frozen); stipend re-queued for the next cycle.",
    academyId: "ac-20",
    status: "open",
    createdAt: "2026-06-28T07:05:00+05:30",
  },

  // --- Kit reconciliation variance — resources, escalated high
  {
    id: "al-08",
    pillar: "resources",
    severity: "high",
    title: "Kit reconciliation variance — pilferage suspected",
    description:
      "Deoghar Wrestling Centre received 40 fewer mats and shoes than dispatched; consignment variance escalated to the district sports officer.",
    academyId: "ac-08",
    status: "escalated",
    createdAt: "2026-06-27T14:35:00+05:30",
    assignedTo: "DSO Deoghar — S. Yadav",
  },

  // --- Compliance breach / funding at risk — academies, open medium
  {
    id: "al-09",
    pillar: "academies",
    severity: "medium",
    title: "Compliance below release threshold",
    description:
      "Palamu Wrestling Academy compliance sits at 55% with biometric attendance at 51%, putting the next funding tranche at risk of an auto-hold.",
    academyId: "ac-34",
    status: "acknowledged",
    createdAt: "2026-06-27T11:10:00+05:30",
    assignedTo: "Zonal Director — V. Singh",
  },

  // --- Debias evaluator deviation — integrity, acknowledged medium
  {
    id: "al-10",
    pillar: "integrity",
    severity: "medium",
    title: "Evaluator scoring deviation flagged",
    description:
      "Subjective trial scores at West Singhbhum Athletics PEC run 18 points above objective baselines for one evaluator — debias review triggered.",
    academyId: "ac-15",
    status: "acknowledged",
    createdAt: "2026-06-27T09:30:00+05:30",
  },

  // --- At-risk athlete attendance — welfare, acknowledged high
  {
    id: "al-11",
    pillar: "welfare",
    severity: "high",
    title: "Athlete attendance falling — dropout risk",
    description:
      "Three athletes at Saraikela Wrestling Academy have missed over 10 sessions this month with a falling trend; welfare outreach assigned.",
    academyId: "ac-16",
    status: "acknowledged",
    createdAt: "2026-06-26T16:45:00+05:30",
    assignedTo: "Welfare Officer — M. Hansda",
  },

  // --- DBT in-transit delay — finance, acknowledged medium
  {
    id: "al-12",
    pillar: "finance",
    severity: "medium",
    title: "Stipend batch stuck in transit",
    description:
      "A batch of 14 stipend transfers at Giridih Football PEC has been in-transit for over 48 hours pending bank settlement confirmation.",
    academyId: "ac-09",
    status: "acknowledged",
    createdAt: "2026-06-26T10:15:00+05:30",
  },

  // --- Identity document pending — integrity, open medium
  {
    id: "al-13",
    pillar: "integrity",
    severity: "medium",
    title: "Residency proof unverified at intake",
    description:
      "Eleven new intake athletes at Chatra Rural Athletics Academy still have unsealed DigiLocker residency documents past the 7-day window.",
    academyId: "ac-19",
    status: "open",
    createdAt: "2026-06-25T13:20:00+05:30",
  },

  // --- Nutrition check-in low — resources, escalated medium
  {
    id: "al-14",
    pillar: "resources",
    severity: "medium",
    title: "Nutrition check-ins below capacity",
    description:
      "Verified biometric meal check-ins at Bokaro Steel City PEC averaged 61% of billed plates over the last 7 days — billing audit escalated.",
    academyId: "ac-06",
    status: "escalated",
    createdAt: "2026-06-25T08:05:00+05:30",
    assignedTo: "Audit Desk — S. Tudu",
  },

  // --- Resolved: dual-registration cleared — integrity, resolved low
  {
    id: "al-15",
    pillar: "integrity",
    severity: "low",
    title: "Identity match resolved — false positive",
    description:
      "A face-match alert at Khunti Archery Excellence Centre was reviewed and cleared as twins with separate biometrics; registration unfrozen.",
    academyId: "ac-12",
    status: "resolved",
    createdAt: "2026-06-24T15:40:00+05:30",
    assignedTo: "Identity Cell — D. Munda",
  },

  // --- Resolved: SLA closed — resources, resolved medium
  {
    id: "al-16",
    pillar: "resources",
    severity: "medium",
    title: "Equipment SLA resolved within window",
    description:
      "Archery target replacement at Simdega Hockey Nursery was delivered and biometrically receipted 9 hours inside the SLA window.",
    academyId: "ac-14",
    status: "resolved",
    createdAt: "2026-06-24T11:25:00+05:30",
  },

  // --- Resolved: funding restored — finance, resolved low
  {
    id: "al-17",
    pillar: "finance",
    severity: "low",
    title: "Funding hold lifted after compliance recovery",
    description:
      "Garhwa Athletics Nursery cleared the 60% biometric attendance threshold for two cycles; the prior funding hold was released.",
    academyId: "ac-22",
    status: "resolved",
    createdAt: "2026-06-23T17:10:00+05:30",
    assignedTo: "Finance Cell — I. Hussain",
  },
];

// Newest-first by createdAt.
export const ALERTS: Alert[] = RAW.map(resolve).sort(
  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
);

// ---- Helpers / aggregates --------------------------------------------------
export function unresolvedAlerts(): Alert[] {
  return ALERTS.filter((a) => a.status !== "resolved");
}

export function alertsByPillar(p: Pillar): Alert[] {
  return ALERTS.filter((a) => a.pillar === p);
}

export const OPEN_ALERTS_COUNT = unresolvedAlerts().length;

export const ESCALATED_COUNT = ALERTS.filter(
  (a) => a.status === "escalated",
).length;
