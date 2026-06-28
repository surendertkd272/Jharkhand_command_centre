import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        neutral: "bg-black/5 text-ink-700",
        lime: "bg-lime-100 text-ink-900",
        ok: "bg-tint-green text-ok",
        warn: "bg-tint-orange text-warn",
        danger: "bg-tint-red text-danger",
        info: "bg-tint-blue text-info",
        dark: "bg-ink-900 text-white",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props} />
  );
}

export { badgeVariants };
