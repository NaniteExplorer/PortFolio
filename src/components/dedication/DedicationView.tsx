"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, TrendingUp } from "lucide-react";
import type {
  CPDataPoint,
  DedicationCategory,
  DedicationEvent,
  DedicationProfileData,
  DedicationSource,
} from "@/types";
import { BarChart } from "@/components/analytics/BarChart";
import { Heatmap } from "@/components/analytics/Heatmap";
import { MonthlyTrendChart } from "@/components/analytics/MonthlyTrendChart";
import { StatTile } from "@/components/analytics/StatTile";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { BadgeGrid, FeaturedBadges } from "@/components/badges/BadgeGrid";
import { BadgeGuide } from "@/components/badges/BadgeGuide";
import { RatingBands } from "@/components/dedication/RatingBands";
import { monthlyTiers } from "@/lib/dedication-rating";

const CATEGORY_LABELS: Record<DedicationCategory, string> = {
  professional: "Professional",
  personal: "Personal",
  freelance: "Freelance",
  "open-source": "Open Source",
  learning: "Learning",
};

const SOURCE_LABELS: Record<DedicationSource, string> = {
  github: "GitHub",
  competitive: "Competitive",
};
const DATE_LOCALE = "en-US";
const DATE_ZONE = "UTC";

type CategoryFilter = "all" | DedicationCategory;
type SourceFilter = "all" | DedicationSource;
type MonthRange = "all" | "last-12" | string;

function addToMap(map: Record<string, number>, key: string, value: number) {
  map[key] = Math.round(((map[key] ?? 0) + value) * 100) / 100;
}

function scoreLabel(value: number): number {
  return Math.round(value);
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions): string {
  return date.toLocaleDateString(DATE_LOCALE, { ...options, timeZone: DATE_ZONE });
}

function buildBreakdown(events: DedicationEvent[], key: "category" | "source" | "label"): CPDataPoint[] {
  const map = new Map<string, number>();
  for (const event of events) {
    const label =
      key === "category"
        ? CATEGORY_LABELS[event.category]
        : key === "source"
          ? SOURCE_LABELS[event.source]
          : event.label;
    map.set(label, (map.get(label) ?? 0) + event.score);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value: scoreLabel(value) }))
    .sort((a, b) => b.value - a.value);
}

function buildMonthly(events: DedicationEvent[]) {
  const map: Record<string, number> = {};
  for (const event of events) addToMap(map, event.date.slice(0, 7), event.score);
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, score]) => ({
      month,
      label: new Date(`${month}-01T00:00:00Z`).toLocaleDateString(DATE_LOCALE, {
        month: "short",
        year: "2-digit",
        timeZone: DATE_ZONE,
      }),
      longLabel: new Date(`${month}-01T00:00:00Z`).toLocaleDateString(DATE_LOCALE, {
        month: "long",
        year: "numeric",
        timeZone: DATE_ZONE,
      }),
      score: scoreLabel(score),
    }));
}

function formatFilter(category: CategoryFilter, source: SourceFilter): string {
  const parts = [
    category === "all" ? "all categories" : CATEGORY_LABELS[category],
    source === "all" ? "all sources" : SOURCE_LABELS[source],
  ];
  return parts.join(" from ");
}

function monthRangeLabel(range: MonthRange, monthly: ReturnType<typeof buildMonthly>): string {
  if (range === "last-12") return "Last 12 months";
  if (range !== "all") return range;
  const first = monthly[0];
  const last = monthly[monthly.length - 1];
  if (!first || !last) return "All available months";
  return `${first.longLabel} - ${last.longLabel}`;
}

function filterMonthlyByRange(monthly: ReturnType<typeof buildMonthly>, range: MonthRange) {
  if (range === "last-12") return monthly.slice(-12);
  if (range === "all") return monthly;
  return monthly.filter((point) => point.month.startsWith(`${range}-`));
}

function filterEventsByMonthRange(events: DedicationEvent[], visibleMonthly: ReturnType<typeof buildMonthly>) {
  const months = new Set(visibleMonthly.map((point) => point.month));
  return events.filter((event) => months.has(event.date.slice(0, 7)));
}

