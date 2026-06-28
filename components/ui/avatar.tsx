import * as React from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

const TONES = [
  "bg-tint-blue text-info",
  "bg-tint-green text-ok",
  "bg-tint-violet text-[#7c3aed]",
  "bg-tint-orange text-warn",
  "bg-lime-100 text-ink-900",
];

function toneFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % TONES.length;
  return TONES[h];
}

/** Initials avatar. Deterministic pastel tint per name. */
export function Avatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const dim = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-xl",
  }[size];

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover", dim, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-semibold",
        toneFor(name),
        dim,
        className,
      )}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}
