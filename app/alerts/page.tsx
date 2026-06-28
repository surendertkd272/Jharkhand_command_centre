"use client";

import * as React from "react";
import {
  ShieldCheck,
  Boxes,
  Banknote,
  HeartPulse,
  Building2,
  RotateCcw,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { Page } from "@/components/Page";
import { SectionCard } from "@/components/SectionCard";
import { AlertRow } from "@/components/AlertRow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Alert, Pillar, Severity } from "@/lib/types";
import {
  ALERTS,
  OPEN_ALERTS_COUNT,
  ESCALATED_COUNT,
} from "@/lib/mock/alerts";

// ----------------------------------------------------------------------------
// Filter vocabularies
// ----------------------------------------------------------------------------
const PILLARS: { value: Pillar; label: string; icon: LucideIcon }[] = [
  { value: "integrity", label: "Integrity", icon: ShieldCheck },
  { value: "resources", label: "Resources", icon: Boxes },
  { value: "finance", label: "Finance", icon: Banknote },
  { value: "welfare", label: "Welfare", icon: HeartPulse },
  { value: "academies", label: "Academies", icon: Building2 },
];

const SEVERITIES: { value: Severity; label: string; tone: "danger" | "warn" | "info" }[] =
  [
    { value: "critical", label: "Critical", tone: "danger" },
    { value: "high", label: "High", tone: "danger" },
    { value: "medium", label: "Medium", tone: "warn" },
    { value: "low", label: "Low", tone: "info" },
  ];

// Distinct districts present in the feed, alphabetical, with an "all" sentinel.
const DISTRICT_OPTIONS = [
  { value: "all", label: "All districts" },
  ...Array.from(new Set(ALERTS.map((a) => a.district)))
    .sort((a, b) => a.localeCompare(b))
    .map((d) => ({ value: d, label: d })),
];

type TabKey = "all" | "unresolved" | "escalated";

export default function AlertsCenterPage() {
  const [pillars, setPillars] = React.useState<Set<Pillar>>(new Set());
  const [severities, setSeverities] = React.useState<Set<Severity>>(new Set());
  const [district, setDistrict] = React.useState("all");
  const [unresolvedOnly, setUnresolvedOnly] = React.useState(false);

  const togglePillar = (p: Pillar) =>
    setPillars((prev) => {
      const next = new Set(prev);
      next.has(p) ? next.delete(p) : next.add(p);
      return next;
    });

  const toggleSeverity = (s: Severity) =>
    setSeverities((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });

  const resetFilters = () => {
    setPillars(new Set());
    setSeverities(new Set());
    setDistrict("all");
    setUnresolvedOnly(false);
  };

  const activeFilterCount =
    pillars.size +
    severities.size +
    (district !== "all" ? 1 : 0) +
    (unresolvedOnly ? 1 : 0);

  // Apply the left-rail filters (independent of the tab dimension).
  const filtered = React.useMemo(() => {
    return ALERTS.filter((a) => {
      if (pillars.size && !pillars.has(a.pillar)) return false;
      if (severities.size && !severities.has(a.severity)) return false;
      if (district !== "all" && a.district !== district) return false;
      if (unresolvedOnly && a.status === "resolved") return false;
      return true;
    });
  }, [pillars, severities, district, unresolvedOnly]);

  // Tab partitions over the already-filtered set.
  const lists: Record<TabKey, Alert[]> = React.useMemo(
    () => ({
      all: filtered,
      unresolved: filtered.filter((a) => a.status !== "resolved"),
      escalated: filtered.filter((a) => a.status === "escalated"),
    }),
    [filtered],
  );

  return (
    <Page
      title="Alerts Center"
      subtitle="Unified cross-pillar oversight feed"
      notifications={OPEN_ALERTS_COUNT}
      topbarRight={
        <div className="hidden items-center gap-2 sm:flex">
          <Badge tone="danger">{OPEN_ALERTS_COUNT} unresolved</Badge>
          <Badge tone="warn">{ESCALATED_COUNT} escalated</Badge>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_1fr]">
        {/* ---------------------------------------------------------------- */}
        {/* LEFT — filter rail                                               */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-6">
          <SectionCard
            title="Filters"
            subtitle={`${filtered.length} of ${ALERTS.length} alerts`}
            action={
              <button
                type="button"
                onClick={resetFilters}
                disabled={activeFilterCount === 0}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                  activeFilterCount === 0
                    ? "cursor-default text-muted/50"
                    : "text-ink-700 hover:bg-black/5",
                )}
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            }
            bodyClassName="space-y-5"
          >
            {/* Pillar pills */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Pillar
              </p>
              <div className="flex flex-wrap gap-2">
                {PILLARS.map((p) => {
                  const Icon = p.icon;
                  const active = pillars.has(p.value);
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => togglePillar(p.value)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                        active
                          ? "border-lime-500 bg-lime-500 text-white"
                          : "border-line bg-white text-ink-700 hover:bg-canvas",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Severity pills */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Severity
              </p>
              <div className="flex flex-wrap gap-2">
                {SEVERITIES.map((s) => {
                  const active = severities.has(s.value);
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => toggleSeverity(s.value)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                        active
                          ? "border-ink-900 bg-ink-900 text-white"
                          : "border-line bg-white text-ink-700 hover:bg-canvas",
                      )}
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          s.tone === "danger" && "bg-danger",
                          s.tone === "warn" && "bg-warn",
                          s.tone === "info" && "bg-info",
                        )}
                      />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* District select */}
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                District
              </p>
              <Select
                value={district}
                onValueChange={setDistrict}
                options={DISTRICT_OPTIONS}
                ariaLabel="Filter by district"
                className="w-full"
              />
            </div>

            <Separator />

            {/* Unresolved-only toggle */}
            <button
              type="button"
              onClick={() => setUnresolvedOnly((v) => !v)}
              aria-pressed={unresolvedOnly}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-white px-3 py-2.5 text-left transition-colors hover:bg-canvas"
            >
              <span>
                <span className="block text-sm font-semibold text-ink-900">
                  Unresolved only
                </span>
                <span className="block text-xs text-muted">
                  Hide resolved alerts
                </span>
              </span>
              <span
                className={cn(
                  "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                  unresolvedOnly ? "bg-lime-500" : "bg-black/15",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-soft transition-transform",
                    unresolvedOnly ? "translate-x-4" : "translate-x-0.5",
                  )}
                />
              </span>
            </button>
          </SectionCard>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* RIGHT — tabbed feed                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="min-w-0">
          <Tabs defaultValue="all">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <TabsList>
                <TabsTrigger value="all">
                  All
                  <CountChip n={lists.all.length} />
                </TabsTrigger>
                <TabsTrigger value="unresolved">
                  Unresolved
                  <CountChip n={lists.unresolved.length} />
                </TabsTrigger>
                <TabsTrigger value="escalated">
                  Escalated
                  <CountChip n={lists.escalated.length} />
                </TabsTrigger>
              </TabsList>
              {activeFilterCount > 0 && (
                <Badge tone="lime">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
                </Badge>
              )}
            </div>

            <TabsContent value="all">
              <AlertFeed
                title="All alerts"
                subtitle="Every signal across the five oversight pillars"
                alerts={lists.all}
              />
            </TabsContent>
            <TabsContent value="unresolved">
              <AlertFeed
                title="Unresolved alerts"
                subtitle="Open, acknowledged and escalated — awaiting closure"
                alerts={lists.unresolved}
              />
            </TabsContent>
            <TabsContent value="escalated">
              <AlertFeed
                title="Escalated alerts"
                subtitle="Routed to a cell, officer or board for action"
                alerts={lists.escalated}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Page>
  );
}

// ----------------------------------------------------------------------------
// Small count chip rendered inside a tab trigger.
// ----------------------------------------------------------------------------
function CountChip({ n }: { n: number }) {
  return (
    <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-black/10 px-1.5 py-0.5 text-[11px] font-bold tabular leading-none">
      {n}
    </span>
  );
}

// ----------------------------------------------------------------------------
// The feed body for one tab — a titled card with quick-action alert rows.
// ----------------------------------------------------------------------------
function AlertFeed({
  title,
  subtitle,
  alerts,
}: {
  title: string;
  subtitle: string;
  alerts: Alert[];
}) {
  return (
    <SectionCard
      title={title}
      subtitle={subtitle}
      action={
        <span className="text-2xl font-extrabold tracking-tight text-ink-900 tabular">
          {alerts.length}
        </span>
      }
      bodyClassName="space-y-3"
    >
      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-canvas/60 py-12 text-center">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-tint-green text-ok">
            <Inbox className="h-5 w-5" />
          </span>
          <p className="text-sm font-semibold text-ink-900">
            No alerts match these filters
          </p>
          <p className="max-w-xs text-xs text-muted">
            Adjust the pillar, severity or district filters on the left to widen
            the feed.
          </p>
        </div>
      ) : (
        alerts.map((a) => (
          <AlertRow
            key={a.id}
            alert={a}
            href={`/academies/${a.academyId}`}
            actions={<RowActions resolved={a.status === "resolved"} />}
          />
        ))
      )}
    </SectionCard>
  );
}

// ----------------------------------------------------------------------------
// Cosmetic quick-action buttons. preventDefault stops the AlertRow link nav.
// ----------------------------------------------------------------------------
function RowActions({ resolved }: { resolved: boolean }) {
  const swallow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  if (resolved) {
    return (
      <Button variant="ghost" size="sm" onClick={swallow}>
        View audit trail
      </Button>
    );
  }
  return (
    <>
      <Button variant="subtle" size="sm" onClick={swallow}>
        Acknowledge
      </Button>
      <Button variant="outline" size="sm" onClick={swallow}>
        Assign
      </Button>
      <Button variant="primary" size="sm" onClick={swallow}>
        Resolve
      </Button>
    </>
  );
}
