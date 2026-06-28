// Shared chart palette + axis/tooltip conventions for recharts across screens.
// Keeps the "smooth lime-gradient area + ink line" reference look consistent.

export const CHART = {
  lime: "#2563EB",
  limeDark: "#1D4ED8",
  ink: "#141414",
  ok: "#22C55E",
  warn: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  violet: "#7C3AED",
  grid: "#ECECEC",
  muted: "#8A8F98",
};

// Pie/donut and categorical series rotation.
export const CHART_SERIES = [
  CHART.lime,
  CHART.info,
  CHART.warn,
  CHART.violet,
  CHART.danger,
  CHART.ok,
];

export const axisProps = {
  tick: { fill: CHART.muted, fontSize: 12 },
  axisLine: false as const,
  tickLine: false as const,
};

// Common <Tooltip /> style props for a soft white floating card.
export const tooltipStyle = {
  contentStyle: {
    borderRadius: 12,
    border: "1px solid #ECECEC",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    fontSize: 12,
    padding: "8px 12px",
  },
  labelStyle: { color: "#8A8F98", fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: "#141414", fontWeight: 600 },
  cursor: { stroke: "#ECECEC", strokeWidth: 1 },
};
