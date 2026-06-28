"use client";

import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Wallet,
  Lock,
  Banknote,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";

import { Page } from "@/components/Page";
import { SectionCard } from "@/components/SectionCard";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { ComplianceGauge } from "@/components/ComplianceGauge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
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
  DialogFooter,
} from "@/components/ui/dialog";

import { formatRs, maskAccount } from "@/lib/utils";
import { CHART, axisProps, tooltipStyle } from "@/lib/chartTheme";
import type { FundingRow, ROIRow } from "@/lib/types";
import {
  FUNDING_ROWS,
  DBT_TRANSACTIONS,
  ROI_ROWS,
  FUNDS_ACTIVE,
  FUNDS_ON_HOLD,
  DBT_TOTAL_DISBURSED,
  DBT_PAID_COUNT,
  DBT_IN_TRANSIT_COUNT,
  DBT_FAILED_COUNT,
} from "@/lib/mock/finance";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FUNDING_STATUS_LABEL: Record<FundingRow["status"], string> = {
  active: "Funds active",
  flagged: "Partial hold",
  paused: "Releases frozen",
};

const GRADE_TONE: Record<ROIRow["roiGrade"], "ok" | "lime" | "warn" | "danger"> = {
  A: "ok",
  B: "lime",
  C: "warn",
  D: "danger",
  E: "danger",
};

const GRADE_COLOR: Record<ROIRow["roiGrade"], string> = {
  A: CHART.ok,
  B: CHART.lime,
  C: CHART.warn,
  D: CHART.violet,
  E: CHART.danger,
};

const GRADE_ORDER: ROIRow["roiGrade"][] = ["A", "B", "C", "D", "E"];

// ===========================================================================
// TAB 1 — Conditional Funding
// ===========================================================================

