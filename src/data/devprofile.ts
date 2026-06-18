import type { DevAccount } from "@/types";

/**
 * DEV PROFILE - GitHub accounts aggregated on /dev.
 *
 * Add every account whose activity you want clubbed together. The page sums
 * commits/contributions and merges each account's contribution calendar into
 * one heatmap.
 */
export const devHeadline = "Developer Profile";
export const devSummary =
  "My engineering footprint across NaniteExplorer and every GitHub account I ship from, including personal, open-source, and work contributions.";

export const devAccounts: DevAccount[] = [
  {
    label: "Personal",
    username: "NaniteExplorer",
    url: "https://github.com/NaniteExplorer",
    kind: "Personal",
    tokenEnv: "GITHUB_TOKEN_PERSONAL",
  },
  {
    label: "EVA",
    username: "Debasishrana14",
    url: "https://github.com/Debasishrana14",
    kind: "Office",
    tokenEnv: "GITHUB_TOKEN_EVA",
  },
];
