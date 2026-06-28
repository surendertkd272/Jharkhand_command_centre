"use client";

import * as React from "react";
import {
  Warehouse,
  Building2,
  User,
  ChevronRight,
  Package,
  AlertTriangle,
  ShieldAlert,
  UtensilsCrossed,
  Clock,
  Wrench,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Page } from "@/components/Page";
import { StatCard } from "@/components/StatCard";
import { SectionCard } from "@/components/SectionCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatRs } from "@/lib/utils";
import { CHART, axisProps, tooltipStyle } from "@/lib/chartTheme";
import {
  KIT_RECON,
  NUTRITION,
  SLA_TICKETS,
  ITEMS_TRACKED,
  KIT_VARIANCE_VALUE,
  PILFERAGE_FLAGS,
  NUTRITION_LEAKAGE,
  SLA_AVG_RESOLUTION_HOURS,
  SLA_BREACHES,
} from "@/lib/mock/resources";
import type { NutritionRow, SLATicket } from "@/lib/types";

// ----------------------------------------------------------------------------
// Local derived helpers (mirror the mock's flag logic for the UI)
// ----------------------------------------------------------------------------
const KIT_MATERIAL = (dispatched: number, biometricReceipt: number) =>
  dispatched - biometricReceipt > Math.max(2, dispatched * 0.05);

const NUT_MATERIAL = (billed: number, verified: number) =>
  billed - verified > billed * 0.05;

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

