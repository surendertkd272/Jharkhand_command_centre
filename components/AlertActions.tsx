"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { Alert, Pillar } from "@/lib/types";

// Default owning cell per pillar — names match the assignees in the alert mock.
const PILLAR_OWNER: Record<Pillar, string> = {
  integrity: "Identity Cell — R. Mahato",
  resources: "Audit Desk — S. Tudu",
  finance: "Finance Cell — I. Hussain",
  welfare: "State Medical Board — Dr. P. Kujur",
  academies: "District Sports Officer",
};

type Override = Partial<Pick<Alert, "status" | "assignedTo">>;

export interface AlertTriage {
  alerts: Alert[];
  acknowledge: (a: Alert) => void;
  assign: (a: Alert) => void;
  resolve: (a: Alert) => void;
}

/**
 * Session-local triage over a fixed alert list. Actions update the alert's
 * status / assignee in place (so badges and tab counts move) and confirm with
 * a toast. Nothing is persisted — this is a demo build.
 */
export function useAlertTriage(source: Alert[]): AlertTriage {
  const toast = useToast();
  const [overrides, setOverrides] = React.useState<Record<string, Override>>({});

  const alerts = React.useMemo(
    () => source.map((a) => (overrides[a.id] ? { ...a, ...overrides[a.id] } : a)),
    [source, overrides],
  );

  const patch = (id: string, o: Override) =>
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], ...o } }));

  return {
    alerts,
    acknowledge: (a) => {
      patch(a.id, { status: "acknowledged" });
      toast({ title: "Alert acknowledged", description: `${a.title} · ${a.academyName}` });
    },
    assign: (a) => {
      const owner = PILLAR_OWNER[a.pillar];
      patch(a.id, {
        assignedTo: owner,
        status: a.status === "open" ? "acknowledged" : a.status,
      });
      toast({ title: `Assigned to ${owner}`, description: a.title, tone: "info" });
    },
    resolve: (a) => {
      patch(a.id, { status: "resolved" });
      toast({ title: "Alert resolved", description: `${a.title} · ${a.academyName}` });
    },
  };
}

/** Quick-action buttons for one alert row. Safe inside a linked AlertRow. */
export function AlertActions({
  alert,
  triage,
  showResolve = false,
}: {
  alert: Alert;
  triage: AlertTriage;
  showResolve?: boolean;
}) {
  const toast = useToast();

  // Rows may be wrapped in a <Link>; keep button clicks from navigating.
  const run = (fn: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fn();
  };

  if (alert.status === "resolved") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={run(() =>
          toast({
            title: "Audit trail",
            description: `Raised ${new Date(alert.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} · closed by ${alert.assignedTo ?? "State Sports Cell"}`,
            tone: "info",
          }),
        )}
      >
        View audit trail
      </Button>
    );
  }

  // Escalated alerts are already routed to a cell or board — no acknowledge step.
  const acknowledged = alert.status === "acknowledged";
  return (
    <>
      {alert.status !== "escalated" && (
        <Button
          variant="subtle"
          size="sm"
          disabled={acknowledged}
          onClick={run(() => triage.acknowledge(alert))}
        >
          {acknowledged && <Check className="h-3.5 w-3.5" />}
          {acknowledged ? "Acknowledged" : "Acknowledge"}
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={run(() => triage.assign(alert))}>
        Assign
      </Button>
      {showResolve && (
        <Button variant="primary" size="sm" onClick={run(() => triage.resolve(alert))}>
          Resolve
        </Button>
      )}
    </>
  );
}
