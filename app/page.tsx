"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Banknote,
  ShieldAlert,
  Timer,
  Activity,
  MapPin,
} from "lucide-react";
import { Page } from "@/components/Page";
import { StatCard } from "@/components/StatCard";
import { SectionCard } from "@/components/SectionCard";
import { AlertRow } from "@/components/AlertRow";
import { StatusBadge } from "@/components/StatusBadge";
import { JharkhandMap } from "@/components/JharkhandMap";
import { AreaTrend } from "@/components/charts/AreaTrend";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatRs } from "@/lib/utils";
import {
  TOTAL_ATHLETES,
  TOTAL_ACADEMIES,
  COMPLIANT_COUNT,
  STATE_COMPLIANCE_SCORE,
} from "@/lib/mock/academies";
import { OPEN_ALERTS_COUNT, unresolvedAlerts } from "@/lib/mock/alerts";
import { FUNDING_ROWS } from "@/lib/mock/finance";
import type { FundingRow } from "@/lib/types";

// 8-week upward compliance trend, ending at the live state score (73).
const COMPLIANCE_TREND = [
  { label: "W1", score: 64 },
  { label: "W2", score: 65 },
  { label: "W3", score: 67 },
  { label: "W4", score: 66 },
  { label: "W5", score: 69 },
  { label: "W6", score: 70 },
  { label: "W7", score: 72 },
  { label: "W8", score: STATE_COMPLIANCE_SCORE },
];

// Three academies sitting closest under the 60% release threshold — the ones
// whose funding holds the Director needs eyes on. Pulled from FUNDING_ROWS.
const THRESHOLD_FOCUS_IDS = ["ac-05", "ac-34", "ac-16"];
const FUNDING_FOCUS: FundingRow[] = THRESHOLD_FOCUS_IDS.map(
  (id) => FUNDING_ROWS.find((r) => r.academyId === id)!,
).filter(Boolean);

const LIVE_ALERTS = unresolvedAlerts().slice(0, 7);

