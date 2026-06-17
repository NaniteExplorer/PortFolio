"use client";

import { useEffect, useState } from "react";
import { profileSyncConfig } from "@/data/profile-sync";

/**
 * "Live synced Xm ago" pill with a pulsing dot. Computes the relative time on
 * the client so it stays correct between ISR revalidations. `liveCount`/`total`
 * communicate how many sources actually returned live data this render.
 */
export function SyncBadge({
  syncedAt,
  liveCount,
  total,
}: {
  syncedAt: string;
  liveCount?: number;
  total?: number;
}) {
  const [rel, setRel] = useState<string>("just now");

  useEffect(() => {
    const update = () => {
      const diff = Date.now() - new Date(syncedAt).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) setRel("just now");
      else if (mins < 60) setRel(`${mins}m ago`);
      else if (mins < 1440) setRel(`${Math.floor(mins / 60)}h ago`);
      else setRel(`${Math.floor(mins / 1440)}d ago`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [syncedAt]);

  const allLive = liveCount != null && total != null && liveCount === total;
  const revalidateHours = Math.round(profileSyncConfig.revalidateSeconds / 3600);

  return (
    <span
      title={`Stats are pulled live from each platform's API and refresh automatically. Last refreshed ${rel}; the snapshot is rebuilt at most every ${revalidateHours} hours.${
        liveCount != null && total != null
          ? ` ${liveCount} of ${total} sources responded on the last refresh.`
          : ""
      }`}
      className="inline-flex cursor-help items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted backdrop-blur"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-fg">Auto-synced</span>
      <span>&middot; {rel}</span>
      {liveCount != null && total != null && (
        <span className={allLive ? "text-emerald-500" : ""}>
          &middot; {liveCount}/{total} sources
        </span>
      )}
    </span>
  );
}
