import * as React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Tiny delta chip: green up / red down. `invert` flips good/bad coloring. */
export function KpiDelta({
  value,
  invert = false,
  suffix = "%",
  className,
}: {
  value: number;
  /** When true, a positive delta is bad (e.g. breaches). */
  invert?: boolean;
  suffix?: string;
  className?: string;
}) {
  const up = value >= 0;
  const good = invert ? !up : up;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        good ? "text-ok" : "text-danger",
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(value)}
      {suffix}
    </span>
  );
}