// ============================================================================
// TAB 1 — Procurement & Kit
// ============================================================================
function ProcurementTab() {
  const totalDispatched = sum(KIT_RECON.map((r) => r.dispatched));
  const totalReceived = sum(KIT_RECON.map((r) => r.receivedAtAcademy));
  const totalBiometric = sum(KIT_RECON.map((r) => r.biometricReceipt));

  const flowNodes = [
    {
      icon: Warehouse,
      label: "State Warehouse",
      sub: "Dispatched",
      qty: totalDispatched,
      tint: "bg-tint-blue text-info",
    },
    {
      icon: Building2,
      label: "Academy Stores",
      sub: "Received at academy",
      qty: totalReceived,
      tint: "bg-tint-violet text-[#7c3aed]",
    },
    {
      icon: User,
      label: "Athlete (biometric)",
      sub: "Biometric receipt",
      qty: totalBiometric,
      tint: "bg-lime-100 text-ink-900",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Flow visual */}
      <SectionCard
        title="Procurement chain of custody"
        subtitle="Every unit tracked warehouse → academy → athlete biometric receipt"
      >
        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
          {flowNodes.map((n, i) => (
            <React.Fragment key={n.label}>
              <div className="flex flex-1 items-center gap-4 rounded-3xl border border-line bg-white px-5 py-4 shadow-soft">
                <span
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-full",
                    n.tint,
                  )}
                >
                  <n.icon className="h-6 w-6" strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {n.sub}
                  </p>
                  <p className="truncate text-sm font-semibold text-ink-900">
                    {n.label}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 tabular">
                    {n.qty.toLocaleString("en-IN")}
                    <span className="ml-1 text-sm font-medium text-muted">
                      units
                    </span>
                  </p>
                </div>
              </div>
              {i < flowNodes.length - 1 && (
                <div className="flex shrink-0 items-center justify-center lg:flex-col">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-muted">
                    <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
                  </span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Leakage between hops ={" "}
          <span className="font-semibold text-danger">
            {(totalDispatched - totalBiometric).toLocaleString("en-IN")} units
          </span>{" "}
          unaccounted from dispatch to athlete biometric confirmation.
        </p>
      </SectionCard>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Items tracked"
          value={ITEMS_TRACKED.toLocaleString("en-IN")}
          icon={Package}
          tint="blue"
          hint="Units dispatched across all academies"
        />
        <StatCard
          label="Variance value"
          value={formatRs(KIT_VARIANCE_VALUE)}
          icon={AlertTriangle}
          tint="red"
          accent
          hint="Rs value of phantom-inventory gaps"
        />
        <StatCard
          label="Pilferage flags"
          value={PILFERAGE_FLAGS}
          icon={ShieldAlert}
          tint="orange"
          hint="Rows with material dispatch-to-athlete gap"
        />
      </div>

      {/* Reconciliation table */}
      <SectionCard
        title="Kit reconciliation ledger"
        subtitle="Dispatched vs biometric receipt by the athlete"
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Academy</TableHead>
              <TableHead className="text-right">Dispatched</TableHead>
              <TableHead className="text-right">Received @ Academy</TableHead>
              <TableHead className="text-right">Biometric receipt</TableHead>
              <TableHead className="text-right">Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {KIT_RECON.map((r) => {
              const variance = r.dispatched - r.biometricReceipt;
              const flagged = KIT_MATERIAL(r.dispatched, r.biometricReceipt);
              return (
                <TableRow
                  key={r.id}
                  className={cn(flagged && "bg-tint-red/40 hover:bg-tint-red/60")}
                >
                  <TableCell className="font-medium">{r.item}</TableCell>
                  <TableCell className="text-muted">{r.academyName}</TableCell>
                  <TableCell className="text-right tabular">
                    {r.dispatched}
                  </TableCell>
                  <TableCell className="text-right tabular">
                    {r.receivedAtAcademy}
                  </TableCell>
                  <TableCell className="text-right tabular">
                    {r.biometricReceipt}
                  </TableCell>
                  <TableCell className="text-right">
                    {flagged ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold tabular text-danger">
                          −{variance}
                        </span>
                        <StatusBadge status="flagged" />
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}

// ============================================================================
// TAB 2 — Nutrition Billing
// ============================================================================
function NutritionTab() {
  const [active, setActive] = React.useState<NutritionRow | null>(null);

  const chartData = NUTRITION.map((r) => ({
    name: r.academyName
      .replace(/ Academy| Centre| Excellence| PEC/g, "")
      .slice(0, 14),
    billed: r.platesBilled,
    verified: r.verifiedCheckIns,
  }));

  return (
    <div className="space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Total mess leakage"
          value={formatRs(NUTRITION_LEAKAGE)}
          icon={AlertTriangle}
          tint="red"
          accent
          hint="Billed plates with no biometric meal check-in"
        />
        <StatCard
          label="Academies billed"
          value={NUTRITION.length}
          icon={UtensilsCrossed}
          tint="blue"
          hint="Mess vendors reconciled this cycle"
        />
        <StatCard
          label="Flagged for leakage"
          value={
            NUTRITION.filter((r) =>
              NUT_MATERIAL(r.platesBilled, r.verifiedCheckIns),
            ).length
          }
          icon={ShieldAlert}
          tint="orange"
          hint="Billed plates materially exceed check-ins"
        />
      </div>

      {/* Grouped bar chart */}
      <SectionCard
        title="Plates billed vs biometric meal check-ins"
        subtitle="Grouped by academy — the gap is mess billing leakage"
      >
        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
              barGap={4}
            >
              <CartesianGrid
                vertical={false}
                stroke={CHART.grid}
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="name"
                {...axisProps}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={64}
              />
              <YAxis {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              />
              <Bar
                name="Plates billed"
                dataKey="billed"
                fill={CHART.info}
                radius={[6, 6, 0, 0]}
                maxBarSize={26}
              />
              <Bar
                name="Verified check-ins"
                dataKey="verified"
                fill={CHART.lime}
                radius={[6, 6, 0, 0]}
                maxBarSize={26}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Per-academy reconciliation */}
      <SectionCard
        title="Mess billing reconciliation"
        subtitle="Click a row to inspect the 7-day biometric check-in pattern"
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Academy</TableHead>
              <TableHead className="text-right">Plates billed</TableHead>
              <TableHead className="text-right">Verified check-ins</TableHead>
              <TableHead className="text-right">Leakage (Rs)</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {NUTRITION.map((r) => {
              const gapPlates = r.platesBilled - r.verifiedCheckIns;
              const leakage = gapPlates * r.ratePerPlate;
              const flagged = NUT_MATERIAL(r.platesBilled, r.verifiedCheckIns);
              const hero = r.academyId === "ac-16";
              return (
                <TableRow
                  key={r.id}
                  className={cn(
                    hero && "bg-tint-red/50 hover:bg-tint-red/70",
                    !hero && flagged && "bg-tint-orange/30",
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {r.academyName}
                      {hero && (
                        <Badge tone="danger">Hero flag</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular">
                    {r.platesBilled.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right tabular">
                    {r.verifiedCheckIns.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-right">
                    {flagged ? (
                      <span className="font-bold tabular text-danger">
                        {formatRs(leakage)}
                      </span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {flagged ? (
                      <StatusBadge status="flagged" pulse={hero} />
                    ) : (
                      <StatusBadge status="verified" />
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActive(r)}
                    >
                      Inspect
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      <NutritionDrillDialog
        row={active}
        onClose={() => setActive(null)}
      />
    </div>
  );
}

function heatColor(v: number): string {
  if (v >= 90) return "bg-ok text-white";
  if (v >= 75) return "bg-ok/70 text-white";
  if (v >= 60) return "bg-warn text-white";
  if (v >= 45) return "bg-danger/70 text-white";
  return "bg-danger text-white";
}

function NutritionDrillDialog({
  row,
  onClose,
}: {
  row: NutritionRow | null;
  onClose: () => void;
}) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (!row) return null;
  const gapPlates = row.platesBilled - row.verifiedCheckIns;
  const leakage = gapPlates * row.ratePerPlate;
  const flagged = NUT_MATERIAL(row.platesBilled, row.verifiedCheckIns);
  return (
    <Dialog open={!!row} onOpenChange={(o) => !o && onClose()}>
      <DialogHeader>
        <DialogTitle>{row.academyName}</DialogTitle>
        <DialogDescription>
          7-day biometric meal check-in pattern (% of mess capacity)
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-7 gap-1.5">
        {row.dailyCheckIns.map((v, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                "grid h-14 w-full place-items-center rounded-xl text-sm font-bold tabular",
                heatColor(v),
              )}
            >
              {v}
            </div>
            <span className="text-[11px] font-medium text-muted">
              {days[i]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="text-xs text-muted">Plates billed</p>
          <p className="text-lg font-extrabold text-ink-900 tabular">
            {row.platesBilled.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-3">
          <p className="text-xs text-muted">Verified check-ins</p>
          <p className="text-lg font-extrabold text-ink-900 tabular">
            {row.verifiedCheckIns.toLocaleString("en-IN")}
          </p>
        </div>
        <div
          className={cn(
            "rounded-2xl border p-3",
            flagged ? "border-danger/30 bg-tint-red/40" : "border-line bg-white",
          )}
        >
          <p className="text-xs text-muted">Leakage @ {formatRs(row.ratePerPlate)}/plate</p>
          <p
            className={cn(
              "text-lg font-extrabold tabular",
              flagged ? "text-danger" : "text-ink-900",
            )}
          >
            {flagged ? formatRs(leakage) : "—"}
          </p>
        </div>
      </div>

      {flagged && (
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-tint-red/40 p-3 text-sm text-danger">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Billed plates exceed biometric check-ins by{" "}
            <span className="font-bold">
              {gapPlates.toLocaleString("en-IN")}
            </span>{" "}
            — vendor invoice held pending physical mess audit.
          </span>
        </p>
      )}
    </Dialog>
  );
}

// ============================================================================
// TAB 3 — Infrastructure SLA (Kanban)
// ============================================================================
const SLA_COLUMNS: {
  key: SLATicket["status"];
  title: string;
  accent: string;
}[] = [
  { key: "open", title: "Open", accent: "bg-info" },
  { key: "in-progress", title: "In Progress", accent: "bg-warn" },
  { key: "escalated", title: "Escalated", accent: "bg-danger" },
  { key: "resolved", title: "Resolved", accent: "bg-ok" },
];

function SlaCountdownChip({ ticket }: { ticket: SLATicket }) {
  const h = ticket.hoursRemaining;
  if (ticket.status === "resolved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-tint-green px-2.5 py-0.5 text-xs font-semibold text-ok">
        <Clock className="h-3 w-3" /> Closed within SLA
      </span>
    );
  }
  if (h < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-tint-red px-2.5 py-0.5 text-xs font-bold text-danger">
        <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-danger" />
        BREACHED · auto-escalated
      </span>
    );
  }
  if (h <= 24) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-tint-orange px-2.5 py-0.5 text-xs font-semibold text-warn">
        <Clock className="h-3 w-3" /> SLA at-risk · {h}h left
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-tint-green px-2.5 py-0.5 text-xs font-semibold text-ok">
      <Clock className="h-3 w-3" /> {h}h to SLA
    </span>
  );
}

function SlaTicketCard({ ticket }: { ticket: SLATicket }) {
  const breached = ticket.hoursRemaining < 0 && ticket.status !== "resolved";
  return (
    <div
      className={cn(
        "rounded-2xl border bg-white p-3.5 shadow-soft",
        breached ? "border-danger/30" : "border-line",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug text-ink-900">
          {ticket.issue}
        </p>
        {breached && <StatusBadge status="breach" />}
      </div>
      <p className="mt-1 text-xs text-muted">{ticket.academyName}</p>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <Badge tone="neutral">{ticket.category}</Badge>
        <SlaCountdownChip ticket={ticket} />
      </div>
      <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-2.5 text-xs text-muted">
        <Wrench className="h-3.5 w-3.5" />
        <span className="truncate">{ticket.assignedTo}</span>
      </div>
    </div>
  );
}

function SlaTab() {
  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StatCard
          label="Avg resolution time"
          value={`${SLA_AVG_RESOLUTION_HOURS}h`}
          icon={Clock}
          tint="blue"
          hint="Mean closure window of resolved tickets"
        />
        <StatCard
          label="Breaches this month"
          value={SLA_BREACHES}
          icon={AlertTriangle}
          tint="red"
          accent
          hint="Tickets past SLA — auto-escalated to Director (Infra)"
        />
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {SLA_COLUMNS.map((col) => {
          const tickets = SLA_TICKETS.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              className="flex flex-col rounded-card border border-line bg-canvas/60 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", col.accent)} />
                  <h3 className="text-sm font-semibold text-ink-900">
                    {col.title}
                  </h3>
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-muted tabular">
                  {tickets.length}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {tickets.map((t) => (
                  <SlaTicketCard key={t.id} ticket={t} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// PAGE
// ============================================================================
export default function ResourcesPage() {
  return (
    <Page
      title="Resources & Asset Accountability"
      subtitle="Procurement · nutrition billing · infrastructure SLA"
    >
      <Tabs defaultValue="kit">
        <TabsList>
          <TabsTrigger value="kit">Procurement &amp; Kit</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Billing</TabsTrigger>
          <TabsTrigger value="sla">Infrastructure SLA</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="kit">
            <ProcurementTab />
          </TabsContent>
          <TabsContent value="nutrition">
            <NutritionTab />
          </TabsContent>
          <TabsContent value="sla">
            <SlaTab />
          </TabsContent>
        </div>
      </Tabs>
    </Page>
  );
}
