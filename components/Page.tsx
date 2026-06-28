import * as React from "react";
import { Topbar } from "@/components/Topbar";

/**
 * Standard screen scaffold: sticky Topbar + a 24px-gutter content area.
 * Pass `rightPanel` to get the dashboard/profile-style right context column.
 */
export function Page({
  title,
  subtitle,
  topbarRight,
  notifications,
  children,
  rightPanel,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  topbarRight?: React.ReactNode;
  notifications?: number;
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
}) {
  return (
    <>
      <Topbar
        title={title}
        subtitle={subtitle}
        right={topbarRight}
        notifications={notifications}
      />
      {rightPanel ? (
        <div className="grid grid-cols-1 gap-6 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">{children}</div>
          <aside className="space-y-6">{rightPanel}</aside>
        </div>
      ) : (
        <div className="space-y-6 px-6 py-6">{children}</div>
      )}
    </>
  );
}
