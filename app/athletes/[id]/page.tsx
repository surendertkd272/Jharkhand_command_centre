import { notFound } from "next/navigation";
import { ATHLETES, getAthlete } from "@/lib/mock/athletes";
import { getAthletePhysiology } from "@/lib/integrations";
import { AthleteProfile } from "./AthleteProfile";

export function generateStaticParams() {
  return ATHLETES.map((a) => ({ id: a.id }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const athlete = getAthlete(params.id);
  if (!athlete) notFound();
  // Fetched through the integration layer (Firstbeat + Myoact).
  const physiology = await getAthletePhysiology(params.id);
  return <AthleteProfile athlete={athlete} physiology={physiology} />;
}
