// ============================================================================
// Public integration API consumed by the UI. Merges the Firstbeat + Myoact
// adapters into the normalized AthletePhysiology model and derives injury-risk,
// readiness and human-readable flags. The command center imports ONLY from here
// — it never touches a vendor SDK or raw payload directly.
// ============================================================================
import { ATHLETES, getAthlete } from "@/lib/mock/athletes";
import type { Athlete } from "@/lib/types";
import {
  ACWR_DANGER,
  ACWR_HIGH,
  ACWR_LOW,
  type AthletePhysiology,
  type FleetPhysiology,
  type IntegrationStatus,
  type RiskLevel,
  type Readiness,
  type SamplePoint,
} from "@/lib/integrations/types";
import {
  FIRSTBEAT_LIVE,
  fetchLoadRecovery,
} from "@/lib/integrations/firstbeat";
import { MYOACT_LIVE, fetchMuscleActivity } from "@/lib/integrations/myoact";

// Stable demo "last sync" — 18 min before the fixed demo clock (2026-06-28 09:15 IST).
const LAST_SYNC = "2026-06-28T08:57:00+05:30";

export function getIntegrationStatus(): IntegrationStatus[] {
  const tracked = ATHLETES.length;
  return [
    {
      id: "firstbeat",
      name: "Firstbeat Sports",
      vendor: "Garmin · Firstbeat",
      state: "connected",
      lastSync: LAST_SYNC,
      metrics: "HRV · training load (TRIMP) · recovery · ACWR",
      athletesTracked: tracked,
      api: "OAuth2 · Firstbeat Sports Cloud / Garmin Health API (pull, 15-min sync)",
      live: FIRSTBEAT_LIVE,
    },
    {
      id: "myoact",
      name: "Myoact EMG",
      vendor: "Myoact",
      state: "connected",
      lastSync: LAST_SYNC,
      metrics: "muscle load · L/R asymmetry · fatigue · activation",
      athletesTracked: tracked,
      api: "API key · EMG session sync (pull, 15-min sync)",
      live: MYOACT_LIVE,
    },
  ];
}

function derive(
  a: Athlete,
  acwr: number,
  asymmetryPct: number,
  recoveryScore: number,
  hrvRmssd: number,
): { injuryRisk: RiskLevel; readiness: Readiness; flags: string[] } {
  const flags: string[] = [];
  const blocked = a.injuries.some((i) => i.clearance === "blocked");

  if (acwr > ACWR_DANGER) flags.push(`ACWR ${acwr} — workload spike (>${ACWR_DANGER})`);
  else if (acwr > ACWR_HIGH) flags.push(`ACWR ${acwr} — elevated`);
  else if (acwr < ACWR_LOW) flags.push(`ACWR ${acwr} — undertrained`);

  if (asymmetryPct >= 15) flags.push(`L/R asymmetry ${asymmetryPct}% (>15%)`);
  else if (asymmetryPct >= 10) flags.push(`L/R asymmetry ${asymmetryPct}% — monitor`);

  if (recoveryScore < 50) flags.push(`Low recovery ${recoveryScore}/100`);
  if (hrvRmssd < 40) flags.push(`HRV suppressed ${hrvRmssd} ms`);
  if (blocked) flags.push("Medical clearance BLOCKED — do not return to load");

  const injuryRisk: RiskLevel =
    blocked || acwr > ACWR_DANGER || asymmetryPct >= 15 || recoveryScore < 45
      ? "high"
      : acwr > ACWR_HIGH || asymmetryPct >= 10 || recoveryScore < 60
        ? "moderate"
        : "low";

  const readiness: Readiness =
    injuryRisk === "high" || recoveryScore < 50
      ? "compromised"
      : recoveryScore >= 70 && acwr >= ACWR_LOW && acwr <= ACWR_HIGH && asymmetryPct < 10
        ? "optimal"
        : "moderate";

  return { injuryRisk, readiness, flags };
}

async function buildForAthlete(a: Athlete): Promise<AthletePhysiology> {
  const [lr, ma] = await Promise.all([
    fetchLoadRecovery(a),
    fetchMuscleActivity(a),
  ]);
  const { injuryRisk, readiness, flags } = derive(
    a,
    lr.acwr,
    ma.asymmetryPct,
    lr.recoveryScore,
    lr.hrvRmssd,
  );
  return {
    athleteId: a.id,
    sources: ["firstbeat", "myoact"],
    lastSync: LAST_SYNC,
    ...lr,
    ...ma,
    injuryRisk,
    readiness,
    flags,
  };
}

export async function getAthletePhysiology(
  athleteId: string,
): Promise<AthletePhysiology | null> {
  const a = getAthlete(athleteId);
  if (!a) return null;
  return buildForAthlete(a);
}

export async function getFleetPhysiology(): Promise<FleetPhysiology> {
  const athletes = await Promise.all(ATHLETES.map(buildForAthlete));

  const tracked = athletes.length;
  const optimal = athletes.filter((p) => p.readiness === "optimal").length;
  const compromised = athletes.filter((p) => p.readiness === "compromised").length;
  const highRisk = athletes.filter((p) => p.injuryRisk === "high").length;
  const acwrOutOfRange = athletes.filter(
    (p) => p.acwr < ACWR_LOW || p.acwr > ACWR_HIGH,
  ).length;
  const avgRecovery = Math.round(
    athletes.reduce((s, p) => s + p.recoveryScore, 0) / tracked,
  );

  // fleet-average daily load across the 14-day window
  const labels = athletes[0].trainingLoad.map((d) => d.label);
  const loadTrend: SamplePoint[] = labels.map((label, i) => ({
    label,
    value: Math.round(
      athletes.reduce((s, p) => s + (p.trainingLoad[i]?.value ?? 0), 0) / tracked,
    ),
  }));

  return {
    status: getIntegrationStatus(),
    athletes,
    summary: {
      tracked,
      optimal,
      compromised,
      highRisk,
      acwrOutOfRange,
      avgRecovery,
      loadTrend,
    },
  };
}