export default function Home() {
  return (
    <Page
      title="Good morning, Director Sharma"
      subtitle="Jharkhand · 28 academies · 12 PECs under oversight"
      notifications={OPEN_ALERTS_COUNT}
      rightPanel={<RightPanel />}
    >
      {/* 1) KPI ROW ---------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          label="Active Athletes"
          value={TOTAL_ATHLETES.toLocaleString("en-IN")}
          icon={Users}
          tint="blue"
          delta={3.1}
        />
        <StatCard
          label="Academies Compliant"
          value={`${COMPLIANT_COUNT} / ${TOTAL_ACADEMIES}`}
          icon={ShieldCheck}
          tint="orange"
          hint="Score ≥ 70 / 100"
        />
        <StatCard
          label="Funds Disbursed"
          value="Rs 18.4 Cr"
          icon={Banknote}
          tint="green"
          delta={6.4}
          hint="FY 2025–26"
        />
        <StatCard
          label="Open Fraud Alerts"
          value={String(OPEN_ALERTS_COUNT)}
          icon={ShieldAlert}
          tint="red"
          accent
          hint="4 critical · needs review"
        />
        <StatCard
          label="SLA Breaches"
          value="4"
          icon={Timer}
          tint="violet"
          delta={-12}
          deltaInvert
        />
        <StatCard
          label="Compliance Score"
          value={`${STATE_COMPLIANCE_SCORE} / 100`}
          icon={Activity}
          tint="lime"
          delta={2.0}
        />
      </div>

      {/* 2) MAP + LIVE ALERTS ------------------------------------------------ */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <SectionCard
          title="Jharkhand Oversight Map"
          subtitle="40 academies & PECs · colored by live compliance"
        >
          <JharkhandMap />
        </SectionCard>

        <SectionCard
          title="Live Alerts"
          subtitle={`${OPEN_ALERTS_COUNT} unresolved across 5 pillars`}
          action={
            <Link
              href="/alerts"
              className="text-sm font-semibold text-ink-700 hover:text-ink-900"
            >
              View all
            </Link>
          }
          bodyClassName="pt-2"
        >
          <div className="scroll-thin flex max-h-[460px] flex-col gap-2.5 overflow-y-auto pr-1">
            {LIVE_ALERTS.map((alert) => (
              <AlertRow key={alert.id} alert={alert} href="/alerts" />
            ))}
          </div>
        </SectionCard>
      </div>

      {/* 3) PERFORMANCE-LINKED FUNDING -------------------------------------- */}
      <SectionCard
        title="Performance-Linked Funding"
        subtitle="Releases auto-held below the 60% biometric-attendance threshold"
        action={
          <Link
            href="/finance"
            className="text-sm font-semibold text-ink-700 hover:text-ink-900"
          >
            Funding ledger
          </Link>
        }
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {FUNDING_FOCUS.map((row) => (
            <FundingFocusCard key={row.id} row={row} />
          ))}
        </div>
      </SectionCard>

      {/* 4) COMPLIANCE TREND ------------------------------------------------- */}
      <SectionCard title="State Compliance Trend" subtitle="Last 8 weeks">
        <AreaTrend
          data={COMPLIANCE_TREND}
          dataKey="score"
          domain={[55, 80]}
          unit=""
        />
      </SectionCard>
    </Page>
  );
}

/* -------------------------------------------------------------------------- */
/* Performance-linked funding card                                            */
/* -------------------------------------------------------------------------- */
function FundingFocusCard({ row }: { row: FundingRow }) {
  const tone =
    row.status === "paused" ? "danger" : row.status === "flagged" ? "warn" : "ok";
  const badge =
    row.status === "paused"
      ? "paused"
      : row.status === "flagged"
        ? "flagged"
        : "active";
  return (
    <div className="flex flex-col rounded-2xl border border-line bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink-900">
            {row.academyName}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
            <MapPin className="h-3 w-3" />
            {row.district}
          </p>
        </div>
        <StatusBadge status={badge} />
      </div>

      {/* compliance vs threshold */}
      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-medium text-muted">
            Compliance
          </span>
          <span className="text-sm font-bold tabular text-ink-900">
            {row.complianceScore}%
            <span className="ml-1 font-medium text-muted">
              / {row.threshold}% needed
            </span>
          </span>
        </div>
        <div className="relative mt-1.5">
          <Progress value={row.complianceScore} tone={tone} />
          {/* threshold marker at 60 */}
          <span
            className="absolute -top-0.5 h-3 w-0.5 rounded-full bg-ink-900/70"
            style={{ left: `${row.threshold}%` }}
            aria-hidden
          />
        </div>
        <p className="mt-1.5 text-[11px] font-medium text-danger">
          {row.threshold - row.complianceScore} pts below release threshold
        </p>
      </div>

      {/* amount on hold */}
      <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">
            On hold
          </p>
          <p className="text-xl font-extrabold tracking-tight tabular text-ink-900">
            {formatRs(row.amountOnHold)}
          </p>
        </div>
        {row.reason && (
          <p className="max-w-[55%] text-right text-[11px] leading-snug text-muted">
            {row.reason}
          </p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Right context column                                                       */
/* -------------------------------------------------------------------------- */
function RightPanel() {
  return (
    <>
      <OnDutyCard />
      <SignoffCard />
      <InspectionCalendar />
    </>
  );
}

function OnDutyCard() {
  return (
    <div className="rounded-card border border-line bg-card p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <Avatar name="Rajesh Sharma" size="lg" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-base font-bold text-ink-900">
              Rajesh Sharma
            </p>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-lime-100 px-2 py-0.5 text-[11px] font-semibold text-ink-900">
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-lime-500" />
              On duty
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted">Director, Sports Dept.</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-line bg-canvas/60 px-3 py-2.5 text-sm text-ink-700">
        <MapPin className="h-4 w-4 shrink-0 text-muted" />
        Jharkhand · State HQ, Ranchi
      </div>
    </div>
  );
}

interface SignoffRow {
  title: string;
  context: string;
  href: string;
}

const SIGNOFFS: SignoffRow[] = [
  {
    title: "Release funding hold",
    context: "Dhanbad Coalfields Academy · Rs 42.00 L held",
    href: "/finance",
  },
  {
    title: "Approve dual-registration freeze",
    context: "Same biometric in West Singhbhum & Sahibganj",
    href: "/integrity",
  },
  {
    title: "Clear injury return",
    context: "Pooja Kumari · shoulder · awaiting state board",
    href: "/welfare",
  },
];

function SignoffCard() {
  return (
    <SectionCard
      title="Needs your sign-off"
      subtitle="3 decisions pending"
      bodyClassName="pt-3"
    >
      <div className="flex flex-col gap-2.5">
        {SIGNOFFS.map((s) => (
          <div
            key={s.title}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">
                {s.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted">{s.context}</p>
            </div>
            <Link href={s.href} className="shrink-0">
              <Button variant="outline" size="sm">
                Review
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/* This week — State inspections. Week of Mon 22 Jun .. Sun 28 Jun 2026.
   Today (28th) is highlighted; 3 inspection days marked lime. */
interface CalDay {
  dow: string;
  date: number;
  scheduled?: boolean;
  today?: boolean;
  label?: string;
}

const WEEK: CalDay[] = [
  { dow: "Mon", date: 22, scheduled: true, label: "Ranchi State Archery" },
  { dow: "Tue", date: 23 },
  { dow: "Wed", date: 24, scheduled: true, label: "Saraikela Wrestling" },
  { dow: "Thu", date: 25 },
  { dow: "Fri", date: 26, scheduled: true, label: "Dhanbad Coalfields" },
  { dow: "Sat", date: 27 },
  { dow: "Sun", date: 28, today: true },
];

const SCHEDULED_DAYS = WEEK.filter((d) => d.scheduled);

function InspectionCalendar() {
  return (
    <SectionCard
      title="This week — State inspections"
      subtitle="22 – 28 June 2026"
      bodyClassName="pt-3"
    >
      <div className="grid grid-cols-7 gap-1.5">
        {WEEK.map((d) => {
          const base =
            "flex flex-col items-center justify-center gap-0.5 rounded-xl py-2 text-center";
          let cls = "border border-line bg-white text-ink-700";
          if (d.scheduled) cls = "bg-lime-500 text-white font-semibold";
          if (d.today)
            cls = "border-2 border-ink-900 bg-white font-bold text-ink-900";
          return (
            <div key={d.date} className={`${base} ${cls}`}>
              <span className="text-[10px] uppercase tracking-wide opacity-70">
                {d.dow}
              </span>
              <span className="text-sm tabular">{d.date}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {SCHEDULED_DAYS.map((d) => (
          <div
            key={d.date}
            className="flex items-center gap-2.5 rounded-2xl border border-line bg-canvas/60 px-3 py-2"
          >
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-lime-100 text-xs font-bold text-ink-900">
              {d.date}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink-900">
                {d.label}
              </p>
              <p className="text-[11px] text-muted">{d.dow} · field inspection</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-4 px-1 text-[11px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded bg-lime-500" />
          Scheduled
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded border-2 border-ink-900" />
          Today
        </span>
      </div>
    </SectionCard>
  );
}
