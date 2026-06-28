import { notFound } from "next/navigation";
import { ACADEMIES, getAcademy } from "@/lib/mock/academies";
import { AcademyDetail } from "./AcademyDetail";

export function generateStaticParams() {
  return ACADEMIES.map((a) => ({ id: a.id }));
}

export default function Page({ params }: { params: { id: string } }) {
  const academy = getAcademy(params.id);
  if (!academy) notFound();
  return <AcademyDetail academy={academy} />;
}
