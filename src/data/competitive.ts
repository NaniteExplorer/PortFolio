import type { CPProfile } from "@/types";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  COMPETITIVE PROGRAMMING — powers the home teaser AND the /competitive page.
 * ───────────────────────────────────────────────────────────────────────────
 *  Update your handles, ratings, and solved counts here. `icon` is an
 *  icon-registry key (components/ui/BrandIcon); platforms without a registered
 *  logo fall back to a branded monogram automatically.
 *
 *  Aggregate stats (total solved, etc.) are computed from this data — you don't
 *  maintain them by hand.
 *
 *  Only platforms with a reliable live source live here: LeetCode + Codeforces
 *  (official-ish APIs) and CodeChef (server-rendered scrape). SPA-only and
 *  unverifiable platforms were intentionally dropped so the dashboard never
 *  shows numbers it can't back up live.
 */
export const competitive: CPProfile = {
  headline: "Competitive Programming",
  summary:
    "I sharpen my problem-solving on the major judges — algorithms, data structures, and contest math. Here's a live snapshot of my journey across platforms.",

  // NOTE: the numbers below are FALLBACKS. At request time the /competitive page
  // overlays live data (Codeforces/LeetCode official + unofficial APIs, AtCoder,
  // and best-effort scrapes) on top of these — so keep them roughly accurate as
  // a graceful degradation when a source is unavailable. `handle` is the live
  // lookup key for each platform.
  platforms: [
    {
      id: "leetcode",
      name: "LeetCode",
      handle: "Debasish1452003",
      url: "https://leetcode.com/u/Debasish1452003/",
      icon: "SiLeetcode",
      color: "#FFA116",
      rating: 2023,
      // Peak contest rating — derived live from LeetCode's rating history; this
      // is the graceful fallback when the API is unreachable.
      maxRating: 2047,
      rank: "Knight",
      solved: 634,
      contests: 67,
      breakdown: [
        { label: "Easy", value: 186, color: "#22C55E" },
        { label: "Medium", value: 379, color: "#F59E0B" },
        { label: "Hard", value: 69, color: "#EF4444" },
      ],
    },
    {
      id: "codeforces",
      name: "Codeforces",
      handle: "debasishrana1452003",
      url: "https://codeforces.com/profile/debasishrana1452003",
      icon: "SiCodeforces",
      color: "#1F8ACB",
      rating: 1617,
      maxRating: 1679,
      rank: "Expert",
      solved: 131,
      contests: 25,
    },
    {
      id: "codechef",
      name: "CodeChef",
      handle: "nanite",
      url: "https://www.codechef.com/users/nanite",
      icon: "SiCodechef",
      color: "#5B4638",
      rating: 1770,
      maxRating: 1818,
      rank: "3★",
      solved: 106,
      // Live count parsed from the profile's rating history; fallback only.
      contests: 31,
    },
  ],

  // Global difficulty mix (drives the donut chart on /competitive). Fallback —
  // overlaid by live LeetCode difficulty when available.
  difficulty: [
    { label: "Easy", value: 186, color: "#22C55E" },
    { label: "Medium", value: 379, color: "#F59E0B" },
    { label: "Hard", value: 69, color: "#EF4444" },
  ],

  achievements: [
    { title: "Expert on Codeforces", detail: "Peak rating 1679", icon: "Trophy" },
    { title: "Knight on LeetCode", detail: "Peak contest rating 2047 (top ~2%)", icon: "Sword" },
    { title: "3★ on CodeChef", detail: "Peak rating 1818", icon: "Star" },
    { title: "120+ rated contests", detail: "Across LeetCode, Codeforces & CodeChef", icon: "Swords" },
    { title: "Consistent daily practice", detail: "Active solving streak", icon: "Flame" },
  ],

  // Optional: ~26 weeks of daily solve counts for the activity heatmap.
  // Replace with your real data or remove to hide the heatmap.
  activity: [
    1, 0, 2, 3, 1, 0, 0, 2, 4, 1, 0, 3, 2, 1, 5, 0, 1, 2, 3, 0, 0, 1, 4, 2, 1, 0,
    3, 2, 1, 0, 2, 5, 1, 0, 0, 3, 2, 4, 1, 0, 2, 1, 3, 0, 1, 2, 0, 4, 3, 1, 0, 2,
    1, 5, 2, 0, 1, 3, 2, 0, 4, 1, 0, 2, 3, 1, 0, 2, 1, 4, 0, 3, 2, 1, 0, 5, 2, 1,
    3, 0, 1, 2, 4, 0, 1, 3, 2, 0, 1, 5, 2, 1, 0, 3, 2, 4, 1, 0, 2, 1, 3, 0, 2, 1,
    0, 4, 3, 2, 1, 0, 5, 2, 1, 3, 0, 2, 1, 4, 0, 1, 2, 3, 1, 0, 2, 5, 1, 0, 3, 2,
    1, 4, 0, 2, 1, 0, 3, 2, 5, 1, 0, 2, 3, 1, 0, 4, 2, 1, 3, 0, 1, 2, 0, 5, 2, 3,
    1, 0, 2, 4, 1, 0, 3, 2, 1, 0, 2, 5, 3, 1, 0, 2, 4, 1, 0, 3, 2, 1, 5, 0, 2, 1,
    3, 0, 4, 2,
  ],
};
