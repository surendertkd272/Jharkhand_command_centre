"use client";

import * as React from "react";
import Link from "next/link";
import {
  Banknote,
  Users,
  CalendarDays,
  MapPin,
  UserCog,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import type { Academy } from "@/lib/types";
import { Page } from "@/components/Page";
import { SectionCard } from "@/components/SectionCard";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertRow } from "@/components/AlertRow";
import { ComplianceGauge } from "@/components/ComplianceGauge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn, formatRs, timeAgo } from "@/lib/utils";

import { athletesByAcademy } from "@/lib/mock/athletes";
import { FUNDING_ROWS } from "@/lib/mock/finance";
import { KIT_RECON } from "@/lib/mock/resources";
import { ALERTS } from "@/lib/mock/alerts";
import { INJURY_LEDGER } from "@/lib/mock/welfare";

import type { StatusKind, IdentityStatus, FundingStatus } from "@/lib/types";

// ---------------------------------------------------------------------------
// Small mapping helpers (no new colors — only StatusBadge / token tints).
// ---------------------------------------------------------------------------
const FUNDING_STATUS: Record<FundingStatus, StatusKind> = {
  active: "active",
  flagged: "flagged",
  paused: "paused",
};

const IDENTITY_STATUS: Record<IdentityStatus, StatusKind> = {
  verified: "verified",
  pending: "pending",
  flagged: "flagged",
};

const CLEARANCE_STATUS: Record<
  "pending" | "cleared" | "blocked",
  StatusKind
> = {
  pending: "pending",
  cleared: "cleared",
  blocked: "blocked",
};

// Athlete lifecycle status → StatusBadge kind + label.
const ATHLETE_STATUS: Record<
  "active" | "at-risk" | "exited" | "injured",
  { kind: StatusKind; label?: string }
> = {
  active: { kind: "active" },
  "at-risk": { kind: "at-risk" },
  injured: { kind: "blocked", label: "Injured" },
  exited: { kind: "paused", label: "Exited" },
};

/** Clean positive "no flags" signal — not an empty-state placeholder. */
function CleanSignal({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-line bg-tint-green/40 px-4 py-3.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-tint-green text-ok">
        <CheckCircle2 className="h-[18px] w-[18px]" strokeWidth={2.4} />
      </span>
      <p className="text-sm font-medium text-ink-900">{message}</p>
    </div>
  );
}

