import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Titled white card with optional subtitle and a right-aligned action slot
 * (e.g. a "View all" link or a period pill). The standard content container.
 */
export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
  bodyClassName,
  noPadding = false,
}: {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-card border border-line bg-card shadow-soft",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 px-5 pt-5">
          <div className="min-w-0">
            {title && (
              <h3 className="text-[15px] font-semibold leading-tight text-ink-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-[13px] leading-snug text-muted">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      <div
        className={cn(
          noPadding ? "" : "p-5",
          title || action ? (noPadding ? "" : "pt-4") : "",
          bodyClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
