import { notFound } from "next/navigation";
import { ATHLETES, getAthlete } from "@/lib/mock/athletes";
import { AthleteProfile } from "./AthleteProfile";

export function generateStaticParams() {
  return ATHLETES.map((a) => ({ id: a.id }));
}

export default function Page({ params }: { params: { id: string } }) {
  const athlete = getAthlete(params.id);
  if (!athlete) notFound();
  return <AthleteProfile athlete={athlete} />;
}
