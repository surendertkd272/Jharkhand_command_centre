"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Activity,
  Gauge,
  Wallet,
  HeartPulse,
  TriangleAlert,
  MapPin,
  Building2,
  UserRound,
  CalendarClock,
} from "lucide-react";
import type { Athlete, StatusKind } from "@/lib/types";
import { Page } from "@/components/Page";
import { SectionCard } from "@/components/SectionCard";
import { StatusBadge } from "@/components/StatusBadge";
import { AreaTrend } from "@/components/charts/AreaTrend";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { getAcademy } from "@/lib/mock/academies";
import { cn, formatRs, timeAgo } from "@/lib/utils";

// athlete.status is "active" | "at-risk" | "exited" | "injured" — map the two
// that are not part of the StatusBadge vocabulary onto the closest StatusKind.
function statusKindFor(s: Athlete["status"]): {
  kind: StatusKind;
  label: string;
  pulse?: boolean;
} {
  switch (s) {
    case "active":
      return { kind: "active", label: "Active" };
    case "at-risk":
      return { kind: "at-risk", label: "At risk", pulse: true };
    case "injured":
      return { kind: "blocked", label: "Injured", pulse: true };
    case "exited":
      return { kind: "failed", label: "Exited" };
  }
}

const IDENTITY_DOCS: Record<
  Athlete["identityStatus"],
  { label: string; sealed: boolean }[]
> = {
  verified: [
    { label: "Aadhaar (DigiLocker-sealed)", sealed: true },
    { label: "Birth Certificate / Age proof", sealed: true },
    { label: "Jharkhand Domicile / Residency", sealed: true },
    { label: "Biometric enrolment (face + fingerprint)", sealed: true },
  ],
  pending: [
    { label: "Aadhaar (DigiLocker-sealed)", sealed: true },
    { label: "Birth Certificate / Age proof", sealed: true },
    { label: "Jharkhand Domicile / Residency", sealed: false },
    { label: "Biometric enrolment (face + fingerprint)", sealed: false },
  ],
  flagged: [
    { label: "Aadhaar (DigiLocker-sealed)", sealed: true },
    { label: "Birth Certificate / Age proof", sealed: false },
    { label: "Jharkhand Domicile / Residency", sealed: true },
    { label: "Biometric enrolment (face + fingerprint)", sealed: true },
  ],
};

const IDENTITY_BADGE: Record<Athlete["identityStatus"], StatusKind> = {
  verified: "verified",
  pending: "pending",
  flagged: "flagged",
};

