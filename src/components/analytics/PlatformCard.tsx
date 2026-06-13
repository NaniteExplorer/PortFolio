"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { CPPlatform } from "@/types";
import { BrandIcon, brandColors } from "@/components/ui/BrandIcon";
import { RatingRing } from "@/components/analytics/RatingRing";
import { fadeUp } from "@/lib/motion";

/**
 * Rich card for a single competitive-programming platform: brand logo, handle
 * link, rating ring, rank, solved/contests, and any extra metrics. Fully driven
 * by one CPPlatform object.
 */
export function PlatformCard({ platform }: { platform: CPPlatform }) {
  const color = platform.color ?? brandColors[platform.id] ?? "rgb(var(--accent))";

  return (
    <motion.a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1"
      style={{ ["--brand" as string]: color }}
    >
      {/* Brand glow */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${hexA(color, 0.12)}`, color }}
          >
            <BrandIcon name={platform.icon} fallbackLabel={platform.name} size={24} />
          </span>
          <div>
            <h3 className="font-bold leading-tight">{platform.name}</h3>
            <p className="text-xs text-muted">@{platform.handle}</p>
          </div>
        </div>

        {platform.rating != null && platform.maxRating != null ? (
          <RatingRing
            value={platform.rating}
            max={platform.maxRating}
            color={color}
            label="rating"
          />
        ) : (
          <ExternalLink
            size={16}
            className="text-muted transition-colors group-hover:text-fg"
          />
        )}
      </div>

      {/* Rank + peak */}
      {(platform.rank || platform.maxRating != null) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          {platform.rank && (
            <span
              className="rounded-full px-2.5 py-1 font-semibold"
              style={{ backgroundColor: hexA(color, 0.14), color }}
            >
              {platform.rank}
            </span>
          )}
          {platform.maxRating != null && (
            <span className="text-muted">Peak {platform.maxRating}</span>
          )}
        </div>
      )}

      {/* Metric grid */}
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        {platform.solved != null && (
          <Metric label="Solved" value={platform.solved} />
        )}
        {platform.contests != null && (
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
