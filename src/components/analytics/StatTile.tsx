"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/types";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { CountUp } from "@/components/analytics/CountUp";

/**
 * Reusable headline-stat tile (big number + label + optional icon).
 * Used across the competitive page and anywhere you need a metric card.
 *
 * Pass `count` (a number) to animate the value up from zero on scroll, with an
 * optional `suffix` (e.g. "+"). Otherwise `value` is rendered as-is.
 */
export function StatTile({
  value,
  count,
  suffix,
  label,
  helper,
  icon,
  accent,
  className,
}: {
  value?: string | number;
  /** When provided, the value animates 0→count on scroll into view. */
  count?: number;
  suffix?: string;
  label: string;
  helper?: string;
  icon?: IconName;
  /** Optional accent color for the value + icon. */
  accent?: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 text-center transition-colors hover:border-accent/40",
        className
      )}
    >
      {/* subtle top sheen */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      {icon && (
        <div
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10"
          style={accent ? { backgroundColor: `${accent}1a`, color: accent } : { color: "rgb(var(--accent))" }}
        >
          <Icon name={icon} size={20} />
        </div>
      )}
      <p
        className="text-3xl font-extrabold tracking-tight"
        style={accent ? { color: accent } : { color: "rgb(var(--accent))" }}
      >
        {count != null ? <CountUp value={count} suffix={suffix} /> : value}
      </p>
      <p className="mt-1 text-sm text-muted" title={helper}>
        {label}
      </p>
      {helper && <p className="mx-auto mt-2 max-w-44 text-xs leading-5 text-muted">{helper}</p>}
    </motion.div>
  );
}
