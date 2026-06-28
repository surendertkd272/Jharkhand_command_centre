import type { KitReconRow, NutritionRow, SLATicket } from "@/lib/types";

// ============================================================================
// Resources pillar mock — kit reconciliation, mess/nutrition billing, and the
// facility SLA ticket board. Pure data + derived aggregates (NO "use client").
//
// Referential: every academyId/academyName below resolves to a row in
// @/lib/mock/academies (ac-01 .. ac-40). All money is Rs.
//
// Hero beats surfaced here:
//   (c) ac-16 Saraikela Wrestling Academy — mess billing variance ~Rs 3.2 L
//       (plates billed >> biometric meal check-ins).
//   ac-29 Bokaro Aquatics & Athletics — phantom-inventory kit gap ~Rs 1.8 L.
// ============================================================================

// ----------------------------------------------------------------------------
// Kit reconciliation — dispatched -> received at academy -> biometric receipt
// by the athlete. Gaps between received and biometric receipt are the
// phantom-inventory signal. unitValue is Rs per unit.
// ----------------------------------------------------------------------------
export const KIT_RECON: KitReconRow[] = [
  {
    id: "kit-01",
    item: "Archery Recurve Bow",
    academyId: "ac-01",
    academyName: "Ranchi State Archery Academy",
    dispatched: 60,
    receivedAtAcademy: 60,
    biometricReceipt: 59,
    unitValue: 18500,
  },
  {
    id: "kit-02",
    item: "Hockey Stick",
    academyId: "ac-03",
    academyName: "Jamshedpur Hockey Centre",
    dispatched: 120,
    receivedAtAcademy: 118,
    biometricReceipt: 116,
    unitValue: 2400,
  },
  {
    id: "kit-03",
    item: "Wrestling Mat",
    academyId: "ac-05",
    academyName: "Dhanbad Coalfields Academy",
    dispatched: 14,
    receivedAtAcademy: 10,
    biometricReceipt: 8,
    unitValue: 42000,
  },
  {
    id: "kit-04",
    item: "Weightlifting Belt",
    academyId: "ac-08",
    academyName: "Deoghar Wrestling Centre",
    dispatched: 90,
    receivedAtAcademy: 78,
    biometricReceipt: 61,
    unitValue: 3200,
  },
  {
    id: "kit-05",
    item: "Running Spikes",
    academyId: "ac-04",
    academyName: "Tata Steel Sports PEC",
    dispatched: 180,
    receivedAtAcademy: 180,
    biometricReceipt: 178,
    unitValue: 5600,
  },
  {
    id: "kit-06",
    item: "Football Boots",
    academyId: "ac-09",
    academyName: "Giridih Football PEC",
    dispatched: 150,
    receivedAtAcademy: 144,
    biometricReceipt: 132,
    unitValue: 4100,
  },
  {
    id: "kit-07",
    item: "Boxing Gloves",
    academyId: "ac-17",
    academyName: "Koderma Boxing Centre",
    dispatched: 70,
    receivedAtAcademy: 66,
    biometricReceipt: 60,
    unitValue: 3800,
  },
  {
    id: "kit-08",
    item: "Track Suit",
    academyId: "ac-29",
    academyName: "Bokaro Aquatics & Athletics Academy",
    dispatched: 94,
    receivedAtAcademy: 70,
    biometricReceipt: 49,
    unitValue: 4000,
  },
  {
    id: "kit-09",
    item: "Archery Recurve Bow",
    academyId: "ac-12",
    academyName: "Khunti Archery Excellence Centre",
    dispatched: 40,
    receivedAtAcademy: 40,
    biometricReceipt: 40,
    unitValue: 18500,
  },
  {
    id: "kit-10",
    item: "Wrestling Mat",
    academyId: "ac-16",
    academyName: "Saraikela Wrestling Academy",
    dispatched: 12,
    receivedAtAcademy: 9,
    biometricReceipt: 7,
    unitValue: 42000,
  },
  {
    id: "kit-11",
    item: "Track Suit",
    academyId: "ac-15",
    academyName: "West Singhbhum Athletics PEC",
    dispatched: 119,
    receivedAtAcademy: 108,
    biometricReceipt: 96,
    unitValue: 4000,
  },
  {
    id: "kit-12",
    item: "Hockey Stick",
    academyId: "ac-14",
    academyName: "Simdega Hockey Nursery",
    dispatched: 100,
    receivedAtAcademy: 100,
    biometricReceipt: 99,
    unitValue: 2400,
  },
  {
    id: "kit-13",
    item: "Football Boots",
    academyId: "ac-34",
    academyName: "Palamu Wrestling Academy",
    dispatched: 60,
    receivedAtAcademy: 52,
    biometricReceipt: 41,
    unitValue: 4100,
  },
];