export function AcademyDetail({ academy }: { academy: Academy }) {
  // --- Joined slices for THIS academy (cross-pillar, not siloed) -----------
  const roster = athletesByAcademy(academy.id);
  const rosterIds = React.useMemo(
    () => new Set(roster.map((a) => a.id)),
    [roster],
  );

  const academyAlerts = ALERTS.filter((al) => al.academyId === academy.id);
  const kitRows = KIT_RECON.filter((k) => k.academyId === academy.id);
  const fundingRow = FUNDING_ROWS.find((f) => f.academyId === academy.id);
  const injuryRows = INJURY_LEDGER.filter((i) => rosterIds.has(i.athleteId));

  // Roster attendance summary for the header strip.
  const avgAttendance = roster.length
    ? Math.round(
        roster.reduce((s, a) => s + a.attendanceRate, 0) / roster.length,
      )
    : 0;
  const flaggedIdentity = roster.filter(
    (a) => a.identityStatus === "flagged",
  ).length;
  const atRiskRoster = roster.filter((a) => a.status === "at-risk").length;

  const subtitle =
    academy.district + " · " + academy.type + " · Lead: " + academy.leadCoach;

  return (
    <Page
      title={academy.name}
      subtitle={subtitle}
      topbarRight={
        <Link href="/academies">
          <Button variant="outline" size="sm">
            All academies
          </Button>
        </Link>
      }
    >
      {/* ============================ HEADER CARD ============================ */}
      <SectionCard noPadding className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge tone={academy.type === "PEC" ? "info" : "lime"}>
                {academy.type}
              </Badge>
              <StatusBadge
                status={FUNDING_STATUS[academy.fundingStatus]}
                pulse={academy.fundingStatus === "paused"}
              />
              {academy.sports.map((s) => (
                <Badge key={s} tone="neutral">
                  {s}
                </Badge>
              ))}
            </div>

            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900">
              {academy.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-700">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted" />
                {academy.district}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserCog className="h-4 w-4 text-muted" />
                {academy.leadCoach}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-muted" />
                Established {academy.established}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted" />
                {academy.athletesCount} athletes on roll
              </span>
            </div>

            {academy.fundingNote && (
              <div
                className={cn(
                  "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
                  academy.fundingStatus === "paused"
                    ? "bg-tint-red text-danger"
                    : "bg-tint-orange text-warn",
                )}
              >
                <Banknote className="h-3.5 w-3.5" />
                {academy.fundingNote}
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center justify-center lg:pl-6">
            <div className="flex flex-col items-center gap-2">
              <ComplianceGauge
                value={academy.complianceScore}
                threshold={60}
                size={148}
                stroke={12}
                suffix="%"
                label="Compliance"
              />
              <p className="text-xs font-medium text-muted">
                Release threshold 60%
              </p>
            </div>
          </div>
        </div>

        {/* Header KPI strip — roster-derived rollups */}
        <Separator />
        <div className="grid grid-cols-2 divide-x divide-line border-t border-line md:grid-cols-4">
          <div className="px-6 py-4">
            <p className="text-xs font-medium text-muted">Roster (profiled)</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900 tabular">
              {roster.length}
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="text-xs font-medium text-muted">Avg attendance</p>
            <p
              className={cn(
                "mt-1 text-2xl font-extrabold tracking-tight tabular",
                avgAttendance < 60 ? "text-danger" : "text-ink-900",
              )}
            >
              {avgAttendance}%
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="text-xs font-medium text-muted">Open alerts</p>
            <p
              className={cn(
                "mt-1 text-2xl font-extrabold tracking-tight tabular",
                academyAlerts.some((a) => a.status !== "resolved")
                  ? "text-danger"
                  : "text-ink-900",
              )}
            >
              {academyAlerts.filter((a) => a.status !== "resolved").length}
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="text-xs font-medium text-muted">Identity flags</p>
            <p
              className={cn(
                "mt-1 text-2xl font-extrabold tracking-tight tabular",
                flaggedIdentity > 0 ? "text-warn" : "text-ink-900",
              )}
            >
              {flaggedIdentity}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* ===================== JOINED CROSS-PILLAR BANNER ==================== */}
      <div className="flex items-center gap-2 px-1">
        <span className="h-1.5 w-1.5 rounded-full bg-lime-500" />
        <p className="text-sm font-medium text-ink-700">
          One academy, every pillar — alerts, kit, funding, injuries and roster
          are <span className="font-semibold text-ink-900">joined</span> on{" "}
          <span className="font-semibold text-ink-900">{academy.id}</span>, not
          siloed across systems.
        </p>
      </div>

      {/* ===================== ROW 1: ALERTS + FUNDING ====================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        {/* (a) Open alerts for this academy */}
        <SectionCard
          title="Open alerts"
          subtitle={`Cross-pillar signals raised against ${academy.name}`}
          action={
            <span className="grid h-7 w-7 place-items-center rounded-full bg-tint-red text-xs font-bold text-danger">
              {academyAlerts.filter((a) => a.status !== "resolved").length}
            </span>
          }
        >
          {academyAlerts.length === 0 ? (
            <CleanSignal message="No active alerts on this academy. Clean across all five pillars." />
          ) : (
            <div className="space-y-2.5">
              {academyAlerts.map((al) => (
                <AlertRow
                  key={al.id}
                  alert={al}
                  showPillar
                  actions={
                    <>
                      <Button variant="outline" size="sm">
                        Acknowledge
                      </Button>
                      <Button variant="ghost" size="sm">
                        Assign
                      </Button>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </SectionCard>

        {/* (c) Funding status */}
        <SectionCard
          title="Funding status"
          subtitle="Compliance-gated release ledger (Finance)"
        >
          {fundingRow ? (
            <div className="space-y-5">
              <div className="flex items-center gap-5">
                <ComplianceGauge
                  value={fundingRow.complianceScore}
                  threshold={fundingRow.threshold}
                  size={104}
                  stroke={10}
                  suffix="%"
                />
                <div className="min-w-0 flex-1">
                  <StatusBadge
                    status={FUNDING_STATUS[fundingRow.status]}
                    pulse={fundingRow.status === "paused"}
                  />
                  <p className="mt-2 text-sm text-ink-700">
                    Compliance{" "}
                    <span className="font-semibold text-ink-900">
                      {fundingRow.complianceScore}%
                    </span>{" "}
                    vs release threshold{" "}
                    <span className="font-semibold text-ink-900">
                      {fundingRow.threshold}%
                    </span>
                  </p>
                  {fundingRow.reason && (
                    <p
                      className={cn(
                        "mt-2 rounded-xl px-3 py-2 text-xs font-medium",
                        fundingRow.status === "paused"
                          ? "bg-tint-red text-danger"
                          : "bg-tint-orange text-warn",
                      )}
                    >
                      {fundingRow.reason}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-line bg-canvas/40 p-4">
                  <p className="text-xs font-medium text-muted">Released</p>
                  <p className="mt-1 text-xl font-extrabold tracking-tight text-ok tabular">
                    {formatRs(fundingRow.amountActive)}
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-canvas/40 p-4">
                  <p className="text-xs font-medium text-muted">On hold</p>
                  <p
                    className={cn(
                      "mt-1 text-xl font-extrabold tracking-tight tabular",
                      fundingRow.amountOnHold > 0 ? "text-danger" : "text-ink-900",
                    )}
                  >
                    {formatRs(fundingRow.amountOnHold)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <CleanSignal message="No funding holds. This academy's tranches are releasing on schedule." />
          )}
        </SectionCard>
      </div>

      {/* ===================== ROW 2: KIT + INJURIES ======================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* (b) Kit variance */}
        <SectionCard
          title="Kit reconciliation"
          subtitle="Dispatched → received → biometric receipt (Resources)"
        >
          {kitRows.length === 0 ? (
            <CleanSignal message="No kit consignments flagged. Receipts reconcile to dispatch." />
          ) : (
            <div className="space-y-4">
              {kitRows.map((k) => {
                const gap = k.dispatched - k.biometricReceipt;
                const gapValue = gap * k.unitValue;
                const flagged = gap > Math.max(2, k.dispatched * 0.05);
                const recvPct = Math.round(
                  (k.biometricReceipt / k.dispatched) * 100,
                );
                return (
                  <div
                    key={k.id}
                    className="rounded-2xl border border-line p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink-900">
                          {k.item}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          {formatRs(k.unitValue, { compact: false })} / unit
                        </p>
                      </div>
                      {flagged ? (
                        <StatusBadge status="flagged" label="Variance" />
                      ) : (
                        <StatusBadge status="cleared" label="Reconciled" />
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-lg font-extrabold tabular text-ink-900">
                          {k.dispatched}
                        </p>
                        <p className="text-[11px] text-muted">Dispatched</p>
                      </div>
                      <div>
                        <p className="text-lg font-extrabold tabular text-ink-900">
                          {k.receivedAtAcademy}
                        </p>
                        <p className="text-[11px] text-muted">At academy</p>
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-lg font-extrabold tabular",
                            flagged ? "text-danger" : "text-ink-900",
                          )}
                        >
                          {k.biometricReceipt}
                        </p>
                        <p className="text-[11px] text-muted">Biometric</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Progress
                        value={recvPct}
                        tone={flagged ? "danger" : "ok"}
                      />
                    </div>

                    {flagged && (
                      <p className="mt-3 rounded-xl bg-tint-red px-3 py-2 text-xs font-medium text-danger">
                        {gap} units unaccounted ·{" "}
                        <span className="font-bold">{formatRs(gapValue)}</span>{" "}
                        phantom-inventory exposure
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* (d) Injury cases */}
        <SectionCard
          title="Injury & medical clearance"
          subtitle="Independent state medical board ledger (Welfare)"
        >
          {injuryRows.length === 0 ? (
            <CleanSignal message="No open injury cases. All cleared athletes carry valid state sign-off." />
          ) : (
            <div className="space-y-3">
              {injuryRows.map((inj) => {
                const blocked = inj.clearance === "blocked";
                return (
                  <div
                    key={inj.id}
                    className={cn(
                      "rounded-2xl border p-4",
                      blocked
                        ? "border-danger/40 bg-tint-red/30"
                        : "border-line",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/athletes/${inj.athleteId}`}
                          className="truncate text-sm font-semibold text-ink-900 hover:underline"
                        >
                          {inj.athleteName}
                        </Link>
                        <p className="mt-0.5 text-sm text-ink-700">
                          {inj.injury}
                        </p>
                        <p className="mt-0.5 text-xs text-muted">
                          Reported by {inj.reportedBy} · {timeAgo(inj.date)}
                        </p>
                      </div>
                      <StatusBadge
                        status={CLEARANCE_STATUS[inj.clearance]}
                        pulse={blocked}
                      />
                    </div>

                    {inj.overrideAttempt && (
                      <p className="mt-3 rounded-xl bg-tint-red px-3 py-2 text-xs font-semibold text-danger">
                        Coach re-activation attempt BLOCKED — independent state
                        medical clearance required before return to play.
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {inj.timeline.map((t, i) => (
                        <span
                          key={i}
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                            t.done
                              ? "bg-tint-green text-ok"
                              : "bg-black/5 text-muted",
                          )}
                        >
                          {t.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ============================ (e) ROSTER ============================ */}
      <SectionCard
        title="Athlete roster"
        subtitle={`${roster.length} profiled athletes · joined identity, attendance & welfare`}
        action={
          <div className="hidden items-center gap-3 sm:flex">
            {atRiskRoster > 0 && (
              <Badge tone="warn">{atRiskRoster} at risk</Badge>
            )}
            {flaggedIdentity > 0 && (
              <Badge tone="danger">{flaggedIdentity} identity flag</Badge>
            )}
          </div>
        }
        noPadding
      >
        {roster.length === 0 ? (
          <div className="p-5">
            <CleanSignal message="No individually profiled athletes in this demo slice — academy-level rolls only." />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Athlete</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Identity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
                <TableHead className="text-right">Profile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map((a) => {
                const low = a.attendanceRate < 60;
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={a.name} size="sm" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink-900">
                            {a.name}
                          </p>
                          <p className="text-xs text-muted">
                            Age {a.age} · {a.gender === "F" ? "Female" : "Male"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-ink-700">{a.sport}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={IDENTITY_STATUS[a.identityStatus]}
                      />
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={ATHLETE_STATUS[a.status].kind}
                        label={ATHLETE_STATUS[a.status].label}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex w-36 items-center gap-2">
                        <Progress
                          value={a.attendanceRate}
                          tone={low ? "danger" : "ok"}
                        />
                        <span
                          className={cn(
                            "w-9 shrink-0 text-right text-sm font-semibold tabular",
                            low ? "text-danger" : "text-ink-900",
                          )}
                        >
                          {a.attendanceRate}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/athletes/${a.id}`}>
                        <Button variant="ghost" size="sm">
                          Open
                          <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </Page>
  );
}
