import * as React from "react";
import { cn } from "@/lib/utils";
import type { StatusKind } from "@/lib/types";

interface StatusStyle {
  label: string;
  dot: string;
  text: string;
  bg: string;
}

// Single source of truth for status semantics across the whole app.
const STATUS: Record<StatusKind, StatusStyle> = {
  compliant: { label: "Compliant", dot: "bg-ok", text: "text-ok", bg: "bg-tint-green" },
  verified: { label: "Verified", dot: "bg-ok", text: "text-ok", bg: "bg-tint-green" },
  resolved: { label: "Resolved", dot: "bg-ok", text: "text-ok", bg: "bg-tint-green" },
  paid: { label: "Paid", dot: "bg-ok", text: "text-ok", bg: "bg-tint-green" },
  active: { label: "Active", dot: "bg-ok", text: "text-ok", bg: "bg-tint-green" },
  cleared: { label: "Cleared", dot: "bg-ok", text: "text-ok", bg: "bg-tint-green" },
  flagged: { label: "Flagged", dot: "bg-warn", text: "text-warn", bg: "bg-tint-orange" },
  pending: { label: "Pending", dot: "bg-warn", text: "text-warn", bg: "bg-tint-orange" },
  "at-risk": { label: "At risk", dot: "bg-warn", text: "text-warn", bg: "bg-tint-orange" },
  "in-progress": { label: "In progress", dot: "bg-info", text: "text-info", bg: "bg-tint-blue" },
  "in-transit": { label: "In transit", dot: "bg-info", text: "text-info", bg: "bg-tint-blue" },
  open: { label: "Open", dot: "bg-info", text: "text-info", bg: "bg-tint-blue" },
  escalated: { label: "Escalated", dot: "bg-danger", text: "text-danger", bg: "bg-tint-red" },
  paused: { label: "Paused", dot: "bg-danger", text: "text-danger", bg: "bg-tint-red" },
  breach: { label: "Breach", dot: "bg-danger", text: "text-danger", bg: "bg-tint-red" },
  failed: { label: "Failed", dot: "bg-danger", text: "text-danger", bg: "bg-tint-red" },
  blocked: { label: "Blocked", dot: "bg-danger", text: "text-danger", bg: "bg-tint-red" },
};

export function StatusBadge({
  status,
  label,
  pulse,
  className,
}: {
  status: StatusKind;
  /** Override the default label text. */
  label?: string;
  /** Animate the dot (use for live/critical states). */
  pulse?: boolean;
  className?: string;
}) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        s.bg,
        s.text,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          s.dot,
          pulse && "animate-pulse-dot",
        )}
      />
      {label ?? s.label}
    </span>
  );
}
