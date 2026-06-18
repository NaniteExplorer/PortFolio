import { unstable_cache } from "next/cache";
import type { CPProfile, CPPlatform, CPDataPoint } from "@/types";
import { profileSyncCacheTags } from "@/data/profile-sync";
import { getAdminSettings, mergeCompetitive } from "@/lib/admin-settings";
import { LiveStats, REVALIDATE, mergeDaily, dailyToSeries } from "./integrations/types";
import { fetchCodeforces } from "./integrations/codeforces";
import { fetchLeetCode } from "./integrations/leetcode";
import { fetchCodeChef } from "./integrations/scrape";
import { fetchAlgoZenith } from "./integrations/algozenith";
import { fetchAtCoder } from "./integrations/atcoder";
import { fetchCodingNinjas } from "./integrations/codingninjas";
import { fetchGeeksforGeeks } from "./integrations/geeksforgeeks";
import { buildCompetitiveBadges } from "@/lib/badges";

/**
 * Live-merge layer for the competitive dashboard. Fetches every platform in
 * parallel and renders only platforms whose data could be retrieved live. This
 * avoids showing stale hand-maintained numbers as if they were current stats.
 * Also stitches per-day activity from the API-backed platforms into ONE unified
 * heatmap series.
 *
 * Cached for REVALIDATE seconds via unstable_cache so the expensive submission
 * reductions run at most once per window, not per request.
 */

type Fetcher = (handle: string) => Promise<LiveStats | null>;

const FETCHERS: Record<string, Fetcher> = {
  codeforces: fetchCodeforces,
  leetcode: fetchLeetCode,
  codechef: fetchCodeChef,
  geeksforgeeks: fetchGeeksforGeeks,
  codingninjas: fetchCodingNinjas,
  atcoder: fetchAtCoder,
  algozenith: fetchAlgoZenith,
};

/** Overlay a LiveStats result onto a static platform definition. */
function mergePlatform(base: CPPlatform, live: LiveStats): CPPlatform {
  const merged: CPPlatform = {
    ...base,
    rating: live.rating,
    ratingLabel: live.ratingLabel,
    rated: live.rated,
    maxRating: live.maxRating,
    rank: live.rank,
    solved: live.solved,
    contests: live.contests,
    metrics: live.metrics ?? base.metrics,
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
  const competitiveProfile = mergeCompetitive(await getAdminSettings());
  const results = await Promise.all(
    competitiveProfile.platforms.map(async (p) => {
      const fetcher = FETCHERS[p.id];
      const live = fetcher ? await fetcher(p.handle) : null;
      return { platform: live ? mergePlatform(p, live) : null, live };
    })
  );

  const platforms = results
    .map((r) => r.platform)
    .filter((p): p is CPPlatform => p != null);
  const liveCount = platforms.length;

  // Unified daily activity across every platform that reported per-day data.
  // We keep BOTH the full date→count map (for the year-filterable heatmap) and
  // a trailing-26-week series (graceful fallback / compact view).
  const unified = mergeDaily(...results.map((r) => r.live?.daily));
  const hasDaily = Object.keys(unified).length > 0;
  const activity = hasDaily ? dailyToSeries(unified, 26) : undefined;
  const activityByDay = hasDaily ? unified : undefined;

  // Global difficulty donut: aggregate only live difficulty where present.
  const liveDifficulties = results
    .map((r) => r.live?.difficulty)
    .filter((d): d is NonNullable<typeof d> => !!d);
  let difficulty: CPDataPoint[] = [];
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

  const profile: CPProfile = {
    ...competitiveProfile,
    platforms,
    difficulty,
    activity,
    activityByDay,
    liveCount,
    sourceCount: competitiveProfile.platforms.length,
    syncedAt: new Date().toISOString(),
  };
  return {
    ...profile,
    badges: buildCompetitiveBadges(profile),
  };
}

/** Cached entry point used by the /competitive page. */
export const getLiveCompetitive = unstable_cache(
  buildLiveCompetitive,
  ["competitive-live-v5"],
  { revalidate: REVALIDATE, tags: [profileSyncCacheTags.competitive] }
);
