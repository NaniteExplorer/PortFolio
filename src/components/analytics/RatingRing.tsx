"use client";

import { motion } from "framer-motion";

/**
 * Compact circular progress ring — used to visualise a rating against its peak
 * (or any value/max pair). Reusable and dependency-free.
 */
export function RatingRing({
  value,
  max,
  displayValue,
  size = 72,
  thickness = 7,
  color = "rgb(var(--accent))",
  label,
}: {
  value: number;
  max: number;
  /** Number shown in the center. Defaults to `value`. Use to surface a
   *  different figure (e.g. peak) while the ring still fills by value/max. */
  displayValue?: number;
  size?: number;
  thickness?: number;
  color?: string;
  label?: string;
}) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.min(value / Math.max(max, 1), 1);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(var(--surface-2))"
          strokeWidth={thickness}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - fraction) }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-bold leading-none">{displayValue ?? value}</span>
        {label && <span className="mt-0.5 text-[10px] text-muted">{label}</span>}
      </div>
    </div>
  );
}