function FundingCard({ row }: { row: FundingRow }) {
  const [open, setOpen] = React.useState(false);
  const needsRelease = row.status === "paused" || row.status === "flagged";

  return (
    <>
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-900">
              {row.academyName}
            </p>
            <p className="mt-0.5 text-xs text-muted">{row.district}</p>
          </div>
          <StatusBadge
            status={row.status}
            pulse={row.status === "paused"}
          />
        </div>

        <div className="flex items-center gap-4">
          <ComplianceGauge
            value={row.complianceScore}
            threshold={row.threshold}
            size={92}
            stroke={9}
            suffix="%"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                Release threshold
              </p>
              <p className="text-sm font-semibold text-ink-900 tabular">
                {row.threshold}% biometric attendance
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                {row.amountActive > 0 ? "Released this cycle" : "Status"}
              </p>
              <p className="text-sm font-semibold text-ink-900 tabular">
                {row.amountActive > 0
                  ? formatRs(row.amountActive)
                  : FUNDING_STATUS_LABEL[row.status]}
              </p>
            </div>
          </div>
        </div>

        {row.amountOnHold > 0 && (
          <div className="flex items-start gap-2 rounded-2xl bg-tint-red px-3 py-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-danger">
                {formatRs(row.amountOnHold)} on hold
              </p>
              {row.reason && (
                <p className="mt-0.5 text-xs text-ink-700">{row.reason}</p>
              )}
            </div>
          </div>
        )}

        {needsRelease && (
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onClick={() => setOpen(true)}
          >
            <Lock className="h-3.5 w-3.5" />
            Release hold
          </Button>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>
          <DialogTitle>Release funding hold for {row.academyName}?</DialogTitle>
          <DialogDescription>
            {row.district} · Compliance {row.complianceScore}% vs {row.threshold}%
            threshold
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-line bg-canvas px-4 py-3">
            <span className="text-sm text-muted">Amount on hold</span>
            <span className="text-base font-extrabold text-ink-900 tabular">
              {formatRs(row.amountOnHold)}
            </span>
          </div>
          {row.reason && (
            <div className="flex items-start gap-2 rounded-2xl bg-tint-red px-4 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-danger">
                  Hold reason
                </p>
                <p className="mt-0.5 text-sm text-ink-900">{row.reason}</p>
              </div>
            </div>
          )}
          <p className="text-xs text-muted">
            Overriding a conditional hold is logged against your sign-off and
            re-routes funds to the academy account immediately.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Confirm release
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function ConditionalFundingTab() {
  const paused = FUNDING_ROWS.filter((r) => r.status === "paused");
  const flagged = FUNDING_ROWS.filter((r) => r.status === "flagged");
  const active = FUNDING_ROWS.filter((r) => r.status === "active");
  const ordered = [...paused, ...flagged, ...active];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Funds active"
          value={formatRs(FUNDS_ACTIVE)}
          icon={Wallet}
          tint="green"
          hint="Released against met compliance"
        />
        <StatCard
          label="Funds on hold"
          value={formatRs(FUNDS_ON_HOLD)}
          icon={Lock}
          tint="red"
          accent
          hint={`${paused.length} paused · ${flagged.length} partial`}
        />
        <StatCard
          label="Academies funded"
          value={FUNDING_ROWS.length}
          icon={Banknote}
          tint="blue"
          hint={`${active.length} clear · ${paused.length + flagged.length} conditional`}
        />
        <StatCard
          label="Release threshold"
          value="60%"
          icon={TrendingUp}
          tint="lime"
          hint="Biometric attendance floor"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ordered.map((row) => (
          <FundingCard key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// TAB 2 — DBT Reconciliation
// ===========================================================================

function DBTTab() {
  const [scheme, setScheme] = React.useState("all");
  const [status, setStatus] = React.useState("all");

  const schemeOptions = React.useMemo(() => {
    const set = Array.from(new Set(DBT_TRANSACTIONS.map((t) => t.scheme)));
    return [
      { value: "all", label: "All schemes" },
      ...set.map((s) => ({ value: s, label: s })),
    ];
  }, []);

  const statusOptions = [
    { value: "all", label: "All statuses" },
    { value: "paid", label: "Paid" },
    { value: "in-transit", label: "In-transit" },
    { value: "failed", label: "Failed" },
  ];

  const rows = DBT_TRANSACTIONS.filter(
    (t) =>
      (scheme === "all" || t.scheme === scheme) &&
      (status === "all" || t.status === status),
  );

  const donutData = [
    { name: "Paid", value: DBT_PAID_COUNT, color: CHART.ok },
    { name: "In-transit", value: DBT_IN_TRANSIT_COUNT, color: CHART.info },
    { name: "Failed", value: DBT_FAILED_COUNT, color: CHART.danger },
  ];
  const totalCount = DBT_PAID_COUNT + DBT_IN_TRANSIT_COUNT + DBT_FAILED_COUNT;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard
          title="Transfer status"
          subtitle="This disbursement cycle"
        >
          <div className="relative h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {donutData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend
                  iconType="circle"
                  formatter={(v) => (
                    <span className="text-xs text-ink-700">{v}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 top-[-26px] grid place-items-center">
              <div className="text-center">
                <p className="text-3xl font-extrabold tracking-tight text-ink-900 tabular">
                  {totalCount}
                </p>
                <p className="text-[11px] font-medium text-muted">transfers</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-tint-green px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
              Total disbursed
            </p>
            <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-ink-900 tabular">
              {formatRs(DBT_TOTAL_DISBURSED)}
            </p>
            <p className="mt-0.5 text-xs text-ink-700">
              {DBT_PAID_COUNT} paid · {DBT_IN_TRANSIT_COUNT} in-transit ·{" "}
              <span className="font-semibold text-danger">
                {DBT_FAILED_COUNT} failed
              </span>
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="DBT ledger"
          subtitle="Direct benefit transfers to athlete accounts"
          action={
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={scheme}
                onValueChange={setScheme}
                options={schemeOptions}
                ariaLabel="Filter by scheme"
              />
              <Select
                value={status}
                onValueChange={setStatus}
                options={statusOptions}
                ariaLabel="Filter by status"
              />
            </div>
          }
          noPadding
        >
          <div className="px-2 pb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Athlete</TableHead>
                  <TableHead>Scheme</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={t.athleteName} size="sm" />
                        <span className="font-medium">{t.athleteName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-ink-700">{t.scheme}</TableCell>
                    <TableCell className="text-right font-semibold tabular">
                      {formatRs(t.amount, { compact: false })}
                    </TableCell>
                    <TableCell>
                      <div className="leading-tight">
                        <p className="font-medium tabular">
                          {maskAccount(t.bankAccount)}
                        </p>
                        <p className="text-xs text-muted">{t.bankName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <StatusBadge status={t.status} />
                        {t.status === "failed" && t.failureReason && (
                          <p className="text-xs text-danger">
                            {t.failureReason}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {t.status === "failed" ? (
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-3.5 w-3.5" />
                          Retry
                        </Button>
                      ) : (
                        <span className="text-xs text-muted tabular">
                          {t.date}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

// ===========================================================================
// TAB 3 — Academy ROI
// ===========================================================================

function RoiTab() {
  const [sortKey, setSortKey] = React.useState<"roi" | "costPerAthlete">("roi");

  const sortOptions = [
    { value: "roi", label: "Sort: ROI grade (best first)" },
    { value: "costPerAthlete", label: "Sort: Cost-per-athlete (lowest first)" },
  ];

  const rows = React.useMemo(() => {
    const copy = [...ROI_ROWS];
    if (sortKey === "costPerAthlete") {
      copy.sort((a, b) => a.costPerAthlete - b.costPerAthlete);
    } else {
      copy.sort(
        (a, b) =>
          GRADE_ORDER.indexOf(a.roiGrade) - GRADE_ORDER.indexOf(b.roiGrade) ||
          b.stateSelections +
            b.nationalSelections -
            (a.stateSelections + a.nationalSelections),
      );
    }
    return copy;
  }, [sortKey]);

  const setSort = (k: string) =>
    setSortKey(k === "costPerAthlete" ? "costPerAthlete" : "roi");

  const scatterByGrade = React.useMemo(() => {
    return GRADE_ORDER.map((g) => ({
      grade: g,
      points: ROI_ROWS.filter((r) => r.roiGrade === g).map((r) => ({
        x: r.annualCost,
        y: r.stateSelections + r.nationalSelections,
        name: r.academyName,
        grade: r.roiGrade,
      })),
    })).filter((s) => s.points.length > 0);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
        <SectionCard
          title="Academy ROI ranking"
          subtitle="Annual cost vs talent output"
          action={
            <Select
              value={sortKey}
              onValueChange={setSort}
              options={sortOptions}
              ariaLabel="Sort academies"
            />
          }
          noPadding
        >
          <div className="px-2 pb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academy</TableHead>
                  <TableHead className="text-right">Annual cost</TableHead>
                  <TableHead className="text-right">Developed</TableHead>
                  <TableHead className="text-right">State</TableHead>
                  <TableHead className="text-right">National</TableHead>
                  <TableHead className="text-right">Cost / athlete</TableHead>
                  <TableHead className="text-center">ROI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="font-medium">{r.academyName}</p>
                      <p className="text-xs text-muted">{r.district}</p>
                    </TableCell>
                    <TableCell className="text-right tabular">
                      {formatRs(r.annualCost)}
                    </TableCell>
                    <TableCell className="text-right tabular">
                      {r.athletesDeveloped}
                    </TableCell>
                    <TableCell className="text-right tabular">
                      {r.stateSelections}
                    </TableCell>
                    <TableCell className="text-right tabular">
                      {r.nationalSelections}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular">
                      {formatRs(r.costPerAthlete)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge tone={GRADE_TONE[r.roiGrade]}>{r.roiGrade}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard
          title="Cost vs selections"
          subtitle="Each dot is an academy, colored by ROI grade"
        >
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                margin={{ top: 12, right: 16, bottom: 28, left: 8 }}
              >
                <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" />
                <XAxis
                  {...axisProps}
                  type="number"
                  dataKey="x"
                  name="Annual cost"
                  tickFormatter={(v) => formatRs(v)}
                  label={{
                    value: "Annual cost →",
                    position: "insideBottom",
                    offset: -14,
                    fill: CHART.muted,
                    fontSize: 11,
                  }}
                />
                <YAxis
                  {...axisProps}
                  type="number"
                  dataKey="y"
                  name="Selections"
                  label={{
                    value: "Selections",
                    angle: -90,
                    position: "insideLeft",
                    fill: CHART.muted,
                    fontSize: 11,
                  }}
                />
                <ZAxis range={[120, 120]} />
                <Tooltip
                  {...tooltipStyle}
                  cursor={{ strokeDasharray: "3 3", stroke: CHART.grid }}
                  formatter={(value: number, name: string) =>
                    name === "Annual cost"
                      ? [formatRs(value), name]
                      : [value, name]
                  }
                  labelFormatter={() => ""}
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const p = payload[0].payload as {
                      name: string;
                      x: number;
                      y: number;
                      grade: ROIRow["roiGrade"];
                    };
                    return (
                      <div className="rounded-xl border border-line bg-white px-3 py-2 shadow-lift">
                        <p className="text-xs font-semibold text-ink-900">
                          {p.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatRs(p.x)} · {p.y} selections · Grade {p.grade}
                        </p>
                      </div>
                    );
                  }}
                />
                {scatterByGrade.map((s) => (
                  <Scatter
                    key={s.grade}
                    name={`Grade ${s.grade}`}
                    data={s.points}
                    fill={GRADE_COLOR[s.grade]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 flex items-start gap-1.5 text-xs text-muted">
            <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 rotate-90 text-danger" />
            Over-funded under-performers sit bottom-right (high cost, few
            selections) — grade E academies to re-scope first.
          </p>
        </SectionCard>
      </div>
    </div>
  );
}

// ===========================================================================
// Page
// ===========================================================================

export default function FinancePage() {
  return (
    <Page
      title="Financial Controls"
      subtitle="Conditional funding · DBT reconciliation · academy ROI"
      notifications={DBT_FAILED_COUNT}
    >
      <Tabs defaultValue="funding">
        <TabsList>
          <TabsTrigger value="funding">Conditional Funding</TabsTrigger>
          <TabsTrigger value="dbt">DBT Reconciliation</TabsTrigger>
          <TabsTrigger value="roi">Academy ROI</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="funding">
            <ConditionalFundingTab />
          </TabsContent>
          <TabsContent value="dbt">
            <DBTTab />
          </TabsContent>
          <TabsContent value="roi">
            <RoiTab />
          </TabsContent>
        </div>
      </Tabs>
    </Page>
  );
}
