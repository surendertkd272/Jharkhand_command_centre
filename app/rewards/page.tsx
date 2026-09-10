"use client";

import * as React from "react";
import { Flame, Trophy, Medal, TrendingUp } from "lucide-react";

import { Page } from "@/components/Page";
import { SectionCard } from "@/components/SectionCard";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { AreaTrend } from "@/components/charts/AreaTrend";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Progress } from "@/components/ui/progress";

import {
  ACADEMY_STREAKS,
  ATHLETE_BADGES,
  BADGE_CRITERIA,
  BADGE_LABEL,
  DISTRICT_STANDINGS,
  ENGAGEMENT_TREND,
  ACTIVE_STREAK_COUNT,
  BADGES_AWARDED,
  BROKEN_STREAK_COUNT,
  ON_TIME_RATE_LIFT,
  ON_TIME_RATE_NOW,
  TOTAL_FACILITIES,
} from "@/lib/mock/rewards";
import { cn } from "@/lib/utils";
import type { BadgeKind } from "@/lib/types";

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
const BADGE_TONE: Record<
  BadgeKind,
  React.ComponentProps<typeof Badge>["tone"]
> = {
  consistency: "ok",
  "rising-talent": "info",
  "perfect-attendance": "lime",
  "recovery-champion": "warn",
  "district-topper": "dark",
};

function RankChip({ rank }: { rank: number }) {
  const podium = rank <= 3;
  return (
    <span
      className={cn(
        "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold tabular",
        podium ? "bg-lime-100 text-ink-900" : "bg-black/5 text-muted",
      )}
    >
      {rank}
    </span>
  );
}

