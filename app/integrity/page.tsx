"use client";

import * as React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  Lock,
  Unlock,
  FileText,
  ScanFace,
  Fingerprint,
  ArrowRight,
} from "lucide-react";

import { Page } from "@/components/Page";
import { StatCard } from "@/components/StatCard";
import { SectionCard } from "@/components/SectionCard";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Sheet, SheetHeader, SheetTitle, SheetBody } from "@/components/ui/sheet";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { CHART, axisProps, tooltipStyle } from "@/lib/chartTheme";
import type {
  VerificationRow,
  DualRegistrationMatch,
} from "@/lib/types";
import {
  VERIFICATION_QUEUE,
  DEBIAS_POINTS,
  DUAL_REGISTRATIONS,
  VERIFIED_COUNT,
  PENDING_COUNT,
  FORGERY_FLAGGED_COUNT,
  DUAL_FLAGGED_COUNT,
} from "@/lib/mock/integrity";

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
function digiTone(status: VerificationRow["digiLockerStatus"]) {
  return status; // "verified" | "pending" | "flagged" are all StatusKind
}

function dualStatusKind(status: DualRegistrationMatch["status"]) {
  if (status === "flagged") return "flagged" as const;
  if (status === "frozen") return "paused" as const;
  return "resolved" as const; // cleared
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fmtSealedAt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ----------------------------------------------------------------------------
// Verification Vault tab
// ----------------------------------------------------------------------------
function VerificationVault() {
  const [selectedRow, setSelectedRow] = React.useState<VerificationRow | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = React.useState(false);

  function openRow(row: VerificationRow) {
    setSelectedRow(row);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Mini KPI tiles */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Verified & sealed"
          value={VERIFIED_COUNT}
          icon={ShieldCheck}
          tint="green"
          hint="DigiLocker dossiers locked"
        />
        <StatCard
          label="Pending board review"
          value={PENDING_COUNT}
          icon={Clock}
          tint="orange"
          hint="Awaiting registrar fetch"
        />
        <StatCard
          label="Forgery flagged"
          value={FORGERY_FLAGGED_COUNT}
          icon={AlertTriangle}
          tint="red"
          accent
          hint="DOB / residency mismatch"
        />
      </div>

      <SectionCard
        title="Identity verification queue"
        subtitle="Age & residency are sealed at registration via DigiLocker — immutable thereafter"
        action={
          <Badge tone="dark">{VERIFICATION_QUEUE.length} dossiers</Badge>
        }
        noPadding
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Athlete</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Residency proof</TableHead>
                <TableHead>DigiLocker</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VERIFICATION_QUEUE.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-canvas",
                    row.digiLockerStatus === "flagged" && "bg-tint-red/40",
                  )}
                  onClick={() => openRow(row)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={row.athleteName} size="sm" />
                      <div className="min-w-0">
                        <div className="font-semibold text-ink-900">
                          {row.athleteName}
                        </div>
                        <div className="text-xs text-muted">{row.athleteId}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-ink-700">{row.district}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold tabular text-ink-900">
                        {row.age}
                      </span>
                      {row.ageLocked && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-tint-green px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ok">
                          <Lock className="h-3 w-3" />
                          DigiLocker
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[320px]">
                    <span
                      className={cn(
                        "text-sm",
                        row.digiLockerStatus === "flagged"
                          ? "font-medium text-danger"
                          : "text-ink-700",
                      )}
                    >
                      {row.residencyProof}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={digiTone(row.digiLockerStatus)}
                      pulse={row.digiLockerStatus === "flagged"}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openRow(row);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      {/* DigiLocker seal sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        {selectedRow && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <Avatar name={selectedRow.athleteName} size="lg" />
                <div>
                  <SheetTitle>{selectedRow.athleteName}</SheetTitle>
                  <p className="text-sm text-muted">
                    {selectedRow.district} · Age {selectedRow.age}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <StatusBadge
                  status={digiTone(selectedRow.digiLockerStatus)}
                  pulse={selectedRow.digiLockerStatus === "flagged"}
                />
                {selectedRow.ageLocked ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-tint-green px-2.5 py-0.5 text-xs font-semibold text-ok">
                    <Lock className="h-3 w-3" />
                    Age locked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-tint-orange px-2.5 py-0.5 text-xs font-semibold text-warn">
                    <Unlock className="h-3 w-3" />
                    Age unsealed
                  </span>
                )}
              </div>
            </SheetHeader>
            <SheetBody className="space-y-6">
              {selectedRow.digiLockerStatus === "flagged" && (
                <div className="flex items-start gap-3 rounded-2xl border border-danger/30 bg-tint-red px-4 py-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
                  <div>
                    <p className="text-sm font-semibold text-danger">
                      Forgery flag raised
                    </p>
                    <p className="mt-0.5 text-sm text-ink-700">
                      {selectedRow.residencyProof}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink-900">
                  Sealed document vault
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {selectedRow.documents.map((doc) => (
                    <div
                      key={doc.label}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center",
                        doc.sealed
                          ? "border-ok/30 bg-tint-green"
                          : "border-warn/30 bg-tint-orange",
                      )}
                    >
                      <div
                        className={cn(
                          "grid h-12 w-12 place-items-center rounded-xl",
                          doc.sealed
                            ? "bg-white text-ok"
                            : "bg-white text-warn",
                        )}
                      >
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="text-xs font-semibold leading-tight text-ink-900">
                        {doc.label}
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide",
                          doc.sealed ? "text-ok" : "text-warn",
                        )}
                      >
                        {doc.sealed ? (
                          <>
                            <Lock className="h-3 w-3" />
                            Sealed
                          </>
                        ) : (
                          <>
                            <Unlock className="h-3 w-3" />
                            Unsealed
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Data sealed on</span>
                  <span className="font-semibold tabular text-ink-900">
                    {fmtSealedAt(selectedRow.sealedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Source</span>
                  <span className="font-medium text-ink-900">
                    DigiLocker · Govt. of India
                  </span>
                </div>
                <div className="flex items-start gap-2 rounded-2xl bg-canvas px-4 py-3 text-xs text-muted">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-ink-700" />
                  Data sealed on registration — immutable. Any post-registration
                  edit attempt is rejected and logged to the audit ledger.
                </div>
              </div>
            </SheetBody>
          </>
        )}
      </Sheet>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Trial De-Biasing tab
// ----------------------------------------------------------------------------
function TrialDeBiasing() {
  const sports = React.useMemo(() => {
    const set = new Set(DEBIAS_POINTS.map((p) => p.sport));
    return Array.from(set).sort();
  }, []);

  const [sport, setSport] = React.useState("all");

  const sportOptions = React.useMemo(
    () => [
      { value: "all", label: "All sports" },
      ...sports.map((s) => ({ value: s, label: s })),
    ],
    [sports],
  );

  const points = React.useMemo(
    () =>
      sport === "all"
        ? DEBIAS_POINTS
        : DEBIAS_POINTS.filter((p) => p.sport === sport),
    [sport],
  );

  const fairPoints = points.filter((p) => !p.flagged);
  const flaggedPoints = points.filter((p) => p.flagged);

  const flaggedList = React.useMemo(
    () =>
      flaggedPoints
        .slice()
        .sort((a, b) => b.deviation - a.deviation),
    [flaggedPoints],
  );

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
      <SectionCard
        title="Evaluator de-biasing scatter"
        subtitle="Objective baseline vs subjective trial score. Points far above the fair band signal evaluator inflation."
        action={
          <Select
            value={sport}
            onValueChange={setSport}
            options={sportOptions}
            ariaLabel="Filter by sport"
          />
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-4 text-xs">
          <span className="inline-flex items-center gap-2 font-medium text-ink-700">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: CHART.ok }} />
            Within fair band ({fairPoints.length})
          </span>
          <span className="inline-flex items-center gap-2 font-medium text-ink-700">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: CHART.danger }} />
            Flagged inflation ({flaggedPoints.length})
          </span>
          <span className="inline-flex items-center gap-2 font-medium text-muted">
            <span className="h-0.5 w-5" style={{ background: CHART.muted }} />
            Fair line (trial = baseline)
          </span>
        </div>
        <div className="h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid stroke={CHART.grid} strokeDasharray="3 3" />
              {/* Fair band: +/-8 around the diagonal, drawn as a faint band */}
              <ReferenceArea
                x1={0}
                y1={8}
                x2={92}
                y2={100}
                fill={CHART.ok}
                fillOpacity={0.05}
                ifOverflow="hidden"
              />
              <ReferenceLine
                segment={[
                  { x: 0, y: 0 },
                  { x: 100, y: 100 },
                ]}
                stroke={CHART.muted}
                strokeDasharray="5 5"
                strokeWidth={1.5}
              />
              <XAxis
                type="number"
                dataKey="baseline"
                domain={[55, 100]}
                {...axisProps}
                label={{
                  value: "Objective baseline",
                  position: "insideBottom",
                  offset: -18,
                  fill: CHART.muted,
                  fontSize: 12,
                }}
              />
              <YAxis
                type="number"
                dataKey="trialScore"
                domain={[55, 100]}
                {...axisProps}
                label={{
                  value: "Evaluator score",
                  angle: -90,
                  position: "insideLeft",
                  fill: CHART.muted,
                  fontSize: 12,
                }}
              />
              <ZAxis range={[90, 90]} />
              <Tooltip
                {...tooltipStyle}
                cursor={{ strokeDasharray: "3 3", stroke: CHART.grid }}
                formatter={(value: number, name: string) => [value, name]}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const p = payload[0].payload as (typeof DEBIAS_POINTS)[number];
                  return (
                    <div className="rounded-xl border border-line bg-white px-3 py-2 shadow-lift">
                      <div className="text-sm font-semibold text-ink-900">
                        {p.athleteName}
                      </div>
                      <div className="text-xs text-muted">
                        {p.district} · {p.sport}
                      </div>
                      <div className="mt-1 text-xs text-muted">{p.evaluator}</div>
                      <div className="mt-2 flex gap-4 text-xs">
                        <span className="text-ink-700">
                          Baseline{" "}
                          <span className="font-semibold tabular text-ink-900">
                            {p.baseline}
                          </span>
                        </span>
                        <span className="text-ink-700">
                          Trial{" "}
                          <span className="font-semibold tabular text-ink-900">
                            {p.trialScore}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "font-semibold tabular",
                            p.flagged ? "text-danger" : "text-ok",
                          )}
                        >
                          {p.deviation > 0 ? "+" : ""}
                          {p.deviation}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter
                name="Fair"
                data={fairPoints}
                fill={CHART.ok}
                fillOpacity={0.85}
              />
              <Scatter
                name="Flagged"
                data={flaggedPoints}
                fill={CHART.danger}
                fillOpacity={0.9}
                shape="diamond"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard
        title="Flagged for review"
        subtitle={`${flaggedList.length} evaluator bias signatures`}
        bodyClassName="space-y-3"
      >
        {flaggedList.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-line bg-white p-4 shadow-soft"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold text-ink-900">{p.athleteName}</div>
                <div className="text-xs text-muted">
                  {p.district} · {p.sport}
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-tint-red px-2.5 py-0.5 text-xs font-bold tabular text-danger">
                +{p.deviation}
              </span>
            </div>
            <div className="mt-2 text-xs text-ink-700">{p.evaluator}</div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted">
              <span>
                Baseline{" "}
                <span className="font-semibold tabular text-ink-900">
                  {p.baseline}
                </span>
              </span>
              <ArrowRight className="h-3 w-3" />
              <span>
                Trial{" "}
                <span className="font-semibold tabular text-danger">
                  {p.trialScore}
                </span>
              </span>
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full">
              Review
            </Button>
          </div>
        ))}
        {flaggedList.length === 0 && (
          <p className="text-sm text-muted">
            No flagged cases for this sport — all evaluator scores sit within the
            fair band.
          </p>
        )}
      </SectionCard>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Dual-Registration tab
