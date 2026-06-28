import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Boxes,
  Banknote,
  HeartPulse,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import type { Alert, Pillar, Severity } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

const PILLAR_ICON: Record<Pillar, LucideIcon> = {
  integrity: ShieldCheck,
  resources: Boxes,
  finance: Banknote,
  welfare: HeartPulse,
  academies: Building2,
};

const PILLAR_LABEL: Record<Pillar, string> = {
  integrity: "Integrity",
  resources: "Resources",
  finance: "Finance",
  welfare: "Welfare",
  academies: "Academies",
};

const SEV_DOT: Record<Severity, string> = {
  critical: "bg-danger",
  high: "bg-danger",
  medium: "bg-warn",
  low: "bg-info",
};

const STATUS_MAP = {
  open: "open",
  acknowledged: "in-progress",
  escalated: "escalated",
  resolved: "resolved",
} as const;

/** A single row in any alert feed. `actions` renders trailing quick-action buttons. */
export function AlertRow({
  alert,
  actions,
  showPillar = true,
  href,
  className,
}: {
  alert: Alert;
  actions?: React.ReactNode;
  showPillar?: boolean;
  href?: string;
  className?: string;
}) {
  const Icon = PILLAR_ICON[alert.pillar];
  const body = (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-line bg-card p-3.5 transition-colors hover:bg-canvas/60",
        className,
      )}
    >
      <span className="relative mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/5 text-ink-700">
        <Icon className="h-4 w-4" />
        <span
          className={cn(
            "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white",
            SEV_DOT[alert.severity],
          )}
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-ink-900">
            {alert.title}
          </p>
          {showPillar && (
            <span className="shrink-0 rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
              {PILLAR_LABEL[alert.pillar]}
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted">
          {alert.academyName} · {alert.district} · {timeAgo(alert.createdAt)}
        </p>
        {actions && <div className="mt-2 flex gap-2">{actions}</div>}
      </div>
      <div className="shrink-0">
        <StatusBadge status={STATUS_MAP[alert.status]} />
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {body}
      </Link>
    );
  }
  return body;
}
