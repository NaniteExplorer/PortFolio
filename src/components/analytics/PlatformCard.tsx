"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CPPlatform } from "@/types";
import { BrandIcon, brandColors } from "@/components/ui/BrandIcon";
import { RatingRing } from "@/components/analytics/RatingRing";
import { fadeUp } from "@/lib/motion";

/**
 * Rich card for a single competitive-programming platform. Every card follows
 * the SAME anatomy so the grid reads consistently:
 *
 *   ┌ logo · name · @handle ················· ↗ (always) ┐
 *   │ <rating>  rating          [ rank tag ]   ◯ ring    │
 *   │ Peak N                                             │
 *   ├ Solved · Contests · …extra metrics ────────────────┤
 *
 * Rated platforms (LeetCode, Codeforces, CodeChef) show their native rating +
 * the platform's own tag (Top 5% / Expert / 3★) + a peak ring. Unrated practice
 * platforms (AtCoder) honestly show "Practice" instead of a fabricated rating.
 */
export function PlatformCard({ platform }: { platform: CPPlatform }) {
  const color = platform.color ?? brandColors[platform.id] ?? "rgb(var(--accent))";
  const isRated = platform.rated ?? platform.rating != null;
  const practiceValue = platform.solved ?? platform.rating ?? "—";
  const practiceLabel = platform.solved != null ? "solved" : platform.ratingLabel ?? "stat";
  // Only ring platforms that report a distinct peak — the ring then visualises
  // current-vs-peak progress instead of echoing the current rating shown big.
  const hasPeak = platform.maxRating != null;

  return (
    <motion.a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand)]/40"
      style={{ ["--brand" as string]: color }}
    >
      {/* Brand glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: color }}
      />

      {/* Header — identical across every card */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: hexA(color, 0.12), color }}
          >
            <BrandIcon name={platform.icon} fallbackLabel={platform.name} size={24} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-bold leading-tight">{platform.name}</h3>
            <p className="truncate text-xs text-muted">@{platform.handle}</p>
          </div>
        </div>
        <ArrowUpRight
          size={18}
          className="shrink-0 text-muted transition-colors group-hover:text-[var(--brand)]"
        />
      </div>

      {/* Rating band — native rating + tag, with a peak ring for rated platforms */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          {isRated ? (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold leading-none tracking-tight">
                  {platform.rating}
                </span>
                <span className="text-xs font-medium text-muted">
                  {platform.ratingLabel ?? "rating"}
                </span>
              </div>
              {/* Peak is surfaced by the ring (center) — no redundant text line. */}
            </>
          ) : (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold leading-none tracking-tight">
                  {practiceValue}
                </span>
                <span className="text-xs font-medium text-muted">{practiceLabel}</span>
              </div>
              <p className="mt-1 text-xs text-muted">Practice profile</p>
            </>
          )}
          {/* Tag — the platform's own honorific, consistently styled */}
          <span
            className="mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: hexA(color, 0.14), color }}
          >
            {platform.rank ?? (isRated ? "Rated" : "Unrated")}
          </span>
        </div>

        {isRated && hasPeak && (
          <RatingRing
            value={platform.rating!}
            max={platform.maxRating!}
            displayValue={platform.maxRating!}
            color={color}
            label="peak"
          />
        )}
      </div>

      {/* Metric grid — consistent secondary stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        {/* For rated cards, solved goes here; for unrated it's the hero, so skip it. */}
        {isRated && platform.solved != null && (
          <Metric label="Solved" value={platform.solved} />
        )}
        {isRated && platform.contests != null && (
          <Metric label="Contests" value={platform.contests} />
        )}
        {platform.metrics?.map((m) => (
          <Metric key={m.label} label={m.label} value={m.value} />
        ))}
      </div>
    </motion.a>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-surface-2/60 px-3 py-2">
      <p className="text-base font-bold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

/** Convert a hex (or pass-through) color to an rgba-ish string with alpha. */
function hexA(color: string, alpha: number): string {
  if (!color.startsWith("#")) {
    // CSS var or named color — wrap with color-mix for alpha.
    return `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`;
  }
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