// ----------------------------------------------------------------------------
function DualRegistration() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard
          label="Athletes flagged this cycle"
          value={DUAL_FLAGGED_COUNT}
          icon={ScanFace}
          tint="red"
          accent
          hint="Same biometric, two districts"
        />
        <StatCard
          label="Registrations frozen"
          value={DUAL_REGISTRATIONS.filter((d) => d.status === "frozen").length}
          icon={Lock}
          tint="orange"
          hint="Pending state board ruling"
        />
        <StatCard
          label="Cleared after review"
          value={DUAL_REGISTRATIONS.filter((d) => d.status === "cleared").length}
          icon={ShieldCheck}
          tint="green"
          hint="False-positive matches"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {DUAL_REGISTRATIONS.map((d) => {
          const hot = d.matchConfidence >= 95;
          const isFlagged = d.status === "flagged";
          return (
            <Card
              key={d.id}
              className={cn(
                "overflow-hidden",
                isFlagged && hot && "ring-2 ring-danger",
              )}
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    {d.biometric === "face" ? (
                      <ScanFace className="h-4 w-4" />
                    ) : (
                      <Fingerprint className="h-4 w-4" />
                    )}
                    {d.biometric === "face" ? "Face match" : "Fingerprint match"}
                  </span>
                  <StatusBadge
                    status={dualStatusKind(d.status)}
                    pulse={isFlagged}
                  />
                </div>

                {/* Photo pair */}
                <div className="flex items-center justify-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <Avatar name={d.athleteName} size="lg" />
                    <span className="text-[11px] font-medium text-muted">
                      {d.districtA}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-full text-xs font-bold",
                      isFlagged
                        ? "bg-tint-red text-danger"
                        : "bg-canvas text-muted",
                    )}
                  >
                    vs
                  </span>
                  <div className="flex flex-col items-center gap-1">
                    <Avatar name={d.athleteName} size="lg" />
                    <span className="text-[11px] font-medium text-muted">
                      {d.districtB}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm font-semibold text-ink-900">
                    {d.athleteName}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    Registered in two districts
                  </div>
                </div>

                {/* Confidence */}
                <div className="rounded-2xl bg-canvas px-4 py-3 text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted">
                    Match confidence
                  </div>
                  <div
                    className={cn(
                      "text-3xl font-extrabold tracking-tight tabular",
                      hot ? "text-danger" : "text-ink-900",
                    )}
                  >
                    {d.matchConfidence}%
                  </div>
                </div>

                {/* Trial dates */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-line bg-white px-3 py-2">
                    <div className="font-semibold text-ink-900">
                      {d.districtA}
                    </div>
                    <div className="text-muted">{fmtDate(d.trialDateA)}</div>
                  </div>
                  <div className="rounded-xl border border-line bg-white px-3 py-2">
                    <div className="font-semibold text-ink-900">
                      {d.districtB}
                    </div>
                    <div className="text-muted">{fmtDate(d.trialDateB)}</div>
                  </div>
                </div>

                {isFlagged ? (
                  <Button variant="danger" size="md" className="w-full">
                    <Lock className="h-4 w-4" />
                    Freeze registrations
                  </Button>
                ) : d.status === "frozen" ? (
                  <Button variant="outline" size="md" className="w-full">
                    Review frozen case
                  </Button>
                ) : (
                  <Button variant="ghost" size="md" className="w-full">
                    View cleared record
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------
export default function IntegrityPage() {
  return (
    <Page
      title="Anti-Fraud & Identity Governance"
      subtitle="Verification vault · trial de-biasing · dual-registration"
    >
      <Tabs defaultValue="vault">
        <TabsList>
          <TabsTrigger value="vault">Verification Vault</TabsTrigger>
          <TabsTrigger value="debias">Trial De-Biasing</TabsTrigger>
          <TabsTrigger value="dual">Dual-Registration</TabsTrigger>
        </TabsList>
        <TabsContent value="vault">
          <VerificationVault />
        </TabsContent>
        <TabsContent value="debias">
          <TrialDeBiasing />
        </TabsContent>
        <TabsContent value="dual">
          <DualRegistration />
        </TabsContent>
      </Tabs>
    </Page>
  );
}
