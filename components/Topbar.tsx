"use client";

import * as React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Select } from "@/components/ui/select";
import { SearchInput } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PERIODS = [
  { value: "quarter", label: "This Quarter" },
  { value: "month", label: "This Month" },
  { value: "week", label: "This Week" },
  { value: "fy", label: "FY 2025–26" },
];

/**
 * Sticky page topbar: title + contextual subtitle on the left; period pill,
 * search and notification bell on the right. Pass `right` to override the
 * default action cluster.
 */
export function Topbar({
  title,
  subtitle,
  right,
  notifications = 7,
  showSearch = true,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  notifications?: number;
  showSearch?: boolean;
  className?: string;
}) {
  const [period, setPeriod] = React.useState("quarter");

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-line bg-canvas/85 px-6 py-4 backdrop-blur-md",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold tracking-tight text-ink-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 truncate text-sm text-muted">{subtitle}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        {right ?? (
          <>
            {showSearch && (
              <SearchInput
                placeholder="Search academies, athletes…"
                className="hidden w-60 lg:block"
              />
            )}
            <Select
              value={period}
              onValueChange={setPeriod}
              options={PERIODS}
              ariaLabel="Period"
            />
            <Link
              href="/alerts"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink-700 transition-colors hover:bg-canvas"
              aria-label="Alerts"
            >
              <Bell className="h-[18px] w-[18px]" />
              {notifications > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                  {notifications}
                </span>
              )}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
