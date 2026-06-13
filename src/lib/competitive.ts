import type { CPProfile, CPDataPoint } from "@/types";
import { brandColors } from "@/components/ui/BrandIcon";

/**
 * Derived competitive-programming aggregates. Computed from the data in
 * `data/competitive.ts` so headline numbers are never maintained by hand and
 * stay consistent between the home teaser and the /competitive page.
 */
export function cpAggregates(profile: CPProfile) {
  const totalSolved = profile.platforms.reduce((s, p) => s + (p.solved ?? 0), 0);
  const totalContests = profile.platforms.reduce((s, p) => s + (p.contests ?? 0), 0);
  const ratedPlatforms = profile.platforms.filter((p) => p.rating != null);
  const peakRating = Math.max(0, ...profile.platforms.map((p) => p.maxRating ?? 0));

  // Solved-per-platform series for the bar chart.
  const solvedByPlatform: CPDataPoint[] = profile.platforms
    .filter((p) => (p.solved ?? 0) > 0)
    .map((p) => ({
      label: p.name,
      value: p.solved ?? 0,
      color: p.color ?? brandColors[p.id],
    }))
    .sort((a, b) => b.value - a.value);

  return {
    totalSolved,
    totalContests,
    platformCount: profile.platforms.length,
    ratedCount: ratedPlatforms.length,
    peakRating,
    solvedByPlatform,
  };
}
