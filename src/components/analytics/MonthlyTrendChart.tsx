"use client";

import { motion } from "framer-motion";
import type { DedicationMonthlyPoint } from "@/types";

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
}: {
  data: DedicationMonthlyPoint[];
  rangeLabel?: string;
}) {
  const points = data;
  const max = Math.max(...points.map((point) => point.score), 1);
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
          <motion.path
            d={path}
            fill="none"
            stroke="rgb(var(--accent))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          {coords.map((point) => (
            <g key={point.month}>
              <circle cx={point.x} cy={point.y} r="4" fill="rgb(var(--accent))">
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
    </div>
  );
}