// ----------------------------------------------------------------------------
// Nutrition / mess billing — vendor-billed plates vs biometric meal check-ins.
// dailyCheckIns is a 7-day strip (0–100 of capacity) for the heat row.
//   HERO BEAT (c): ac-16 Saraikela — billed >> verified, leakage ~Rs 3.2 L.
// ----------------------------------------------------------------------------
export const NUTRITION: NutritionRow[] = [
  {
    id: "nut-01",
    academyId: "ac-01",
    academyName: "Ranchi State Archery Academy",
    platesBilled: 5520,
    verifiedCheckIns: 5410,
    ratePerPlate: 62,
    dailyCheckIns: [96, 94, 97, 92, 95, 88, 90],
  },
  {
    id: "nut-02",
    academyId: "ac-04",
    academyName: "Tata Steel Sports PEC",
    platesBilled: 8700,
    verifiedCheckIns: 8612,
    ratePerPlate: 70,
    dailyCheckIns: [98, 97, 99, 96, 98, 95, 97],
  },
  {
    id: "nut-03",
    academyId: "ac-16",
    academyName: "Saraikela Wrestling Academy",
    platesBilled: 9900,
    verifiedCheckIns: 4080,
    ratePerPlate: 55,
    dailyCheckIns: [44, 38, 52, 41, 36, 30, 47],
  },
  {
    id: "nut-04",
    academyId: "ac-05",
    academyName: "Dhanbad Coalfields Academy",
    platesBilled: 4140,
    verifiedCheckIns: 3210,
    ratePerPlate: 58,
    dailyCheckIns: [62, 58, 71, 55, 49, 44, 60],
  },
  {
    id: "nut-05",
    academyId: "ac-12",
    academyName: "Khunti Archery Excellence Centre",
    platesBilled: 4260,
    verifiedCheckIns: 4220,
    ratePerPlate: 60,
    dailyCheckIns: [99, 98, 97, 99, 96, 94, 95],
  },
  {
    id: "nut-06",
    academyId: "ac-08",
    academyName: "Deoghar Wrestling Centre",
    platesBilled: 2880,
    verifiedCheckIns: 2190,
    ratePerPlate: 52,
    dailyCheckIns: [70, 64, 58, 61, 55, 48, 66],
  },
  {
    id: "nut-07",
    academyId: "ac-27",
    academyName: "Ranchi Elite Football PEC",
    platesBilled: 6360,
    verifiedCheckIns: 6280,
    ratePerPlate: 65,
    dailyCheckIns: [97, 95, 98, 96, 94, 91, 93],
  },
  {
    id: "nut-08",
    academyId: "ac-18",
    academyName: "Ramgarh Combat Sports PEC",
    platesBilled: 4560,
    verifiedCheckIns: 4470,
    ratePerPlate: 50,
    dailyCheckIns: [95, 93, 96, 92, 94, 90, 89],
  },
  {
    id: "nut-09",
    academyId: "ac-29",
    academyName: "Bokaro Aquatics & Athletics Academy",
    platesBilled: 2820,
    verifiedCheckIns: 2640,
    ratePerPlate: 48,
    dailyCheckIns: [92, 89, 94, 87, 90, 84, 88],
  },
  {
    id: "nut-10",
    academyId: "ac-33",
    academyName: "Deoghar Athletics PEC",
    platesBilled: 4320,
    verifiedCheckIns: 4255,
    ratePerPlate: 54,
    dailyCheckIns: [96, 95, 97, 94, 93, 91, 92],
  },
];

