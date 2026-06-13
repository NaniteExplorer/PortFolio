import { LiveStats, DailyMap, REVALIDATE, UA, isoDay } from "./types";

/**
 * LeetCode — UNOFFICIAL public GraphQL endpoint (leetcode.com/graphql). Stable
 * in practice and used widely by community stat cards. Returns solved-by-
 * difficulty, contest rating + count, a per-day submission calendar, and the
 * full contest-rating history (from which we derive a REAL peak rating —
 * LeetCode exposes no maxRating field directly).
 *
 * Cached manually via the fetch revalidate option; LeetCode requires a Referer
 * header or it rejects the request.
 */
const ENDPOINT = "https://leetcode.com/graphql";

const QUERY = /* GraphQL */ `
  query ($u: String!, $year: Int) {
    matchedUser(username: $u) {
      submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
      userCalendar(year: $year) {
        submissionCalendar
      }
    }
    userContestRanking(username: $u) {
      rating
      attendedContestsCount
      topPercentage
    }
    userContestRankingHistory(username: $u) {
      attended
      rating
    }
  }
`;

async function queryYear(username: string, year: number) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
      "User-Agent": UA,
    },
    body: JSON.stringify({ query: QUERY, variables: { u: username, year } }),
    next: { revalidate: REVALIDATE },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data ?? null;
}

/** How many calendar years of submission history to pull (current + N-1 prior). */
const YEARS_BACK = 6;

export async function fetchLeetCode(username: string): Promise<LiveStats | null> {
  try {
    const now = new Date();
    const thisYear = now.getUTCFullYear();
    // Fetch several calendar years so the heatmap's per-year filter (2024, 2023,
    // …) reflects REAL submission history — not just the trailing 12 months.
    // Newest first so the most recent non-null result wins for the rating/solved
    // stats below.
    const years = Array.from({ length: YEARS_BACK }, (_, i) => thisYear - i);
    const yearly = await Promise.all(years.map((y) => queryYear(username, y)));
    const data = yearly.find((d) => d?.matchedUser) ?? null;
    if (!data?.matchedUser) return null;

    const nums: { difficulty: string; count: number }[] =
      data.matchedUser.submitStatsGlobal?.acSubmissionNum ?? [];
    const by = (d: string) => nums.find((n) => n.difficulty === d)?.count ?? 0;
    const easy = by("Easy");
    const medium = by("Medium");
    const hard = by("Hard");
    const solved = by("All") || easy + medium + hard;

    const ranking = data.userContestRanking;
    const rating = ranking?.rating != null ? Math.round(ranking.rating) : undefined;
    const contests = ranking?.attendedContestsCount;
    const rank =
      ranking?.topPercentage != null
        ? `Top ${ranking.topPercentage.toFixed(1)}%`
        : undefined;

    // Peak rating = highest rating across all attended contests. LeetCode has no
    // maxRating field, so we derive it from the rating history.
    const history: { attended?: boolean; rating?: number }[] =
      data.userContestRankingHistory ?? [];
    const attendedRatings = history
      .filter((h) => h.attended && typeof h.rating === "number")
      .map((h) => h.rating as number);
    const maxRating = attendedRatings.length
      ? Math.round(Math.max(...attendedRatings, rating ?? 0))
      : undefined;

    // Merge submission calendars from every fetched year. Keys are epoch-seconds.
    const daily: DailyMap = {};
    for (const yr of yearly) {
      const raw = yr?.matchedUser?.userCalendar?.submissionCalendar;
      if (!raw) continue;
      try {
        const cal: Record<string, number> = JSON.parse(raw);
        for (const [ts, n] of Object.entries(cal)) {
          const day = isoDay(Number(ts));
          daily[day] = (daily[day] ?? 0) + n;
        }
      } catch {
        /* ignore malformed calendar */
      }
    }

    return {
      rating,
      maxRating,
      contests,
      rank,
      solved,
      difficulty: { easy, medium, hard },
      daily: Object.keys(daily).length ? daily : undefined,
    };
  } catch {
    return null;
  }
}
