import type {
  AcademyStreakRow,
  AthleteBadgeRow,
  BadgeKind,
  DistrictStanding,
  EngagementPoint,
  StatusKind,
} from "@/lib/types";
import { ACADEMIES, ACADEMY_BY_ID } from "@/lib/mock/academies";
import { ATHLETE_BY_ID } from "@/lib/mock/athletes";
import { clamp } from "@/lib/utils";

// ============================================================================
// Rewards & Engagement mock. Pure data + helpers (NO "use client").
//
// The pillar exists to solve an adoption problem: a state platform only works
// if academies keep filing every week instead of scrambling before an audit.
// Streaks and badges are derived deterministically from each facility's real
// compliance score, so the leaderboard always agrees with the rest of the app —
// the academies already flagged on /finance are the ones with broken streaks.
// ============================================================================

// Stable per-id pseudo-randomness (same approach as the map jitter).
function seed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997;
  return h;
}

/** Weeks of unbroken on-time filing, banded by compliance. */
function deriveStreak(score: number, id: string): number {
  const s = seed(id);
  if (score >= 90) return 15 + (s % 4); // 15-18
  if (score >= 80) return 9 + (s % 6); // 9-14
  if (score >= 70) return 5 + (s % 4); // 5-8
  if (score >= 60) return 1 + (s % 4); // 1-4
  return 0; // streak broken — below the 60% funding floor
}

function deriveOnTime(score: number, id: string): number {
  const s = seed(id);
  if (score < 60) return 38 + (s % 8); // 38-45
  return clamp(score + 4 - (s % 6), 60, 99);
}

function deriveBadges(streak: number, id: string): number {
  const s = seed(id);
  if (streak >= 15) return 5 + (s % 2);
  if (streak >= 9) return 3 + (s % 2);
  if (streak >= 5) return 2;
  if (streak >= 1) return 1;
  return 0;
}

function streakStatus(streak: number): StatusKind {
  if (streak >= 8) return "active";
  if (streak >= 1) return "at-risk";
  return "paused";
}

// ----------------------------------------------------------------------------
// Academy streaks — every one of the 40 facilities, ranked by points.
// ----------------------------------------------------------------------------
export const ACADEMY_STREAKS: AcademyStreakRow[] = ACADEMIES.map((a) => {
  const streakWeeks = deriveStreak(a.complianceScore, a.id);
  const onTimeRate = deriveOnTime(a.complianceScore, a.id);
  const badgesEarned = deriveBadges(streakWeeks, a.id);
  const s = seed(a.id);
  return {
    id: `str-${a.id}`,
    academyId: a.id,
    academyName: a.name,
    district: a.district,
    type: a.type,
    streakWeeks,
    // A broken streak still remembers what it lost.
    bestStreakWeeks: streakWeeks === 0 ? 3 + (s % 5) : streakWeeks + (s % 3),
    onTimeRate,
    badgesEarned,
    points: streakWeeks * 25 + badgesEarned * 50 + onTimeRate * 3,
    status: streakStatus(streakWeeks),
  };
}).sort((x, y) => y.points - x.points);

export const STREAK_BY_ACADEMY: Record<string, AcademyStreakRow> =
  Object.fromEntries(ACADEMY_STREAKS.map((r) => [r.academyId, r]));

// ----------------------------------------------------------------------------
// Athlete badges — earned on the athlete's own record, visible on their profile
// rather than buried in a coach's file. Drawn from real roster entries.
// ----------------------------------------------------------------------------
interface RawBadgeRow {
  athleteId: string;
  badges: BadgeKind[];
}

const RAW_BADGES: RawBadgeRow[] = [
  { athleteId: "at-01", badges: ["consistency", "perfect-attendance", "district-topper"] }, // Deepika Kumari Munda — Khunti, 94% attendance
  { athleteId: "at-17", badges: ["consistency", "rising-talent"] },                          // Sushila Purty — West Singhbhum, trending up
  { athleteId: "at-07", badges: ["consistency", "perfect-attendance"] },                     // Sunita Kumari — West Singhbhum Tribal Archery
  { athleteId: "at-03", badges: ["consistency", "rising-talent", "district-topper"] },       // Salima Tete Kispotta — Simdega, rising
  { athleteId: "at-27", badges: ["consistency"] },                                           // Sylvanus Dungdung Jr. — Simdega Hockey
  { athleteId: "at-05", badges: ["consistency", "district-topper"] },                        // Priya Soren — Tata Steel Sports PEC
  { athleteId: "at-11", badges: ["consistency"] },                                           // Mary Hansda — Dumka Santal Pargana
  { athleteId: "at-02", badges: ["consistency"] },                                           // Arjun Mahato — Birsa Munda PEC
  { athleteId: "at-19", badges: ["consistency"] },                                           // Reena Tudu — East Singhbhum Archery
  { athleteId: "at-13", badges: ["recovery-champion"] },                                     // Pooja Kumari — cleared return after injury
];

