"use client";

import { motion } from "framer-motion";
import type { DedicationProfileData } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heatmap } from "@/components/analytics/Heatmap";
import { Section, SectionHeader } from "@/components/ui/Section";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

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
        className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <p className="text-sm leading-6 text-muted">
              A scored, filterable view of GitHub contribution, professional work, and competitive programming activity.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <MiniStat value={data.totals.score} label="Score" />
              <MiniStat value={data.totals.activeDays} label="Active days" />
              <MiniStat value={data.totals.bestStreak} label="Best streak" />
            </div>
            <div className="mt-6">
              <Button href="/dedication">Open dedication graph</Button>
            </div>
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="h-full">
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
    <div className="rounded-xl bg-surface-2/60 px-3 py-4">
      <p className="text-2xl font-extrabold text-accent">{value}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
