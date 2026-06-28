"use client";

import * as React from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  SlidersHorizontal,
  ShieldCheck,
  Fingerprint,
  Landmark,
  ScanFace,
  ShieldAlert,
  Save,
  RotateCcw,
} from "lucide-react";
import { Page } from "@/components/Page";
import { SectionCard } from "@/components/SectionCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const DEFAULTS = {
  compliance: 60,
  sla: 72,
  funding: 60,
};

type ThresholdSliderProps = {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix: string;
  isDefault: boolean;
  onChange: (v: number) => void;
};

function ThresholdSlider({
  label,
  hint,
  value,
  min,
  max,
  step = 1,
  suffix,
  isDefault,
  onChange,
}: ThresholdSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-3xl border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink-900">{label}</p>
          <p className="mt-0.5 text-xs text-muted">{hint}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold tracking-tight text-ink-900 tabular">
            {value}
          </span>
          <span className="ml-1 text-sm font-medium text-muted">{suffix}</span>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          className="h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-ink-900 [&::-webkit-slider-thumb]:shadow-soft [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-ink-900"
          style={{
            background: `linear-gradient(to right, #2563EB 0%, #2563EB ${pct}%, #ECECEC ${pct}%, #ECECEC 100%)`,
          }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span className="tabular">
          {min}
          {suffix}
        </span>
        {isDefault ? (
          <Badge tone="neutral">Default</Badge>
        ) : (
          <Badge tone="lime">Modified</Badge>
        )}
        <span className="tabular">
          {max}
          {suffix}
        </span>
      </div>
    </div>
  );
}

const INTEGRATIONS = [
  {
    name: "DigiLocker",
    icon: ShieldCheck,
    tint: "bg-tint-blue",
    iconColor: "text-info",
    desc: "Document vault for athlete certificates, domicile & education proofs.",
    detail: "Last sync 12 min ago · 2,140 docs",
  },
  {
    name: "Aadhaar (UIDAI)",
    icon: Fingerprint,
    tint: "bg-tint-violet",
    iconColor: "text-[#7c3aed]",
    desc: "Biometric eKYC & demographic auth for athlete identity verification.",
    detail: "Auth API v2.5 · AUA/KUA active",
  },
  {
    name: "NPCI / DBT",
    icon: Landmark,
    tint: "bg-tint-green",
    iconColor: "text-ok",
    desc: "Aadhaar-mapped direct benefit transfer of stipends to athletes.",
    detail: "APB enabled · 1,284 mapped accounts",
  },
  {
    name: "Biometric Vendor",
    icon: ScanFace,
    tint: "bg-tint-orange",
    iconColor: "text-warn",
    desc: "Fingerprint & facial attendance capture across academy devices.",
    detail: "118 devices online · firmware 4.1.7",
  },
];

const ROLES = [
  {
    role: "Director",
    scope: "Full administrative control — statewide",
    perms: ["Manage", "Approve", "Configure", "Export"],
    permTone: "dark" as const,
    users: 1,
    access: "Full access",
  },
  {
    role: "Joint Secretary",
    scope: "Funding & escalation approvals — statewide",
    perms: ["Approve", "Flag", "Export"],
    permTone: "info" as const,
    users: 3,
    access: "Approve",
  },
  {
    role: "District Officer",
    scope: "Assigned district academies only",
    perms: ["View", "Flag", "Inspect"],
    permTone: "lime" as const,
    users: 24,
    access: "View + flag",
  },
  {
    role: "Academy Admin",
    scope: "Single academy — read-mostly",
    perms: ["View", "Upload"],
    permTone: "neutral" as const,
    users: 40,
    access: "Read-mostly",
  },
];

