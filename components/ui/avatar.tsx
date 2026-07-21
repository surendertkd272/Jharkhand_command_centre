"use client";

import * as React from "react";
import { cn, initials } from "@/lib/utils";
import { AVATAR_PHOTOS } from "@/lib/avatarManifest";

const TONES = [
  "bg-tint-blue text-info",
  "bg-tint-green text-ok",
  "bg-tint-violet text-[#7c3aed]",
  "bg-tint-orange text-warn",
  "bg-lime-100 text-ink-900",
];

function toneFor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++)
    h = (h + name.charCodeAt(i)) % TONES.length;
  return TONES[h];
}

/** Must match the avatar generator's slug (scripts/gen-avatars). */
function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const DIM = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

/**
 * Athlete/person avatar. Renders a pre-generated portrait from
 * /public/avatars/<slug>.svg (or an explicit `src`), and falls back to a
 * tinted initials monogram if the image is missing or fails to load.
 */
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
  const [failed, setFailed] = React.useState(false);
  const dim = DIM[size];
  const s = slug(name);
  // Prefer an explicit src, then a real photo (if the manifest lists one),
  // then the generated illustrated SVG.
  const photoExt = AVATAR_PHOTOS[s];
  const resolved =
    src && src.length > 0
      ? src
      : photoExt
        ? `/avatars/${s}.${photoExt}`
        : `/avatars/${s}.svg`;

  if (failed) {
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

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 rounded-full bg-canvas object-cover ring-1 ring-line",
        dim,
        className,
      )}
    />
  );
}
