"use client";

import { motion } from "framer-motion";
import type { CPDataPoint } from "@/types";
import { viewportOnce } from "@/lib/motion";

/**
 * Reusable horizontal bar chart. Bars animate to their proportional width on
 * scroll. Pass any CPDataPoint[] (label/value/color).
 */
export function BarChart({ data }: { data: CPDataPoint[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="space-y-4">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">{d.label}</span>
              <span className="text-muted">{d.value}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: d.color
                    ? `linear-gradient(90deg, ${d.color}, ${d.color}cc)`
                    : "linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-2)))",
                }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={viewportOnce}
                transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
