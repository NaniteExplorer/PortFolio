"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Target, Layers, Trophy } from "lucide-react";
import type { CPProfile } from "@/types";
import { cpAggregates } from "@/lib/competitive";
import { Section, SectionHeader } from "@/components/ui/Section";
import { BrandIcon, brandColors } from "@/components/ui/BrandIcon";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";

/**
 * Home-page competitive-programming teaser: platform logos + handles, a few
 * headline stats, and a CTA to the full /competitive analytics dashboard.
 *
 * Presentational only — it receives a fully-resolved (live-merged) `profile`
 * from the `Competitive` server wrapper, so the numbers here match the live
 * /competitive page instead of the static fallback.
 */
export function CompetitiveTeaser({ profile }: { profile: CPProfile }) {
  const stats = cpAggregates(profile);

  const headlineStats = [
    { icon: Target, value: `${stats.totalSolved}+`, label: "Problems solved" },
    { icon: Trophy, value: `${stats.totalContests}+`, label: "Contests" },
    { icon: Layers, value: stats.platformCount, label: "Platforms" },
  ];

  return (
    <Section id="competitive">
      <SectionHeader
        eyebrow="Beyond building"
        title="Competitive Programming"
        subtitle="I keep my algorithms sharp on the major judges. Here's the snapshot — dive into the full analytics for the deep dive."
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Platform handles */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-3 sm:grid-cols-2"
        >
          {profile.platforms.map((p) => {
            const color = p.color ?? brandColors[p.id] ?? "rgb(var(--accent))";
            return (
              <motion.a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${color}1f`, color }}
                >
                  <BrandIcon name={p.icon} fallbackLabel={p.name} size={22} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-xs text-muted">
                    {p.rank ? `${p.rank} · ` : ""}
                    {p.solved ? `${p.solved} solved` : `@${p.handle}`}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* Stats + CTA */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-2/40 p-8"
        >
          <div className="grid grid-cols-3 gap-4">
            {headlineStats.map((s) => (
              <motion.div key={s.label} variants={fadeUp} className="text-center">
                <s.icon className="mx-auto mb-2 text-accent" size={22} />
                <p className="text-2xl font-extrabold text-accent">{s.value}</p>
                <p className="mt-1 text-xs text-muted">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp}>
            <Link
              href="/competitive"
              className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-accent-2"
            >
              View Full Analytics
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Section>
  );
}
