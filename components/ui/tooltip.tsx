import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CSS-only hover tooltip — no portal, no JS state. Wrap a trigger and pass
 * `label`. Positioned to the right by default (for the icon rail).
 */
export function Tooltip({
  label,
  side = "right",
  children,
  className,
}: {
  label: string;
  side?: "right" | "top" | "bottom" | "left";
  children: React.ReactNode;
  className?: string;
}) {
  const pos = {
    right: "left-full top-1/2 ml-2 -translate-y-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2",
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
    bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  }[side];
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-ink-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-lift transition-opacity duration-150 group-hover:opacity-100",
          pos,
        )}
      >
        {label}
      </span>
    </span>
  );
}
