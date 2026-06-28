"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  Heart,
  LogOut,
  AlertTriangle,
  TrendingDown,
  Lock,
  ShieldAlert,
  Check,
  Clock,
} from "lucide-react";

import { Page } from "@/components/Page";
import { SectionCard } from "@/components/SectionCard";
import { StatCard } from "@/components/StatCard";
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetHeader, SheetTitle, SheetBody } from "@/components/ui/sheet";

import {
  MONTHLY_EXITS,
  EXIT_REASONS,
  AT_RISK,
  INJURY_LEDGER,
  RETENTION_RATE,
  EXITS_THIS_QUARTER,
  AT_RISK_TOTAL,
} from "@/lib/mock/welfare";
import { CHART, CHART_SERIES, axisProps, tooltipStyle } from "@/lib/chartTheme";
import { cn } from "@/lib/utils";
import type { InjuryLedgerRow } from "@/lib/types";

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
const fmtDate = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const RISK_TONE: Record<
  string,
  { badge: React.ComponentProps<typeof StatusBadge>["status"]; label: string }
> = {
  critical: { badge: "blocked", label: "Critical" },
  high: { badge: "paused", label: "High" },
  medium: { badge: "at-risk", label: "Medium" },
  low: { badge: "pending", label: "Low" },
};

function attendanceTone(rate: number): "danger" | "warn" {
  return rate < 55 ? "danger" : "warn";
}

const TOTAL_EXIT_REASONS = EXIT_REASONS.reduce((s, r) => s + r.count, 0);

