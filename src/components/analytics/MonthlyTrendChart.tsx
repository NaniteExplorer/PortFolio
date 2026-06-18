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

export function MonthlyTrendChart({
  data,
  rangeLabel,
  benchmarks = [],
}: {
  data: DedicationMonthlyPoint[];
  rangeLabel?: string;
  benchmarks?: DedicationBenchmark[];
}) {
  const [scale, setScale] = useState<"focus" | "ladder">("focus");
  const points = data;
  const peakScore = Math.max(...points.map((point) => point.score), 1);
  const focusLimit = Math.max(peakScore * 1.25, benchmarks.find((benchmark) => benchmark.value > peakScore)?.value ?? peakScore);
  const visibleBenchmarks = benchmarks.filter((benchmark) => benchmark.value > 0 && (scale === "ladder" || benchmark.value <= focusLimit));
  const max =
    scale === "ladder"
      ? Math.max(peakScore, ...benchmarks.map((benchmark) => benchmark.value), 1)
      : Math.max(peakScore, ...visibleBenchmarks.map((benchmark) => benchmark.value), 1);
  const width = 640;
  const height = 220;
  const padding = 28;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const coords = points.map((point, index) => {
    const x = padding + (points.length <= 1 ? innerWidth : (index / (points.length - 1)) * innerWidth);
    const y = padding + innerHeight - (point.score / max) * innerHeight;
    return { ...point, x, y };
  });

  const path = coords
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  if (points.length === 0) {
    return <p className="text-sm text-muted">Trend data will appear after activity syncs.</p>;
  }

  const total = points.reduce((sum, point) => sum + point.score, 0);
  const peak = points.reduce((best, point) => (point.score > best.score ? point : best), points[0]);
  const average = Math.round(total / points.length);
  const first = points[0];
  const last = points[points.length - 1];

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Monthly dedication score trend"
          className="min-w-[560px]"
        >
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            className="stroke-border"
          />
          {visibleBenchmarks.map((benchmark) => {
            const y = padding + innerHeight - (benchmark.value / max) * innerHeight;
            if (y < padding - 1 || y > height - padding + 1) return null;
            return (
              <g key={benchmark.label}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke={benchmark.color}
                  strokeDasharray="4 5"
                  strokeOpacity="0.55"
                >
                  <title>{`${benchmark.label}: ${benchmark.value} monthly points`}</title>
                </line>
                <text
                  x={width - padding}
                  y={Math.max(10, y - 5)}
                  textAnchor="end"
                  fill={benchmark.color}
                  className="text-[10px] font-semibold"
                >
                  {benchmark.label}
                </text>
              </g>
            );
          })}
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
          {coords.map((point) => (
            <g key={point.month}>
              <circle cx={point.x} cy={point.y} r="3" fill="rgb(var(--accent))">
                <title>{`${formatMonth(point.month, {
                  month: "long",
                  year: "numeric",
                })}: ${point.score} points`}</title>
              </circle>
              <text
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted text-[10px]"
              >
                {formatMonth(point.month, { month: "short" })}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>
          {rangeLabel ?? `${formatMonth(first.month, { month: "short", year: "numeric" })} - ${formatMonth(
            last.month,
            { month: "short", year: "numeric" }
          )}`}
        </span>
        <span>
          {total} total | {average} avg/mo | peak {peak.score} in{" "}
          {formatMonth(peak.month, { month: "short", year: "numeric" })} | {points.length} active mo
        </span>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {scale === "focus"
            ? "Focus scale keeps the curve readable and shows nearby tiers."
            : "Full ladder zooms out to the upper dedication tiers."}
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
      {visibleBenchmarks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted">
          {visibleBenchmarks.map((benchmark) => (
            <span key={benchmark.label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/60 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: benchmark.color }} />
              {benchmark.label}: {benchmark.value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
