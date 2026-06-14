import { LiveStats, DailyMap, REVALIDATE, UA } from "./types";

/**
 * BEST-EFFORT SCRAPER for CodeChef — the one no-API platform we keep because it
 * is server-rendered and parses reliably. (GeeksforGeeks, Coding Ninjas/Code360
 * and AlgoZenith/maang.in are client-rendered SPAs whose stats can't be fetched
 * server-side without a headless browser, so they were removed rather than show
 * unverifiable numbers.)
 *
 * Never throws — returns `null` on any failure so the merge layer falls back to
 * the hand-maintained values in `data/competitive.ts`.
 */

async function getHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      next: { revalidate: REVALIDATE },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function firstInt(html: string, re: RegExp): number | undefined {
  const m = html.match(re);
  return m ? parseInt(m[1], 10) : undefined;
}

/**
 * CodeChef star rank derived from rating bands — far more robust than scraping
 * the star glyphs (which are HTML entities, not literal "★" characters, so the
 * old regex counted zero and rendered "0★"). Bands per CodeChef's official
 * rating system.
 */
export function codeChefStars(rating?: number): string | undefined {
  if (rating == null) return undefined;
  if (rating >= 2500) return "7★";
  if (rating >= 2200) return "6★";
  if (rating >= 2000) return "5★";
  if (rating >= 1800) return "4★";
  if (rating >= 1600) return "3★";
  if (rating >= 1400) return "2★";
  return "1★";
}

/** Pull a JS array literal assigned to `var <name> = [ … ];` from the page. */
function extractArray(html: string, varName: string): unknown[] | null {
  const m = html.match(new RegExp(`var\\s+${varName}\\s*=\\s*(\\[[\\s\\S]*?\\])\\s*;`));
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

/** Normalize CodeChef's "2024-7-3" (no zero-padding) to "2024-07-03". */
function padDay(date: string): string | null {
  const m = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!m) return null;
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

/**
 * CodeChef — current rating (`.rating-number`), highest rating, star rank
 * (derived from rating), and "Total Problems Solved". The profile page also
 * embeds two JS arrays we parse: `all_rating` (one entry per rated contest →
 * contest count) and `userDailySubmissionsStats` (date→submissions → feeds the
 * unified activity heatmap). Server-rendered, so this scrapes reliably.
 */
export async function fetchCodeChef(handle: string): Promise<LiveStats | null> {
  const html = await getHtml(`https://www.codechef.com/users/${handle}`);
  if (!html) return null;

  const rating = firstInt(html, /class="rating-number">\s*(\d{3,4})/);
  const maxRating = firstInt(html, /Highest Rating\s*(\d{3,4})/i);
  const solved = firstInt(html, /Total Problems Solved:\s*(\d+)/i);
  const rank = codeChefStars(rating);

  // Rated-contest count from the embedded rating-history array.
  const ratingHistory = extractArray(html, "all_rating");
  const contests = Array.isArray(ratingHistory) ? ratingHistory.length : undefined;

  // Per-day submission activity for the unified heatmap.
  let daily: DailyMap | undefined;
  const subs = extractArray(html, "userDailySubmissionsStats") as
    | { date?: string; value?: number }[]
    | null;
  if (Array.isArray(subs)) {
    daily = {};
    for (const s of subs) {
      const day = s.date ? padDay(s.date) : null;
      if (day && typeof s.value === "number") daily[day] = (daily[day] ?? 0) + s.value;
    }
    if (Object.keys(daily).length === 0) daily = undefined;
  }

  if (rating == null && solved == null) return null;
  return {
    rating,
    ratingLabel: "rating",
    rated: rating != null,
    maxRating,
    solved,
    rank,
    contests,
    daily,
  };
}
