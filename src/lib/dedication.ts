import { unstable_cache } from "next/cache";
import type {
  CPDataPoint,
  DedicationCategory,
  DedicationEvent,
  DedicationMonthlyPoint,
  DedicationProfileData,
  DedicationSource,
} from "@/types";
import { profileSyncCacheTags } from "@/data/profile-sync";
import { getDevProfile } from "@/lib/dev-live";
import { getLiveCompetitive } from "@/lib/competitive-live";
import { REVALIDATE } from "@/lib/integrations/types";
import { buildBadges, buildBadgeStats } from "@/lib/badges";
import { buildDedicationRating } from "@/lib/dedication-rating";

const CATEGORY_COLORS: Record<DedicationCategory, string> = {
  professional: "#3B82F6",
  personal: "#22C55E",
  freelance: "#F59E0B",
  "open-source": "#A855F7",
  learning: "#06B6D4",
};

const SOURCE_COLORS: Record<DedicationSource, string> = {
  github: "#22C55E",
  competitive: "#F97316",
};

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

function categoryFromKind(kind?: string): DedicationCategory {
  const normalized = kind?.toLowerCase() ?? "";
  if (normalized.includes("office") || normalized.includes("professional") || normalized.includes("eva")) {
    return "professional";
  }
  if (normalized.includes("freelance")) return "freelance";
  if (normalized.includes("open")) return "open-source";
  if (normalized.includes("learn")) return "learning";
  return "personal";
}

function weightFor(source: DedicationSource, category: DedicationCategory): number {
  if (source === "competitive") return 0.8;
  if (category === "professional") return 1.25;
  if (category === "freelance") return 1.15;
  return 1;
}

function addToMap(map: Record<string, number>, key: string, value: number) {
  map[key] = Math.round(((map[key] ?? 0) + value) * 100) / 100;
}

function scoreLabel(value: number): number {
  return Math.round(value);
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
    if ((byDay[day] ?? 0) <= 0) continue;
    const time = Date.parse(`${day}T00:00:00Z`);
    run = previousTime && time - previousTime === 86400000 ? run + 1 : 1;
    previousTime = time;
    best = Math.max(best, run);
  }
  return { current, best };
}

function buildMonthly(events: DedicationEvent[]): DedicationMonthlyPoint[] {
  const byMonth: Record<string, number> = {};
  for (const event of events) {
    const month = event.date.slice(0, 7);
    addToMap(byMonth, month, event.score);
  }

  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, score]) => {
      const date = new Date(`${month}-01T00:00:00Z`);
      return {
        month,
        label: date.toLocaleDateString("en", { month: "short", year: "2-digit", timeZone: "UTC" }),
        score: scoreLabel(score),
      };
    });
}

function buildBreakdown(
  events: DedicationEvent[],
  key: "category" | "source" | "label"
): CPDataPoint[] {
  const values = new Map<string, CPDataPoint>();
  for (const event of events) {
    const label =
      key === "category"
        ? CATEGORY_LABELS[event.category]
        : key === "source"
          ? SOURCE_LABELS[event.source]
          : event.label;
    const color =
      key === "category"
        ? CATEGORY_COLORS[event.category]
        : key === "source"
          ? SOURCE_COLORS[event.source]
          : undefined;
    const current = values.get(label) ?? { label, value: 0, color };
    current.value += event.score;
    values.set(label, current);
  }
  return [...values.values()]
    .map((point) => ({ ...point, value: scoreLabel(point.value) }))
    .sort((a, b) => b.value - a.value);
}

function buildStory(monthly: DedicationMonthlyPoint[], bySource: CPDataPoint[]) {
  const topMonth = monthly.reduce<DedicationMonthlyPoint | null>(
    (best, point) => (!best || point.score > best.score ? point : best),
    null
  );
  const topSource = bySource[0];
  if (!topMonth || !topSource) {
    return "Dedication data will become richer as more sources sync successfully.";
  }
  return `${topMonth.label} was the strongest month, led by ${topSource.label.toLowerCase()} activity with ${topMonth.score} dedication points.`;
}

async function buildDedicationProfile(): Promise<DedicationProfileData> {
  const [dev, competitive] = await Promise.all([getDevProfile(), getLiveCompetitive()]);
  const events: DedicationEvent[] = [];

  for (const account of dev.accounts) {
    const category = categoryFromKind(account.kind ?? account.label);
    const weight = weightFor("github", category);
    for (const [date, count] of Object.entries(account.daily ?? {})) {
      if (count <= 0) continue;
      events.push({
        source: "github",
        category,
        label: account.label,
        date,
        count,
        weight,
        score: count * weight,
      });
    }
  }

  for (const platform of competitive.platforms) {
    const daily = competitive.activityByDay;
    if (!daily) continue;
    const weight = weightFor("competitive", "personal");
    for (const [date, count] of Object.entries(daily)) {
      if (count <= 0) continue;
      events.push({
        source: "competitive",
        category: "personal",
        label: "Competitive Programming",
        date,
        count,
        weight,
        score: count * weight,
      });
    }
    break;
  }

  const byDay: Record<string, number> = {};
  const professionalDays = new Set<string>();
  for (const event of events) {
    addToMap(byDay, event.date, event.score);
    if (event.category === "professional") professionalDays.add(event.date);
  }

  const syncedAt = new Date().toISOString();
  const activeDays = Object.values(byDay).filter((value) => value > 0).length;
  const rawCount = events.reduce((sum, event) => sum + event.count, 0);
  const score = events.reduce((sum, event) => sum + event.score, 0);
  const streaks = buildStreaks(byDay, syncedAt);
  const monthly = buildMonthly(events);
  const byCategory = buildBreakdown(events, "category");
  const bySource = buildBreakdown(events, "source");
  const byLabel = buildBreakdown(events, "label").slice(0, 8);
  const badgeStats = {
    ...buildBadgeStats(events, byDay, syncedAt),
    currentStreak: streaks.current,
    bestStreak: streaks.best,
  };
  const badgeResult = buildBadges({
    events,
    byDay,
    syncedAt,
    stats: badgeStats,
    dev,
    competitive,
  });
  const rating = buildDedicationRating(badgeStats);

  return {
    headline: "Dedication Graph",
    summary:
      "A unified view of shipped code, professional contribution, and competitive problem-solving across time.",
    events,
    categories: ["professional", "personal", "freelance", "open-source", "learning"],
    sources: ["github", "competitive"],
    byDay,
    monthly,
    breakdowns: { byCategory, bySource, byLabel },
    totals: {
      score: scoreLabel(score),
      rawCount,
      activeDays,
      currentStreak: streaks.current,
      bestStreak: streaks.best,
      professionalDays: professionalDays.size,
    },
    badges: badgeResult.badges,
    featuredBadges: badgeResult.featuredBadges,
    dedicationRating: rating.dedicationRating,
    dedicationTier: rating.dedicationTier,
    dedicationBenchmarks: rating.dedicationBenchmarks,
    dedicationRatingBreakdown: rating.dedicationRatingBreakdown,
    nextTier: rating.nextTier,
    story: buildStory(monthly, bySource),
    confidence: {
      githubLive: dev.liveCount,
      githubTotal: dev.accounts.length,
      competitiveLive: competitive.liveCount ?? 0,
      competitiveTotal: competitive.sourceCount ?? competitive.platforms.length,
    },
    syncedAt,
  };
}

export const getDedicationProfile = unstable_cache(
  buildDedicationProfile,
  ["dedication-profile-v1"],
  { revalidate: REVALIDATE, tags: [profileSyncCacheTags.dedication] }
);
