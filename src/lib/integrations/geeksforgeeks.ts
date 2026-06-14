import { LiveStats, REVALIDATE, UA } from "./types";

async function getHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/json" },
      next: { revalidate: REVALIDATE },
      redirect: "follow",
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function firstInt(source: string, patterns: RegExp[]): number | undefined {
  for (const re of patterns) {
    const match = source.match(re);
    if (match?.[1]) return parseInt(match[1].replace(/,/g, ""), 10);
  }
  return undefined;
}

function normalizeNextHtml(html: string): string {
  return html
    .replace(/\\"/g, '"')
    .replace(/\\u0026/g, "&")
    .replace(/\\u003c/g, "<")
    .replace(/\\u003e/g, ">");
}

/**
 * GeeksforGeeks profile pages change markup often, so this intentionally parses
 * broad public text/JSON hints and otherwise lets the static fallback win.
 */
export async function fetchGeeksforGeeks(handle: string): Promise<LiveStats | null> {
  const urls = [
    `https://www.geeksforgeeks.org/profile/${handle}`,
    `https://auth.geeksforgeeks.org/user/${handle}/profile`,
    `https://www.geeksforgeeks.org/user/${handle}/`,
  ];

  for (const url of urls) {
    const raw = await getHtml(url);
    if (!raw) continue;
    const html = normalizeNextHtml(raw);

    const solved = firstInt(html, [
      /Problem[s]?\s*Solved[^0-9]{0,80}([\d,]+)/i,
      /Solved[^0-9]{0,80}([\d,]+)\s*Problem/i,
      /"total_problems_solved"\s*:\s*"?([\d,]+)"?/i,
      /"problemsSolved"\s*:\s*"?([\d,]+)"?/i,
    ]);
    const score = firstInt(html, [
      /Coding\s*Score[^0-9]{0,80}([\d,]+)/i,
      /"score"\s*:\s*"?(\d[\d,]*)"?/i,
      /"coding_score"\s*:\s*"?(\d[\d,]*)"?/i,
      /"codingScore"\s*:\s*"?(\d[\d,]*)"?/i,
    ]);
    const rank = firstInt(html, [
      /Institute\s*Rank[^0-9]{0,80}([\d,]+)/i,
      /"institute_rank"\s*:\s*"?([\d,]+)"?/i,
      /"instituteRank"\s*:\s*"?([\d,]+)"?/i,
    ]);

    if (solved == null && score == null && rank == null) continue;

    return {
      solved: solved ?? 0,
      rating: undefined,
      rated: false,
      metrics: score != null ? [{ label: "Score", value: score }] : undefined,
      rank: rank != null ? `Institute #${rank}` : score != null ? "Coding score" : undefined,
    };
  }

  return null;
}
