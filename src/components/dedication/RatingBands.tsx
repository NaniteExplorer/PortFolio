"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Lock } from "lucide-react";
import { DEDICATION_TIERS } from "@/lib/dedication-rating";

/**
 * Codeforces-style rating graph for the composite Dedication Rating. Each tier
 * is a horizontal band; the band fills to show how far through that tier's
 * rating range you are (cleared = full, current = partial, locked = empty). A
 * Focus / Full-ladder toggle either zooms to the tiers around you or shows the
 * whole ladder — mirroring the monthly chart's control. Pure composite scale,
 * so it can never disagree with the rating number above it.
 */
export function RatingBands({ rating }: { rating: number }) {
  const [scale, setScale] = useState<"focus" | "ladder">("focus");
  const tiers = DEDICATION_TIERS;
  const currentIndex = Math.max(0, tiers.map((t) => rating >= t.minRating).lastIndexOf(true));

  // Focus → the tier you hold plus one below and two above (clamped).
  const from = scale === "focus" ? Math.max(0, currentIndex - 1) : 0;
  const to = scale === "focus" ? Math.min(tiers.length - 1, currentIndex + 2) : tiers.length - 1;

  // Highest tier on top, like a CF rating axis.
  const rows = [];
  for (let i = to; i >= from; i--) {
    const tier = tiers[i];
    const next = tiers[i + 1];
    const upper = next ? next.minRating : tier.minRating + 300;
    const cleared = i < currentIndex;
    const current = i === currentIndex;
    const locked = i > currentIndex;
    const fill = cleared ? 1 : locked ? 0 : Math.min(1, Math.max(0.04, (rating - tier.minRating) / (upper - tier.minRating)));
    rows.push({ tier, next, upper, cleared, current, locked, fill });
  }

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        {rows.map(({ tier, next, upper, cleared, current, locked, fill }) => (
          <div key={tier.tag} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-3 sm:grid-cols-[9rem_1fr_auto]">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="grid h-4 w-4 shrink-0 place-items-center rounded-full"
                style={{ backgroundColor: locked ? "rgb(var(--surface-2))" : tier.color, color: "#0b0b0f" }}
              >
                {locked && <Lock size={9} className="text-muted" />}
              </span>
              <span
                className="truncate text-xs font-bold leading-tight"
                style={{ color: cleared || current ? tier.color : "rgb(var(--muted))" }}
              >
                {tier.name}
              </span>
            </div>
            <div
              className={`relative h-5 overflow-hidden rounded-md ring-1 ring-inset ring-white/5 ${current ? "" : "opacity-90"}`}
              style={{ backgroundColor: "rgb(var(--surface-2) / 0.6)", boxShadow: current ? `0 0 18px -6px ${tier.color}` : undefined }}
            >
              <motion.div
                className="h-full rounded-md"
                style={{ background: `linear-gradient(90deg, ${hexA(tier.color, 0.45)}, ${tier.color})` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${fill * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
              {current && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-extrabold text-white drop-shadow">
                  {rating}
                </span>
              )}
            </div>
            <span className="whitespace-nowrap text-right text-[10px] tabular-nums text-muted">
              {next ? `${tier.minRating}–${upper}` : `${tier.minRating}+`}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-xs text-muted">
          {scale === "focus"
            ? "Focus shows the ranks right around you."
            : "Full ladder shows every dedication rank from entry to mythic."}
        </p>
        <div className="flex rounded-full border border-border bg-surface-2/60 p-1">
          {(["focus", "ladder"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setScale(option)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                scale === option ? "bg-accent text-white" : "text-muted hover:text-fg"
              }`}
            >
              {option === "focus" ? "Focus" : "Full ladder"}
            </button>
          ))}
        </div>
      </div>
    </div>
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
