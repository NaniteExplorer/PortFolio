"use client";

import { motion } from "framer-motion";
import type { DedicationProfileData } from "@/types";
import { Card } from "@/components/ui/Card";
import { Heatmap } from "@/components/analytics/Heatmap";
import { Section, SectionHeader } from "@/components/ui/Section";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function DedicationTeaser({ data }: { data: DedicationProfileData }) {
  return (
    <Section id="dedication">
      <SectionHeader
        eyebrow="Dedication"
        title="Consistency across code, work, and problem solving"
        subtitle="A professional activity graph that connects GitHub, work, and competitive programming into one honest signal."
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="grid gap-5"
      >
        <motion.div variants={fadeUp}>
          <Card className="h-full overflow-hidden border-accent/25">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Dedication Snapshot
                </p>
                <h3 className="mt-2 text-xl font-bold">Activity that compounds across sources</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  A scored view of GitHub contribution, professional work, and competitive programming without
                  pretending every source has the same weight.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <MiniStat value={data.totals.score} label="Score" />
                <MiniStat value={data.totals.activeDays} label="Active days" />
                <MiniStat value={data.totals.bestStreak} label="Best streak" />
                <Link
                  href="/dedication"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_34px_-18px_rgb(var(--accent))] transition-colors hover:bg-accent-2"
                >
                  Open graph
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
            <Heatmap
              byDay={data.byDay}
              anchorDate={data.syncedAt}
              title="Dedication Snapshot"
              scheme="green"
              unit="dedication point"
            />
          </Card>
        </motion.div>
      </motion.div>
    </Section>
  );
}

function MiniStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-[92px] rounded-2xl border border-border bg-surface-2/60 px-3 py-2">
      <p className="text-base font-extrabold text-accent">
        {Math.round(value).toLocaleString("en-US", { notation: value > 9999 ? "compact" : "standard" })}
      </p>
      <p className="mt-0.5 whitespace-nowrap text-[11px] text-muted">{label}</p>
    </div>
  );
}
