// ============================================================================
// Myoact adapter (EMG muscle-activity monitoring). Provides muscle load,
// left/right asymmetry, fatigue and per-muscle-group activation.
//
// ⇩ GOING LIVE — the ONLY file to change for Myoact:
//   1. Confirm access with the vendor (API vs session CSV/FIT export) — see
//      docs/INTEGRATIONS.md for the exact questions to ask them.
//   2. Set env: MYOACT_API_BASE, MYOACT_API_KEY (or the auth they provide).
//   3. Replace the DEMO branch in fetchMuscleActivity() with the real request
//      + normalizeMyoact(). Everything downstream consumes MuscleActivity.
// ============================================================================
import type { Athlete } from "@/lib/types";
import type { MuscleActivity, MuscleGroupLoad } from "@/lib/integrations/types";

export const MYOACT_LIVE = !!process.env.MYOACT_API_BASE;

export function myoactExternalId(athlete: Athlete): string {
  return `MYO-${athlete.id.toUpperCase()}`;
}

export async function fetchMuscleActivity(
  athlete: Athlete,
): Promise<MuscleActivity> {
  if (!MYOACT_LIVE) return demoMuscleActivity(athlete); // DEMO

  // --- REAL (fill in once credentials + docs are available) ---------------
  // const id = myoactExternalId(athlete);
  // const res = await fetch(`${process.env.MYOACT_API_BASE}/athletes/${id}/emg/latest`, {
  //   headers: { "x-api-key": process.env.MYOACT_API_KEY! },
  //   next: { revalidate: 900 },
  // });
  // if (!res.ok) throw new Error(`Myoact ${res.status}`);
  // return normalizeMyoact(await res.json());
  throw new Error("Myoact live mode not yet implemented");
}

// ---- deterministic demo data ----------------------------------------------
function seed(id: string): number {
  let h = 7;
  for (let i = 0; i < id.length; i++) h = (h * 37 + id.charCodeAt(i)) % 100000;
  return h;
}

const GROUPS = ["Quadriceps", "Hamstrings", "Glutes", "Calves", "Core"];

function demoMuscleActivity(a: Athlete): MuscleActivity {
  const s = seed(a.id);
  const injured = a.status === "injured";
  const blocked = a.injuries.some((i) => i.clearance === "blocked");
  const atRisk = a.status === "at-risk";

  const muscleGroups: MuscleGroupLoad[] = GROUPS.map((g, i) => {
    const base = 58 + ((s + i * 17) % 30);
    // injured/blocked athletes show a clear left/right imbalance
    const skew = blocked ? 18 : injured ? 13 : atRisk ? 8 : (s + i) % 6;
    return {
      group: g,
      left: Math.min(99, base),
      right: Math.max(20, base - skew),
    };
  });

  const asymmetryPct = blocked
    ? 19
    : injured
      ? 14
      : atRisk
        ? 11
        : 3 + (s % 6);

  const muscleLoad = injured || atRisk ? 74 + (s % 12) : 55 + (s % 25);
  const fatigueIndex = blocked
    ? 78
    : injured
      ? 70
      : atRisk
        ? 62
        : 30 + (s % 30);

  return { muscleLoad, asymmetryPct, fatigueIndex, muscleGroups };
}
