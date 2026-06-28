import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { KpiDelta } from "@/components/KpiDelta";

type Tint = "blue" | "orange" | "red" | "green" | "violet" | "lime";

const TINTS: Record<Tint, { bg: string; fg: string }> = {
  blue: { bg: "bg-tint-blue", fg: "text-info" },
  orange: { bg: "bg-tint-orange", fg: "text-warn" },
  red: { bg: "bg-tint-red", fg: "text-danger" },
  green: { bg: "bg-tint-green", fg: "text-ok" },
  violet: { bg: "bg-tint-violet", fg: "text-[#7c3aed]" },
  lime: { bg: "bg-lime-100", fg: "text-ink-900" },
};

/**
 * Reference-style KPI tile: oversized extra-bold number, label, pastel icon
 * badge, optional delta chip. The dashboard hero element.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  tint = "blue",
  delta,
  deltaInvert,
  deltaSuffix,
  hint,
  accent = false,
  className,
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tint?: Tint;
  delta?: number;
  deltaInvert?: boolean;
  deltaSuffix?: string;
  hint?: string;
  /** Red accent ring for critical KPIs (e.g. open fraud alerts). */
  accent?: boolean;
  className?: string;
}) {
  const t = TINTS[tint];
  return (
    <div
      className={cn(
        "group rounded-card border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift",
        accent ? "border-danger/25 ring-1 ring-danger/10" : "border-line",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium leading-tight text-muted">
          {label}
        </span>
        <span
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-transform duration-200 group-hover:scale-105",
            t.bg,
            t.fg,
          )}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="whitespace-nowrap text-[22px] font-extrabold leading-none tracking-tight text-ink-900 tabular">
          {value}
        </span>
        {typeof delta === "number" && (
          <KpiDelta value={delta} invert={deltaInvert} suffix={deltaSuffix} />
        )}
      </div>
      {hint && <p className="mt-2 text-[11px] leading-tight text-muted">{hint}</p>}
    </div>
  );
}
