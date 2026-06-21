"use client";

import { motion } from "framer-motion";
import type { CPPlatform } from "@/types";
import { BrandIcon, brandColors } from "@/components/ui/BrandIcon";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/**
 * Cross-platform rating comparison — a genuinely multi-platform view (no single
 * judge dominates it). Each rated platform gets a horizontal bar scaled against
 * that platform's all-time record ceiling, so bars are comparable at a glance:
 * a longer bar means "closer to the top of that ladder," not just a bigger raw
 * number. The current rating fills the bar; a tick marks the personal peak.
 */
export function RatingComparison({ platforms }: { platforms: CPPlatform[] }) {
  const rated = platforms
    .filter((p) => (p.rated ?? p.rating != null) && p.rating != null && p.ratingCeiling)
    .sort((a, b) => (b.rating ?? 0) / (b.ratingCeiling ?? 1) - (a.rating ?? 0) / (a.ratingCeiling ?? 1));

  if (rated.length === 0) {
    return <p className="text-sm text-muted">No rated platform synced live this cycle.</p>;
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="flex flex-col gap-5"
    >
      {rated.map((p) => {
        const color = p.color ?? brandColors[p.id] ?? "rgb(var(--accent))";
        const ceiling = p.ratingCeiling!;
        const ratingPct = Math.max(2, Math.min(100, Math.round((p.rating! / ceiling) * 100)));
        const peakPct =
          p.maxRating != null ? Math.max(2, Math.min(100, Math.round((p.maxRating / ceiling) * 100))) : null;

        return (
          <motion.div key={p.id} variants={fadeUp} style={{ ["--brand" as string]: color }}>
            <div className="mb-2 flex items-end justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-white/5"
                  style={{ backgroundColor: hexA(color, 0.12), color }}
                >
                  <BrandIcon name={p.icon} fallbackLabel={p.name} size={17} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold leading-tight">{p.name}</p>
                  <p className="truncate text-[11px] text-muted">
                    {p.rank ?? "Rated"}
                    {p.maxRating != null && p.maxRating !== p.rating ? ` · peak ${p.maxRating}` : ""}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-extrabold leading-none tabular-nums">{p.rating}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-muted">{ratingPct}% of {ceiling}</p>
              </div>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-2/70 ring-1 ring-inset ring-white/5">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${hexA(color, 0.5)}, ${color})` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${ratingPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              {peakPct != null && peakPct > ratingPct && (
                <span
                  className="absolute top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full opacity-70"
                  style={{ left: `calc(${peakPct}% - 1px)`, backgroundColor: color }}
                  title={`Peak ${p.maxRating}`}
                />
              )}
            </div>
          </motion.div>
        );
      })}
      <p className="mt-1 text-[11px] leading-5 text-muted">
        Bars are scaled to each platform&apos;s all-time record rating, so length reflects how far up the ladder you are — not just the raw number. The tick marks your peak.
      </p>
    </motion.div>
  );
}

function hexA(color: string, alpha: number): string {
  if (!color.startsWith("#")) return `color-mix(in srgb, ${color} ${alpha * 100}%, transparent)`;
  const hex = color.replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
