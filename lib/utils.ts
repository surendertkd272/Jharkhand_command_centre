import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names, de-duping Tailwind utilities. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a rupee amount in Indian Lakh/Crore convention. Uses "Rs" (no glyph). */
export function formatRs(amount: number, opts?: { compact?: boolean }): string {
  const compact = opts?.compact ?? true;
  if (!compact) {
    return "Rs " + amount.toLocaleString("en-IN");
  }
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 1_00_00_000) {
    return `${sign}Rs ${(abs / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}Rs ${(abs / 1_00_000).toFixed(2)} L`;
  }
  if (abs >= 1_000) {
    return `${sign}Rs ${(abs / 1_000).toFixed(1)}K`;
  }
  return `${sign}Rs ${abs.toLocaleString("en-IN")}`;
}

/** Relative "time ago" from an ISO string, anchored to the demo "now". */
export function timeAgo(iso: string, now: Date = DEMO_NOW): string {
  const then = new Date(iso).getTime();
  const diffMs = now.getTime() - then;
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return `${weeks}w ago`;
}

/** Fixed "now" for the demo so relative timestamps stay stable. */
export const DEMO_NOW = new Date("2026-06-28T09:15:00+05:30");

/** Mask a bank account number, showing only last 4 digits. */
export function maskAccount(acct: string): string {
  const last4 = acct.slice(-4);
  return `XXXX XXXX ${last4}`;
}

/** Clamp a number between min and max. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

/** Initials from a full name, max 2 chars. */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