// ----------------------------------------------------------------------------
// Exit Tracking tab
// ----------------------------------------------------------------------------
function ExitTracking() {
  return (
    <div className="space-y-6">
      {/* KPI tiles */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Retention rate"
          value={`${RETENTION_RATE}%`}
          icon={Heart}
          tint="green"
          delta={3}
          deltaSuffix="pp"
          hint="Roster retained over trailing year"
        />
        <StatCard
          label="Exits this quarter"
          value={EXITS_THIS_QUARTER}
          icon={LogOut}
          tint="orange"
          delta={-8}
          deltaInvert
          hint="Apr + May + Jun bookings"
        />
        <StatCard
          label="At-risk athletes"
          value={AT_RISK_TOTAL}
          icon={AlertTriangle}
          tint="red"
          accent
          hint="Flagged before they leave"
        />
      </div>

      {/* Monthly exits + Exit reasons */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard
          title="Monthly Exits"
          subtitle="Trailing 12 months · trending down"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={MONTHLY_EXITS}
              margin={{ top: 8, right: 12, bottom: 0, left: -16 }}
            >
              <CartesianGrid
                stroke={CHART.grid}
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis allowDecimals={false} {...axisProps} />
              <Tooltip {...tooltipStyle} />
              <Line
                type="monotone"
                dataKey="exits"
                name="Exits"
                stroke={CHART.ink}
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: CHART.ink, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: CHART.ink, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard
          title="Exit Reasons"
          subtitle={`${TOTAL_EXIT_REASONS} exits classified`}
        >
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <ResponsiveContainer width="100%" height={220} className="!w-1/2">
              <PieChart>
                <Tooltip {...tooltipStyle} />
                <Pie
                  data={EXIT_REASONS}
                  dataKey="count"
                  nameKey="reason"
                  innerRadius={52}
                  outerRadius={84}
                  paddingAngle={2}
                  stroke="none"
                >
                  {EXIT_REASONS.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_SERIES[i % CHART_SERIES.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="flex-1 space-y-2.5">
              {EXIT_REASONS.map((r, i) => (
                <li
                  key={r.reason}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex items-center gap-2 text-ink-700">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background: CHART_SERIES[i % CHART_SERIES.length],
                      }}
                    />
                    {r.reason}
                  </span>
                  <span className="font-semibold text-ink-900 tabular">
                    {r.count}
                    <span className="ml-1.5 text-xs font-medium text-muted">
                      {Math.round((r.count / TOTAL_EXIT_REASONS) * 100)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </SectionCard>
      </div>

      {/* At-risk athletes */}
      <SectionCard
        title="At-risk athletes — flagged before they leave"
        subtitle="Biometric attendance trending down · proactive intervention queue"
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Athlete</TableHead>
              <TableHead>Academy</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead className="w-[200px]">Attendance</TableHead>
              <TableHead className="text-center">Missed</TableHead>
              <TableHead>Risk level</TableHead>
              <TableHead className="pr-5 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {AT_RISK.map((a) => {
              const tone = attendanceTone(a.attendanceRate);
              const risk = RISK_TONE[a.riskLevel];
              return (
                <TableRow key={a.id}>
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={a.athleteName} size="sm" />
                      <div>
                        <div className="font-semibold text-ink-900">
                          {a.athleteName}
                        </div>
                        <div className="text-xs text-muted">{a.district}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-700">{a.academyName}</TableCell>
                  <TableCell>
                    <Badge tone="neutral">{a.sport}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TrendingDown
                        className={cn(
                          "h-4 w-4 shrink-0",
                          tone === "danger" ? "text-danger" : "text-warn",
                        )}
                      />
                      <span
                        className={cn(
                          "w-9 shrink-0 text-sm font-semibold tabular",
                          tone === "danger" ? "text-danger" : "text-warn",
                        )}
                      >
                        {a.attendanceRate}%
                      </span>
                      <Progress
                        value={a.attendanceRate}
                        tone={tone}
                        className="flex-1"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-ink-900 tabular">
                    {a.missedSessions}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={risk.badge}
                      label={risk.label}
                      pulse={a.riskLevel === "critical"}
                    />
                  </TableCell>
                  <TableCell className="pr-5 text-right">
                    <Button variant="primary" size="sm">
                      Intervene
                    </Button>
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

// ----------------------------------------------------------------------------
// Injury Ledger tab
// ----------------------------------------------------------------------------
const CLEARANCE_BADGE: Record<
  InjuryLedgerRow["clearance"],
  { status: React.ComponentProps<typeof StatusBadge>["status"]; label?: string }
> = {
  cleared: { status: "cleared" },
  pending: { status: "pending" },
  blocked: { status: "blocked", label: "Override blocked" },
};

function InjuryLedger() {
  const [selected, setSelected] = React.useState<InjuryLedgerRow | null>(null);

  return (
    <div className="space-y-6">
      {/* Explainer banner */}
      <div className="flex items-start gap-3 rounded-card border border-info/30 bg-tint-blue px-5 py-4">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-info/15 text-info">
          <ShieldAlert className="h-[18px] w-[18px]" strokeWidth={2.2} />
        </span>
        <div className="text-sm">
          <p className="font-semibold text-ink-900">
            Independent clearance required before return to active trials
          </p>
          <p className="mt-0.5 text-ink-700">
            No injured athlete may return to active trials or competition until
            an{" "}
            <span className="font-semibold">independent state medical board</span>{" "}
            issues clearance. Academy coaches and physios cannot override this
            gate.
          </p>
        </div>
      </div>

      <SectionCard
        title="Injury Ledger"
        subtitle="Clearance gated by the state medical board · click a row for the full timeline"
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Athlete</TableHead>
              <TableHead>Academy</TableHead>
              <TableHead>Injury</TableHead>
              <TableHead>Reported by</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="pr-5">Medical clearance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INJURY_LEDGER.map((row) => {
              const isHero = row.overrideAttempt && row.clearance === "blocked";
              const badge = CLEARANCE_BADGE[row.clearance];
              return (
                <TableRow
                  key={row.id}
                  onClick={() => setSelected(row)}
                  className={cn(
                    "cursor-pointer",
                    isHero &&
                      "bg-tint-red hover:bg-tint-red/80 border-l-4 border-l-danger",
                  )}
                >
                  <TableCell className="pl-5">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar name={row.athleteName} size="sm" />
                        {isHero && (
                          <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-danger text-white ring-2 ring-card">
                            <Lock className="h-2.5 w-2.5" strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                      <div>
                        <div
                          className={cn(
                            "font-semibold text-ink-900",
                            isHero && "text-danger",
                          )}
                        >
                          {row.athleteName}
                        </div>
                        {isHero && (
                          <div className="mt-0.5 flex items-center gap-1 text-xs font-medium text-danger">
                            <Lock className="h-3 w-3" strokeWidth={2.4} />
                            Coach re-activation BLOCKED — awaiting independent
                            state medical clearance
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-700">
                    {row.academyName}
                  </TableCell>
                  <TableCell className="text-ink-700">{row.injury}</TableCell>
                  <TableCell className="text-ink-700">{row.reportedBy}</TableCell>
                  <TableCell className="text-muted tabular">
                    {fmtDate(row.date)}
                  </TableCell>
                  <TableCell className="pr-5">
                    <StatusBadge
                      status={badge.status}
                      label={badge.label}
                      pulse={isHero}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </SectionCard>

      <ClearanceSheet
        row={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Clearance timeline sheet (vertical stepper)
// ----------------------------------------------------------------------------
function ClearanceSheet({
  row,
  onClose,
}: {
  row: InjuryLedgerRow | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!row} onOpenChange={(o) => !o && onClose()}>
      {row && (
        <>
          <SheetHeader>
            <div className="flex items-center gap-3">
              <Avatar name={row.athleteName} size="md" />
              <div>
                <SheetTitle>{row.athleteName}</SheetTitle>
                <p className="mt-0.5 text-sm text-muted">{row.academyName}</p>
              </div>
            </div>
          </SheetHeader>
          <SheetBody className="space-y-5">
            {/* Injury summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line bg-canvas/60 p-3">
                <div className="text-xs font-medium text-muted">Injury</div>
                <div className="mt-1 text-sm font-semibold text-ink-900">
                  {row.injury}
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-canvas/60 p-3">
                <div className="text-xs font-medium text-muted">
                  Reported by
                </div>
                <div className="mt-1 text-sm font-semibold text-ink-900">
                  {row.reportedBy}
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-canvas/60 p-3">
                <div className="text-xs font-medium text-muted">
                  Reported on
                </div>
                <div className="mt-1 text-sm font-semibold text-ink-900 tabular">
                  {fmtDate(row.date)}
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-canvas/60 p-3">
                <div className="text-xs font-medium text-muted">Clearance</div>
                <div className="mt-1">
                  <StatusBadge
                    status={CLEARANCE_BADGE[row.clearance].status}
                    label={CLEARANCE_BADGE[row.clearance].label}
                  />
                </div>
              </div>
            </div>

            {/* Hero beat banner */}
            {row.overrideAttempt && row.clearance === "blocked" && (
              <div className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-tint-red px-4 py-3">
                <Lock
                  className="mt-0.5 h-5 w-5 shrink-0 text-danger"
                  strokeWidth={2.3}
                />
                <p className="text-sm font-medium text-danger">
                  Coach re-activation BLOCKED — athlete cannot return to active
                  trials until the independent state medical board issues
                  clearance. The override attempt has been logged.
                </p>
              </div>
            )}

            {/* Vertical stepper */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-ink-900">
                Clearance timeline
              </h4>
              <ol className="relative space-y-0">
                {row.timeline.map((step, i) => {
                  const isLast = i === row.timeline.length - 1;
                  const isBlocked = /blocked/i.test(step.label);
                  const state: "done" | "blocked" | "locked" = step.done
                    ? "done"
                    : isBlocked
                      ? "blocked"
                      : "locked";
                  return (
                    <li key={i} className="flex gap-3">
                      {/* rail + node */}
                      <div className="flex flex-col items-center">
                        <span
                          className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-full ring-4 ring-card",
                            state === "done" && "bg-ok text-white",
                            state === "blocked" && "bg-danger text-white",
                            state === "locked" && "bg-black/10 text-muted",
                          )}
                        >
                          {state === "done" ? (
                            <Check className="h-4 w-4" strokeWidth={3} />
                          ) : state === "blocked" ? (
                            <Lock className="h-3.5 w-3.5" strokeWidth={2.6} />
                          ) : (
                            <Clock className="h-3.5 w-3.5" strokeWidth={2.4} />
                          )}
                        </span>
                        {!isLast && (
                          <span
                            className={cn(
                              "w-0.5 flex-1",
                              state === "done" ? "bg-ok/40" : "bg-line",
                            )}
                            style={{ minHeight: 22 }}
                          />
                        )}
                      </div>
                      {/* label */}
                      <div className={cn("pb-5", isLast && "pb-0")}>
                        <div
                          className={cn(
                            "text-sm font-semibold",
                            state === "blocked"
                              ? "text-danger"
                              : state === "done"
                                ? "text-ink-900"
                                : "text-ink-700",
                          )}
                        >
                          {step.label}
                        </div>
                        <div className="mt-0.5 text-xs text-muted tabular">
                          {step.at
                            ? fmtDate(step.at)
                            : state === "blocked"
                              ? "Override rejected"
                              : "Awaiting"}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </SheetBody>
        </>
      )}
    </Sheet>
  );
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------
export default function WelfarePage() {
  return (
    <Page
      title="Athlete Welfare & Attrition"
      subtitle="Exit tracking · injury ledger"
      notifications={3}
    >
      <Tabs defaultValue="exits">
        <TabsList>
          <TabsTrigger value="exits">Exit Tracking</TabsTrigger>
          <TabsTrigger value="injury">Injury Ledger</TabsTrigger>
        </TabsList>
        <TabsContent value="exits">
          <ExitTracking />
        </TabsContent>
        <TabsContent value="injury">
          <InjuryLedger />
        </TabsContent>
      </Tabs>
    </Page>
  );
}
