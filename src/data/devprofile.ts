import type { DevAccount } from "@/types";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  DEV PROFILE — your GitHub accounts, aggregated on /dev.
 * ───────────────────────────────────────────────────────────────────────────
 *  Add every account whose activity you want clubbed together (personal,
 *  freelance, office…). The page sums commits/contributions and merges each
 *  account's contribution calendar into one heatmap.
 *
 *  TOKENS (for PRIVATE contributions): set one Personal Access Token per
 *  account in your environment (locally in `.env.local`, in production via
 *  Vercel → Settings → Environment Variables). The var name must match
 *  `tokenEnv` below. Scopes: `read:user` + `repo`. Also enable, per account:
 *  GitHub → Settings → Profile → "Include private contributions on my profile".
 *
 *  Without a token an account simply shows as "not synced" (no public-only
 *  fallback — GitHub's GraphQL API is authenticated-only).
 */
export const devHeadline = "Developer Profile";
export const devSummary =
  "My engineering footprint clubbed across every GitHub account I ship from — personal, open-source, and work — so the real volume of work lives in one place.";

export const devAccounts: DevAccount[] = [
  {
    label: "Personal",
    username: "NaniteExplorer",
    url: "https://github.com/NaniteExplorer",
    kind: "Personal",
    tokenEnv: "GITHUB_TOKEN_PERSONAL",
  },
  {
    label: "Eva (Office)",
    username: "Debasishrana14",
    url: "https://github.com/Debasishrana14",
    kind: "Office",
    tokenEnv: "GITHUB_TOKEN_EVA",
  },
];
