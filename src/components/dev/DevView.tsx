"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, AlertCircle } from "lucide-react";
import type { DevProfileData, DevAccountStats } from "@/types";
import { StatTile } from "@/components/analytics/StatTile";
import { BarChart } from "@/components/analytics/BarChart";
import { Heatmap } from "@/components/analytics/Heatmap";
import { SyncBadge } from "@/components/analytics/SyncBadge";
import { ProfileRefreshButton } from "@/components/analytics/ProfileRefreshButton";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { stagger, fadeUp, viewportOnce } from "@/lib/motion";
import { BadgeGrid, FeaturedBadges } from "@/components/badges/BadgeGrid";
import { BadgeGuide } from "@/components/badges/BadgeGuide";

/**
 * /dev — multi-account GitHub analytics dashboard. Clubs every configured
 * account's commits/contributions into one set of totals, a unified
 * contribution heatmap, and a merged language breakdown.
 */
export function DevView({ data }: { data: DevProfileData }) {
  const { totals } = data;
  const hasActivity = data.activity.some((d) => d > 0);

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
            href="/#about"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent"
          >
            <ArrowLeft size={16} /> Back to portfolio
          </Link>
        </motion.div>
        <motion.div variants={fadeUp} className="mb-3 mt-6 flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Engineering Footprint
          </p>
          <SyncBadge
            syncedAt={data.syncedAt}
            liveCount={data.liveCount}
            total={data.accounts.length}
          />
          <ProfileRefreshButton target="dev" />
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl font-bold tracking-tight md:text-5xl">
          {data.headline}
        </motion.h1>
      <motion.p variants={fadeUp} className="mt-4 text-muted">
          {data.summary}
        </motion.p>
        {data.badges && data.badges.length > 0 && (
          <motion.div variants={fadeUp} className="mt-6">
            <FeaturedBadges badges={data.badges} />
          </motion.div>
        )}
      </motion.header>

      {/* Token notice when nothing synced */}
      {data.liveCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <p className="text-muted">
            No GitHub data synced yet. Add a Personal Access Token per account
            (env vars <code className="text-fg">GITHUB_TOKEN_*</code>) to pull live
            commits — including private contributions. Showing placeholders until then.
          </p>
        </motion.div>
      )}

      {/* Headline stats — clubbed across all accounts */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <StatTile count={totals.commits} suffix="+" label="Commits (1y)" icon="GitCommitHorizontal" />
        <StatTile count={totals.contributions} suffix="+" label="Contributions (1y)" icon="Activity" />
        <StatTile count={totals.repos} label="Public Repos" icon="FolderGit2" />
        <StatTile count={totals.accounts} label="Accounts Clubbed" icon="Users" />
      </motion.section>

      {data.badges && data.badges.length > 0 && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="mb-16"
        >
          <motion.div variants={fadeUp}>
            <Card className="overflow-visible border-accent/20 bg-[radial-gradient(circle_at_top_left,rgb(var(--accent)/0.12),transparent_34%),rgb(var(--surface))]">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Developer Badges</p>
                  <h2 className="mt-2 text-2xl font-bold">Engineering Trophy Case</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                    GitHub milestones for shipping rhythm, contribution volume, repositories, and language breadth.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    {data.badges.filter((badge) => badge.status === "earned").length}/{data.badges.length} earned
                  </span>
                <BadgeGuide
                  badges={data.badges}
                  title="Engineering Badge Guide"
                  description="Developer badges reward sustained GitHub signal: contribution volume, active-day density, repository breadth, and multi-account sync. The upper medals are intentionally multi-year targets."
                />
                </div>
              </div>
              <BadgeGrid badges={data.badges} />
            </Card>
          </motion.div>
        </motion.section>
      )}

      {/* Account cards */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mb-16"
      >
        <SectionTitle icon="Github" title="Accounts" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.accounts.map((a) => (
            <AccountCard key={a.username} account={a} />
          ))}
        </div>
      </motion.section>

      {/* Unified contribution heatmap */}
      {hasActivity && (
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={stagger}
          className="mb-16"
        >
          <motion.div variants={fadeUp}>
            <Card>
              <Heatmap
                byDay={data.activityByDay}
                anchorDate={data.syncedAt}
                title="Unified Contributions — all accounts"
                scheme="green"
                unit="contribution"
              />
            </Card>
          </motion.div>
        </motion.section>
      )}

      {/* Language + per-account commit breakdown */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="grid gap-5 lg:grid-cols-2"
      >
        {data.languages.length > 0 && (
          <motion.div variants={fadeUp}>
            <Card className="h-full">
              <h3 className="mb-6 font-bold">Top Languages</h3>
              <BarChart data={data.languages} />
            </Card>
          </motion.div>
        )}
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <h3 className="mb-6 font-bold">Commits by Account</h3>
            <BarChart
              data={data.accounts
                .map((a) => ({ label: a.label, value: a.commits ?? 0 }))
                .sort((x, y) => y.value - x.value)}
            />
          </Card>
        </motion.div>
      </motion.section>
    </div>
  );
}

function AccountCard({ account }: { account: DevAccountStats }) {
  return (
    <motion.a
      href={account.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={fadeUp}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {account.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={account.avatar}
              alt={account.username}
              className="h-11 w-11 rounded-xl object-cover"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <BrandIcon name="SiGithub" size={22} />
            </span>
          )}
          <div>
            <h3 className="font-bold leading-tight">{account.label}</h3>
            <p className="text-xs text-muted">@{account.username}</p>
          </div>
        </div>
        <ExternalLink size={16} className="text-muted transition-colors group-hover:text-fg" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        {account.kind && (
          <span className="rounded-full bg-accent/10 px-2.5 py-1 font-semibold text-accent">
            {account.kind}
          </span>
        )}
        <span
          className={`rounded-full px-2.5 py-1 font-medium ${
            account.ok
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-surface-2 text-muted"
          }`}
        >
          {account.ok ? "Live" : "Not synced"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <Metric label="Commits" value={account.commits ?? "—"} />
        <Metric label="Contributions" value={account.contributions ?? "—"} />
        {account.privateContributions != null && account.privateContributions > 0 && (
          <Metric label="Private" value={account.privateContributions} />
        )}
        {account.followers != null && <Metric label="Followers" value={account.followers} />}
      </div>
    </motion.a>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-surface-2/60 px-3 py-2">
      <p className="text-base font-bold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
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
