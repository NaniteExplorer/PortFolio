import { LiveStats, REVALIDATE, UA } from "./types";

type AlgoZenithProfile = {
  code?: number;
  data?: {
    coins?: number;
    followers?: number;
    id?: number;
    streak?: number;
    xp?: number;
  };
};

type AlgoZenithSolved = {
  code?: number;
  data?: unknown;
};

type AlgoZenithStreaks = {
  code?: number;
  data?: {
    current_streak?: number;
    longest_streak?: number;
  };
};

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "application/json",
        Origin: "https://maang.in",
        Referer: "https://maang.in/",
      },
      next: { revalidate: REVALIDATE },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function findSolved(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (!value || typeof value !== "object") return undefined;

  if (Array.isArray(value)) {
    const count = value.filter((item) => {
      if (!item || typeof item !== "object") return false;
      const obj = item as Record<string, unknown>;
      return obj.solved === true || obj.status === "solved" || obj.is_solved === true;
    }).length;
    return count || undefined;
  }

  const obj = value as Record<string, unknown>;
  for (const key of ["solved", "solved_count", "problems_solved", "problemsSolved", "total_solved"]) {
    const n = obj[key];
    if (typeof n === "number") return n;
  }

  for (const child of Object.values(obj)) {
    const n = findSolved(child);
    if (n != null) return n;
  }
  return undefined;
}

function toDaily(value: unknown): Record<string, number> | undefined {
  if (!Array.isArray(value)) return undefined;
  const daily: Record<string, number> = {};
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const date = typeof obj.date === "string" ? obj.date.slice(0, 10) : undefined;
    const count = typeof obj.count === "number" ? obj.count : undefined;
    if (date && count != null) daily[date] = (daily[date] ?? 0) + count;
  }
  return Object.keys(daily).length ? daily : undefined;
}

/**
 * AlgoZenith's public page is mostly a skeleton, so avoid scraping page chrome
 * like "rating.png" or "Contests" nav labels. Use public JSON only. The solved
 * endpoint currently returns 500 for some users; in that case we show safe
 * profile stats and omit solved/contests.
 */
export async function fetchAlgoZenith(handle: string): Promise<LiveStats | null> {
  const profile = await getJson<AlgoZenithProfile>(
    `https://api2.maang.in/users/profile/${handle}`
  );
  const userId = profile?.data?.id;
  if (profile?.code !== 200 || userId == null) return null;

  const [solvedJson, heatmapJson, streakJson] = await Promise.all([
    getJson<AlgoZenithSolved>(
      `https://api2.maang.in/users/profile/${userId}/problems-solved`
    ),
    getJson<AlgoZenithSolved>(
      `https://api2.maang.in/users/profile/${userId}/heatmap?year=${new Date().getUTCFullYear()}`
    ),
    getJson<AlgoZenithStreaks>(`https://api2.maang.in/users/profile/${userId}/streaks`),
  ]);

  const solved = findSolved(solvedJson?.data);
  const xp = profile?.data?.xp;
  const coins = profile?.data?.coins;
  const followers = profile?.data?.followers;
  const longestStreak = streakJson?.data?.longest_streak;
  const metrics: { label: string; value: string | number }[] = [];
  if (typeof xp === "number") metrics.push({ label: "XP", value: xp });
  if (typeof coins === "number") metrics.push({ label: "Coins", value: coins });
  if (typeof longestStreak === "number") {
    metrics.push({ label: "Best streak", value: longestStreak });
  }
  if (typeof followers === "number") metrics.push({ label: "Followers", value: followers });

  return {
    solved: solved ?? 0,
    rated: false,
    rank: "Practice",
    metrics: metrics.length ? metrics : undefined,
    daily: toDaily(heatmapJson?.data),
  };
}
