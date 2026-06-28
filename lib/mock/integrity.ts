import type {
  DebiasPoint,
  DualRegistrationMatch,
  Sport,
  VerificationRow,
} from "@/lib/types";
import { ATHLETE_BY_ID } from "@/lib/mock/athletes";

// ============================================================================
// Integrity pillar mock data — age/identity verification, evaluator de-bias
// scatter, and biometric dual-registration matches. Pure, deterministic data
// derived from the canonical ATHLETES roster. No runtime randomness.
//
// Hero beat (a): a strongly flagged same-FACE biometric match for the SAME
// person registered across two different districts (Ranchi + East Singhbhum).
// ============================================================================

// ----------------------------------------------------------------------------
// Standard sealed document set for a fully DigiLocker-verified athlete.
// ----------------------------------------------------------------------------
const SEALED_DOCS: VerificationRow["documents"] = [
  { label: "Aadhaar (DigiLocker)", sealed: true },
  { label: "Birth Certificate", sealed: true },
  { label: "Residency Proof", sealed: true },
];

// Docs for a pending row — Aadhaar pulled, but the rest not yet sealed.
const PENDING_DOCS: VerificationRow["documents"] = [
  { label: "Aadhaar (DigiLocker)", sealed: true },
  { label: "Birth Certificate", sealed: false },
  { label: "Residency Proof", sealed: false },
];

// Docs for a forgery-flagged row — DigiLocker pull mismatched the submitted
// paperwork, so nothing is allowed to seal.
const FLAGGED_DOCS: VerificationRow["documents"] = [
  { label: "Aadhaar (DigiLocker)", sealed: true },
  { label: "Birth Certificate", sealed: false },
  { label: "Residency Proof", sealed: false },
];

interface RawVerification {
  athleteId: string;
  residencyProof: string;
  digiLockerStatus: VerificationRow["digiLockerStatus"];
  sealedAt?: string;
}

// 14 rows derived from real athletes. Verified rows seal all three documents;
// pending rows leave the dossier open; flagged rows (the three known forged
// identities) carry a residency/DOB mismatch and never seal.
const RAW_VERIFICATIONS: RawVerification[] = [
  // ---- Verified (sealed) -------------------------------------------------
  { athleteId: "at-01", residencyProof: "Khunti — domicile certificate matches DigiLocker", digiLockerStatus: "verified", sealedAt: "2026-01-14T10:20:00+05:30" },
  { athleteId: "at-02", residencyProof: "Ranchi — ration card + Aadhaar address match", digiLockerStatus: "verified", sealedAt: "2026-01-18T11:05:00+05:30" },
  { athleteId: "at-03", residencyProof: "Simdega — gram panchayat residency verified", digiLockerStatus: "verified", sealedAt: "2026-02-02T09:40:00+05:30" },
  { athleteId: "at-05", residencyProof: "East Singhbhum — domicile certificate matches DigiLocker", digiLockerStatus: "verified", sealedAt: "2026-01-22T14:10:00+05:30" },
  { athleteId: "at-07", residencyProof: "West Singhbhum — tribal certificate + Aadhaar match", digiLockerStatus: "verified", sealedAt: "2026-02-09T10:00:00+05:30" },
  { athleteId: "at-11", residencyProof: "Dumka — domicile certificate matches DigiLocker", digiLockerStatus: "verified", sealedAt: "2026-01-30T12:25:00+05:30" },
  { athleteId: "at-17", residencyProof: "West Singhbhum — domicile certificate matches DigiLocker", digiLockerStatus: "verified", sealedAt: "2026-02-11T11:50:00+05:30" },
  { athleteId: "at-25", residencyProof: "Hazaribagh — voter roll + Aadhaar address match", digiLockerStatus: "verified", sealedAt: "2026-02-18T09:15:00+05:30" },
  { athleteId: "at-27", residencyProof: "Simdega — gram panchayat residency verified", digiLockerStatus: "verified", sealedAt: "2026-02-04T15:30:00+05:30" },

  // ---- Pending (dossier open, awaiting board) ----------------------------
  { athleteId: "at-15", residencyProof: "Pakur — residency proof uploaded, board review queued", digiLockerStatus: "pending" },
  { athleteId: "at-32", residencyProof: "Latehar — birth certificate awaiting registrar fetch", digiLockerStatus: "pending" },

  // ---- Forgery flagged (DigiLocker mismatch) -----------------------------
  { athleteId: "at-04", residencyProof: "Giridih — MISMATCH: submitted DOB 2010 vs Aadhaar DOB 2008; residency address not found in DigiLocker", digiLockerStatus: "flagged" },
  { athleteId: "at-10", residencyProof: "Deoghar — MISMATCH: birth certificate seal fails verification; DigiLocker age 18 vs claimed 16", digiLockerStatus: "flagged" },
  { athleteId: "at-26", residencyProof: "Hazaribagh — MISMATCH: residency proof issued post-trial date; Aadhaar address in different district", digiLockerStatus: "flagged" },
];

