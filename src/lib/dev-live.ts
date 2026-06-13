import { unstable_cache } from "next/cache";
import type { DevProfileData, CPDataPoint } from "@/types";
import { devAccounts, devHeadline, devSummary } from "@/data/devprofile";
import { fetchGithubAccounts } from "./integrations/github";
import { REVALIDATE, mergeDaily, dailyToSeries } from "./integrations/types";

/**
 * Aggregates every configured GitHub account into one DevProfileData object:
 * summed totals, a merged contribution heatmap, and combined language usage.
 * Accounts that fail to sync (no token / API error) contribute zero and are
 * flagged ok:false so the UI can surface them honestly.
 */
async function buildDevProfile(): Promise<DevProfileData> {
  const accounts = await fetchGithubAccounts(devAccounts);
  const live = accounts.filter((a) => a.ok);

  const totals = accounts.reduce(
    (acc, a) => ({
      commits: acc.commits + (a.commits ?? 0),
      contributions: acc.contributions + (a.contributions ?? 0),
      repos: acc.repos + (a.publicRepos ?? 0),
      followers: acc.followers + (a.followers ?? 0),
      accounts: acc.accounts + 1,
    }),
    { commits: 0, contributions: 0, repos: 0, followers: 0, accounts: 0 }
  );

  // Merge contribution calendars → one trailing-year heatmap series.
  const unified = mergeDaily(...accounts.map((a) => a.daily));
  const activity = dailyToSeries(unified, 52);

  // Merge language usage across accounts.
  const langMap = new Map<string, CPDataPoint>();
  for (const a of accounts) {
    for (const l of a.languages ?? []) {
      const cur = langMap.get(l.label) ?? { label: l.label, value: 0, color: l.color };
      cur.value += l.value;
      langMap.set(l.label, cur);
    }
  }
  const languages = [...langMap.values()]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return {
    headline: devHeadline,
    summary: devSummary,
    accounts,
    totals,
    activity,
    languages,
    syncedAt: new Date().toISOString(),
    liveCount: live.length,
  };
}

/** Cached entry point used by the /dev page. */
export const getDevProfile = unstable_cache(buildDevProfile, ["dev-profile-v2"], {
  revalidate: REVALIDATE,
  tags: ["dev"],
});
