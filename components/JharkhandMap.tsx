"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  DISTRICTS,
  DISTRICT_BY_ID,
  MAP_WIDTH,
  MAP_HEIGHT,
} from "@/lib/mock/districts";
import { ACADEMIES } from "@/lib/mock/academies";
import { complianceTone } from "@/components/ComplianceGauge";
import type { Academy } from "@/lib/types";

const TONE_FILL = { ok: "#22C55E", warn: "#F59E0B", danger: "#EF4444" };

/**
 * Inline SVG of Jharkhand with REAL district boundaries (projected from census
 * GeoJSON). Academy markers are colored by live compliance; hover a marker for
 * a mini-popover and to highlight its district; click to open the detail page.
 */
export function JharkhandMap({
  academies = ACADEMIES,
  maxHeight = 560,
}: {
  academies?: Academy[];
  maxHeight?: number;
}) {
  const router = useRouter();
  const [hovered, setHovered] = React.useState<Academy | null>(null);
  const hoveredDistrictId = hovered?.districtId ?? null;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className="w-full"
        style={{ height: "auto", maxHeight }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* District polygons */}
        <g>
          {DISTRICTS.map((d) => {
            const active = d.id === hoveredDistrictId;
            return (
              <path
                key={d.id}
                d={d.path}
                fill={active ? "#EFF5FF" : "#FFFFFF"}
                stroke={active ? "#2563EB" : "#D7DAD1"}
                strokeWidth={active ? 1.6 : 0.9}
                strokeLinejoin="round"
                className="transition-colors duration-150"
              />
            );
          })}
        </g>

        {/* District labels */}
        <g pointerEvents="none">
          {DISTRICTS.map((d) => (
            <text
              key={d.id}
              x={d.cx}
              y={d.cy}
              textAnchor="middle"
              fontSize={9.5}
              fontWeight={500}
              fill="#A6ABA0"
              className="select-none"
            >
              {d.name}
            </text>
          ))}
        </g>

        {/* Academy markers */}
        <g>
          {academies.map((a) => {
            const tone = complianceTone(a.complianceScore);
            const fill = TONE_FILL[tone];
            const active = hovered?.id === a.id;
            return (
              <g
                key={a.id}
                transform={`translate(${a.x}, ${a.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(a)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/academies/${a.id}`)}
              >
                {active && <circle r={13} fill={fill} opacity={0.18} />}
                <circle
                  r={active ? 7 : 5}
                  fill={fill}
                  stroke="#fff"
                  strokeWidth={1.8}
                  className="transition-all"
                />
                {a.openAlerts > 0 && (
                  <circle
                    r={2.2}
                    cx={5}
                    cy={-5}
                    fill="#EF4444"
                    stroke="#fff"
                    strokeWidth={1}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hover popover (HTML overlay positioned by viewBox %) */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 w-52 -translate-x-1/2 -translate-y-full rounded-xl border border-line bg-white p-3 shadow-lift"
          style={{
            left: `${(hovered.x / MAP_WIDTH) * 100}%`,
            top: `${(hovered.y / MAP_HEIGHT) * 100 - 1.5}%`,
          }}
        >
          <p className="text-sm font-semibold leading-tight text-ink-900">
            {hovered.name}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            {hovered.district} · {hovered.type}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted">Compliance</span>
            <span
              className="font-bold"
              style={{
                color: TONE_FILL[complianceTone(hovered.complianceScore)],
              }}
            >
              {hovered.complianceScore}%
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-muted">Open alerts</span>
            <span className="font-bold text-ink-900">{hovered.openAlerts}</span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-1 text-xs text-muted">
        <LegendDot color={TONE_FILL.ok} label="Compliant (≥70)" />
        <LegendDot color={TONE_FILL.warn} label="At risk (60–69)" />
        <LegendDot color={TONE_FILL.danger} label="Breach (<60)" />
        <span className="flex items-center gap-1.5">
          <span className="grid h-3 w-3 place-items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-danger" />
          </span>
          Open alerts
        </span>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
