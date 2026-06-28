"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV } from "@/lib/nav";
import { Tooltip } from "@/components/ui/tooltip";

/** Fixed near-black icon rail with lime diamond logo and active-item highlight. */
export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 z-40 flex h-screen w-[72px] shrink-0 flex-col items-center bg-ink-900 py-5">
      {/* Lime diamond logo */}
      <Link href="/" className="mb-8 grid h-11 w-11 place-items-center" aria-label="Home">
        <span className="block h-7 w-7 rotate-45 rounded-md bg-lime-500 shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-2">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Tooltip key={item.href} label={item.label} side="right">
              <Link
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-2xl transition-all duration-200",
                  active
                    ? "bg-lime-500 text-white shadow-[0_0_18px_rgba(37,99,235,0.4)]"
                    : "text-white/50 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              </Link>
            </Tooltip>
          );
        })}
      </nav>

      {/* Pinned help/profile */}
      <div className="mt-auto flex flex-col items-center gap-3 pt-4">
        <Tooltip label="Help & support" side="right">
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </Tooltip>
        <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/20">
          <div className="grid h-full w-full place-items-center bg-lime-100 text-xs font-bold text-ink-900">
            RS
          </div>
        </div>
      </div>
    </aside>
  );
}