function StreakCell({ weeks, best }: { weeks: number; best: number }) {
  if (weeks === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-danger">Broken</span>
        <span className="text-xs text-muted">best was {best}w</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <Flame
        className={cn(
          "h-4 w-4 shrink-0",
          weeks >= 15 ? "text-warn" : weeks >= 8 ? "text-ok" : "text-muted",
        )}
        strokeWidth={2.2}
      />
      <span className="text-sm font-semibold text-ink-900 tabular">
        {weeks}w
      </span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Academy Streaks tab
// ----------------------------------------------------------------------------
function AcademyStreaks() {
  const top = ACADEMY_STREAKS.slice(0, 12);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Facilities on an active streak"
          value={`${ACTIVE_STREAK_COUNT} / ${TOTAL_FACILITIES}`}
          icon={Flame}
          tint="green"
          hint="8+ consecutive weeks filed on time"
        />
        <StatCard
          label="On-time filing rate"
          value={`${ON_TIME_RATE_NOW}%`}
          icon={TrendingUp}
          tint="blue"
          delta={ON_TIME_RATE_LIFT}
          deltaSuffix="pp"
          hint="Since streaks went live, 8 weeks ago"
        />
        <StatCard
          label="Badges awarded"
          value={BADGES_AWARDED}
          icon={Medal}
          tint="lime"
          hint="Across academies this cycle"
        />
        <StatCard
          label="Streaks broken"
          value={BROKEN_STREAK_COUNT}
          icon={Trophy}
          tint="red"
          accent
          hint="Below the 60% filing floor — no grant priority"
        />
      </div>

      <SectionCard
        title="Weekly on-time filing"
        subtitle={`Share of all ${TOTAL_FACILITIES} facilities filing before the cut-off · up ${ON_TIME_RATE_LIFT}pp since rewards launched`}
      >
        <AreaTrend
          data={ENGAGEMENT_TREND}
          dataKey="onTime"
          domain={[50, 90]}
          unit="%"
        />
      </SectionCard>

      <SectionCard
        title="Academy leaderboard"
        subtitle="Ranked by engagement points — streak weeks, badges earned and on-time filing"
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[64px] pl-5">Rank</TableHead>
              <TableHead>Academy / PEC</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead className="w-[180px]">On-time filing</TableHead>
              <TableHead className="text-center">Badges</TableHead>
              <TableHead className="text-right">Points</TableHead>
              <TableHead className="pr-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell className="pl-5">
                  <RankChip rank={i + 1} />
                </TableCell>
                <TableCell>
                  <div className="font-semibold text-ink-900">
                    {r.academyName}
                  </div>
                  <div className="text-xs text-muted">{r.type}</div>
                </TableCell>
                <TableCell className="text-ink-700">{r.district}</TableCell>
                <TableCell>
                  <StreakCell weeks={r.streakWeeks} best={r.bestStreakWeeks} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="w-9 shrink-0 text-sm font-semibold text-ink-900 tabular">
                      {r.onTimeRate}%
                    </span>
                    <Progress
                      value={r.onTimeRate}
                      tone={
                        r.onTimeRate >= 80
                          ? "ok"
                          : r.onTimeRate >= 60
                            ? "warn"
                            : "danger"
                      }
                      className="flex-1"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold text-ink-900 tabular">
                  {r.badgesEarned}
                </TableCell>
                <TableCell className="text-right font-bold text-ink-900 tabular">
                  {r.points.toLocaleString("en-IN")}
                </TableCell>
                <TableCell className="pr-5">
                  <StatusBadge status={r.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Athlete Badges tab
// ----------------------------------------------------------------------------
function AthleteBadges() {
  const kinds = Object.keys(BADGE_LABEL) as BadgeKind[];
  return (
    <div className="space-y-6">
      <SectionCard
        title="What athletes earn"
        subtitle="Every badge is tied to verified data already in the command center — nothing is awarded by hand"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {kinds.map((k) => (
            <div
              key={k}
              className="rounded-xl border border-line bg-canvas/60 p-4"
            >
              <Badge tone={BADGE_TONE[k]}>{BADGE_LABEL[k]}</Badge>
              <p className="mt-2 text-[13px] leading-snug text-muted">
                {BADGE_CRITERIA[k]}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Athlete recognition"
        subtitle="Badges sit on the athlete's own profile and feed the scholarship priority score"
        noPadding
      >
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5">Athlete</TableHead>
              <TableHead>Academy</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead className="text-center">Attendance</TableHead>
              <TableHead>Badges</TableHead>
              <TableHead className="pr-5 text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ATHLETE_BADGES.map((a) => (
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
                <TableCell className="text-center font-semibold text-ink-900 tabular">
                  {a.attendanceRate}%
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1.5">
                    {a.badges.map((b) => (
                      <Badge key={b} tone={BADGE_TONE[b]}>
                        {BADGE_LABEL[b]}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="pr-5 text-right font-bold text-ink-900 tabular">
                  {a.points.toLocaleString("en-IN")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}

// ----------------------------------------------------------------------------
// District Leaderboard tab
// ----------------------------------------------------------------------------
function DistrictLeaderboard() {
  const top = DISTRICT_STANDINGS.slice(0, 12);
  const max = top[0]?.points ?? 1;
  return (
    <SectionCard
      title="District standings"
      subtitle="Facility engagement points rolled up by district — the view the Director reviews each month"
      noPadding
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[64px] pl-5">Rank</TableHead>
            <TableHead>District</TableHead>
            <TableHead className="text-center">Facilities</TableHead>
            <TableHead className="text-center">Avg. streak</TableHead>
            <TableHead className="w-[260px]">Engagement</TableHead>
            <TableHead className="pr-5 text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {top.map((d, i) => (
            <TableRow key={d.districtId}>
              <TableCell className="pl-5">
                <RankChip rank={i + 1} />
              </TableCell>
              <TableCell className="font-semibold text-ink-900">
                {d.district}
              </TableCell>
              <TableCell className="text-center text-ink-700 tabular">
                {d.facilities}
              </TableCell>
              <TableCell className="text-center text-ink-700 tabular">
                {d.avgStreakWeeks}w
              </TableCell>
              <TableCell>
                <Progress
                  value={Math.round((d.points / max) * 100)}
                  tone="ok"
                />
              </TableCell>
              <TableCell className="pr-5 text-right font-bold text-ink-900 tabular">
                {d.points.toLocaleString("en-IN")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  );
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------
export default function RewardsPage() {
  return (
    <Page
      title="Rewards & Engagement"
      subtitle="Compliance streaks · recognition badges · district leaderboard"
      notifications={2}
    >
      <Tabs defaultValue="streaks">
        <TabsList>
          <TabsTrigger value="streaks">Academy Streaks</TabsTrigger>
          <TabsTrigger value="badges">Athlete Badges</TabsTrigger>
          <TabsTrigger value="districts">District Leaderboard</TabsTrigger>
        </TabsList>
        <TabsContent value="streaks">
          <AcademyStreaks />
        </TabsContent>
        <TabsContent value="badges">
          <AthleteBadges />
        </TabsContent>
        <TabsContent value="districts">
          <DistrictLeaderboard />
        </TabsContent>
      </Tabs>
    </Page>
  );
}
