import type { Academy, FundingStatus, Sport } from "@/lib/types";
import { DISTRICT_BY_ID, districtName } from "@/lib/mock/districts";

// ============================================================================
// 40 academies / PECs across Jharkhand. The referential backbone: every
// alert, ticket, transaction, athlete and ROI row resolves to one of these.
// ============================================================================

interface RawAcademy {
  id: string;
  name: string;
  districtId: string;
  type: "Academy" | "PEC";
  sports: Sport[];
  athletesCount: number;
  complianceScore: number;
  leadCoach: string;
  established: number;
  openAlerts: number;
  fundingNote?: string;
  /** Optional explicit funding override (else derived from compliance). */
  funding?: FundingStatus;
}

// Deterministic position jitter around a district centroid (stable per id).
function jitter(id: string, span: number): [number, number] {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  const dx = ((h % 100) / 100 - 0.5) * span;
  const dy = (((h >> 3) % 100) / 100 - 0.5) * span;
  return [dx, dy];
}

function deriveFunding(score: number, override?: FundingStatus): FundingStatus {
  if (override) return override;
  if (score >= 70) return "active";
  if (score >= 60) return "flagged";
  return "paused";
}

const RAW: RawAcademy[] = [
  { id: "ac-01", name: "Ranchi State Archery Academy", districtId: "ranchi", type: "Academy", sports: ["Archery", "Athletics"], athletesCount: 184, complianceScore: 88, leadCoach: "Coach Anil Mahato", established: 2009, openAlerts: 0 },
  { id: "ac-02", name: "Birsa Munda PEC", districtId: "ranchi", type: "PEC", sports: ["Hockey", "Football"], athletesCount: 246, complianceScore: 81, leadCoach: "Coach Rakesh Tirkey", established: 2014, openAlerts: 1 },
  { id: "ac-03", name: "Jamshedpur Hockey Centre", districtId: "east-singhbhum", type: "Academy", sports: ["Hockey"], athletesCount: 162, complianceScore: 76, leadCoach: "Coach Sunita Soren", established: 2011, openAlerts: 1 },
  { id: "ac-04", name: "Tata Steel Sports PEC", districtId: "east-singhbhum", type: "PEC", sports: ["Athletics", "Football", "Wrestling"], athletesCount: 290, complianceScore: 91, leadCoach: "Coach Vikram Singh", established: 2007, openAlerts: 0 },
  { id: "ac-05", name: "Dhanbad Coalfields Academy", districtId: "dhanbad", type: "Academy", sports: ["Weightlifting", "Wrestling"], athletesCount: 138, complianceScore: 58, leadCoach: "Coach Manoj Verma", established: 2013, openAlerts: 3, fundingNote: "Biometric attendance 48% < 60%" },
  { id: "ac-06", name: "Bokaro Steel City PEC", districtId: "bokaro", type: "PEC", sports: ["Football", "Athletics"], athletesCount: 204, complianceScore: 72, leadCoach: "Coach Priya Kujur", established: 2010, openAlerts: 0 },
  { id: "ac-07", name: "Hazaribagh Athletics Academy", districtId: "hazaribagh", type: "Academy", sports: ["Athletics", "Kabaddi"], athletesCount: 121, complianceScore: 64, leadCoach: "Coach Devendra Oraon", established: 2015, openAlerts: 1 },
  { id: "ac-08", name: "Deoghar Wrestling Centre", districtId: "deoghar", type: "Academy", sports: ["Wrestling", "Kabaddi"], athletesCount: 96, complianceScore: 53, leadCoach: "Coach Suresh Yadav", established: 2016, openAlerts: 2, fundingNote: "Kit reconciliation variance flagged" },
  { id: "ac-09", name: "Giridih Football PEC", districtId: "giridih", type: "PEC", sports: ["Football"], athletesCount: 158, complianceScore: 69, leadCoach: "Coach Albert Lakra", established: 2012, openAlerts: 1 },
  { id: "ac-10", name: "Palamu Tribal Sports Academy", districtId: "palamu", type: "Academy", sports: ["Archery", "Athletics"], athletesCount: 110, complianceScore: 67, leadCoach: "Coach Ram Pravesh", established: 2017, openAlerts: 1 },
  { id: "ac-11", name: "Dumka Santal Pargana PEC", districtId: "dumka", type: "PEC", sports: ["Archery", "Hockey"], athletesCount: 176, complianceScore: 74, leadCoach: "Coach Mary Hansda", established: 2011, openAlerts: 0 },
  { id: "ac-12", name: "Khunti Archery Excellence Centre", districtId: "khunti", type: "PEC", sports: ["Archery"], athletesCount: 142, complianceScore: 93, leadCoach: "Coach Deepika Munda", established: 2008, openAlerts: 0 },
  { id: "ac-13", name: "Gumla Hockey Academy", districtId: "gumla", type: "Academy", sports: ["Hockey", "Football"], athletesCount: 128, complianceScore: 71, leadCoach: "Coach Joseph Toppo", established: 2013, openAlerts: 1 },
  { id: "ac-14", name: "Simdega Hockey Nursery", districtId: "simdega", type: "Academy", sports: ["Hockey"], athletesCount: 134, complianceScore: 84, leadCoach: "Coach Sylvanus Dungdung", established: 2010, openAlerts: 0 },
  { id: "ac-15", name: "West Singhbhum Athletics PEC", districtId: "west-singhbhum", type: "PEC", sports: ["Athletics", "Archery"], athletesCount: 119, complianceScore: 61, leadCoach: "Coach Birsa Purty", established: 2015, openAlerts: 2 },
  { id: "ac-16", name: "Saraikela Wrestling Academy", districtId: "saraikela", type: "Academy", sports: ["Wrestling", "Weightlifting"], athletesCount: 88, complianceScore: 56, leadCoach: "Coach Naveen Mahto", established: 2018, openAlerts: 2, fundingNote: "Mess billing variance Rs 3.2 L" },
  { id: "ac-17", name: "Koderma Boxing Centre", districtId: "koderma", type: "Academy", sports: ["Boxing", "Athletics"], athletesCount: 74, complianceScore: 66, leadCoach: "Coach Farhan Ansari", established: 2017, openAlerts: 1 },
  { id: "ac-18", name: "Ramgarh Combat Sports PEC", districtId: "ramgarh", type: "PEC", sports: ["Boxing", "Wrestling", "Weightlifting"], athletesCount: 152, complianceScore: 79, leadCoach: "Coach Pooja Devi", established: 2012, openAlerts: 0 },
  { id: "ac-19", name: "Chatra Rural Athletics Academy", districtId: "chatra", type: "Academy", sports: ["Athletics", "Kabaddi"], athletesCount: 92, complianceScore: 62, leadCoach: "Coach Dinesh Ravidas", established: 2016, openAlerts: 1 },
  { id: "ac-20", name: "Latehar Forest Sports Centre", districtId: "latehar", type: "Academy", sports: ["Archery", "Athletics"], athletesCount: 70, complianceScore: 59, leadCoach: "Coach Etwari Devi", established: 2019, openAlerts: 1, fundingNote: "Compliance below 60% threshold" },
  { id: "ac-21", name: "Lohardaga Kabaddi Academy", districtId: "lohardaga", type: "Academy", sports: ["Kabaddi", "Wrestling"], athletesCount: 84, complianceScore: 73, leadCoach: "Coach Mahavir Oraon", established: 2014, openAlerts: 0 },
  { id: "ac-22", name: "Garhwa Athletics Nursery", districtId: "garhwa", type: "Academy", sports: ["Athletics"], athletesCount: 66, complianceScore: 60, leadCoach: "Coach Sanjay Tiwari", established: 2018, openAlerts: 1 },
  { id: "ac-23", name: "Jamtara Weightlifting Centre", districtId: "jamtara", type: "Academy", sports: ["Weightlifting"], athletesCount: 58, complianceScore: 68, leadCoach: "Coach Imran Khan", established: 2017, openAlerts: 0 },
  { id: "ac-24", name: "Godda Football Academy", districtId: "godda", type: "Academy", sports: ["Football"], athletesCount: 102, complianceScore: 70, leadCoach: "Coach Vijay Marandi", established: 2015, openAlerts: 0 },
  { id: "ac-25", name: "Sahibganj Riverside PEC", districtId: "sahibganj", type: "PEC", sports: ["Athletics", "Football"], athletesCount: 96, complianceScore: 63, leadCoach: "Coach Sabina Murmu", established: 2016, openAlerts: 1 },
  { id: "ac-26", name: "Pakur Archery Academy", districtId: "pakur", type: "Academy", sports: ["Archery"], athletesCount: 61, complianceScore: 77, leadCoach: "Coach Lalita Hembrom", established: 2014, openAlerts: 0 },
  { id: "ac-27", name: "Ranchi Elite Football PEC", districtId: "ranchi", type: "PEC", sports: ["Football", "Athletics"], athletesCount: 212, complianceScore: 85, leadCoach: "Coach Gautam Bose", established: 2009, openAlerts: 0 },
  { id: "ac-28", name: "East Singhbhum Archery Academy", districtId: "east-singhbhum", type: "Academy", sports: ["Archery"], athletesCount: 118, complianceScore: 82, leadCoach: "Coach Reena Tudu", established: 2011, openAlerts: 0 },
  { id: "ac-29", name: "Bokaro Aquatics & Athletics Academy", districtId: "bokaro", type: "Academy", sports: ["Athletics", "Weightlifting"], athletesCount: 94, complianceScore: 57, leadCoach: "Coach Harish Gope", established: 2018, openAlerts: 2, fundingNote: "Phantom inventory flag — Rs 1.8 L" },
  { id: "ac-30", name: "Dhanbad Wrestling Excellence Centre", districtId: "dhanbad", type: "PEC", sports: ["Wrestling"], athletesCount: 130, complianceScore: 75, leadCoach: "Coach Balwant Singh", established: 2012, openAlerts: 0 },
  { id: "ac-31", name: "Hazaribagh Hockey Academy", districtId: "hazaribagh", type: "Academy", sports: ["Hockey"], athletesCount: 108, complianceScore: 78, leadCoach: "Coach Nirmala Kachhap", established: 2013, openAlerts: 0 },
  { id: "ac-32", name: "Giridih Athletics Nursery", districtId: "giridih", type: "Academy", sports: ["Athletics", "Kabaddi"], athletesCount: 72, complianceScore: 64, leadCoach: "Coach Rajesh Verma", established: 2017, openAlerts: 1 },
  { id: "ac-33", name: "Deoghar Athletics PEC", districtId: "deoghar", type: "PEC", sports: ["Athletics", "Football"], athletesCount: 144, complianceScore: 80, leadCoach: "Coach Sushma Singh", established: 2010, openAlerts: 0 },
  { id: "ac-34", name: "Palamu Wrestling Academy", districtId: "palamu", type: "Academy", sports: ["Wrestling", "Kabaddi"], athletesCount: 80, complianceScore: 55, leadCoach: "Coach Chandan Pandey", established: 2019, openAlerts: 2, fundingNote: "Biometric attendance 51% < 60%" },
  { id: "ac-35", name: "Ranchi Para-Sports PEC", districtId: "ranchi", type: "PEC", sports: ["Athletics", "Archery"], athletesCount: 88, complianceScore: 86, leadCoach: "Coach Anjali Ekka", established: 2016, openAlerts: 0 },
  { id: "ac-36", name: "Saraikela Hockey Nursery", districtId: "saraikela", type: "Academy", sports: ["Hockey"], athletesCount: 76, complianceScore: 67, leadCoach: "Coach Prakash Sardar", established: 2017, openAlerts: 1 },
  { id: "ac-37", name: "West Singhbhum Tribal Archery Academy", districtId: "west-singhbhum", type: "Academy", sports: ["Archery"], athletesCount: 90, complianceScore: 90, leadCoach: "Coach Sushila Purty", established: 2011, openAlerts: 0 },
  { id: "ac-38", name: "Bokaro Kabaddi Centre", districtId: "bokaro", type: "Academy", sports: ["Kabaddi"], athletesCount: 64, complianceScore: 62, leadCoach: "Coach Raju Mahato", established: 2018, openAlerts: 1 },
  { id: "ac-39", name: "Ranchi Combat & Weightlifting PEC", districtId: "ranchi", type: "PEC", sports: ["Weightlifting", "Boxing"], athletesCount: 126, complianceScore: 83, leadCoach: "Coach Iqbal Hussain", established: 2013, openAlerts: 0 },
  { id: "ac-40", name: "Dumka Athletics Academy", districtId: "dumka", type: "Academy", sports: ["Athletics"], athletesCount: 70, complianceScore: 60, leadCoach: "Coach Phulmani Hansda", established: 2017, openAlerts: 1 },
];