export const ATHLETE_BADGES: AthleteBadgeRow[] = RAW_BADGES.map((r, i) => {
  const ath = ATHLETE_BY_ID[r.athleteId];
  const academy = ACADEMY_BY_ID[ath.academyId];
  return {
    id: `bdg-${String(i + 1).padStart(2, "0")}`,
    athleteId: r.athleteId,
    athleteName: ath.name,
    district: ath.district,
    academyName: academy?.name ?? "",
    sport: ath.sport,
    attendanceRate: ath.attendanceRate,
    points: ath.attendanceRate * 8 + r.badges.length * 120,
    badges: r.badges,
  };
}).sort((x, y) => y.points - x.points);

export const BADGE_LABEL: Record<BadgeKind, string> = {
  consistency: "Consistency",
  "rising-talent": "Rising Talent",
  "perfect-attendance": "Perfect Attendance",
  "recovery-champion": "Recovery Champion",
  "district-topper": "District Topper",
};

export const BADGE_CRITERIA: Record<BadgeKind, string> = {
  consistency: "85%+ biometric attendance held for 8 straight weeks",
  "rising-talent": "Trial score climbing above the objective baseline",
  "perfect-attendance": "Every session checked in, no misses this month",
  "recovery-champion": "Returned to play on verified state medical clearance",
  "district-topper": "Best verified trial score in the district this cycle",
};

// ----------------------------------------------------------------------------
// District standings — facility points rolled up to the district.
// ----------------------------------------------------------------------------
export const DISTRICT_STANDINGS: DistrictStanding[] = Object.values(
  ACADEMY_STREAKS.reduce<Record<string, DistrictStanding & { streakSum: number }>>(
    (acc, r) => {
      const academy = ACADEMY_BY_ID[r.academyId];
      const key = academy.districtId;
      const cur = acc[key] ?? {
        districtId: key,
        district: r.district,
        facilities: 0,
        points: 0,
        avgStreakWeeks: 0,
        streakSum: 0,
      };
      cur.facilities += 1;
      cur.points += r.points;
      cur.streakSum += r.streakWeeks;
      acc[key] = cur;
      return acc;
    },
    {},
  ),
)
  .map((d) => ({
    districtId: d.districtId,
    district: d.district,
    facilities: d.facilities,
    points: d.points,
    avgStreakWeeks: Math.round(d.streakSum / d.facilities),
  }))
  .sort((a, b) => b.points - a.points);

// ----------------------------------------------------------------------------
// Engagement trend — share of the 40 facilities filing before the weekly
// cut-off, since streaks and badges went live in W1.
// ----------------------------------------------------------------------------
export const ENGAGEMENT_TREND: EngagementPoint[] = [
  { label: "W1", onTime: 61 },
  { label: "W2", onTime: 63 },
  { label: "W3", onTime: 66 },
  { label: "W4", onTime: 68 },
  { label: "W5", onTime: 72 },
  { label: "W6", onTime: 76 },
  { label: "W7", onTime: 79 },
  { label: "W8", onTime: 83 },
];

// ---- Derived aggregates ----------------------------------------------------
export const TOTAL_FACILITIES = ACADEMY_STREAKS.length;
export const ACTIVE_STREAK_COUNT = ACADEMY_STREAKS.filter(
  (r) => r.streakWeeks >= 8,
).length;
export const BROKEN_STREAK_COUNT = ACADEMY_STREAKS.filter(
  (r) => r.streakWeeks === 0,
).length;
export const LONGEST_STREAK = ACADEMY_STREAKS.reduce(
  (best, r) => (r.streakWeeks > best.streakWeeks ? r : best),
  ACADEMY_STREAKS[0],
);
export const BADGES_AWARDED = ACADEMY_STREAKS.reduce(
  (sum, r) => sum + r.badgesEarned,
  0,
);
export const ON_TIME_RATE_NOW =
  ENGAGEMENT_TREND[ENGAGEMENT_TREND.length - 1].onTime;
export const ON_TIME_RATE_LIFT =
  ON_TIME_RATE_NOW - ENGAGEMENT_TREND[0].onTime;
