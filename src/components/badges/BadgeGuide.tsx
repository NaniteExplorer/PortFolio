"use client";

import { useState } from "react";
import { Info, Lock, Star } from "lucide-react";
import type { BadgeAchievement, BadgeTrack } from "@/types";

const TRACK_LABELS: Record<BadgeTrack, string> = {
  prestige: "Prestige",
  dedication: "Dedication",
  competitive: "Competitive",
  dev: "Developer",
  monthly: "Monthly",
};

const TRACK_ORDER: BadgeTrack[] = ["prestige", "dedication", "competitive", "dev", "monthly"];

export function BadgeGuide({
  badges = [],
  title = "Badge Guide",
  description = "Badges are long-horizon honours. Locked medals are faded, earned medals keep their full finish, and in-progress medals show partial progress.",
}: {
  badges?: BadgeAchievement[];
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const tracks = TRACK_ORDER.map((track) => {
    const items = badges.filter((badge) => badge.track === track);
    return {
      track,
      total: items.length,
      earned: items.filter((badge) => badge.status === "earned").length,
      locked: items.filter((badge) => badge.status === "locked").length,
    };
  }).filter((item) => item.total > 0);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/70 px-3 py-2 text-xs font-semibold text-fg transition-colors hover:border-accent/50 hover:text-accent"
        aria-expanded={open}
      >
        <Info size={15} className="text-accent" />
        Badge tiers
      </button>
      {open && (
        <div className="absolute left-0 top-full z-[90] mt-3 w-[min(92vw,680px)] rounded-2xl border border-border bg-surface p-4 text-sm text-muted shadow-[0_24px_80px_-24px_rgba(0,0,0,0.72)]">
          <div className="mb-3 flex items-center gap-2 font-semibold text-fg">
            <Info size={17} className="text-accent" />
            {title}
          </div>
          <p className="leading-6">{description}</p>
          <div className="mt-4 rounded-xl border border-border bg-surface-2/45 p-3 text-xs leading-5 text-muted">
            <span className="font-semibold text-fg">Shape logic:</span> badge family decides where it appears; medal
            silhouette is tier-based: bronze round, silver rounded crest, gold hex, platinum octagon, diamond gem,
            and mythic crown crest.
          </div>
          {tracks.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map((item) => (
                <div key={item.track} className="rounded-xl border border-border bg-surface-2/55 px-3 py-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    {TRACK_LABELS[item.track]}
                  </p>
                  <p className="mt-1 text-sm font-bold text-fg">
                    {item.earned}/{item.total} earned
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{item.locked} locked medals</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <GuideItem icon={<Lock size={15} />} label="Locked" text="Faded medal with lock mark." />
            <GuideItem icon={<Info size={15} />} label="Progress" text="Partial ring and hover details." />
            <GuideItem icon={<Star size={15} />} label="Favorite" text="Pin one medal per section." />
          </div>
        </div>
      )}
    </div>
  );
}

function GuideItem({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2/55 px-3 py-2">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-fg">
        <span className="text-accent">{icon}</span>
        {label}
      </div>
      <p className="text-xs leading-4 text-muted">{text}</p>
    </div>
  );
}
