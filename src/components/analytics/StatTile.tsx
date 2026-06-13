"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/types";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

/**
 * Reusable headline-stat tile (big number + label + optional icon).
 * Used across the competitive page and anywhere you need a metric card.
 */
export function StatTile({
  value,
  label,
  icon,
  accent,
  className,
}: {
  value: string | number;
  label: string;
  icon?: IconName;
  /** Optional accent color for the value + icon. */
  accent?: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 text-center",
        className
      )}
    >
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
        {value}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </motion.div>
  );
}