// ----------------------------------------------------------------------------
// Facility SLA ticket board — maintenance issues against the SLA clock.
// hoursRemaining < 0 => breached. Dates are within ~30 days of DEMO_NOW
// (2026-06-28). ~4 open, ~4 in-progress, ~3 escalated, ~3 resolved.
// ----------------------------------------------------------------------------
export const SLA_TICKETS: SLATicket[] = [
  // --- open ---
  {
    id: "sla-01",
    academyId: "ac-01",
    academyName: "Ranchi State Archery Academy",
    issue: "Broken archery target butts",
    category: "Equipment",
    raisedAt: "2026-06-27T08:20:00+05:30",
    slaHours: 72,
    hoursRemaining: 47,
    status: "open",
    assignedTo: "Facility Cell — Ranchi",
  },
  {
    id: "sla-02",
    academyId: "ac-06",
    academyName: "Bokaro Steel City PEC",
    issue: "Hostel water heater fault",
    category: "Plumbing",
    raisedAt: "2026-06-26T17:40:00+05:30",
    slaHours: 96,
    hoursRemaining: 56,
    status: "open",
    assignedTo: "Vendor — Aqua Heat Services",
  },
  {
    id: "sla-03",
    academyId: "ac-13",
    academyName: "Gumla Hockey Academy",
    issue: "Gym AC compressor down",
    category: "Electrical",
    raisedAt: "2026-06-27T11:05:00+05:30",
    slaHours: 48,
    hoursRemaining: 26,
    status: "open",
    assignedTo: "Vendor — CoolTech Jharkhand",
  },
  {
    id: "sla-04",
    academyId: "ac-24",
    academyName: "Godda Football Academy",
    issue: "Damaged goalpost netting - practice ground",
    category: "Equipment",
    raisedAt: "2026-06-26T09:30:00+05:30",
    slaHours: 72,
    hoursRemaining: 31,
    status: "open",
    assignedTo: "Facility Cell — Santal Pargana",
  },
  // --- in-progress ---
  {
    id: "sla-05",
    academyId: "ac-03",
    academyName: "Jamshedpur Hockey Centre",
    issue: "Cracked synthetic track lane 3",
    category: "Surface",
    raisedAt: "2026-06-23T14:10:00+05:30",
    slaHours: 96,
    hoursRemaining: 18,
    status: "in-progress",
    assignedTo: "Vendor — TurfPro Infra",
  },
  {
    id: "sla-06",
    academyId: "ac-04",
    academyName: "Tata Steel Sports PEC",
    issue: "Floodlight failure - main ground",
    category: "Electrical",
    raisedAt: "2026-06-25T19:50:00+05:30",
    slaHours: 72,
    hoursRemaining: 14,
    status: "in-progress",
    assignedTo: "Vendor — Lumen Sports Lighting",
  },
  {
    id: "sla-07",
    academyId: "ac-30",
    academyName: "Dhanbad Wrestling Excellence Centre",
    issue: "Mat room dehumidifier malfunction",
    category: "Electrical",
    raisedAt: "2026-06-24T10:25:00+05:30",
    slaHours: 96,
    hoursRemaining: 32,
    status: "in-progress",
    assignedTo: "Vendor — CoolTech Jharkhand",
  },
  {
    id: "sla-08",
    academyId: "ac-31",
    academyName: "Hazaribagh Hockey Academy",
    issue: "Drainage blockage - astroturf perimeter",
    category: "Plumbing",
    raisedAt: "2026-06-22T08:00:00+05:30",
    slaHours: 72,
    hoursRemaining: 9,
    status: "in-progress",
    assignedTo: "Facility Cell — Hazaribagh",
  },
  // --- escalated (breached: hoursRemaining < 0) ---
  {
    id: "sla-09",
    academyId: "ac-05",
    academyName: "Dhanbad Coalfields Academy",
    issue: "Floodlight failure - main ground",
    category: "Electrical",
    raisedAt: "2026-06-20T18:30:00+05:30",
    slaHours: 72,
    hoursRemaining: -114,
    status: "escalated",
    assignedTo: "Director (Infra) — escalated",
  },
  {
    id: "sla-10",
    academyId: "ac-16",
    academyName: "Saraikela Wrestling Academy",
    issue: "Hostel water heater fault",
    category: "Plumbing",
    raisedAt: "2026-06-19T07:15:00+05:30",
    slaHours: 96,
    hoursRemaining: -89,
    status: "escalated",
    assignedTo: "Director (Infra) — escalated",
  },
  {
    id: "sla-11",
    academyId: "ac-08",
    academyName: "Deoghar Wrestling Centre",
    issue: "Cracked synthetic track lane 3",
    category: "Surface",
    raisedAt: "2026-06-15T12:40:00+05:30",
    slaHours: 72,
    hoursRemaining: -222,
    status: "escalated",
    assignedTo: "Director (Infra) — escalated",
  },
  // --- resolved ---
  {
    id: "sla-12",
    academyId: "ac-12",
    academyName: "Khunti Archery Excellence Centre",
    issue: "Broken archery target butts",
    category: "Equipment",
    raisedAt: "2026-06-10T09:00:00+05:30",
    slaHours: 72,
    hoursRemaining: 0,
    status: "resolved",
    assignedTo: "Facility Cell — Khunti",
  },
  {
    id: "sla-13",
    academyId: "ac-27",
    academyName: "Ranchi Elite Football PEC",
    issue: "Floodlight failure - main ground",
    category: "Electrical",
    raisedAt: "2026-06-12T20:10:00+05:30",
    slaHours: 72,
    hoursRemaining: 0,
    status: "resolved",
    assignedTo: "Vendor — Lumen Sports Lighting",
  },
  {
    id: "sla-14",
    academyId: "ac-14",
    academyName: "Simdega Hockey Nursery",
    issue: "Gym AC compressor down",
    category: "Electrical",
    raisedAt: "2026-06-08T13:25:00+05:30",
    slaHours: 96,
    hoursRemaining: 0,
    status: "resolved",
    assignedTo: "Vendor — CoolTech Jharkhand",
  },
];

