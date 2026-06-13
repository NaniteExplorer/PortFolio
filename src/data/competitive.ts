import type { CPProfile } from "@/types";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  COMPETITIVE PROGRAMMING — powers the home teaser AND the /competitive page.
 * ───────────────────────────────────────────────────────────────────────────
 *  Update your handles, ratings, and solved counts here. `icon` is an
 *  icon-registry key (components/ui/BrandIcon); platforms without an official
 *  logo (e.g. AtCoder) fall back to a branded monogram automatically.
 *
 *  Aggregate stats (total solved, etc.) are computed from this data — you don't
 *  maintain them by hand.
 *
 *  TIP: to wire LIVE stats later, fetch in the /competitive page's server
 *  component (Codeforces has a free public API) and merge into this shape.
 */
export const competitive: CPProfile = {
  headline: "Competitive Programming",
  summary:
    "I sharpen my problem-solving on the major judges — algorithms, data structures, and contest math. Here's a live snapshot of my journey across platforms.",

  platforms: [
    {
      id: "leetcode",
      name: "LeetCode",
      handle: "debasish",
      url: "https://leetcode.com/debasish",
      icon: "SiLeetcode",
      color: "#FFA116",
      rating: 1842,
      maxRating: 1905,
      rank: "Knight",
      solved: 620,
      contests: 48,
      metrics: [{ label: "Top", value: "8.4%" }],
      breakdown: [
        { label: "Easy", value: 230, color: "#22C55E" },
        { label: "Medium", value: 320, color: "#F59E0B" },
        { label: "Hard", value: 70, color: "#EF4444" },
      ],
    },
    {
      id: "codeforces",
      name: "Codeforces",
      handle: "debasish",
      url: "https://codeforces.com/profile/debasish",
      icon: "SiCodeforces",
      color: "#1F8ACB",
      rating: 1564,
      maxRating: 1631,
      rank: "Specialist",
      solved: 540,
      contests: 62,
    },
    {
      id: "atcoder",
      name: "AtCoder",
      handle: "debasish",
      url: "https://atcoder.jp/users/debasish",
      // No official Simple Icon — renders a branded monogram.
      color: "#1F2937",
      rating: 1120,
      maxRating: 1204,
      rank: "Green",
      solved: 180,
      contests: 24,
    },
    {
      id: "codechef",
      name: "CodeChef",
      handle: "debasish",
      url: "https://www.codechef.com/users/debasish",
      icon: "SiCodechef",
      color: "#5B4638",
      rating: 1876,
      maxRating: 1923,
      rank: "4★",
      solved: 210,
      contests: 31,
    },
    {
      id: "geeksforgeeks",
      name: "GeeksforGeeks",
      handle: "debasish",
      url: "https://auth.geeksforgeeks.org/user/debasish",
      icon: "SiGeeksforgeeks",
      color: "#2F8D46",
      solved: 300,
      metrics: [
        { label: "Coding Score", value: 1450 },
        { label: "Streak", value: "120d" },
      ],
    },
    {
      id: "codingninjas",
      name: "Coding Ninjas",
      handle: "debasish",
      url: "https://www.naukri.com/code360/profile/debasish",
      icon: "SiCodingninjas",
      color: "#FC4F41",
      solved: 150,
      metrics: [{ label: "Rank", value: "Top 5%" }],
    },
  ],

  // Global difficulty mix (drives the donut chart on /competitive).
  difficulty: [
    { label: "Easy", value: 540, color: "#22C55E" },
    { label: "Medium", value: 920, color: "#F59E0B" },
    { label: "Hard", value: 240, color: "#EF4444" },
  ],

  achievements: [
    { title: "Knight on LeetCode", detail: "Peak rating 1905 (top 8%)", icon: "Sword" },
    { title: "4★ on CodeChef", detail: "Max rating 1923", icon: "Star" },
    { title: "Specialist on Codeforces", detail: "Max rating 1631", icon: "Trophy" },
    { title: "120-day solving streak", detail: "Consistent daily practice", icon: "Flame" },
    { title: "62+ rated contests", detail: "Across all platforms", icon: "Swords" },
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