export const VERIFICATION_QUEUE: VerificationRow[] = RAW_VERIFICATIONS.map(
  (r, i) => {
    const a = ATHLETE_BY_ID[r.athleteId];
    const verified = r.digiLockerStatus === "verified";
    const flagged = r.digiLockerStatus === "flagged";
    return {
      id: `vr-${String(i + 1).padStart(2, "0")}`,
      athleteId: r.athleteId,
      athleteName: a?.name ?? r.athleteId,
      district: a?.district ?? "",
      age: a?.age ?? 0,
      ageLocked: verified,
      residencyProof: r.residencyProof,
      digiLockerStatus: r.digiLockerStatus,
      sealedAt: r.sealedAt,
      documents: verified ? SEALED_DOCS : flagged ? FLAGGED_DOCS : PENDING_DOCS,
    };
  },
);

// ----------------------------------------------------------------------------
// Evaluator de-bias scatter: objective baseline (x) vs subjective trial (y).
// Most points sit inside a fair +/-8 band. Six flagged outliers show trial
// scores inflated 18..32 points above baseline — evaluator bias signatures.
// ----------------------------------------------------------------------------
interface RawDebias {
  athleteName: string;
  district: string;
  sport: Sport;
  evaluator: string;
  baseline: number;
  trialScore: number;
}

const RAW_DEBIAS: RawDebias[] = [
  // ---- Fair band (|trial - baseline| <= 8) -------------------------------
  { athleteName: "Deepika Kumari Munda", district: "Khunti", sport: "Archery", evaluator: "Eval. Anil Mahato", baseline: 92, trialScore: 90 },
  { athleteName: "Arjun Mahato", district: "Ranchi", sport: "Hockey", evaluator: "Eval. Rakesh Tirkey", baseline: 84, trialScore: 86 },
  { athleteName: "Salima Tete Kispotta", district: "Simdega", sport: "Hockey", evaluator: "Eval. Sylvanus Dungdung", baseline: 88, trialScore: 89 },
  { athleteName: "Priya Soren", district: "East Singhbhum", sport: "Athletics", evaluator: "Eval. Vikram Singh", baseline: 86, trialScore: 85 },
  { athleteName: "Vikram Singh Munda", district: "Dhanbad", sport: "Wrestling", evaluator: "Eval. Balwant Singh", baseline: 80, trialScore: 82 },
  { athleteName: "Sunita Kumari", district: "West Singhbhum", sport: "Archery", evaluator: "Eval. Sushila Purty", baseline: 89, trialScore: 91 },
  { athleteName: "Anjali Ekka", district: "Ranchi", sport: "Athletics", evaluator: "Eval. Anjali Ekka", baseline: 83, trialScore: 84 },
  { athleteName: "Mary Hansda", district: "Dumka", sport: "Archery", evaluator: "Eval. Reena Tudu", baseline: 85, trialScore: 86 },
  { athleteName: "Rakesh Tirkey Jr.", district: "Ranchi", sport: "Football", evaluator: "Eval. Gautam Bose", baseline: 82, trialScore: 83 },
  { athleteName: "Imran Ansari", district: "Koderma", sport: "Boxing", evaluator: "Eval. Farhan Ansari", baseline: 79, trialScore: 80 },
  { athleteName: "Naveen Mahto", district: "Saraikela-Kharsawan", sport: "Weightlifting", evaluator: "Eval. Iqbal Hussain", baseline: 77, trialScore: 75 },
  { athleteName: "Sushila Purty", district: "West Singhbhum", sport: "Archery", evaluator: "Eval. Anil Mahato", baseline: 90, trialScore: 92 },
  { athleteName: "Reena Tudu", district: "East Singhbhum", sport: "Archery", evaluator: "Eval. Mary Hansda", baseline: 84, trialScore: 85 },
  { athleteName: "Balwant Singh Jr.", district: "Dhanbad", sport: "Wrestling", evaluator: "Eval. Vikram Singh", baseline: 80, trialScore: 81 },
  { athleteName: "Phulmani Hansda", district: "Dumka", sport: "Athletics", evaluator: "Eval. Anjali Ekka", baseline: 76, trialScore: 77 },
  { athleteName: "Sabina Murmu", district: "Sahibganj", sport: "Athletics", evaluator: "Eval. Sabina Murmu", baseline: 75, trialScore: 76 },
  { athleteName: "Gautam Bose Jr.", district: "Ranchi", sport: "Football", evaluator: "Eval. Gautam Bose", baseline: 81, trialScore: 82 },
  { athleteName: "Nirmala Kachhap", district: "Hazaribagh", sport: "Hockey", evaluator: "Eval. Nirmala Kachhap", baseline: 83, trialScore: 84 },
  { athleteName: "Mahavir Oraon Jr.", district: "Lohardaga", sport: "Kabaddi", evaluator: "Eval. Mahavir Oraon", baseline: 77, trialScore: 78 },
  { athleteName: "Sushma Singh Jr.", district: "Deoghar", sport: "Athletics", evaluator: "Eval. Sushma Singh", baseline: 82, trialScore: 83 },

  // ---- Flagged outliers (trial inflated 18..32 above baseline) -----------
  { athleteName: "Rohit Oraon", district: "Giridih", sport: "Football", evaluator: "Eval. Albert Lakra", baseline: 71, trialScore: 95 },
  { athleteName: "Suresh Yadav Jr.", district: "Deoghar", sport: "Wrestling", evaluator: "Eval. Suresh Yadav", baseline: 66, trialScore: 96 },
  { athleteName: "Devendra Oraon Jr.", district: "Hazaribagh", sport: "Athletics", evaluator: "Eval. Devendra Oraon", baseline: 68, trialScore: 92 },
  { athleteName: "Etwari Devi Jr.", district: "Latehar", sport: "Archery", evaluator: "Eval. Etwari Devi", baseline: 64, trialScore: 88 },
  { athleteName: "Harish Gope", district: "Bokaro", sport: "Weightlifting", evaluator: "Eval. Harish Gope", baseline: 71, trialScore: 91 },
  { athleteName: "Birsa Purty", district: "West Singhbhum", sport: "Athletics", evaluator: "Eval. Birsa Purty", baseline: 67, trialScore: 88 },
];

