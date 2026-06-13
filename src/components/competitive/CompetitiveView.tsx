"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { CPProfile } from "@/types";
import type { cpAggregates } from "@/lib/competitive";
import { StatTile } from "@/components/analytics/StatTile";
import { DonutChart } from "@/components/analytics/DonutChart";
import { BarChart } from "@/components/analytics/BarChart";
import { Heatmap } from "@/components/analytics/Heatmap";
import { PlatformCard } from "@/components/analytics/PlatformCard";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { stagger, fadeUp, viewportOnce } from "@/lib/motion";

type Stats = ReturnType<typeof cpAggregates>;

/**
 * The competitive-programming analytics dashboard. Composed entirely from
 * reusable analytics components, fed by `data/competitive.ts`.
 */
export function CompetitiveView({
  profile,
  stats,
}: {
  profile: CPProfile;
  stats: Stats;
}) {
  return (
    <div className="container min-h-screen pt-32 pb-24">
      {/* Header */}
      <motion.header
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mb-14 max-w-3xl"
      >
        <motion.div variants={fadeUp}>
          <Link
            href="/#competitive"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent"
          >
            <ArrowLeft size={16} /> Back to portfolio
          </Link>
        </motion.div>
        <motion.p
          variants={fadeUp}
          className="mb-3 mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-accent"
        >
          Problem Solving
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-4xl font-bold tracking-tight md:text-5xl"
        >
          {profile.headline}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 text-muted">
          {profile.summary}
        </motion.p>
      </motion.header>

      {/* Headline stats */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <StatTile value={`${stats.totalSolved}+`} label="Problems Solved" icon="Target" />
        <StatTile value={stats.peakRating} label="Peak Rating" icon="TrendingUp" />
        <StatTile value={`${stats.totalContests}+`} label="Rated Contests" icon="Trophy" />
        <StatTile value={stats.platformCount} label="Platforms" icon="Layers" />
      </motion.section>

      {/* Platform cards */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mb-16"
      >
        <SectionTitle icon="Code2" title="Platforms" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {profile.platforms.map((p) => (
            <PlatformCard key={p.id} platform={p} />
          ))}
        </div>
      </motion.section>

      {/* Charts */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mb-16 grid gap-5 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <h3 className="mb-6 font-bold">Problems by Difficulty</h3>
            <DonutChart data={profile.difficulty} centerLabel="solved" />
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <h3 className="mb-6 font-bold">Problems by Platform</h3>
            <BarChart data={stats.solvedByPlatform} />
          </Card>
        </motion.div>
      </motion.section>

      {/* Activity heatmap */}
      {profile.activity && profile.activity.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="mb-16"
        >
          <motion.div variants={fadeUp}>
            <Card>
              <Heatmap data={profile.activity} title="Solving Activity" />
            </Card>
          </motion.div>
        </motion.section>
      )}

      {/* Achievements */}
      {profile.achievements.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
        >
          <SectionTitle icon="Award" title="Achievements" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.achievements.map((a) => (
              <motion.div
                key={a.title}
                variants={fadeUp}
                className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Icon name={(a.icon as never) ?? "Award"} size={20} />
                </span>
                <div>
                  <p className="font-semibold">{a.title}</p>
                  {a.detail && <p className="mt-0.5 text-sm text-muted">{a.detail}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <motion.h2 variants={fadeUp} className="mb-6 flex items-center gap-2 text-2xl font-bold">
      <Icon name={icon as never} size={22} className="text-accent" />
      {title}
    </motion.h2>
  );
}