export function AthleteProfile({ athlete }: { athlete: Athlete }) {
  const academy = getAcademy(athlete.academyId);
  const st = statusKindFor(athlete.status);
  const attendanceData = athlete.attendance.map((p) => ({
    label: p.label,
    value: p.value,
  }));

  const scoreGap = athlete.trialScore - athlete.baselineScore;
  const biasSuspected = scoreGap >= 12; // subjective trial far above objective baseline
  const docs = IDENTITY_DOCS[athlete.identityStatus];
  const sealedCount = docs.filter((d) => d.sealed).length;

  const blockedInjury = athlete.injuries.find((i) => i.clearance === "blocked");

  const subtitle =
    athlete.sport + " · " + athlete.district + " · age " + athlete.age;

  return (
    <Page
      title={athlete.name}
      subtitle={subtitle}
      rightPanel={<SidePanel athlete={athlete} />}
    >
      {/* ---- Header card ---- */}
      <SectionCard noPadding>
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar name={athlete.name} size="xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">
                {athlete.name}
              </h2>
              <StatusBadge status={st.kind} label={st.label} pulse={st.pulse} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-700">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4 text-muted" />
                {athlete.gender === "F" ? "Female" : "Male"} · age {athlete.age}
                {athlete.ageVerified && (
                  <Badge tone="lime" className="ml-1.5">
                    <Lock className="mr-1 h-3 w-3" />
                    DigiLocker-locked
                  </Badge>
                )}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-muted" />
                {athlete.sport}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted" />
                {athlete.district}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-muted" />
                {academy ? (
                  <Link
                    href={`/academies/${academy.id}`}
                    className="font-medium text-ink-900 underline-offset-2 hover:text-lime-600 hover:underline"
                  >
                    {academy.name}
                  </Link>
                ) : (
                  <span className="text-muted">Unassigned academy</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-6 sm:flex-col sm:items-end sm:gap-3">
            <div className="text-right">
              <div className="text-3xl font-extrabold tracking-tight text-ink-900 tabular">
                {athlete.attendanceRate}%
              </div>
              <div className="text-xs font-medium text-muted">
                Biometric attendance
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ---- Blocked-clearance hero alert (demo beat d) ---- */}
      {blockedInjury && (
        <div className="animate-fade-in rounded-card border border-danger/30 bg-tint-red p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/15">
              <TriangleAlert className="h-5 w-5 text-danger" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-danger">
                  Re-activation override BLOCKED
                </h3>
                <StatusBadge status="blocked" pulse />
              </div>
              <p className="mt-1 text-sm text-ink-700">
                {blockedInjury.note}
              </p>
              <p className="mt-1.5 text-xs text-muted">
                {blockedInjury.injury} · reported by {blockedInjury.reportedBy} ·{" "}
                {timeAgo(blockedInjury.date)}. Independent state medical board
                clearance is mandatory before this athlete can return to
                competition or trials.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ---- Identity & verification ---- */}
      <SectionCard
        title="Identity & verification"
        subtitle={`${sealedCount} of ${docs.length} documents sealed on registration`}
        action={
          <StatusBadge
            status={IDENTITY_BADGE[athlete.identityStatus]}
            pulse={athlete.identityStatus === "flagged"}
          />
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {docs.map((d) => (
            <div
              key={d.label}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3",
                d.sealed
                  ? "border-line bg-tint-green/40"
                  : "border-warn/30 bg-tint-orange/50",
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  d.sealed ? "bg-ok/15" : "bg-warn/20",
                )}
              >
                {d.sealed ? (
                  <FileCheck2 className="h-4 w-4 text-ok" />
                ) : (
                  <ShieldCheck className="h-4 w-4 text-warn" />
                )}
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-ink-900">
                  {d.label}
                </div>
                <div
                  className={cn(
                    "text-xs",
                    d.sealed ? "text-ok" : "text-warn",
                  )}
                >
                  {d.sealed ? "Sealed & tamper-locked" : "Awaiting seal"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ---- Biometric attendance ---- */}
      <SectionCard
        title="Biometric attendance"
        subtitle="Weekly verified check-in rate (last 8 weeks)"
        action={
          <span className="text-sm font-semibold text-ink-900 tabular">
            {athlete.attendanceRate}%
            <span className="ml-1 text-xs font-normal text-muted">current</span>
          </span>
        }
      >
        <AreaTrend
          data={attendanceData}
          dataKey="value"
          unit="%"
          domain={[0, 100]}
          height={240}
        />
        {athlete.attendanceRate < 60 && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-tint-orange px-3 py-1 text-xs font-medium text-warn">
            <TriangleAlert className="h-3.5 w-3.5" />
            Below the 60% funding-compliance floor — flagged for welfare review.
          </p>
        )}
      </SectionCard>

      {/* ---- Trial score vs baseline ---- */}
      <SectionCard
        title="Trial score vs baseline"
        subtitle="Subjective evaluator trial score against the objective performance baseline"
        action={<Gauge className="h-5 w-5 text-muted" />}
      >
        <div className="space-y-5">
          <ScoreBar
            label="Objective baseline"
            sublabel="Sensor-measured performance index"
            value={athlete.baselineScore}
            tone="ink"
          />
          <ScoreBar
            label="Evaluator trial score"
            sublabel="Subjective panel assessment"
            value={athlete.trialScore}
            tone={biasSuspected ? "warn" : "lime"}
          />
          <div
            className={cn(
              "flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm",
              biasSuspected
                ? "bg-tint-orange text-warn"
                : "bg-tint-green/50 text-ok",
            )}
          >
            {biasSuspected ? (
              <>
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="text-ink-700">
                  <span className="font-semibold text-warn">
                    Possible evaluator bias.
                  </span>{" "}
                  Trial score is {scoreGap} points above the objective baseline
                  — routed to the de-bias review queue.
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="text-ink-700">
                  Trial score tracks the objective baseline within the fair band
                  ({scoreGap >= 0 ? "+" : ""}
                  {scoreGap} pts). No bias flag.
                </span>
              </>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ---- DBT stipend history ---- */}
      <SectionCard
        title="DBT stipend history"
        subtitle="Direct-benefit transfers to the athlete's verified bank account"
        action={<Wallet className="h-5 w-5 text-muted" />}
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scheme</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {athlete.stipendHistory.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-ink-900">
                  {s.scheme}
                </TableCell>
                <TableCell className="text-ink-700">
                  {new Date(s.date).toLocaleDateString("en-IN", {
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right font-semibold text-ink-900 tabular">
                  {formatRs(s.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <StatusBadge
                      status={s.status}
                      pulse={s.status === "failed"}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      {/* ---- Injury / clearance timeline ---- */}
      <SectionCard
        title="Injury & clearance timeline"
        subtitle="Medical events and return-to-play clearance trail"
        action={<HeartPulse className="h-5 w-5 text-muted" />}
      >
        {athlete.injuries.length === 0 ? (
          <div className="flex items-center gap-2.5 rounded-2xl bg-tint-green/50 px-4 py-3 text-sm text-ink-700">
            <ShieldCheck className="h-4 w-4 text-ok" />
            No recorded injuries. Athlete is medically clear for training and
            competition.
          </div>
        ) : (
          <ol className="relative space-y-5 pl-6">
            <span className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-line" />
            {athlete.injuries.map((inj) => {
              const isBlocked = inj.clearance === "blocked";
              return (
                <li key={inj.id} className="relative">
                  <span
                    className={cn(
                      "absolute -left-6 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-card",
                      isBlocked
                        ? "bg-danger"
                        : inj.clearance === "cleared"
                          ? "bg-ok"
                          : "bg-warn",
                    )}
                  />
                  <div
                    className={cn(
                      "rounded-2xl border px-4 py-3.5",
                      isBlocked
                        ? "border-danger/30 bg-tint-red"
                        : "border-line bg-canvas",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          isBlocked ? "text-danger" : "text-ink-900",
                        )}
                      >
                        {inj.injury}
                      </span>
                      <StatusBadge
                        status={inj.clearance}
                        pulse={isBlocked}
                        label={
                          inj.clearance === "blocked"
                            ? "Override blocked"
                            : undefined
                        }
                      />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {new Date(inj.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span>Reported by {inj.reportedBy}</span>
                    </div>
                    {inj.note && (
                      <p
                        className={cn(
                          "mt-2 text-sm",
                          isBlocked
                            ? "font-medium text-danger"
                            : "text-ink-700",
                        )}
                      >
                        {inj.note}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </SectionCard>
    </Page>
  );
}

// ----------------------------------------------------------------------------
function ScoreBar({
  label,
  sublabel,
  value,
  tone,
}: {
  label: string;
  sublabel: string;
  value: number;
  tone: "lime" | "ink" | "warn";
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-ink-900">{label}</div>
          <div className="text-xs text-muted">{sublabel}</div>
        </div>
        <div className="text-lg font-extrabold tabular text-ink-900">
          {value}
          <span className="text-xs font-normal text-muted">/100</span>
        </div>
      </div>
      <Progress value={value} tone={tone} />
    </div>
  );
}

// ----------------------------------------------------------------------------
function SidePanel({ athlete }: { athlete: Athlete }) {
  const academy = getAcademy(athlete.academyId);
  const docs = IDENTITY_DOCS[athlete.identityStatus];
  const sealedCount = docs.filter((d) => d.sealed).length;
  const facts: { label: string; value: React.ReactNode }[] = [
    {
      label: "Academy",
      value: academy ? (
        <Link
          href={`/academies/${academy.id}`}
          className="font-medium text-ink-900 hover:text-lime-600"
        >
          {academy.name}
        </Link>
      ) : (
        "—"
      ),
    },
    {
      label: "Attendance rate",
      value: (
        <span
          className={cn(
            "font-semibold tabular",
            athlete.attendanceRate < 60 ? "text-warn" : "text-ink-900",
          )}
        >
          {athlete.attendanceRate}%
        </span>
      ),
    },
    {
      label: "Gender",
      value: athlete.gender === "F" ? "Female" : "Male",
    },
    {
      label: "Identity status",
      value: <StatusBadge status={IDENTITY_BADGE[athlete.identityStatus]} />,
    },
  ];

  return (
    <>
      <SectionCard title="Quick facts">
        <dl className="space-y-3">
          {facts.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <dt className="text-muted">{f.label}</dt>
              <dd className="min-w-0 truncate text-right">{f.value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>

      <SectionCard
        title="Verification"
        subtitle="Tamper-sealed registration record"
        action={<ShieldCheck className="h-5 w-5 text-muted" />}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-700">Documents sealed</span>
          <span className="text-2xl font-extrabold tabular text-ink-900">
            {sealedCount}
            <span className="text-base font-medium text-muted">
              /{docs.length}
            </span>
          </span>
        </div>
        <Progress
          className="mt-2"
          value={(sealedCount / docs.length) * 100}
          tone={sealedCount === docs.length ? "ok" : "warn"}
        />
        <Separator />
        <ul className="mt-4 space-y-2.5">
          {docs.map((d) => (
            <li
              key={d.label}
              className="flex items-center gap-2 text-sm text-ink-700"
            >
              {d.sealed ? (
                <FileCheck2 className="h-4 w-4 shrink-0 text-ok" />
              ) : (
                <ShieldCheck className="h-4 w-4 shrink-0 text-warn" />
              )}
              <span className="min-w-0 truncate">{d.label}</span>
            </li>
          ))}
        </ul>
        {athlete.ageVerified && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-lime-100 px-3 py-2 text-xs font-medium text-ink-900">
            <Lock className="h-3.5 w-3.5" />
            Age DigiLocker-locked — cannot be edited by the academy.
          </div>
        )}
      </SectionCard>
    </>
  );
}
