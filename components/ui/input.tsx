import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-9 w-full rounded-full border border-line bg-white px-4 text-sm text-ink-900 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink-900/15",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

/** Search input with a leading icon. */
export const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <div className={cn("relative", className)}>
    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    <input
      ref={ref}
      className="h-9 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm text-ink-900 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ink-900/15"
      {...props}
    />
  </div>
));
SearchInput.displayName = "SearchInput";
