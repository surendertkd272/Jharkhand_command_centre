import * as React from "react";
import { cn } from "@/lib/utils";

/** Horizontal progress bar. `tone` controls the fill color. */
export function Progress({
  value,
  className,
  tone = "lime",
  trackClassName,
}: {
  value: number;
  className?: string;
  tone?: "lime" | "ok" | "warn" | "danger" | "info" | "ink";
  trackClassName?: string;
}) {
  const fill = {
    lime: "bg-lime-500",
    ok: "bg-ok",
    warn: "bg-warn",
    danger: "bg-danger",
    info: "bg-info",
    ink: "bg-ink-900",
  }[tone];
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-black/5",
        trackClassName,
        className,
      )}
    >
      <div
        className={cn("h-full rounded-full transition-all", fill)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
