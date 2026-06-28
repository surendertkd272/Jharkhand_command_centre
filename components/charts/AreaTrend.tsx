"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART, axisProps, tooltipStyle } from "@/lib/chartTheme";

/**
 * Signature smooth lime-gradient area chart with an ink line on top —
 * the reference's "Workout Activity" look. Reused for compliance trends,
 * attendance, etc.
 */
export function AreaTrend({
  data,
  dataKey,
  xKey = "label",
  height = 240,
  domain,
  unit = "",
  color = CHART.lime,
  lineColor = CHART.ink,
  gradientId,
}: {
  data: Array<Record<string, number | string>>;
  dataKey: string;
  xKey?: string;
  height?: number;
  domain?: [number | "auto", number | "auto"];
  unit?: string;
  color?: string;
  lineColor?: string;
  gradientId?: string;
}) {
  const gid = gradientId ?? `grad-${dataKey}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <stop offset="100%" stopColor={color} stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART.grid} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis
          {...axisProps}
          domain={domain ?? ["auto", "auto"]}
          width={44}
          tickFormatter={(v) => `${v}${unit}`}
        />
        <Tooltip {...tooltipStyle} formatter={(v) => [`${v}${unit}`, ""]} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={lineColor}
          strokeWidth={2.5}
          fill={`url(#${gid})`}
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: lineColor, strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
