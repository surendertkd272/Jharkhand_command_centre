import type {
  Athlete,
  AttendancePoint,
  IdentityStatus,
  InjuryRecord,
  Sport,
  StipendRecord,
} from "@/lib/types";
import { ACADEMY_BY_ID } from "@/lib/mock/academies";
import { clamp } from "@/lib/utils";

// ============================================================================
// 36 athletes. Each resolves to a real academyId. Nested attendance / stipend
// data is generated deterministically (no randomness) so the demo is stable.
// Embeds the hero demo beats: forged identity flags, a blocked coach
// injury-override, and at-risk attrition cases.
// ============================================================================

function attend(
  base: number,
  trend: "stable" | "falling" | "rising",
  seed: number,
): AttendancePoint[] {
  const pts: AttendancePoint[] = [];
  for (let w = 1; w <= 8; w++) {
    let v = base;
    if (trend === "falling") v = base + (8 - w) * 2.4;
    else if (trend === "rising") v = base - (8 - w) * 1.8;
    const wob = ((seed * 7 + w * 13) % 9) - 4;
    pts.push({ label: `W${w}`, value: clamp(Math.round(v + wob), 28, 99) });
  }
  return pts;
}

const SCHEMES = [
  "Khelo India Scholarship",
  "Mukhyamantri Pratibha Grant",
  "SAI Fellowship",
  "State Stipend Scheme",
];

function stipends(
  idBase: string,
  amount: number,
  months: { m: string; status: StipendRecord["status"] }[],
  scheme = SCHEMES[0],
): StipendRecord[] {
  return months.map((mm, i) => ({
    id: `${idBase}-st-${i + 1}`,
    scheme,
    amount,
    date: mm.m,
    status: mm.status,
  }));
}

const PAID3 = [
  { m: "2026-04-01", status: "paid" as const },
  { m: "2026-05-01", status: "paid" as const },
  { m: "2026-06-01", status: "paid" as const },
];

interface RawAthlete {
  id: string;
  name: string;
  age: number;
  ageVerified: boolean;
  gender: "M" | "F";
  sport: Sport;
  academyId: string;
  identityStatus: IdentityStatus;
  status: "active" | "at-risk" | "exited" | "injured";
  attBase: number;
  attTrend: "stable" | "falling" | "rising";
  baselineScore: number;
  trialScore: number;
  stipendAmount: number;
  stipendStatuses?: { m: string; status: StipendRecord["status"] }[];
  scheme?: string;
  injuries?: InjuryRecord[];
}

