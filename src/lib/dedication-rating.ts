import type { DedicationBenchmark, DedicationRatingComponent, DedicationTier } from "@/types";
import type { BadgeStats } from "@/lib/badges";

export const DEDICATION_TIERS: DedicationTier[] = [
  {
    tag: "Unrated",
    name: "Static Drift",
    minRating: 0,
    monthlyBenchmark: 0,
    color: "#9CA3AF",
    description: "Signal exists, but the rhythm has not stabilized yet.",
  },
  {
    tag: "Spark",
    name: "Spark Carrier",
    minRating: 800,
    monthlyBenchmark: 80,
    color: "#22C55E",
    description: "Visible activity with the first signs of repeatable motion.",
  },
  {
    tag: "Forgehand",
    name: "Forgehand",
    minRating: 1100,
    monthlyBenchmark: 180,
    color: "#06B6D4",
    description: "Regular building tempo with enough force to compound.",
  },
  {
    tag: "Signal Runner",
    name: "Signal Runner",
    minRating: 1400,
    monthlyBenchmark: 350,
    color: "#3B82F6",
    description: "Strong consistency across months, not only scattered bursts.",
  },
  {
    tag: "Redline",
    name: "Redline Builder",
    minRating: 1700,
    monthlyBenchmark: 650,
    color: "#A855F7",
    description: "High-output rhythm that starts to separate from ordinary effort.",
  },
  {
    tag: "Obsidian",
    name: "Obsidian Pro",
    minRating: 2000,
    monthlyBenchmark: 1000,
    color: "#F97316",
    description: "Professional-grade pressure over a long enough window.",
  },
  {
    tag: "Apex",
    name: "Apex Architect",
    minRating: 2300,
    monthlyBenchmark: 1500,
    color: "#EF4444",
    description: "Elite sustained signal with serious weekly and monthly density.",
  },
  {
    tag: "Mythic",
    name: "Relentless Mythic",
    minRating: 2600,
    monthlyBenchmark: 2200,
    color: "#F8D477",
    description: "A rare long-form discipline tier, designed to stay difficult.",
  },
];

/**
 * MONTHLY OUTPUT TIERS — a separate ladder for the Monthly Trend chart, scored
 * in actual monthly dedication points (NOT the yearly composite rating). The
 * thresholds widen as you climb (30 → 1700) so each higher rank is meaningfully
 * harder to reach than the last. These are intentionally distinct names from the
 * composite Dedication Rating ranks so the two scales can never be confused.
 */
export const MONTHLY_TIERS: DedicationBenchmark[] = [
  { label: "Ember", value: 30, color: "#84CC16", description: "First real monthly heat — output is visible." },
  { label: "Kindling", value: 70, color: "#22C55E", description: "A month that holds a steady flame." },
  { label: "Steady Burn", value: 120, color: "#14B8A6", description: "Consistent monthly output with momentum." },
  { label: "Forge Heat", value: 190, color: "#06B6D4", description: "A strong building month, well above casual." },
  { label: "Blaze", value: 290, color: "#3B82F6", description: "High-output month that stands out on the curve." },
  { label: "Inferno", value: 420, color: "#8B5CF6", description: "An intense month few are willing to sustain." },
  { label: "Firestorm", value: 600, color: "#A855F7", description: "Elite monthly density across sources." },
  { label: "Solar Flare", value: 850, color: "#F97316", description: "A rare, ferocious month of compounded work." },
  { label: "Supernova", value: 1200, color: "#EF4444", description: "Near the ceiling of what a month can hold." },
  { label: "Singularity", value: 1700, color: "#F8D477", description: "A mythic monthly peak, designed to stay brutal." },
];

export function monthlyTiers(): DedicationBenchmark[] {
  return MONTHLY_TIERS;
}

export function dedicationBenchmarks(): DedicationBenchmark[] {
  return DEDICATION_TIERS.filter((tier) => tier.monthlyBenchmark > 0).map((tier) => ({
    label: tier.name,
    value: tier.monthlyBenchmark,
    color: tier.color,
    description: tier.description,
  }));
}

export function buildDedicationRating(stats: BadgeStats) {
  const balanceBonus = stats.hasBalancedSourcesThisYear ? 80 : 0;
  const professionalBonus = Math.min(140, Math.round(stats.yearlyProfessionalDays * 0.65));
  const activeDayScore = Math.min(720, Math.round(stats.yearlyActiveDays * 2.2));
  const scoreDensity = Math.min(620, Math.round(stats.yearlyScore * 0.22));
  const streakScore = Math.min(420, Math.round(stats.bestStreak * 1.55));
  const currentStreakScore = Math.min(180, Math.round(stats.currentStreak * 1.2));
  const peakScore = Math.min(260, Math.round(stats.peakDayScore * 2));
  const monthlyScore = Math.min(380, Math.round(stats.bestMonthlyScore * 0.22));
  const breakdown: DedicationRatingComponent[] = [
    {
      label: "Active days",
      value: activeDayScore,
      max: 720,
      hint: "Raise this by increasing active days in the current year.",
    },
    {
      label: "Score density",
      value: scoreDensity,
      max: 620,
      hint: "Raise this with higher weighted GitHub, professional, and CP output.",
    },
    {
      label: "Best streak",
      value: streakScore,
      max: 420,
      hint: "Raise this by keeping long unbroken active-day chains.",
    },
    {
      label: "Current streak",
      value: currentStreakScore,
      max: 180,
      hint: "Raise this by keeping today's active streak alive.",
    },
    {
      label: "Professional signal",
      value: professionalBonus,
      max: 140,
      hint: "Raise this through synced professional GitHub activity.",
    },
    {
      label: "Monthly peak",
      value: peakScore + monthlyScore,
      max: 640,
      hint: "Raise this with standout high-output days and months.",
    },
    {
      label: "Balance bonus",
      value: balanceBonus,
      max: 80,
      hint: "Raise this by having both GitHub and competitive activity in the year.",
    },
  ];

  const rating = Math.round(
    600 +
      activeDayScore +
      scoreDensity +
      streakScore +
      currentStreakScore +
      professionalBonus +
      balanceBonus +
      peakScore +
      monthlyScore
  );

  const tier =
    [...DEDICATION_TIERS].reverse().find((item) => rating >= item.minRating) ??
    DEDICATION_TIERS[0];
  const nextTier = DEDICATION_TIERS.find((item) => item.minRating > rating);

  return {
    dedicationRating: rating,
    dedicationTier: tier,
    dedicationBenchmarks: dedicationBenchmarks(),
    dedicationRatingBreakdown: breakdown,
    nextTier,
  };
}