// ----------------------------------------------------------------------------
// Derived aggregates
// ----------------------------------------------------------------------------

/** A kit row is materially flagged when biometric receipt trails dispatch by
 *  >5% of the dispatched quantity — the phantom-inventory signal. */
function isKitFlagged(row: KitReconRow): boolean {
  const gap = row.dispatched - row.biometricReceipt;
  return gap > Math.max(2, row.dispatched * 0.05);
}

/** A nutrition row leaks materially when verified check-ins trail billed
 *  plates by >5% of billed. */
function isNutritionFlagged(row: NutritionRow): boolean {
  const gap = row.platesBilled - row.verifiedCheckIns;
  return gap > row.platesBilled * 0.05;
}

/** Total units dispatched across all tracked kit. */
export const ITEMS_TRACKED: number = KIT_RECON.reduce(
  (sum, r) => sum + r.dispatched,
  0,
);

/** Rs value of the dispatched-vs-biometric gap over materially flagged rows. */
export const KIT_VARIANCE_VALUE: number = KIT_RECON.filter(isKitFlagged).reduce(
  (sum, r) => sum + (r.dispatched - r.biometricReceipt) * r.unitValue,
  0,
);

/** Count of kit rows showing a material pilferage / phantom-inventory gap. */
export const PILFERAGE_FLAGS: number = KIT_RECON.filter(isKitFlagged).length;

/** Rs value of mess billing leakage (billed minus biometric-verified plates)
 *  over materially flagged academies. */
export const NUTRITION_LEAKAGE: number = NUTRITION.filter(
  isNutritionFlagged,
).reduce((sum, r) => sum + (r.platesBilled - r.verifiedCheckIns) * r.ratePerPlate, 0);

/** Mean resolution window of resolved tickets, in hours (rounded). */
export const SLA_AVG_RESOLUTION_HOURS: number = (() => {
  const resolved = SLA_TICKETS.filter((t) => t.status === "resolved");
  if (resolved.length === 0) return 0;
  // Modeled resolution time = SLA window minus a small early-finish buffer.
  const buffers: Record<string, number> = {
    "sla-12": 14,
    "sla-13": 9,
    "sla-14": 22,
  };
  const total = resolved.reduce(
    (sum, t) => sum + (t.slaHours - (buffers[t.id] ?? 12)),
    0,
  );
  return Math.round(total / resolved.length);
})();

/** Count of tickets past their SLA window (breached). */
export const SLA_BREACHES: number = SLA_TICKETS.filter(
  (t) => t.hoursRemaining < 0,
).length;
