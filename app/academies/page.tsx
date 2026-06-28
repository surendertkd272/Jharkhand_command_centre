"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Users, Building2, ArrowUpRight } from "lucide-react";
import { Page } from "@/components/Page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { ComplianceGauge } from "@/components/ComplianceGauge";
import { ACADEMIES, TOTAL_ACADEMIES } from "@/lib/mock/academies";
import { DISTRICTS } from "@/lib/mock/districts";
import type { Sport } from "@/lib/types";

const SPORTS: Sport[] = [
  "Archery",
  "Hockey",
  "Football",
  "Athletics",
  "Wrestling",
  "Weightlifting",
  "Kabaddi",
  "Boxing",
];

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "flagged", label: "Flagged" },
  { value: "paused", label: "Paused" },
];

const DISTRICT_OPTIONS = [
  { value: "all", label: "All districts" },
  ...DISTRICTS.map((d) => ({ value: d.id, label: d.name })),
];

const SPORT_OPTIONS = [
  { value: "all", label: "All sports" },
  ...SPORTS.map((s) => ({ value: s, label: s })),
];

export default function AcademiesPage() {
  const [query, setQuery] = React.useState("");
  const [district, setDistrict] = React.useState("all");
  const [sport, setSport] = React.useState("all");
  const [status, setStatus] = React.useState("all");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return ACADEMIES.filter((a) => {
      if (q && !a.name.toLowerCase().includes(q)) return false;
      if (district !== "all" && a.districtId !== district) return false;
      if (sport !== "all" && !a.sports.includes(sport as Sport)) return false;
      if (status !== "all" && a.fundingStatus !== status) return false;
      return true;
    });
  }, [query, district, sport, status]);

  return (
    <Page
      title="Academies & PECs"
      subtitle="40 facilities under state oversight"
      notifications={6}
    >
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by facility name…"
            className="lg:max-w-xs"
          />
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={district}
              onValueChange={setDistrict}
              options={DISTRICT_OPTIONS}
              ariaLabel="Filter by district"
            />
            <Select
              value={sport}
              onValueChange={setSport}
              options={SPORT_OPTIONS}
              ariaLabel="Filter by sport"
            />
            <Select
              value={status}
              onValueChange={setStatus}
              options={STATUS_OPTIONS}
              ariaLabel="Filter by funding status"
            />
          </div>
          <div className="lg:ml-auto">
            <span className="text-sm font-semibold text-ink-900 tabular">
              {filtered.length}
            </span>
            <span className="text-sm text-muted"> of {TOTAL_ACADEMIES}</span>
          </div>
        </div>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((a) => (
          <Link
            key={a.id}
            href={`/academies/${a.id}`}
            className="group block rounded-card outline-none transition focus-visible:ring-2 focus-visible:ring-ink-900/20"
          >
            <Card className="flex h-full flex-col p-5 transition group-hover:shadow-lift group-hover:border-ink-900/15">
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge tone={a.type === "PEC" ? "info" : "lime"}>
                      <Building2 className="h-3 w-3" />
                      {a.type}
                    </Badge>
                    {a.openAlerts > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-tint-red px-2 py-0.5 text-xs font-semibold text-danger">
                        <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse-dot" />
                        {a.openAlerts} alert{a.openAlerts > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <h3 className="truncate text-base font-semibold leading-tight text-ink-900 group-hover:underline">
                    {a.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{a.district}</span>
                  </div>
                </div>
                <ComplianceGauge value={a.complianceScore} size={64} stroke={7} threshold={60} />
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {a.sports.map((s) => (
                  <Badge key={s} tone="neutral">
                    {s}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
                <div className="flex items-center gap-1.5 text-sm font-medium text-ink-700">
                  <Users className="h-4 w-4 text-muted" />
                  <span className="tabular">{a.athletesCount}</span>
                  <span className="text-muted">athletes</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    status={a.fundingStatus}
                    pulse={a.fundingStatus === "paused"}
                  />
                  <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-ink-900" />
                </div>
              </div>

              {a.fundingNote && a.fundingStatus !== "active" && (
                <div className="mt-3 rounded-2xl bg-tint-orange/60 px-3 py-2 text-xs font-medium text-warn">
                  {a.fundingNote}
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-sm font-medium text-ink-900">
            No facilities match these filters.
          </p>
          <p className="mt-1 text-sm text-muted">
            Adjust the search, district, sport or status filters above.
          </p>
        </Card>
      )}
    </Page>
  );
}