function buildStory({
  events,
  monthly,
  bySource,
  byCategory,
  activeDays,
  professionalDays,
  category,
  source,
  rangeLabel,
}: {
  events: DedicationEvent[];
  monthly: ReturnType<typeof buildMonthly>;
  bySource: CPDataPoint[];
  byCategory: CPDataPoint[];
  activeDays: number;
  professionalDays: number;
  category: CategoryFilter;
  source: SourceFilter;
  rangeLabel: string;
}) {
  const topMonth = monthly.reduce<(typeof monthly)[number] | null>(
    (best, point) => (!best || point.score > best.score ? point : best),
    null
  );
  const topSource = bySource[0];
  const topCategory = byCategory[0];
  if (!events.length || !topMonth || !topSource) {
    return `No activity matches ${formatFilter(category, source)} in ${rangeLabel}. Try widening the filters or choosing another year.`;
  }
  const professionalState =
    professionalDays > 0
      ? `${professionalDays} professional day${professionalDays === 1 ? "" : "s"} are included.`
      : "Professional days are not present in this view because the office GitHub daily calendar has not synced any matching activity.";

  // Momentum read from the last two visible months — keeps the story honest
  // about whether the rhythm is climbing, holding, or cooling.
  const momentum = (() => {
    if (monthly.length < 2) return "";
    const last = monthly[monthly.length - 1].score;
    const prev = monthly[monthly.length - 2].score;
    if (prev === 0 && last === 0) return "";
    const delta = last - prev;
    const pct = prev > 0 ? Math.round((delta / prev) * 100) : 100;
    if (delta > 0) return ` Momentum is climbing — the latest month is up ${Math.abs(pct)}% over the previous one.`;
    if (delta < 0) return ` The latest month cooled ${Math.abs(pct)}% from the previous one — a window to rebuild the streak.`;
    return " The last two months held steady, signalling a stable rhythm.";
  })();

  return `${rangeLabel}: ${activeDays} active day${activeDays === 1 ? "" : "s"} found. ${topMonth.longLabel} is the strongest month with ${topMonth.score} dedication points, led by ${topSource.label.toLowerCase()} activity${
    topCategory ? ` and ${topCategory.label.toLowerCase()} work` : ""
  }. ${professionalState}${momentum}`;
}

function buildStreaks(byDay: Record<string, number>, anchorIso: string) {
  const anchor = new Date(anchorIso);
  let current = 0;
  for (let d = new Date(anchor); ; d.setUTCDate(d.getUTCDate() - 1)) {
    const key = d.toISOString().slice(0, 10);
    if ((byDay[key] ?? 0) <= 0) break;
    current += 1;
  }

  const days = Object.keys(byDay).sort();
  let best = 0;
  let run = 0;
  let previousTime = 0;
  for (const day of days) {
    const time = Date.parse(`${day}T00:00:00Z`);
    run = previousTime && time - previousTime === 86400000 ? run + 1 : 1;
    previousTime = time;
    best = Math.max(best, run);
  }
  return { current, best };
}

