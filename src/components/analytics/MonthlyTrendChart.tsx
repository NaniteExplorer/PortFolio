"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { DedicationBenchmark, DedicationMonthlyPoint } from "@/types";

const DATE_LOCALE = "en-US";
const DATE_ZONE = "UTC";

function formatMonth(month: string, options: Intl.DateTimeFormatOptions): string {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString(DATE_LOCALE, {
    ...options,
    timeZone: DATE_ZONE,
  });
}

/**
 * Monthly dedication-score trend with a MONTHLY-OUTPUT tier ladder.
 *
 * The tier lines here (Ember → Singularity) are scored in actual monthly points
 * and are a DIFFERENT system from the composite Dedication Rating ranks — their
 * thresholds widen as you climb, so each rank is harder to reach. Focus zooms to
 * the ranks around your curve; Full ladder reveals the whole climb. Self-derived
 * average and best-month lines stay as honest personal references.
 */
export function MonthlyTrendChart({
  data,
  rangeLabel,
  tiers = [],
}: {
  data: DedicationMonthlyPoint[];
  rangeLabel?: string;
  /** Monthly-output tier ladder (Ember … Singularity). */
  tiers?: DedicationBenchmark[];
}) {
  const [scale, setScale] = useState<"focus" | "ladder">("focus");
  const points = data;

  if (points.length === 0) {
    return <p className="text-sm text-muted">Trend data will appear after activity syncs.</p>;
  }

  const total = points.reduce((sum, point) => sum + point.score, 0);
  const peak = points.reduce((best, point) => (point.score > best.score ? point : best), points[0]);
  const average = Math.round(total / points.length);
  const first = points[0];
  const last = points[points.length - 1];

  // Which tier the best month currently sits in (for the "you" highlight).
  const reachedIndex = tiers.map((t) => peak.score >= t.value).lastIndexOf(true);

  // Focus → keep the curve readable, showing the rank just above the peak.
  // Full ladder → zoom out to the top tier so the whole climb is visible.
  const nextTierAbove = tiers.find((t) => t.value > peak.score)?.value ?? peak.score;
  const topTier = tiers.length ? tiers[tiers.length - 1].value : peak.score;
  const max =
    scale === "ladder"
      ? Math.max(peak.score * 1.05, topTier, 1)
      : Math.max(peak.score * 1.18, nextTierAbove * 1.05, 1);

  const visibleTiers = tiers.filter((t) => t.value <= max);

  const width = 640;
  const height = 230;
  const padding = 28;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const yFor = (value: number) => padding + innerHeight - (value / max) * innerHeight;

  const coords = points.map((point, index) => {
    const x = padding + (points.length <= 1 ? innerWidth : (index / (points.length - 1)) * innerWidth);
    return { ...point, x, y: yFor(point.score) };
  });

  const path = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${path} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

  const avgY = yFor(average);
  const peakY = yFor(peak.score);

  // Avoid label pile-ups: only label a tier if it's far enough from the last one drawn.
  let lastLabelY = -Infinity;

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Monthly dedication score trend" className="min-w-[560px]">
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity="0.26" />
              <stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} className="stroke-border" />

          {/* Monthly-output tier ladder */}
          {visibleTiers.map((tier) => {
            const y = yFor(tier.value);
            if (y < padding - 1 || y > height - padding + 1) return null;
            const isCurrent = tiers[reachedIndex]?.label === tier.label;
            const showLabel = Math.abs(y - lastLabelY) > 11;
            if (showLabel) lastLabelY = y;
            return (
              <g key={tier.label}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke={tier.color}
                  strokeDasharray={isCurrent ? undefined : "3 5"}
                  strokeOpacity={isCurrent ? 0.85 : 0.4}
                  strokeWidth={isCurrent ? 1.6 : 1}
                >
                  <title>{`${tier.label}: ${tier.value} monthly points`}</title>
                </line>
                {showLabel && (
                  <text x={width - padding} y={Math.max(9, y - 4)} textAnchor="end" fill={tier.color} className="text-[10px] font-semibold">
                    {isCurrent ? `★ ${tier.label}` : tier.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Average reference */}
          <line x1={padding} y1={avgY} x2={width - padding} y2={avgY} className="stroke-muted" strokeDasharray="4 5" strokeOpacity="0.45" />
          <text x={padding} y={Math.max(9, avgY - 4)} textAnchor="start" className="fill-muted text-[10px] font-semibold">
            Avg {average}
          </text>

          {/* Best month reference */}
          {peak.score > average && (
            <text x={padding} y={Math.max(9, peakY - 4)} textAnchor="start" className="text-[10px] font-semibold" fill="rgb(var(--accent))">
              Best {peak.score}
            </text>
          )}

          <motion.path
            d={area}
            fill="url(#trendFill)"
            stroke="none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          <motion.path
            d={path}
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          {coords.map((point) => {
            const isPeak = point.month === peak.month;
            return (
              <g key={point.month}>
                <circle cx={point.x} cy={point.y} r={isPeak ? 4 : 3} fill="rgb(var(--accent))" stroke={isPeak ? "white" : "none"} strokeWidth={isPeak ? 1.5 : 0}>
                  <title>{`${formatMonth(point.month, { month: "long", year: "numeric" })}: ${point.score} points`}</title>
                </circle>
                <text x={point.x} y={height - 8} textAnchor="middle" className="fill-muted text-[10px]">
                  {formatMonth(point.month, { month: "short" })}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          {rangeLabel ?? `${formatMonth(first.month, { month: "short", year: "numeric" })} - ${formatMonth(last.month, { month: "short", year: "numeric" })}`}
        </span>
        <span>
          {total} total | {average} avg/mo | peak {peak.score} in {formatMonth(peak.month, { month: "short", year: "numeric" })} | {points.length} active mo
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-md text-xs text-muted">
          {scale === "focus"
            ? "Focus shows the monthly-output ranks around your curve."
            : "Full ladder reveals every monthly rank — each one harder than the last."}
          {tiers.length > 0 && reachedIndex >= 0 && (
            <> Your best month sits at <span className="font-semibold text-fg">{tiers[reachedIndex].label}</span>.</>
          )}
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

      <p className="mt-3 text-[11px] leading-5 text-muted">
        Monthly ranks (Ember → Singularity) are scored in monthly points and are separate from the composite Dedication Rating tier, which is a yearly score.
      </p>
    </div>
  );
}
