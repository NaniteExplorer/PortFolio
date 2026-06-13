/**
 * Shared shapes + helpers for the live-data integration layer.
 *
 * Every platform fetcher normalizes its source into a `LiveStats` object and
 * NEVER throws — it returns `null` on any failure so the page can fall back to
 * the hand-maintained values in `data/competitive.ts`. This keeps the page
 * resilient when an unofficial API or scrape target changes or rate-limits us.
 */

/** date(YYYY-MM-DD) → activity count for that day. */
export type DailyMap = Record<string, number>;

/** Normalized stats for one competitive-programming platform. */
export interface LiveStats {
  rating?: number;
  maxRating?: number;
  rank?: string;
  solved?: number;
  contests?: number;
  difficulty?: { easy: number; medium: number; hard: number };
  /** Per-day activity for the unified heatmap. */
  daily?: DailyMap;
}

/** How long (seconds) a live fetch is cached before a background refresh. */
export const REVALIDATE = 60 * 60 * 12; // 12 hours

/** A polite User-Agent — some endpoints reject the default fetch UA. */
export const UA =
  "Mozilla/5.0 (compatible; portfolio-analytics/1.0; +https://debasishrana.dev)";

/** Convert an epoch-seconds timestamp to a YYYY-MM-DD day key (UTC). */
export function isoDay(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toISOString().slice(0, 10);
}

/** Title-case a lowercase rank string ("expert" → "Expert"). */
export function titleCase(s?: string): string | undefined {
  if (!s) return undefined;
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Merge several daily maps into one (summing counts per day). */
export function mergeDaily(...maps: (DailyMap | undefined)[]): DailyMap {
  const out: DailyMap = {};
  for (const m of maps) {
    if (!m) continue;
    for (const [day, n] of Object.entries(m)) {
      out[day] = (out[day] ?? 0) + n;
    }
  }
  return out;
}

/**
 * Flatten a daily map into a fixed-length array of the trailing `weeks` weeks,
 * aligned so the array length is a multiple of 7 (most recent day last). This
 * is the shape the <Heatmap /> component consumes.
 */
export function dailyToSeries(daily: DailyMap, weeks = 26): number[] {
  const days = weeks * 7;
  const today = new Date();
  // Anchor to UTC midnight to match the isoDay() keys.
  const series: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push(daily[key] ?? 0);
  }
  return series;
}