export const DEBIAS_POINTS: DebiasPoint[] = RAW_DEBIAS.map((r, i) => {
  const deviation = r.trialScore - r.baseline;
  return {
    id: `db-${String(i + 1).padStart(2, "0")}`,
    athleteName: r.athleteName,
    district: r.district,
    sport: r.sport,
    evaluator: r.evaluator,
    baseline: r.baseline,
    trialScore: r.trialScore,
    deviation,
    flagged: deviation > 8,
  };
});

// ----------------------------------------------------------------------------
// Dual-registration biometric matches: same person surfacing in two districts.
// Hero beat (a) is db dr-01 — a same-face match across Ranchi & East Singhbhum
// at 98% confidence, hard-flagged.
// ----------------------------------------------------------------------------
export const DUAL_REGISTRATIONS: DualRegistrationMatch[] = [
  {
    id: "dr-01",
    athleteName: "Rohit Oraon",
    districtA: "Ranchi",
    districtB: "East Singhbhum",
    trialDateA: "2026-02-12",
    trialDateB: "2026-03-04",
    matchConfidence: 98,
    biometric: "face",
    status: "flagged",
  },
  {
    id: "dr-02",
    athleteName: "Suresh Yadav Jr.",
    districtA: "Deoghar",
    districtB: "Dhanbad",
    trialDateA: "2026-01-28",
    trialDateB: "2026-02-20",
    matchConfidence: 96,
    biometric: "fingerprint",
    status: "flagged",
  },
  {
    id: "dr-03",
    athleteName: "Devendra Oraon Jr.",
    districtA: "Hazaribagh",
    districtB: "Giridih",
    trialDateA: "2026-02-05",
    trialDateB: "2026-02-26",
    matchConfidence: 94,
    biometric: "face",
    status: "frozen",
  },
  {
    id: "dr-04",
    athleteName: "Etwari Devi Jr.",
    districtA: "Latehar",
    districtB: "Palamu",
    trialDateA: "2026-03-01",
    trialDateB: "2026-03-15",
    matchConfidence: 91,
    biometric: "fingerprint",
    status: "flagged",
  },
  {
    id: "dr-05",
    athleteName: "Phulmani Hansda",
    districtA: "Dumka",
    districtB: "Jamtara",
    trialDateA: "2026-01-19",
    trialDateB: "2026-02-08",
    matchConfidence: 82,
    biometric: "face",
    status: "cleared",
  },
];

// ----------------------------------------------------------------------------
// Aggregates
// ----------------------------------------------------------------------------
export const VERIFIED_COUNT = VERIFICATION_QUEUE.filter(
  (v) => v.digiLockerStatus === "verified",
).length;

export const PENDING_COUNT = VERIFICATION_QUEUE.filter(
  (v) => v.digiLockerStatus === "pending",
).length;

export const FORGERY_FLAGGED_COUNT = VERIFICATION_QUEUE.filter(
  (v) => v.digiLockerStatus === "flagged",
).length;

export const DUAL_FLAGGED_COUNT = DUAL_REGISTRATIONS.filter(
  (d) => d.status === "flagged",
).length;
