import * as React from "react";
import { cn } from "@/lib/utils";

/** Color by compliance threshold: >=70 ok, 60–69 warn, <60 danger. */
export function complianceTone(score: number): "ok" | "warn" | "danger" {
  if (score >= 70) return "ok";
  if (score >= 60) return "warn";
  return "danger";
}

const HEX = { ok: "#22C55E", warn: "#F59E0B", danger: "#EF4444" };

/**
 * Circular ring gauge (0–100) with the value in the center. Optionally shows
 * a threshold tick so "score vs trigger line" reads instantly.
 */
export function ComplianceGauge({
  value,
  size = 120,
  stroke = 10,
  threshold,
  label,
  suffix = "",
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  threshold?: number;
  label?: string;
  suffix?: string;
  className?: string;
}) {
  const tone = complianceTone(value);
  const color = HEX[tone];
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const dash = (pct / 100) * c;
  const center = size / 2;

  // Threshold tick position (angle from top, clockwise).
  let tick: React.ReactNode = null;
  if (typeof threshold === "number") {
    const angle = (threshold / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = center + (r - stroke / 2) * Math.cos(angle);
    const y1 = center + (r - stroke / 2) * Math.sin(angle);
    const x2 = center + (r + stroke / 2) * Math.cos(angle);
    const y2 = center + (r + stroke / 2) * Math.sin(angle);
    tick = (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#141414"
        strokeWidth={2}
        strokeLinecap="round"
      />
    );
  }

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="#ECECEC"
          strokeWidth={stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
        {tick}
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <div className="text-2xl font-extrabold tracking-tight text-ink-900 tabular">
            {value}
            {suffix}
          </div>
          {label && (
            <div className="mt-1 text-[11px] font-medium text-muted">
              {label}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
