import { LiveStats, DailyMap, REVALIDATE, UA, isoDay, titleCase } from "./types";

/**
 * Codeforces — OFFICIAL public REST API (no key needed). The most reliable
 * source we have: gives rating/rank from user.info, contest count from
 * user.rating, and full submission history from user.status (which we reduce
 * into a distinct-solved count + a daily activity map).
 *
 * Docs: https://codeforces.com/apiHelp
 */
export async function fetchCodeforces(handle: string): Promise<LiveStats | null> {
  try {
    const base = "https://codeforces.com/api";
    const opts = { headers: { "User-Agent": UA }, next: { revalidate: REVALIDATE } };

    const [infoRes, ratingRes, statusRes] = await Promise.all([
      fetch(`${base}/user.info?handles=${handle}`, opts),
      fetch(`${base}/user.rating?handle=${handle}`, opts),
      fetch(`${base}/user.status?handle=${handle}`, opts),
    ]);

    const info = await infoRes.json();
    if (info.status !== "OK" || !info.result?.[0]) return null;
    const u = info.result[0];

    let contests: number | undefined;
    const rating = await ratingRes.json().catch(() => null);
    if (rating?.status === "OK") contests = rating.result.length;

    let solved: number | undefined;
    let daily: DailyMap | undefined;
    const status = await statusRes.json().catch(() => null);
    if (status?.status === "OK" && Array.isArray(status.result)) {
      const solvedSet = new Set<string>();
      daily = {};
      for (const sub of status.result) {
        if (sub.verdict !== "OK") continue;
        const p = sub.problem;
        solvedSet.add(`${p.contestId ?? "x"}-${p.index ?? p.name}`);
        const day = isoDay(sub.creationTimeSeconds);
        daily[day] = (daily[day] ?? 0) + 1;
      }
      solved = solvedSet.size;
    }

    return {
      rating: u.rating,
      ratingLabel: "rating",
      rated: u.rating != null,
      maxRating: u.maxRating,
      rank: titleCase(u.rank),
      contests,
      solved,
      daily,
    };
  } catch {
    return null;
  }
}
