"use client";

import { motion } from "framer-motion";
import type { DedicationMonthlyPoint } from "@/types";

export function MonthlyTrendChart({ data }: { data: DedicationMonthlyPoint[] }) {
  const points = data.slice(-12);
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
                <title>{`${point.label}: ${point.score} points`}</title>
              </circle>
              <text
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                className="fill-muted text-[10px]"
              >
                {point.label.split(" ")[0]}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>Last {points.length} months</span>
        <span>Peak {Math.max(...points.map((point) => point.score))} points</span>
      </div>
    </div>
  );
}
