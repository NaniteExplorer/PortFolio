import { DailyMap, LiveStats, REVALIDATE } from "./types";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

type Code360Profile = {
  data?: {
    uuid?: string;
  };
};

type Code360Rating = {
  data?: {
    ranker_points?: number;
    current_user_rating?: number | null;
    rating_group?: { group?: string };
    user_rating_data?: {
      date?: number;
      rating?: number;
      problems_solved?: number;
    }[];
  };
};

type Code360Contributions = {
  data?: {
    contribution_map?: Record<string, number>;
    current_streak?: number;
    longest_streak?: number;
    total_submission_count?: number;
    type_count_map?: Record<string, number>;
  };
};

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "application/json",
        Referer: "https://www.naukri.com/code360/",
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

/**
 * Code360 public profile URLs use a username, but contest data needs the
 * internal UUID. Resolve username -> UUID, then fetch public rating history.
 * If the user has no contest history, return null so the card is hidden rather
 * than showing unrelated global leaderboard data.
 */
export async function fetchCodingNinjas(handle: string): Promise<LiveStats | null> {
  const profile = await getJson<Code360Profile>(
    `https://www.naukri.com/code360/api/v3/public_section/profile/user_details?uuid=${handle}`
  );
  const uuid = profile?.data?.uuid;
  if (!uuid) return null;

  const year = new Date().getUTCFullYear();
  const [ratingJson, contributionsJson] = await Promise.all([
    getJson<Code360Rating>(
      `https://www.naukri.com/code360/api/v3/public_section/user_rating_data?uuid=${uuid}`
    ),
    getJson<Code360Contributions>(
      `https://www.naukri.com/code360/api/v3/public_section/profile/contributions?uuid=${uuid}&start_date=${year}-01-01&end_date=${year}-12-31`
    ),
  ]);

  const codingProblemsSolved = contributionsJson?.data?.type_count_map?.["0"];
  const totalSubmissionCount = contributionsJson?.data?.total_submission_count;
  const longestStreak = contributionsJson?.data?.longest_streak;
  const daily = normalizeDaily(contributionsJson?.data?.contribution_map);
  const history = ratingJson?.data?.user_rating_data ?? [];
  const ratedHistory = history.filter((h) => typeof h.rating === "number");
  if (ratedHistory.length === 0) {
    const points = ratingJson?.data?.ranker_points;
    return typeof points === "number"
      ? {
          solved: codingProblemsSolved ?? 0,
          rated: false,
          metrics: [
            { label: "Points", value: points },
            ...(typeof totalSubmissionCount === "number"
              ? [{ label: "Submissions", value: totalSubmissionCount }]
              : []),
            ...(typeof longestStreak === "number"
              ? [{ label: "Best streak", value: longestStreak }]
              : []),
          ],
          rank: "Practice",
          daily,
        }
      : null;
  }

  const contestSolved =
    ratedHistory.reduce((sum, h) => sum + (h.problems_solved ?? 0), 0) || undefined;
  const solved = codingProblemsSolved ?? contestSolved;
  const ratings = ratedHistory.map((h) => h.rating as number);
  const rating = ratingJson?.data?.current_user_rating ?? ratings.at(-1);
  const maxRating = ratings.length ? Math.max(...ratings, rating ?? 0) : rating ?? undefined;
  const contestDaily: DailyMap = {};

  for (const h of ratedHistory) {
    if (typeof h.date !== "number" || !h.problems_solved) continue;
    const day = new Date(h.date * 1000).toISOString().slice(0, 10);
    contestDaily[day] = (contestDaily[day] ?? 0) + h.problems_solved;
  }

  return {
    solved,
    rating: rating ?? undefined,
    ratingLabel: "rating",
    rated: true,
    maxRating,
    contests: ratedHistory.length,
    rank: ratingJson?.data?.rating_group?.group ?? "Rated",
    daily: daily ?? (Object.keys(contestDaily).length ? contestDaily : undefined),
  };
}

function normalizeDaily(map?: Record<string, number>): DailyMap | undefined {
  if (!map || Object.keys(map).length === 0) return undefined;
  const daily: DailyMap = {};
  for (const [rawDate, count] of Object.entries(map)) {
    if (typeof count !== "number") continue;
    const day = rawDate.slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(day)) daily[day] = (daily[day] ?? 0) + count;
  }
  return Object.keys(daily).length ? daily : undefined;
}
