import { unstable_cache } from "next/cache";
import type { CPProfile, CPPlatform, CPDataPoint } from "@/types";
import { competitive } from "@/data/competitive";
import { LiveStats, REVALIDATE, mergeDaily, dailyToSeries } from "./integrations/types";
import { fetchCodeforces } from "./integrations/codeforces";
import { fetchLeetCode } from "./integrations/leetcode";
import { fetchCodeChef } from "./integrations/scrape";

/**
 * Live-merge layer for the competitive dashboard. Fetches every platform in
 * parallel and overlays live values on top of the hand-maintained data in
 * `data/competitive.ts` (live wins; static fills the gaps and is the fallback
 * when a source is down). Also stitches per-day activity from the API-backed
 * platforms into ONE unified heatmap series.
 *
 * Cached for REVALIDATE seconds via unstable_cache so the expensive submission
 * reductions run at most once per window, not per request.
 */

type Fetcher = (handle: string) => Promise<LiveStats | null>;

const FETCHERS: Record<string, Fetcher> = {
  codeforces: fetchCodeforces,
  leetcode: fetchLeetCode,
  codechef: fetchCodeChef,
};

/** Overlay a LiveStats result onto a static platform definition. */
function mergePlatform(base: CPPlatform, live: LiveStats | null): CPPlatform {
  if (!live) return { ...base, live: false };

  const merged: CPPlatform = {
    ...base,
    rating: live.rating ?? base.rating,
    maxRating: live.maxRating ?? base.maxRating,
    rank: live.rank ?? base.rank,
    solved: live.solved ?? base.solved,
    contests: live.contests ?? base.contests,
    live: true,
  };

  // Refresh the per-platform difficulty breakdown when the source gives one.
  if (live.difficulty) {
    merged.breakdown = [
      { label: "Easy", value: live.difficulty.easy, color: "#22C55E" },
      { label: "Medium", value: live.difficulty.medium, color: "#F59E0B" },
      { label: "Hard", value: live.difficulty.hard, color: "#EF4444" },
    ];
  }
  return merged;
}

async function buildLiveCompetitive(): Promise<CPProfile> {
  const results = await Promise.all(
    competitive.platforms.map(async (p) => {
      const fetcher = FETCHERS[p.id];
      const live = fetcher ? await fetcher(p.handle) : null;
      return { platform: mergePlatform(p, live), live };
    })
  );

  const platforms = results.map((r) => r.platform);
  const liveCount = results.filter((r) => r.platform.live).length;

  // Unified daily activity across every platform that reported per-day data.
  // We keep BOTH the full date→count map (for the year-filterable heatmap) and
  // a trailing-26-week series (graceful fallback / compact view).
  const unified = mergeDaily(...results.map((r) => r.live?.daily));
  const hasDaily = Object.keys(unified).length > 0;
  const activity = hasDaily ? dailyToSeries(unified, 26) : competitive.activity;
  const activityByDay = hasDaily ? unified : undefined;

  // Global difficulty donut: aggregate live difficulty where present, else keep
  // the static breakdown.
  const liveDifficulties = results
    .map((r) => r.live?.difficulty)
    .filter((d): d is NonNullable<typeof d> => !!d);
  let difficulty: CPDataPoint[] = competitive.difficulty;
  if (liveDifficulties.length) {
    const sum = liveDifficulties.reduce(
      (a, d) => ({
        easy: a.easy + d.easy,
        medium: a.medium + d.medium,
        hard: a.hard + d.hard,
      }),
      { easy: 0, medium: 0, hard: 0 }
    );
    difficulty = [
      { label: "Easy", value: sum.easy, color: "#22C55E" },
      { label: "Medium", value: sum.medium, color: "#F59E0B" },
      { label: "Hard", value: sum.hard, color: "#EF4444" },
    ];
  }

  return {
    ...competitive,
    platforms,
    difficulty,
    activity,
    activityByDay,
    liveCount,
    syncedAt: new Date().toISOString(),
  };
}

/** Cached entry point used by the /competitive page. */
export const getLiveCompetitive = unstable_cache(
  buildLiveCompetitive,
  ["competitive-live-v2"],
  { revalidate: REVALIDATE, tags: ["competitive"] }
);
