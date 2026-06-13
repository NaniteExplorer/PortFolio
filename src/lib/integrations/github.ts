import type { DevAccount, DevAccountStats, CPDataPoint } from "@/types";
import { REVALIDATE, UA, DailyMap } from "./types";

/**
 * GitHub — OFFICIAL GraphQL API. Aggregates one account at a time and is summed
 * by the dev-live layer.
 *
 * PRIVATE CONTRIBUTIONS: the GraphQL API only returns a user's private
 * contributions to the *authenticated viewer themselves*. So to count private
 * commits for an account, we authenticate AS that account (its own PAT, named
 * by `account.tokenEnv`) and query `viewer`. Public-only accounts can reuse a
 * single token but will then expose only public activity.
 *
 * Each token needs scopes: `read:user` (+ `repo` for private repo contributions)
 * and the account must enable "Include private contributions on my profile".
 */

const ENDPOINT = "https://api.github.com/graphql";

const QUERY = /* GraphQL */ `
  query {
    viewer {
      login
      avatarUrl
      followers { totalCount }
      repositories(privacy: PUBLIC) { totalCount }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalPullRequestReviewContributions
        restrictedContributionsCount
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
      topRepositories: repositories(
        first: 100
        ownerAffiliations: [OWNER]
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes { primaryLanguage { name color } }
      }
    }
  }
`;

/** Fetch + normalize a single account. Returns an "ok:false" record on failure. */
async function fetchOne(account: DevAccount): Promise<DevAccountStats> {
  const fallback: DevAccountStats = {
    label: account.label,
    username: account.username,
    url: account.url,
    kind: account.kind,
    ok: false,
  };

  const token = account.tokenEnv ? process.env[account.tokenEnv] : undefined;
  if (!token) return fallback; // No token → can't use GraphQL at all.

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": UA,
      },
      body: JSON.stringify({ query: QUERY }),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    const v = json?.data?.viewer;
    if (!v) return fallback;

    const cc = v.contributionsCollection;
    const cal = cc.contributionCalendar;

    // Daily map from the calendar weeks.
    const daily: DailyMap = {};
    for (const w of cal.weeks ?? []) {
      for (const d of w.contributionDays ?? []) {
        daily[d.date] = d.contributionCount;
      }
    }

    // Language usage by primary-language repo count.
    const langCounts = new Map<string, { value: number; color?: string }>();
    for (const n of v.topRepositories?.nodes ?? []) {
      const lang = n.primaryLanguage;
      if (!lang?.name) continue;
      const cur = langCounts.get(lang.name) ?? { value: 0, color: lang.color };
      cur.value += 1;
      langCounts.set(lang.name, cur);
    }
    const languages: CPDataPoint[] = [...langCounts.entries()]
      .map(([label, { value, color }]) => ({ label, value, color: color ?? undefined }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return {
      label: account.label,
      username: v.login ?? account.username,
      url: account.url,
      kind: account.kind,
      ok: true,
      avatar: v.avatarUrl,
      commits: cc.totalCommitContributions,
      contributions: cal.totalContributions,
      privateContributions: cc.restrictedContributionsCount,
      followers: v.followers?.totalCount,
      publicRepos: v.repositories?.totalCount,
      daily,
      languages,
    };
  } catch {
    return fallback;
  }
}

/** Fetch all configured accounts in parallel. */
export async function fetchGithubAccounts(
  accounts: DevAccount[]
): Promise<DevAccountStats[]> {
  return Promise.all(accounts.map(fetchOne));
}
