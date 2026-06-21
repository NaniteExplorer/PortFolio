import type { CPProfile } from "@/types";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  COMPETITIVE PROGRAMMING — powers the home teaser AND the /competitive page.
 * ───────────────────────────────────────────────────────────────────────────
 *  Update your handles, ratings, and solved counts here. `icon` is an
 *  icon-registry key (components/ui/BrandIcon); platforms without a registered
 *  logo fall back to a branded monogram automatically.
 *
 *  Aggregate stats (total solved, etc.) are computed from live data — you don't
 *  maintain them by hand.
 *
 *  Live sources are best-effort: stable APIs where available and defensive
 *  scrapes where not. If a source fails, that platform is hidden instead of
 *  showing stale hardcoded stats.
 */
export const competitive: CPProfile = {
  headline: "Competitive Programming",
  summary:
    "I sharpen my problem-solving on the major judges — algorithms, data structures, and contest math. Here's a live snapshot of my journey across platforms.",

  // `handle` is the live lookup key for each platform. Keep it in sync with the
  // profile URL; numeric stats are intentionally fetched live.
  platforms: [
    {
      id: "leetcode",
      name: "LeetCode",
      handle: "Debasish1452003",
      url: "https://leetcode.com/u/Debasish1452003/",
      icon: "SiLeetcode",
      color: "#FFA116",
      // All-time top LeetCode contest rating (global #1 peak ≈ 3686). Used as the
      // 100% mark on the comparative rating bar — a stable record, not a live feed.
      ratingCeiling: 3700,
    },
    {
      id: "codeforces",
      name: "Codeforces",
      handle: "debasishrana1452003",
      url: "https://codeforces.com/profile/debasishrana1452003",
      icon: "SiCodeforces",
      color: "#1F8ACB",
      // Codeforces all-time peak (tourist ≈ 4009). 100% mark for the rating bar.
      ratingCeiling: 4000,
    },
    {
      id: "codechef",
      name: "CodeChef",
      handle: "nanite",
      url: "https://www.codechef.com/users/nanite",
      icon: "SiCodechef",
      color: "#5B4638",
      // CodeChef all-time peak (top rating ≈ 3000+). 100% mark for the rating bar.
      ratingCeiling: 3000,
    },
    {
      id: "geeksforgeeks",
      name: "GeeksforGeeks",
      handle: "debasishrarglx",
      url: "https://www.geeksforgeeks.org/profile/debasishrarglx",
      icon: "SiGeeksforgeeks",
      color: "#2F8D46",
    },
    {
      id: "codingninjas",
      name: "Code360",
      handle: "debasish1234",
      url: "https://www.naukri.com/code360/profile/debasish1234",
      icon: "SiCodingninjas",
      color: "#FC4F41",
    },
    {
      id: "atcoder",
      name: "AtCoder",
      handle: "Nanite",
      url: "https://atcoder.jp/users/Nanite",
      icon: "SiAtcoder",
      color: "#64748B",
    },
    {
      id: "algozenith",
      name: "AlgoZenith",
      handle: "zord145",
      url: "https://maang.in/users/zord145",
      color: "#6D28D9",
    },
  ],

  // Populated from live sources only.
  difficulty: [],

  // Keep achievement badges empty unless they are sourced from live data.
  achievements: [],
};
