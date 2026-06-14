import { DailyMap, LiveStats, REVALIDATE, UA } from "./types";

type AtCoderHistory = {
  NewRating?: number;
  OldRating?: number;
  Performance?: number;
};

type AtCoderSubmission = {
  epoch_second?: number;
  problem_id?: string;
  result?: string;
};

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function isoDayFromSeconds(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toISOString().slice(0, 10);
}

/**
 * AtCoder has no single official profile API, but these public endpoints are
 * widely used by AtCoder Problems. Rating history gives contests/current/peak;
 * user submissions give solved count and the unified heatmap.
 */
export async function fetchAtCoder(handle: string): Promise<LiveStats | null> {
  const [history, submissions] = await Promise.all([
    getJson<AtCoderHistory[]>(`https://atcoder.jp/users/${handle}/history/json`),
    getJson<AtCoderSubmission[]>(
      `https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${handle}&from_second=0`
    ),
  ]);

  const stats: LiveStats = {};

  if (Array.isArray(history) && history.length > 0) {
    const ratings = history
      .map((h) => h.NewRating)
      .filter((n): n is number => typeof n === "number");
    const current = ratings.at(-1);
    stats.rating = current;
    stats.ratingLabel = "rating";
    stats.rated = current != null;
    stats.maxRating = ratings.length ? Math.max(...ratings) : current;
    stats.contests = history.length;
    stats.rank = rankForRating(current);
  }

  if (Array.isArray(submissions) && submissions.length > 0) {
    const solved = new Set<string>();
    const daily: DailyMap = {};

    for (const sub of submissions) {
      if (sub.result !== "AC") continue;
      if (sub.problem_id) solved.add(sub.problem_id);
      if (typeof sub.epoch_second === "number") {
        const day = isoDayFromSeconds(sub.epoch_second);
        daily[day] = (daily[day] ?? 0) + 1;
      }
    }

    stats.solved = solved.size || undefined;
    stats.daily = Object.keys(daily).length ? daily : undefined;
  }

  if (stats.rated == null) stats.rated = stats.rating != null;
  if (stats.rank == null && !stats.rated) stats.rank = "Practice";

  return Object.keys(stats).length ? stats : null;
}

function rankForRating(rating?: number): string | undefined {
  if (rating == null) return undefined;
  if (rating >= 2800) return "Red";
  if (rating >= 2400) return "Orange";
  if (rating >= 2000) return "Yellow";
  if (rating >= 1600) return "Blue";
  if (rating >= 1200) return "Cyan";
  if (rating >= 800) return "Green";
  if (rating >= 400) return "Brown";
  return "Gray";
}
