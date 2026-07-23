// ============================================================================
// Firstbeat adapter (Firstbeat Sports — now part of Garmin). Provides HRV,
// training load (TRIMP), recovery and acute:chronic workload ratio (ACWR).
//
// ⇩ GOING LIVE — this is the ONLY file to change for Firstbeat:
//   1. Obtain partner/API access (Firstbeat Sports Cloud export or the
//      Garmin Health API partner program) — see docs/INTEGRATIONS.md.
//   2. Set env: FIRSTBEAT_API_BASE, FIRSTBEAT_CLIENT_ID, FIRSTBEAT_CLIENT_SECRET.
//   3. Implement getAccessToken() (typically OAuth2 client-credentials) and
//      replace the DEMO branch in fetchLoadRecovery() with the real request +
//      normalizeFirstbeat(). Everything downstream already consumes LoadRecovery.
// ============================================================================
import type { Athlete } from "@/lib/types";
import type { LoadRecovery, SamplePoint } from "@/lib/integrations/types";

export const FIRSTBEAT_LIVE = !!process.env.FIRSTBEAT_API_BASE;

/** Map an athlete to their external Firstbeat id. Demo: derived; live: a lookup. */
export function firstbeatExternalId(athlete: Athlete): string {
  return `FB-${athlete.id.toUpperCase()}`;
}

export async function fetchLoadRecovery(athlete: Athlete): Promise<LoadRecovery> {
  if (!FIRSTBEAT_LIVE) return demoLoadRecovery(athlete); // DEMO

  // --- REAL (fill in once credentials + docs are available) ---------------
  // const token = await getAccessToken();
  // const id = firstbeatExternalId(athlete);
  // const res = await fetch(`${process.env.FIRSTBEAT_API_BASE}/athletes/${id}/sessions?range=14d`, {
  //   headers: { Authorization: `Bearer ${token}` },
  //   next: { revalidate: 900 }, // cache 15 min
  // });
  // if (!res.ok) throw new Error(`Firstbeat ${res.status}`);
  // return normalizeFirstbeat(await res.json());
  throw new Error("Firstbeat live mode not yet implemented");
}

// ---- deterministic demo data (no runtime randomness) -----------------------
function seed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return h;
}

function demoLoadRecovery(a: Athlete): LoadRecovery {
  const s = seed(a.id);
  const injured = a.status === "injured";
  const atRisk = a.status === "at-risk";
  const blocked = a.injuries.some((i) => i.clearance === "blocked");

  // daily TRIMP (higher, spikier for injured/at-risk); label D-13..D0
  const trainingLoad: SamplePoint[] = [];
  const hrvTrend: SamplePoint[] = [];
  let weekly = 0;
  const baseLoad = 45 + (s % 25);
  const baseHrv = injured || atRisk ? 44 : 62 + (s % 18);
  for (let d = 13; d >= 0; d--) {
    const wob = ((s * 7 + d * 13) % 21) - 10;
    const spike = (injured || atRisk) && d < 5 ? 26 : 0;
    const load = Math.max(12, baseLoad + wob + spike);
    trainingLoad.push({ label: `D-${d}`, value: Math.round(load) });
    if (d < 7) weekly += load;
    const hrvWob = ((s * 5 + d * 9) % 14) - 7;
    const hrvDrop = (injured || atRisk) && d < 5 ? -10 : 0;
    hrvTrend.push({
      label: `D-${d}`,
      value: Math.max(22, Math.round(baseHrv + hrvWob + hrvDrop)),
    });
  }

  // acute (7d) vs chronic (28d proxy) -> ACWR
  const acute = weekly / 7;
  const chronic = baseLoad * (1 + ((s % 10) - 5) / 100);
  let acwr = +(acute / chronic).toFixed(2);
  if (blocked) acwr = 1.62;
  else if (injured) acwr = 1.55;
  else if (atRisk) acwr = 1.42;
  acwr = Math.min(acwr, 1.9);

  const recoveryScore = blocked
    ? 38
    : injured
      ? 44
      : atRisk
        ? 54
        : Math.min(96, 68 + (s % 28));

  return {
    trainingLoad,
    weeklyLoad: Math.round(weekly),
    acwr,
    hrvRmssd: hrvTrend[hrvTrend.length - 1].value,
    hrvTrend,
    recoveryScore,
    restingHr: 48 + (s % 14) + (injured ? 6 : 0),
  };
}