export default function SettingsPage() {
  const [compliance, setCompliance] = React.useState(DEFAULTS.compliance);
  const [sla, setSla] = React.useState(DEFAULTS.sla);
  const [funding, setFunding] = React.useState(DEFAULTS.funding);

  const dirty =
    compliance !== DEFAULTS.compliance ||
    sla !== DEFAULTS.sla ||
    funding !== DEFAULTS.funding;

  const reset = () => {
    setCompliance(DEFAULTS.compliance);
    setSla(DEFAULTS.sla);
    setFunding(DEFAULTS.funding);
  };

  return (
    <Page
      title="Settings"
      subtitle="Jharkhand Sports Department · configuration"
      topbarRight={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={!dirty}
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="primary" size="sm">
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </div>
      }
    >
      {/* (1) Org profile */}
      <SectionCard
        title="Organisation profile"
        subtitle="Department identity used across reports, exports and signed orders."
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-lime-100 shadow-soft">
              <div className="h-9 w-9 rotate-45 rounded-md bg-lime-500 shadow-soft" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-ink-900">
                Jharkhand Sports Department
              </h2>
              <p className="mt-0.5 text-sm text-muted">
                Department of Sports, Youth Affairs &amp; Culture · Government of
                Jharkhand
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status="verified" label="Govt. verified" />
                <Badge tone="neutral">FY 2026–27</Badge>
              </div>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-4 rounded-3xl border border-line bg-canvas/50 p-5 sm:grid-cols-2">
            <ProfileField
              icon={MapPin}
              label="Registered address"
              value="Project Bhawan, HEC, Dhurwa, Ranchi — 834004"
            />
            <ProfileField
              icon={Phone}
              label="Office contact"
              value="+91 651 2491 200"
            />
            <ProfileField
              icon={Mail}
              label="Official email"
              value="sports-jh@gov.in"
            />
            <ProfileField
              icon={Globe}
              label="Web portal"
              value="sports.jharkhand.gov.in"
            />
            <ProfileField
              icon={Building2}
              label="Nodal officer"
              value="Smt. Anjali Mahato, Director (Sports)"
            />
            <ProfileField
              icon={ShieldCheck}
              label="Jurisdiction"
              value="24 districts · 40 academies"
            />
          </div>
        </div>
      </SectionCard>

      {/* (2) Thresholds config */}
      <SectionCard
        title="Compliance & escalation thresholds"
        subtitle="Department-wide trigger limits applied to every academy and DBT batch."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-ink-700">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Live preview
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <ThresholdSlider
            label="Compliance threshold"
            hint="Academies below this score are auto-flagged for review."
            value={compliance}
            min={40}
            max={90}
            suffix="%"
            isDefault={compliance === DEFAULTS.compliance}
            onChange={setCompliance}
          />
          <ThresholdSlider
            label="SLA resolution window"
            hint="Tickets open beyond this duration breach the support SLA."
            value={sla}
            min={24}
            max={168}
            step={6}
            suffix="h"
            isDefault={sla === DEFAULTS.sla}
            onChange={setSla}
          />
          <ThresholdSlider
            label="Funding pause trigger"
            hint="Biometric attendance under this level auto-holds disbursal."
            value={funding}
            min={40}
            max={90}
            suffix="%"
            isDefault={funding === DEFAULTS.funding}
            onChange={setFunding}
          />
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-3xl border border-line bg-tint-orange/40 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <p className="text-sm text-ink-700">
            With the funding trigger at{" "}
            <span className="font-semibold text-ink-900">{funding}%</span>,
            academies such as{" "}
            <span className="font-semibold text-ink-900">
              Dhanbad Coalfields Academy
            </span>{" "}
            (biometric attendance 48%) remain on{" "}
            <span className="font-semibold text-danger">paused</span> disbursal
            until verified attendance recovers.
          </p>
        </div>
      </SectionCard>

      {/* (3) Connected integrations */}
      <SectionCard
        title="Connected integrations"
        subtitle="External systems wired into the command center for identity, payments & attendance."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {INTEGRATIONS.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.name}
                className="flex items-start gap-4 rounded-3xl border border-line bg-white p-5"
              >
                <div
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-2xl",
                    it.tint,
                  )}
                >
                  <Icon className={cn("h-6 w-6", it.iconColor)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-ink-900">
                      {it.name}
                    </p>
                    <StatusBadge status="verified" label="Connected" />
                  </div>
                  <p className="mt-1 text-sm text-muted">{it.desc}</p>
                  <p className="mt-2 text-xs font-medium text-ink-700">
                    {it.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* (4) Roles & access */}
      <SectionCard
        title="Roles & access control"
        subtitle="Role-based permissions governing who can view, flag, approve and configure."
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Role</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead className="text-center">Users</TableHead>
              <TableHead className="pr-5">Access level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROLES.map((r) => (
              <TableRow key={r.role}>
                <TableCell className="pl-5 font-semibold">{r.role}</TableCell>
                <TableCell className="text-ink-700">{r.scope}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {r.perms.map((p) => (
                      <Badge key={p} tone={r.permTone}>
                        {p}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold tabular">
                  {r.users}
                </TableCell>
                <TableCell className="pr-5 text-ink-700">{r.access}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </Page>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white shadow-soft">
        <Icon className="h-4 w-4 text-ink-700" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-ink-900">{value}</p>
      </div>
    </div>
  );
}
