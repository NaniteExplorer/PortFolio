"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, ChevronDown, Star, X } from "lucide-react";
import type { BadgeAchievement, BadgeTrack } from "@/types";
import { BadgeMedallion } from "@/components/badges/BadgeMedallion";
import { cn } from "@/lib/utils";

const TRACK_LABELS: Record<BadgeTrack, string> = {
  prestige: "Prestige",
  dedication: "Dedication",
  competitive: "Competitive",
  dev: "Developer",
  monthly: "Monthly",
};

const TRACK_SUMMARY: Record<BadgeTrack, string> = {
  prestige: "Crown-tier honours for long streaks and year-level discipline.",
  dedication: "Consistency medals for active days, streaks, peak days, and score.",
  competitive: "Arena medals for solves, contests, ratings, and CP activity.",
  dev: "Engineering medals for GitHub contribution volume and breadth.",
  monthly: "Calendar medals for standout months and repeated monthly discipline.",
};

const TRACK_ORDER: BadgeTrack[] = ["prestige", "dedication", "competitive", "dev", "monthly"];
const FAVORITES_KEY = "portfolio-badge-favorites-v1";
const EARNED_KEY = "portfolio-earned-badges-v1";

function favoriteBadges(items: BadgeAchievement[]) {
  const earned = items.filter((badge) => badge.status === "earned");
  const inProgress = items
    .filter((badge) => badge.status === "in_progress")
    .sort((a, b) => b.progress / b.target - a.progress / a.target);
  return [...earned, ...inProgress, ...items].filter(
    (badge, index, list) => list.findIndex((item) => item.id === badge.id) === index
  );
}

export function BadgeGrid({ badges }: { badges: BadgeAchievement[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, string>>({});
  const [celebration, setCelebration] = useState<BadgeAchievement | null>(null);
  const availableTracks = TRACK_ORDER.filter((track) => badges.some((badge) => badge.track === track));

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(FAVORITES_KEY);
      if (saved) setFavorites(JSON.parse(saved));
    } catch {
      setFavorites({});
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore private browsing / storage denied cases.
    }
  }, [favorites]);

  useEffect(() => {
    try {
      const earnedIds = badges.filter((badge) => badge.status === "earned").map((badge) => badge.id);
      const previous = JSON.parse(window.localStorage.getItem(EARNED_KEY) ?? "[]") as string[];
      const newlyEarned = badges.find((badge) => badge.status === "earned" && !previous.includes(badge.id));
      window.localStorage.setItem(EARNED_KEY, JSON.stringify(earnedIds));
      if (previous.length > 0 && newlyEarned) {
        window.setTimeout(() => setCelebration(newlyEarned), 450);
      }
    } catch {
      // Ignore storage denied cases.
    }
  }, [badges]);

  useEffect(() => {
    if (!celebration) return;
    const id = window.setTimeout(() => setCelebration(null), 6500);
    return () => window.clearTimeout(id);
  }, [celebration]);

  return (
    <div className="space-y-8 overflow-visible">
      {celebration && (
        <div className="fixed left-1/2 top-5 z-[120] w-[min(92vw,420px)] -translate-x-1/2 rounded-2xl border border-amber-300/30 bg-surface/95 p-4 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.75)] backdrop-blur">
          <button
            type="button"
            onClick={() => setCelebration(null)}
            className="absolute right-2 top-2 rounded-full p-1 text-muted hover:text-fg"
            aria-label="Dismiss badge celebration"
          >
            <X size={15} />
          </button>
          <div className="flex gap-3 pr-5">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-amber-300/25 bg-amber-300/10 text-amber-300">
              <Award size={20} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">New badge earned</p>
              <p className="mt-1 font-bold text-fg">{celebration.title}</p>
              <p className="mt-1 text-sm text-muted">{celebration.description}</p>
            </div>
          </div>
        </div>
      )}
      {availableTracks.map((track) => {
        const items = badges.filter((badge) => badge.track === track);
        const earned = items.filter((badge) => badge.status === "earned").length;
        const isExpanded = expanded[track] ?? false;
        const autoFavorites = favoriteBadges(items);
        const selectedFavorite = items.find((badge) => badge.id === favorites[track]);
        const orderedFavorites = selectedFavorite
          ? [selectedFavorite, ...autoFavorites.filter((badge) => badge.id !== selectedFavorite.id)]
          : autoFavorites;
        const visible = isExpanded ? items : orderedFavorites.slice(0, 4);
        const remaining = Math.max(items.length - visible.length, 0);

        return (
          <section key={track} className="relative overflow-visible rounded-2xl border border-border bg-surface-2/25 p-4">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{TRACK_LABELS[track]}</p>
                  <span className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-semibold text-muted">
                    {earned}/{items.length} earned
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                    <Star size={12} />
                    Favorites first
                  </span>
                </div>
                <h3 className="mt-2 text-xl font-bold">{TRACK_LABELS[track]} Badges</h3>
              </div>
              <p className="max-w-md text-xs leading-5 text-muted">{TRACK_SUMMARY[track]}</p>
            </div>

            <div className="relative overflow-visible">
              <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {visible.map((badge) => (
                  <BadgeMedallion
                    key={badge.id}
                    badge={badge}
                    favorite={favorites[track] === badge.id}
                    onToggleFavorite={(next) =>
                      setFavorites((state) => ({
                        ...state,
                        [track]: state[track] === next.id ? "" : next.id,
                      }))
                    }
                  />
                ))}
              </div>
              {!isExpanded && remaining > 0 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface-2/95 to-transparent" />
              )}
            </div>

            {items.length > 4 && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setExpanded((state) => ({ ...state, [track]: !isExpanded }))}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-accent/50 hover:text-accent"
                >
                  {isExpanded ? "Collapse badges" : `Show all badges (${items.length})`}
                  <ChevronDown size={16} className={cn("transition-transform", isExpanded && "rotate-180")} />
                </button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

export function FeaturedBadges({ badges }: { badges: BadgeAchievement[] }) {
  const visible = useMemo(() => favoriteBadges(badges).slice(0, 4), [badges]);
  if (!visible.length) return null;
  const earned = badges.filter((badge) => badge.status === "earned").length;
  return (
    <div className="rounded-2xl border border-border bg-surface-2/25 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Favorite Badges</p>
          <p className="mt-1 text-xs text-muted">
            {earned}/{badges.length} earned
          </p>
        </div>
        <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
          Premium medals
        </span>
      </div>
      <div className="grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-4">
        {visible.map((badge) => (
          <BadgeMedallion key={badge.id} badge={badge} compact />
        ))}
      </div>
    </div>
  );
}
