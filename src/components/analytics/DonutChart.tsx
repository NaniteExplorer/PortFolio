"use client";

import { motion } from "framer-motion";
import type { CPDataPoint } from "@/types";

const PALETTE = ["#22C55E", "#F59E0B", "#EF4444", "#3B82F6", "#A855F7", "#EC4899"];

/**
 * Reusable SVG donut chart with a center total and legend. Dependency-free and
 * animated. Pass any CPDataPoint[] (label/value/color).
 */
export function DonutChart({
  data,
  size = 200,
  thickness = 22,
  centerLabel = "Total",
}: {
  data: CPDataPoint[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  let offsetAcc = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--surface-2))"
          strokeWidth={thickness}
        />
        {data.map((d, i) => {
          const fraction = total > 0 ? d.value / total : 0;
          const dash = fraction * circumference;
          const color = d.color ?? PALETTE[i % PALETTE.length];
          const circle = (
            <motion.circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offsetAcc}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            />
          );
          offsetAcc += dash;
          return circle;
        })}
        {/* Center text (un-rotate via transform) */}
        <g transform={`rotate(90 ${size / 2} ${size / 2})`}>
          <text
            x="50%"
            y="46%"
            textAnchor="middle"
            className="fill-fg"
            style={{ fontSize: size * 0.16, fontWeight: 800 }}
          >
            {total}
          </text>
          <text
            x="50%"
            y="60%"
            textAnchor="middle"
            className="fill-muted"
            style={{ fontSize: size * 0.07 }}
          >
            {centerLabel}
          </text>
        </g>
      </svg>

      {/* Legend */}
      <ul className="space-y-2">
        {data.map((d, i) => {
          const color = d.color ?? PALETTE[i % PALETTE.length];
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <li key={d.label} className="flex items-center gap-3 text-sm">
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">{d.label}</span>
              <span className="ml-auto text-muted">
                {d.value} · {pct}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