const RAW: RawAthlete[] = [
  { id: "at-01", name: "Deepika Kumari Munda", age: 19, ageVerified: true, gender: "F", sport: "Archery", academyId: "ac-12", identityStatus: "verified", status: "active", attBase: 94, attTrend: "stable", baselineScore: 92, trialScore: 90, stipendAmount: 12500 },
  { id: "at-02", name: "Arjun Mahato", age: 17, ageVerified: true, gender: "M", sport: "Hockey", academyId: "ac-02", identityStatus: "verified", status: "active", attBase: 88, attTrend: "stable", baselineScore: 84, trialScore: 86, stipendAmount: 10000 },
  { id: "at-03", name: "Salima Tete Kispotta", age: 18, ageVerified: true, gender: "F", sport: "Hockey", academyId: "ac-14", identityStatus: "verified", status: "active", attBase: 91, attTrend: "rising", baselineScore: 88, trialScore: 89, stipendAmount: 11000 },
  { id: "at-04", name: "Rohit Oraon", age: 16, ageVerified: false, gender: "M", sport: "Football", academyId: "ac-09", identityStatus: "flagged", status: "active", attBase: 79, attTrend: "stable", baselineScore: 71, trialScore: 88, stipendAmount: 8000 },
  { id: "at-05", name: "Priya Soren", age: 20, ageVerified: true, gender: "F", sport: "Athletics", academyId: "ac-04", identityStatus: "verified", status: "active", attBase: 90, attTrend: "stable", baselineScore: 86, trialScore: 85, stipendAmount: 12000 },
  { id: "at-06", name: "Vikram Singh Munda", age: 18, ageVerified: true, gender: "M", sport: "Wrestling", academyId: "ac-30", identityStatus: "verified", status: "active", attBase: 85, attTrend: "stable", baselineScore: 80, trialScore: 82, stipendAmount: 10500 },
  { id: "at-07", name: "Sunita Kumari", age: 17, ageVerified: true, gender: "F", sport: "Archery", academyId: "ac-37", identityStatus: "verified", status: "active", attBase: 92, attTrend: "stable", baselineScore: 89, trialScore: 91, stipendAmount: 11500 },
  { id: "at-08", name: "Manish Gope", age: 19, ageVerified: true, gender: "M", sport: "Weightlifting", academyId: "ac-05", identityStatus: "verified", status: "at-risk", attBase: 52, attTrend: "falling", baselineScore: 74, trialScore: 70, stipendAmount: 9000, stipendStatuses: [{ m: "2026-04-01", status: "paid" }, { m: "2026-05-01", status: "failed" }, { m: "2026-06-01", status: "in-transit" }] },
  { id: "at-09", name: "Anjali Ekka", age: 18, ageVerified: true, gender: "F", sport: "Athletics", academyId: "ac-35", identityStatus: "verified", status: "active", attBase: 87, attTrend: "stable", baselineScore: 83, trialScore: 84, stipendAmount: 10000 },
  { id: "at-10", name: "Suresh Yadav Jr.", age: 16, ageVerified: false, gender: "M", sport: "Wrestling", academyId: "ac-08", identityStatus: "flagged", status: "active", attBase: 74, attTrend: "stable", baselineScore: 66, trialScore: 87, stipendAmount: 8000 },
  { id: "at-11", name: "Mary Hansda", age: 19, ageVerified: true, gender: "F", sport: "Archery", academyId: "ac-11", identityStatus: "verified", status: "active", attBase: 89, attTrend: "stable", baselineScore: 85, trialScore: 86, stipendAmount: 11000 },
  { id: "at-12", name: "Rakesh Tirkey Jr.", age: 17, ageVerified: true, gender: "M", sport: "Football", academyId: "ac-27", identityStatus: "verified", status: "active", attBase: 86, attTrend: "stable", baselineScore: 82, trialScore: 83, stipendAmount: 10000 },
  { id: "at-13", name: "Pooja Kumari", age: 18, ageVerified: true, gender: "F", sport: "Boxing", academyId: "ac-18", identityStatus: "verified", status: "injured", attBase: 70, attTrend: "falling", baselineScore: 81, trialScore: 80, stipendAmount: 10500, injuries: [{ id: "at-13-inj-1", injury: "Shoulder dislocation (left)", reportedBy: "Academy Physio", date: "2026-05-22", clearance: "pending", note: "Awaiting state medical board review" }] },
  { id: "at-14", name: "Imran Ansari", age: 19, ageVerified: true, gender: "M", sport: "Boxing", academyId: "ac-17", identityStatus: "verified", status: "active", attBase: 84, attTrend: "stable", baselineScore: 79, trialScore: 80, stipendAmount: 9500 },
  { id: "at-15", name: "Lalita Hembrom", age: 17, ageVerified: true, gender: "F", sport: "Archery", academyId: "ac-26", identityStatus: "pending", status: "active", attBase: 83, attTrend: "stable", baselineScore: 78, trialScore: 79, stipendAmount: 9000 },
  { id: "at-16", name: "Naveen Mahto", age: 20, ageVerified: true, gender: "M", sport: "Weightlifting", academyId: "ac-16", identityStatus: "verified", status: "active", attBase: 76, attTrend: "stable", baselineScore: 77, trialScore: 75, stipendAmount: 10000 },
  { id: "at-17", name: "Sushila Purty", age: 18, ageVerified: true, gender: "F", sport: "Archery", academyId: "ac-37", identityStatus: "verified", status: "active", attBase: 93, attTrend: "rising", baselineScore: 90, trialScore: 92, stipendAmount: 12000 },
  { id: "at-18", name: "Albert Lakra Jr.", age: 16, ageVerified: true, gender: "M", sport: "Football", academyId: "ac-09", identityStatus: "verified", status: "at-risk", attBase: 49, attTrend: "falling", baselineScore: 72, trialScore: 70, stipendAmount: 8000, stipendStatuses: [{ m: "2026-04-01", status: "paid" }, { m: "2026-05-01", status: "paid" }, { m: "2026-06-01", status: "in-transit" }] },
  { id: "at-19", name: "Reena Tudu", age: 19, ageVerified: true, gender: "F", sport: "Archery", academyId: "ac-28", identityStatus: "verified", status: "active", attBase: 88, attTrend: "stable", baselineScore: 84, trialScore: 85, stipendAmount: 11000 },
  { id: "at-20", name: "Balwant Singh Jr.", age: 18, ageVerified: true, gender: "M", sport: "Wrestling", academyId: "ac-30", identityStatus: "verified", status: "active", attBase: 82, attTrend: "stable", baselineScore: 80, trialScore: 81, stipendAmount: 10000 },
  { id: "at-21", name: "Phulmani Hansda", age: 17, ageVerified: true, gender: "F", sport: "Athletics", academyId: "ac-40", identityStatus: "verified", status: "active", attBase: 80, attTrend: "stable", baselineScore: 76, trialScore: 77, stipendAmount: 9000 },
  { id: "at-22", name: "Chandan Pandey", age: 19, ageVerified: true, gender: "M", sport: "Wrestling", academyId: "ac-34", identityStatus: "verified", status: "injured", attBase: 60, attTrend: "falling", baselineScore: 78, trialScore: 76, stipendAmount: 9500, injuries: [{ id: "at-22-inj-1", injury: "Knee ligament strain (ACL grade II)", reportedBy: "Coach Chandan Pandey", date: "2026-06-10", clearance: "blocked", note: "Coach attempted to re-activate for district trials — OVERRIDE BLOCKED pending independent state medical clearance" }] },
  { id: "at-23", name: "Sabina Murmu", age: 18, ageVerified: true, gender: "F", sport: "Athletics", academyId: "ac-25", identityStatus: "verified", status: "active", attBase: 78, attTrend: "stable", baselineScore: 75, trialScore: 76, stipendAmount: 9000 },
  { id: "at-24", name: "Gautam Bose Jr.", age: 17, ageVerified: true, gender: "M", sport: "Football", academyId: "ac-27", identityStatus: "verified", status: "active", attBase: 85, attTrend: "stable", baselineScore: 81, trialScore: 82, stipendAmount: 10000 },
  { id: "at-25", name: "Nirmala Kachhap", age: 19, ageVerified: true, gender: "F", sport: "Hockey", academyId: "ac-31", identityStatus: "verified", status: "active", attBase: 87, attTrend: "stable", baselineScore: 83, trialScore: 84, stipendAmount: 10500 },
  { id: "at-26", name: "Devendra Oraon Jr.", age: 16, ageVerified: false, gender: "M", sport: "Athletics", academyId: "ac-07", identityStatus: "flagged", status: "active", attBase: 72, attTrend: "stable", baselineScore: 68, trialScore: 86, stipendAmount: 8000 },
  { id: "at-27", name: "Sylvanus Dungdung Jr.", age: 18, ageVerified: true, gender: "M", sport: "Hockey", academyId: "ac-14", identityStatus: "verified", status: "active", attBase: 90, attTrend: "stable", baselineScore: 86, trialScore: 87, stipendAmount: 11000 },
  { id: "at-28", name: "Anita Kumari", age: 17, ageVerified: true, gender: "F", sport: "Kabaddi", academyId: "ac-21", identityStatus: "verified", status: "at-risk", attBase: 54, attTrend: "falling", baselineScore: 73, trialScore: 71, stipendAmount: 8500 },
  { id: "at-29", name: "Mahavir Oraon Jr.", age: 19, ageVerified: true, gender: "M", sport: "Kabaddi", academyId: "ac-21", identityStatus: "verified", status: "active", attBase: 81, attTrend: "stable", baselineScore: 77, trialScore: 78, stipendAmount: 9500 },
  { id: "at-30", name: "Sushma Singh Jr.", age: 18, ageVerified: true, gender: "F", sport: "Athletics", academyId: "ac-33", identityStatus: "verified", status: "active", attBase: 86, attTrend: "stable", baselineScore: 82, trialScore: 83, stipendAmount: 10500 },
  { id: "at-31", name: "Joseph Toppo Jr.", age: 17, ageVerified: true, gender: "M", sport: "Hockey", academyId: "ac-13", identityStatus: "verified", status: "active", attBase: 79, attTrend: "stable", baselineScore: 75, trialScore: 76, stipendAmount: 9000 },
  { id: "at-32", name: "Etwari Devi Jr.", age: 16, ageVerified: true, gender: "F", sport: "Archery", academyId: "ac-20", identityStatus: "pending", status: "at-risk", attBase: 56, attTrend: "falling", baselineScore: 70, trialScore: 69, stipendAmount: 8000 },
  { id: "at-33", name: "Harish Gope", age: 19, ageVerified: true, gender: "M", sport: "Weightlifting", academyId: "ac-29", identityStatus: "verified", status: "active", attBase: 73, attTrend: "stable", baselineScore: 76, trialScore: 74, stipendAmount: 9500 },
  { id: "at-34", name: "Iqbal Hussain Jr.", age: 18, ageVerified: true, gender: "M", sport: "Boxing", academyId: "ac-39", identityStatus: "verified", status: "active", attBase: 84, attTrend: "stable", baselineScore: 80, trialScore: 81, stipendAmount: 10000 },
  { id: "at-35", name: "Birsa Purty", age: 17, ageVerified: true, gender: "M", sport: "Athletics", academyId: "ac-15", identityStatus: "verified", status: "exited", attBase: 40, attTrend: "falling", baselineScore: 72, trialScore: 70, stipendAmount: 8000, stipendStatuses: [{ m: "2026-03-01", status: "paid" }, { m: "2026-04-01", status: "paid" }] },
  { id: "at-36", name: "Kajal Kumari", age: 18, ageVerified: true, gender: "F", sport: "Football", academyId: "ac-06", identityStatus: "verified", status: "active", attBase: 83, attTrend: "stable", baselineScore: 79, trialScore: 80, stipendAmount: 10000 },
];

