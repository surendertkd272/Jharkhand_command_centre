"use client";

import * as React from "react";
import Link from "next/link";
import {
  Activity,
  HeartPulse,
  AlertTriangle,
  Gauge,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Page } from "@/components/Page";
import { StatCard } from "@/components/StatCard";
import { SectionCard } from "@/components/SectionCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/ui/avatar";
import { Select } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AreaTrend } from "@/components/charts/AreaTrend";
import { cn, timeAgo } from "@/lib/utils";
import { ATHLETE_BY_ID } from "@/lib/mock/athletes";
import { ACADEMY_BY_ID } from "@/lib/mock/academies";
import { ACWR_DANGER, ACWR_HIGH, ACWR_LOW } from "@/lib/integrations/types";
import type {
  AthletePhysiology,
  FleetPhysiology,
  IntegrationStatus,
  RiskLevel,
} from "@/lib/integrations/types";
import type { StatusKind } from "@/lib/types";

const RISK_BADGE: Record<RiskLevel, { status: StatusKind; label: string }> = {
  low: { status: "resolved", label: "Low" },
  moderate: { status: "flagged", label: "Moderate" },
  high: { status: "breach", label: "High" },
};

const READINESS_BADGE = {
  optimal: { status: "active", label: "Optimal" },
  moderate: { status: "pending", label: "Moderate" },
  compromised: { status: "breach", label: "Compromised" },
} as const;

function acwrTone(acwr: number): "ok" | "warn" | "danger" {
  if (acwr > ACWR_DANGER) return "danger";
  if (acwr > ACWR_HIGH || acwr < ACWR_LOW) return "warn";
  return "ok";
}
const TONE_TEXT = { ok: "text-ok", warn: "text-warn", danger: "text-danger" };

export function MonitoringDashboard({ fleet }: { fleet: FleetPhysiology }) {
  const [risk, setRisk] = React.useState("all");

  const rows = React.useMemo(() => {
    const order: Record<RiskLevel, number> = { high: 0, moderate: 1, low: 2 };
    return fleet.athletes
      .filter((p) => risk === "all" || p.injuryRisk === risk)
      .sort((a, b) => order[a.injuryRisk] - order[b.injuryRisk]);
  }, [fleet.athletes, risk]);

  return (
    <Page
      title="Load & Recovery Monitoring"
      subtitle="Live physiological data fetched from Firstbeat & Myoact"
    >
      {/* Connected integrations */}
      <div className="grid gap-4 md:grid-cols-2">
        {fleet.status.map((s) => (
          <IntegrationCard key={s.id} s={s} />
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-5">
        <StatCard label="Athletes Tracked" value={fleet.summary.tracked} icon={Activity} tint="blue" />
        <StatCard label="Optimal Readiness" value={fleet.summary.optimal} icon={Gauge} tint="green" />
        <StatCard label="High Injury-Risk" value={fleet.summary.highRisk} icon={AlertTriangle} tint="red" accent />
        <StatCard label="ACWR Out of Range" value={fleet.summary.acwrOutOfRange} icon={Zap} tint="orange" hint="Outside 0.8–1.3 sweet spot" />
        <StatCard label="Avg Recovery" value={`${fleet.summary.avgRecovery}/100`} icon={HeartPulse} tint="violet" />
      </div>

      {/* Fleet load trend */}
      <SectionCard
        title="Fleet Training Load"
        subtitle="Average daily load (TRIMP) across all tracked athletes · last 14 days"
      >
        <AreaTrend data={fleet.summary.loadTrend} dataKey="value" domain={[0, "auto"]} />
      </SectionCard>

      {/* Athlete table */}
      <SectionCard
        title="Athlete Load & Recovery"
        subtitle="Fetched per athlete from Firstbeat (HRV, load, recovery) + Myoact (muscle asymmetry)"
        action={
          <Select
            value={risk}
            onValueChange={setRisk}
            ariaLabel="Filter by injury risk"
            options={[
              { value: "all", label: "All risk levels" },
              { value: "high", label: "High risk" },
              { value: "moderate", label: "Moderate" },
              { value: "low", label: "Low" },
            ]}
          />
        }
        noPadding
      >
        <div className="px-2 pb-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-3">Athlete</TableHead>
                <TableHead>Weekly load</TableHead>
                <TableHead>ACWR</TableHead>
                <TableHead>Recovery</TableHead>
                <TableHead>L/R asym.</TableHead>
                <TableHead>Readiness</TableHead>
                <TableHead className="pr-3">Injury risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((p) => (
                <AthleteRow key={p.athleteId} p={p} />
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </Page>
  );
}

function IntegrationCard({ s }: { s: IntegrationStatus }) {
  return (
    <div className="flex items-start gap-4 rounded-card border border-line bg-card p-5 shadow-soft">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-tint-blue text-info">
        <Activity className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink-900">{s.name}</p>
          <StatusBadge status="verified" label={s.live ? "Live" : "Connected"} pulse />
        </div>
        <p className="mt-0.5 text-xs text-muted">{s.vendor}</p>
        <p className="mt-2 text-xs text-ink-700">{s.metrics}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted">
          <span className="inline-flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Synced {timeAgo(s.lastSync)}
          </span>
          <span>{s.athletesTracked} athletes</span>
        </div>
        <p className="mt-1.5 text-[11px] text-muted">{s.api}</p>
        {!s.live && (
          <p className="mt-1.5 text-[11px] font-medium text-warn">
            Demo data — set the vendor env vars to switch this source live.
          </p>
        )}
      </div>
    </div>
  );
}

function AthleteRow({ p }: { p: AthletePhysiology }) {
  const athlete = ATHLETE_BY_ID[p.athleteId];
  const academy = athlete ? ACADEMY_BY_ID[athlete.academyId] : undefined;
  const tone = acwrTone(p.acwr);
  const rec = RISK_BADGE[p.injuryRisk];
  const ready = READINESS_BADGE[p.readiness];
  if (!athlete) return null;

  return (
    <TableRow>
      <TableCell className="pl-3">
        <Link href={`/athletes/${athlete.id}`} className="flex items-center gap-2.5 hover:underline">
          <Avatar name={athlete.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink-900">{athlete.name}</p>
            <p className="truncate text-xs text-muted">
              {athlete.sport} · {academy?.district}
            </p>
          </div>
        </Link>
      </TableCell>
      <TableCell className="tabular text-ink-900">{p.weeklyLoad}</TableCell>
      <TableCell>
        <span className={cn("font-bold tabular", TONE_TEXT[tone])}>
          {p.acwr.toFixed(2)}
        </span>
      </TableCell>
      <TableCell className="w-32">
        <div className="flex items-center gap-2">
          <Progress
            value={p.recoveryScore}
            tone={p.recoveryScore >= 70 ? "ok" : p.recoveryScore >= 50 ? "warn" : "danger"}
            className="w-16"
          />
          <span className="tabular text-xs text-ink-700">{p.recoveryScore}</span>
        </div>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "tabular font-medium",
            p.asymmetryPct >= 15 ? "text-danger" : p.asymmetryPct >= 10 ? "text-warn" : "text-ink-700",
          )}
        >
          {p.asymmetryPct}%
        </span>
      </TableCell>
      <TableCell>
        <StatusBadge status={ready.status} label={ready.label} />
      </TableCell>
      <TableCell className="pr-3">
        <StatusBadge status={rec.status} label={rec.label} />
      </TableCell>
    </TableRow>
  );
}
