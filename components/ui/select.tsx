import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

/** Styled native select — reliable, accessible, zero-dependency. */
export function Select({
  value,
  onValueChange,
  options,
  className,
  ariaLabel,
}: {
  value: string;
  onValueChange: (v: string) => void;
  options: SelectOption[];
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={cn("relative inline-flex", className)}>
      <select
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="h-9 w-full appearance-none rounded-full border border-line bg-white pl-4 pr-9 text-sm font-medium text-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-900/15"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}