export const ATHLETES: Athlete[] = RAW.map((r, idx) => {
  const academy = ACADEMY_BY_ID[r.academyId];
  const months = r.stipendStatuses ?? PAID3;
  return {
    id: r.id,
    name: r.name,
    age: r.age,
    ageVerified: r.ageVerified,
    district: academy?.district ?? "",
    districtId: academy?.districtId ?? "",
    sport: r.sport,
    academyId: r.academyId,
    photo: "",
    gender: r.gender,
    identityStatus: r.identityStatus,
    status: r.status,
    attendance: attend(r.attBase, r.attTrend, idx + 1),
    attendanceRate: r.attBase,
    stipendHistory: stipends(r.id, r.stipendAmount, months, r.scheme),
    injuries: r.injuries ?? [],
    trialScore: r.trialScore,
    baselineScore: r.baselineScore,
  };
});

export const ATHLETE_BY_ID: Record<string, Athlete> = Object.fromEntries(
  ATHLETES.map((a) => [a.id, a]),
);

export function getAthlete(id: string): Athlete | undefined {
  return ATHLETE_BY_ID[id];
}

export function athletesByAcademy(academyId: string): Athlete[] {
  return ATHLETES.filter((a) => a.academyId === academyId);
}

// ---- Derived aggregates ----------------------------------------------------
export const TOTAL_ROSTER = ATHLETES.length;
export const AT_RISK_COUNT = ATHLETES.filter((a) => a.status === "at-risk").length;
export const FLAGGED_IDENTITY_COUNT = ATHLETES.filter(
  (a) => a.identityStatus === "flagged",
).length;