export function DedicationView({ data }: { data: DedicationProfileData }) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [source, setSource] = useState<SourceFilter>("all");
  const [monthRange, setMonthRange] = useState<MonthRange>("last-12");

  const availableCategories = useMemo(() => {
    const set = new Set<DedicationCategory>();
    for (const event of data.events) {
      if (source === "all" || event.source === source) set.add(event.category);
    }
    return data.categories.filter((item) => set.has(item));
  }, [data.categories, data.events, source]);

  const monthYears = useMemo(() => {
    const set = new Set<string>();
    for (const event of data.events) set.add(event.date.slice(0, 4));
    return [...set].sort((a, b) => Number(b) - Number(a));
  }, [data.events]);

  const filtered = useMemo(() => {
    return data.events.filter((event) => {
      const categoryMatch = category === "all" || event.category === category;
      const sourceMatch = source === "all" || event.source === source;
      return categoryMatch && sourceMatch;
    });
  }, [category, data.events, source]);

  const derived = useMemo(() => {
    const byDay: Record<string, number> = {};
    const professionalDays = new Set<string>();
    for (const event of filtered) {
      addToMap(byDay, event.date, event.score);
      if (event.category === "professional") professionalDays.add(event.date);
    }
    const score = scoreLabel(filtered.reduce((sum, event) => sum + event.score, 0));
    const activeDays = Object.values(byDay).filter((value) => value > 0).length;
    const streaks = buildStreaks(byDay, data.syncedAt);
    const monthly = buildMonthly(filtered);
    const visibleMonthly = filterMonthlyByRange(monthly, monthRange);
    const visibleEvents = filterEventsByMonthRange(filtered, visibleMonthly);
    const visibleByDay: Record<string, number> = {};
    const visibleProfessionalDays = new Set<string>();
    for (const event of visibleEvents) {
      addToMap(visibleByDay, event.date, event.score);
      if (event.category === "professional") visibleProfessionalDays.add(event.date);
    }
    const visibleActiveDays = Object.values(visibleByDay).filter((value) => value > 0).length;
    const bySource = buildBreakdown(filtered, "source");
    const byCategory = buildBreakdown(filtered, "category");
    const visibleBySource = buildBreakdown(visibleEvents, "source");
    const visibleByCategory = buildBreakdown(visibleEvents, "category");
    const rangeLabel = monthRangeLabel(monthRange, visibleMonthly.length ? visibleMonthly : monthly);
    return {
      byDay,
      score,
      activeDays,
      currentStreak: streaks.current,
      bestStreak: streaks.best,
      professionalDays: professionalDays.size,
      monthly,
      visibleMonthly,
      rangeLabel,
      byCategory,
      bySource,
      byLabel: buildBreakdown(filtered, "label").slice(0, 8),
      story: buildStory({
        events: visibleEvents,
        monthly: visibleMonthly,
        bySource: visibleBySource,
        byCategory: visibleByCategory,
        activeDays: visibleActiveDays,
        professionalDays: visibleProfessionalDays.size,
        category,
        source,
        rangeLabel,
      }),
    };
  }, [category, data.syncedAt, filtered, monthRange, source]);

  const professionalEmpty =
    derived.professionalDays === 0 &&
    data.categories.includes("professional") &&
    data.confidence.githubLive < data.confidence.githubTotal;

  return (
    <div className="container min-h-screen pt-32 pb-24">
      <motion.header initial="hidden" animate="visible" variants={stagger} className="mb-14 max-w-3xl">
        <motion.div variants={fadeUp}>
          <Link href="/#dedication" className="inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
            <ArrowLeft size={16} /> Back to portfolio
          </Link>
        </motion.div>
        <motion.div variants={fadeUp} className="mb-3 mt-6 flex flex-wrap items-center gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Cross-source Consistency
          </p>
          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]"
            style={{
              borderColor: `${data.dedicationTier.color}66`,
              backgroundColor: `${data.dedicationTier.color}1A`,
              color: data.dedicationTier.color,
            }}
          >
            {data.dedicationTier.name}
            <span className="text-[10px] opacity-80">{data.dedicationRating}</span>
          </span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl font-bold tracking-tight md:text-5xl">
          {data.headline}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 text-muted">
          {data.summary}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-6">
          <FeaturedBadges badges={data.featuredBadges} />
        </motion.div>
      </motion.header>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5"
      >
        <StatTile
          count={data.dedicationRating}
          label={data.dedicationTier.tag}
          icon="BadgeCheck"
          helper={`${data.dedicationTier.name}: ${data.dedicationTier.description}`}
        />
        <StatTile
          count={derived.score}
          label="Dedication Score"
          icon="Gauge"
          helper="Weighted activity points from synced GitHub and competitive sources."
        />
        <StatTile
          count={derived.activeDays}
          label="Active Days"
          icon="CalendarCheck"
          helper="Days with at least one synced activity after the selected filters."
        />
        <StatTile
          count={derived.bestStreak}
          label="Best Streak"
          icon="Flame"
          helper="Longest run of consecutive active days in this filtered view."
        />
        <StatTile
          count={derived.professionalDays}
          label="Professional Days"
          icon="BriefcaseBusiness"
          helper="Days from office/professional GitHub activity only."
        />
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger} className="mb-8">
        <motion.div variants={fadeUp}>
          <Card className="border-accent/20 bg-[radial-gradient(circle_at_top_right,rgb(var(--accent)/0.12),transparent_35%),rgb(var(--surface))]">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex items-start gap-3">
                <span
                  className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-2"
                  style={{ color: data.dedicationTier.color }}
                >
                  <TrendingUp size={21} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Dedication Rating</p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {data.dedicationRating} · {data.dedicationTier.name}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                    Calibrated from yearly score, active days, streaks, professional days, source balance, and monthly peak.
                    Benchmarks are internal rating lines inspired by productivity frameworks, not fake global averages.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-surface-2/60 p-4 text-sm text-muted">
                <p className="font-semibold text-fg">Next tier</p>
                <p className="mt-1">
                  {data.nextTier
                    ? `${data.nextTier.name} at ${data.nextTier.minRating} rating`
                    : "Top tier reached"}
                </p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-surface-2/40 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Rating Ladder</p>
              <p className="mb-4 text-xs text-muted">
                Your composite rating across the dedication ranks — cleared ranks fill, your tier glows, locked ranks wait ahead.
              </p>
              <RatingBands rating={data.dedicationRating} />
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {data.dedicationRatingBreakdown.map((item) => {
                const ratio = item.max > 0 ? Math.min(100, Math.round((item.value / item.max) * 100)) : 0;
                return (
                  <div key={item.label} className="rounded-2xl border border-border bg-surface-2/55 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-fg">{item.label}</p>
                      <span className="text-xs font-semibold text-accent">
                        {item.value}/{item.max}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${ratio}%` }} />
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">{item.hint}</p>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger} className="mb-16">
        <motion.div variants={fadeUp}>
          <Card className="overflow-visible border-accent/20 bg-[radial-gradient(circle_at_top_left,rgb(var(--accent)/0.14),transparent_34%),rgb(var(--surface))]">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Achievement Vault
                </p>
                <h2 className="mt-2 text-2xl font-bold">Consistency Trophy Case</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                  Earned and locked milestones for consistency, streaks, active days, monthly discipline, and
                  long-range dedication. The rarest badges are intentionally heavy.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {data.badges.filter((badge) => badge.status === "earned").length}/{data.badges.length} earned
                </span>
              <BadgeGuide
                badges={data.badges}
                title="Consistency Badge Guide"
                description="Dedication badges are designed as long-horizon honours for streaks, active-day density, monthly discipline, and multi-year proof. Many are expected to stay locked for years."
              />
              </div>
            </div>
            <BadgeGrid badges={data.badges} />
          </Card>
        </motion.div>
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger} className="mb-8">
        <motion.div variants={fadeUp}>
          <Card className="border-accent/20 bg-accent/5">
            <div className="grid gap-3 text-sm text-muted md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-semibold text-fg">Source health</p>
                <p className="mt-1">
                  GitHub synced {data.confidence.githubLive}/{data.confidence.githubTotal} accounts.
                  Competitive synced {data.confidence.competitiveLive}/{data.confidence.competitiveTotal} sources.
                </p>
                {professionalEmpty && (
                  <p className="mt-2">
                    Professional Days is 0 because the EVA/office GitHub account is classified as Professional, but no
                    synced daily professional activity is available for this view.
                  </p>
                )}
              </div>
              <span className="rounded-full border border-accent/25 bg-surface px-3 py-1 text-xs font-semibold text-accent">
                Honest synced data only
              </span>
            </div>
          </Card>
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mb-8"
      >
        <motion.div variants={fadeUp}>
          <Card className="bg-gradient-to-br from-surface to-surface-2/45">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="font-bold">Focus The Signal</h2>
                <p className="mt-1 text-sm text-muted">
                  Compare professional, personal, freelance, and learning activity without mixing the story into one vague number.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <FilterGroup
                  label="Category"
                  value={category}
                  options={[
                    ["all", "All"],
                    ...availableCategories.map((item) => [item, CATEGORY_LABELS[item]] as const),
                  ]}
                  onChange={(value) => setCategory(value as CategoryFilter)}
                />
                <FilterGroup
                  label="Source"
                  value={source}
                  options={[
                    ["all", "All"],
                    ...data.sources.map((item) => [item, SOURCE_LABELS[item]] as const),
                  ]}
                  onChange={(value) => setSource(value as SourceFilter)}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.section>

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
              byDay={derived.byDay}
              anchorDate={data.syncedAt}
              title="Dedication Heatmap"
              scheme="green"
              unit="dedication point"
            />
          </Card>
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mb-16 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]"
      >
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">Monthly Trend</h3>
                <p className="mt-1 text-sm text-muted">Score by month for the selected category, source, and year range.</p>
              </div>
              <FilterGroup
                label="Year"
                value={monthRange}
                options={[
                  ["last-12", "Last 12 mo"],
                  ["all", "All"],
                  ...monthYears.map((year) => [year, year] as const),
                ]}
                onChange={(value) => setMonthRange(value)}
              />
            </div>
            <MonthlyTrendChart
              data={derived.visibleMonthly}
              rangeLabel={derived.rangeLabel}
              tiers={monthlyTiers()}
            />
          </Card>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <Icon name="Sparkles" size={18} className="text-accent" />
              <h3 className="font-bold">Activity Story</h3>
            </div>
            <p className="text-sm leading-6 text-muted">{derived.story}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Insight label="Current streak" value={`${derived.currentStreak} days`} />
              <Insight label="Best streak" value={`${derived.bestStreak} days`} />
              {derived.byCategory[0] && (
                <Insight label="Top focus" value={derived.byCategory[0].label} />
              )}
              <Insight label="Active sources" value={`${derived.bySource.length}`} />
            </div>
          </Card>
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={stagger}
        className="mb-16 grid gap-5 lg:grid-cols-3"
      >
        <Breakdown
          title="Work Type"
          description="What kind of activity the score represents, such as Professional or Personal."
          data={derived.byCategory}
        />
        <Breakdown
          title="Data Source"
          description="Where the activity was measured, such as GitHub or Competitive."
          data={derived.bySource}
        />
        <Breakdown
          title="Account / Platform"
          description="Which GitHub account or coding platform contributed most to this view."
          data={derived.byLabel}
        />
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={viewportOnce} variants={stagger}>
        <motion.div variants={fadeUp}>
          <Card>
            <div className="grid gap-6 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 text-accent" size={20} />
                <div>
                  <h3 className="font-bold">Source Confidence</h3>
                  <p className="mt-1 text-sm text-muted">
                    GitHub synced {data.confidence.githubLive}/{data.confidence.githubTotal} accounts.
                    Competitive synced {data.confidence.competitiveLive}/{data.confidence.competitiveTotal} sources.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-surface-2/60 p-4 text-sm text-muted">
                <p className="font-semibold text-fg">Score Formula</p>
                <p className="mt-1">
                  count x source/category weight, then summed per day. GitHub personal is 1x,
                  professional is 1.25x, freelance is 1.15x, and competitive activity is 0.8x.
                </p>
              </div>
              <span className="text-xs text-muted">
                Synced {formatDate(new Date(data.syncedAt), { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </Card>
        </motion.div>
      </motion.section>
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">
      <span className="font-semibold text-fg">{value}</span> {label}
    </span>
  );
}

function FilterGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly (readonly [string, string])[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="flex flex-wrap gap-1 rounded-full border border-border bg-surface-2/50 p-1">
        {options.map(([key, text]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              value === key ? "bg-accent text-white" : "text-muted hover:text-fg"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function Breakdown({
  title,
  description,
  data,
}: {
  title: string;
  description: string;
  data: CPDataPoint[];
}) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="h-full">
        <h3 className="font-bold">{title}</h3>
        <p className="mb-6 mt-1 text-sm text-muted">{description}</p>
        {data.length > 0 ? <BarChart data={data} /> : <p className="text-sm text-muted">No activity for this filter.</p>}
      </Card>
    </motion.div>
  );
}