export const ACADEMIES: Academy[] = RAW.map((r) => {
  const centroid = DISTRICT_BY_ID[r.districtId];
  const [dx, dy] = jitter(r.id, 34);
  return {
    id: r.id,
    name: r.name,
    districtId: r.districtId,
    district: districtName(r.districtId),
    type: r.type,
    sports: r.sports,
    athletesCount: r.athletesCount,
    complianceScore: r.complianceScore,
    fundingStatus: deriveFunding(r.complianceScore, r.funding),
    x: (centroid?.cx ?? 500) + dx,
    y: (centroid?.cy ?? 350) + dy,
    leadCoach: r.leadCoach,
    openAlerts: r.openAlerts,
    established: r.established,
    fundingNote: r.fundingNote,
  };
});

export const ACADEMY_BY_ID: Record<string, Academy> = Object.fromEntries(
  ACADEMIES.map((a) => [a.id, a]),
);

export function getAcademy(id: string): Academy | undefined {
  return ACADEMY_BY_ID[id];
}

// ---- Derived aggregates used across the dashboard --------------------------
export const TOTAL_ACADEMIES = ACADEMIES.length;
export const TOTAL_PECS = ACADEMIES.filter((a) => a.type === "PEC").length;
export const TOTAL_ATHLETES = ACADEMIES.reduce(
  (sum, a) => sum + a.athletesCount,
  0,
);
export const COMPLIANT_COUNT = ACADEMIES.filter(
  (a) => a.complianceScore >= 70,
).length;
export const STATE_COMPLIANCE_SCORE = Math.round(
  ACADEMIES.reduce((s, a) => s + a.complianceScore, 0) / ACADEMIES.length,
);
