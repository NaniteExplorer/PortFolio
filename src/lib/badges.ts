import type {
  BadgeAchievement,
  BadgeRarity,
  BadgeTier,
  BadgeTrack,
  CPProfile,
  DedicationEvent,
  DevProfileData,
  IconName,
} from "@/types";

type BadgeRule = {
  id: string;
  title: string;
  description: string;
  track: BadgeTrack;
  tier: BadgeTier;
  rarity: BadgeRarity;
  progress: number;
  target: number;
  icon: IconName;
  accent: string;
  criteriaLabel: string;
  earnedAt?: string;
  available?: boolean;
};

export type BadgeStats = {
  activeDays: number;
  currentStreak: number;
  bestStreak: number;
  currentYear: string;
  yearlyScore: number;
  yearlyActiveDays: number;
  yearlyProfessionalDays: number;
  peakDayScore: number;
  hasBalancedSourcesThisYear: boolean;
  noZeroWeekStreak: number;
  monthlyGrindCount: number;
  bestMonthlyActiveDays: number;
  bestMonthlyCoverage: number;
  bestMonthlyScore: number;
  bestMonthlyCompetitiveCount: number;
  bestMonthlyGithubCount: number;
  activeYears: number;
  decadeActiveDays: number;
  yearsWith200ActiveDays: number;
  yearsWith1000Score: number;
  cumulativeScore: number;
};

const TIER_RANK: Record<BadgeTier, number> = {
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4,
  diamond: 5,
  mythic: 6,
};

const RARITY_RANK: Record<BadgeRarity, number> = {
  common: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  ascendant: 5,
};

const TRACK_PRIORITY: Record<BadgeTrack, number> = {
  prestige: 5,
  dedication: 4,
  competitive: 3,
  dev: 2,
  monthly: 1,
};

/**
 * Pro-level floor. Entry medals devalue the trophy case, so we drop the lowest
 * benchmark: any bronze-tier medal and a small denylist of low-effort,
 * single-month "noobie" badges. Every surviving badge demands real, sustained
 * work — nothing earnable in a casual month.
 */
const NOOBIE_BADGE_IDS = new Set<string>([
  "monthly_grind", // 20-ish active days in one month — too easy for the floor
]);

function isProLevel(item: BadgeAchievement): boolean {
  return item.tier !== "bronze" && !NOOBIE_BADGE_IDS.has(item.id);
}

function clampProgress(progress: number, target: number) {
  return Math.max(0, Math.min(Math.round(progress), target));
}

function statusFor(progress: number, target: number) {
  if (progress >= target) return "earned";
  return target > 0 && progress / target >= 0.5 ? "in_progress" : "locked";
}

function badge(rule: BadgeRule): BadgeAchievement | null {
  if (rule.available === false) return null;
  const progress = clampProgress(rule.progress, rule.target);
  return {
    ...rule,
    progress,
    status: statusFor(progress, rule.target),
    earnedAt: progress >= rule.target ? rule.earnedAt : undefined,
  };
}

function byDate(events: DedicationEvent[], predicate: (event: DedicationEvent) => boolean) {
  const dates = new Set<string>();
  for (const event of events) {
    if (event.count > 0 && predicate(event)) dates.add(event.date);
  }
  return dates;
}

function thresholdDate(byDay: Record<string, number>, target: number) {
  let total = 0;
  for (const [day, value] of Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b))) {
    if (value <= 0) continue;
    total += 1;
    if (total >= target) return `${day}T00:00:00Z`;
  }
  return undefined;
}

function monthlyBuckets(events: DedicationEvent[]) {
  const active = new Map<string, Set<string>>();
  const competitive = new Map<string, number>();
  const github = new Map<string, number>();
  const score = new Map<string, number>();

  for (const event of events) {
    const month = event.date.slice(0, 7);
    if (event.count > 0) {
      const set = active.get(month) ?? new Set<string>();
      set.add(event.date);
      active.set(month, set);
    }
    score.set(month, (score.get(month) ?? 0) + event.score);
    if (event.source === "competitive") competitive.set(month, (competitive.get(month) ?? 0) + event.count);
    if (event.source === "github") github.set(month, (github.get(month) ?? 0) + event.count);
  }

  return { active, competitive, github, score };
}

function countNoZeroWeeks(byDay: Record<string, number>, anchorIso: string) {
  const anchor = new Date(anchorIso);
  let count = 0;
  for (let week = 0; week < 16; week += 1) {
    let hasActivity = false;
    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(anchor);
      date.setUTCDate(anchor.getUTCDate() - week * 7 - offset);
      if ((byDay[date.toISOString().slice(0, 10)] ?? 0) > 0) hasActivity = true;
    }
    if (!hasActivity) break;
    count += 1;
  }
  return count;
}

function perfectMonthDays(month: string) {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
}

export function buildBadgeStats(events: DedicationEvent[], byDay: Record<string, number>, anchorIso: string): BadgeStats {
  const anchor = new Date(anchorIso);
  const currentYear = String(anchor.getUTCFullYear());
  const yearlyEvents = events.filter((event) => event.date.startsWith(`${currentYear}-`));
  const yearlyByDay: Record<string, number> = {};
  for (const event of yearlyEvents) yearlyByDay[event.date] = (yearlyByDay[event.date] ?? 0) + event.score;

  const monthData = monthlyBuckets(events);
  const monthlyActiveCounts = [...monthData.active.values()].map((set) => set.size);
  const monthlyGrindCount = monthlyActiveCounts.filter((count) => count >= 20).length;
  const bestMonthlyCoverage = [...monthData.active.entries()].reduce((best, [month, days]) => {
    const required = perfectMonthDays(month);
    return Math.max(best, Math.round((Math.min(days.size, required) / required) * 100));
  }, 0);

  const sourceYears = new Map<string, Set<string>>();
  for (const event of events) {
    if (event.count <= 0) continue;
    const set = sourceYears.get(event.date.slice(0, 4)) ?? new Set<string>();
    set.add(event.source);
    sourceYears.set(event.date.slice(0, 4), set);
  }

  return {
    activeDays: Object.values(byDay).filter((value) => value > 0).length,
    currentStreak: 0,
    bestStreak: 0,
    currentYear,
    yearlyScore: Math.round(yearlyEvents.reduce((sum, event) => sum + event.score, 0)),
    yearlyActiveDays: Object.values(yearlyByDay).filter((value) => value > 0).length,
    yearlyProfessionalDays: byDate(yearlyEvents, (event) => event.category === "professional").size,
    peakDayScore: Math.round(Math.max(...Object.values(byDay), 0)),
    hasBalancedSourcesThisYear: (sourceYears.get(currentYear)?.size ?? 0) > 1,
    noZeroWeekStreak: countNoZeroWeeks(byDay, anchorIso),
    monthlyGrindCount,
    bestMonthlyActiveDays: Math.max(...monthlyActiveCounts, 0),
    bestMonthlyCoverage,
    bestMonthlyScore: Math.round(Math.max(...monthData.score.values(), 0)),
    bestMonthlyCompetitiveCount: Math.round(Math.max(...monthData.competitive.values(), 0)),
    bestMonthlyGithubCount: Math.round(Math.max(...monthData.github.values(), 0)),
    ...buildLongHorizonStats(events, byDay, anchorIso),
  };
}

function buildLongHorizonStats(events: DedicationEvent[], byDay: Record<string, number>, anchorIso: string) {
  const anchorYear = new Date(anchorIso).getUTCFullYear();
  const yearActive = new Map<string, Set<string>>();
  const yearScore = new Map<string, number>();
  for (const event of events) {
    if (event.count <= 0) continue;
    const year = event.date.slice(0, 4);
    const days = yearActive.get(year) ?? new Set<string>();
    days.add(event.date);
    yearActive.set(year, days);
    yearScore.set(year, (yearScore.get(year) ?? 0) + event.score);
  }

  let decadeActiveDays = 0;
  for (const [day, value] of Object.entries(byDay)) {
    const year = Number(day.slice(0, 4));
    if (value > 0 && year >= anchorYear - 9 && year <= anchorYear) decadeActiveDays += 1;
  }

  return {
    activeYears: yearActive.size,
    decadeActiveDays,
    yearsWith200ActiveDays: [...yearActive.values()].filter((days) => days.size >= 200).length,
    yearsWith1000Score: [...yearScore.values()].filter((score) => score >= 1000).length,
    cumulativeScore: Math.round(events.reduce((sum, event) => sum + event.score, 0)),
  };
}

export function buildBadges({
  events,
  byDay,
  syncedAt,
  stats,
  dev,
  competitive,
}: {
  events: DedicationEvent[];
  byDay: Record<string, number>;
  syncedAt: string;
  stats: BadgeStats;
  dev: DevProfileData;
  competitive: CPProfile;
}) {
  const livePlatforms = competitive.platforms.filter((platform) => platform.live);
  const totalSolved = livePlatforms.reduce((sum, platform) => sum + (platform.solved ?? 0), 0);
  const totalContests = livePlatforms.reduce((sum, platform) => sum + (platform.rated ? platform.contests ?? 0 : 0), 0);
  const ratedPlatforms = livePlatforms.filter((platform) => platform.rated).length;
  const bestRankText = livePlatforms.map((platform) => platform.rank ?? "").join(" ").toLowerCase();
  const bestTopPercent = livePlatforms.some((platform) => {
    const match = platform.rank?.match(/top\s+([\d.]+)%/i);
    return match ? Number(match[1]) <= 20 : false;
  });
  const bestGitHubContribution = dev.totals.contributions;
  const activeGithubDays = Object.values(dev.activityByDay).filter((value) => value > 0).length;
  const professionalActivity = events.some((event) => event.category === "professional" && event.count > 0);
  const openSourceActivity = events.some((event) => event.category === "open-source" && event.count > 0);
  const languages = dev.languages.length;
  const hasLiveCp = livePlatforms.length > 0;

  const rules: BadgeRule[] = [
    {
      id: "dedication_first_flame",
      title: "Season Mark",
      description: "The first serious seasonal proof of active consistency.",
      track: "dedication",
      tier: "bronze",
      rarity: "common",
      progress: stats.activeDays,
      target: 120,
      icon: "Flame",
      accent: "#C47A3A",
      criteriaLabel: "120 active days",
      earnedAt: thresholdDate(byDay, 120),
    },
    {
      id: "dedication_two_week_heat",
      title: "Two Week Heat",
      description: "Fourteen linked days without letting the signal fade.",
      track: "dedication",
      tier: "silver",
      rarity: "rare",
      progress: stats.bestStreak,
      target: 90,
      icon: "FlameKindling",
      accent: "#CBD5E1",
      criteriaLabel: "90-day best streak",
    },
    {
      id: "dedication_iron_month",
      title: "Iron Month",
      description: "A full month of disciplined momentum.",
      track: "dedication",
      tier: "gold",
      rarity: "epic",
      progress: stats.bestStreak,
      target: 150,
      icon: "Medal",
      accent: "#F8C14A",
      criteriaLabel: "150-day best streak",
    },
    {
      id: "dedication_hundred_day_grid",
      title: "Hundred Day Grid",
      description: "A year with one hundred visible days of work.",
      track: "dedication",
      tier: "platinum",
      rarity: "epic",
      progress: stats.yearlyActiveDays,
      target: 220,
      icon: "CalendarCheck",
      accent: "#8DE7E1",
      criteriaLabel: "220 active days this year",
    },
    {
      id: "dedication_150_day_grid",
      title: "Relentless Grid",
      description: "One hundred fifty active days in the same year.",
      track: "dedication",
      tier: "diamond",
      rarity: "legendary",
      progress: stats.yearlyActiveDays,
      target: 300,
      icon: "Grid3X3",
      accent: "#B7F3FF",
      criteriaLabel: "300 active days this year",
    },
    {
      id: "dedication_no_zero_week",
      title: "No Zero Week",
      description: "Twelve straight weeks with no dead week in the record.",
      track: "dedication",
      tier: "platinum",
      rarity: "legendary",
      progress: stats.noZeroWeekStreak,
      target: 26,
      icon: "CalendarRange",
      accent: "#66E3D4",
      criteriaLabel: "Activity every week for 26 weeks",
    },
    {
      id: "dedication_year_of_fire",
      title: "Year of Fire",
      description: "A year that refuses to look casual.",
      track: "dedication",
      tier: "diamond",
      rarity: "legendary",
      progress: stats.yearlyActiveDays,
      target: 340,
      icon: "Gem",
      accent: "#B7F3FF",
      criteriaLabel: "340 active days this year",
    },
    {
      id: "dedication_score_1500",
      title: "High Voltage Year",
      description: "A dedication score that proves sustained intensity.",
      track: "dedication",
      tier: "diamond",
      rarity: "legendary",
      progress: stats.yearlyScore,
      target: 5000,
      icon: "Gauge",
      accent: "#B7F3FF",
      criteriaLabel: "5000 dedication points this year",
    },
    {
      id: "dedication_365_discipline",
      title: "365 Discipline",
      description: "Every day in the year carries a mark.",
      track: "dedication",
      tier: "mythic",
      rarity: "ascendant",
      progress: stats.yearlyActiveDays,
      target: 365,
      icon: "Crown",
      accent: "#D7B56D",
      criteriaLabel: "365 active days this year",
    },
    {
      id: "dedication_balanced_builder",
      title: "Balanced Builder",
      description: "Proof that building and problem solving are both alive.",
      track: "dedication",
      tier: "gold",
      rarity: "rare",
      progress: stats.hasBalancedSourcesThisYear ? 1 : 0,
      target: 1,
      icon: "Scale",
      accent: "#F8C14A",
      criteriaLabel: "GitHub and CP activity in the same year",
      available: hasLiveCp && dev.liveCount > 0,
    },
    {
      id: "dedication_professional_engine",
      title: "Professional Engine",
      description: "A serious body of work from professional contribution days.",
      track: "dedication",
      tier: "platinum",
      rarity: "epic",
      progress: stats.yearlyProfessionalDays,
      target: 220,
      icon: "BriefcaseBusiness",
      accent: "#8DE7E1",
      criteriaLabel: "220 professional days this year",
      available: dev.liveCount > 0,
    },
    {
      id: "dedication_peak_output_day",
      title: "Peak Output Day",
      description: "One day that hit with unusual force.",
      track: "dedication",
      tier: "gold",
      rarity: "rare",
      progress: stats.peakDayScore,
      target: 150,
      icon: "Zap",
      accent: "#F8C14A",
      criteriaLabel: "150 dedication points in one day",
    },
    {
      id: "dedication_peak_50",
      title: "Singular Output",
      description: "A rare day with fifty dedication points.",
      track: "dedication",
      tier: "diamond",
      rarity: "legendary",
      progress: stats.peakDayScore,
      target: 250,
      icon: "RadioTower",
      accent: "#B7F3FF",
      criteriaLabel: "250 dedication points in one day",
    },
    {
      id: "dev_commit_spark",
      title: "Commit Spark",
      description: "The yearly contribution graph has a visible pulse.",
      track: "dev",
      tier: "bronze",
      rarity: "common",
      progress: bestGitHubContribution,
      target: 500,
      icon: "GitCommitHorizontal",
      accent: "#C47A3A",
      criteriaLabel: "500 GitHub contributions",
      available: dev.liveCount > 0,
    },
    {
      id: "dev_ship_rhythm",
      title: "Ship Rhythm",
      description: "A hundred GitHub days with code in motion.",
      track: "dev",
      tier: "gold",
      rarity: "rare",
      progress: activeGithubDays,
      target: 150,
      icon: "ShipWheel",
      accent: "#F8C14A",
      criteriaLabel: "150 active GitHub days",
      available: dev.liveCount > 0,
    },
    {
      id: "dev_repo_builder",
      title: "Repo Builder",
      description: "A portfolio of repositories with real breadth.",
      track: "dev",
      tier: "silver",
      rarity: "rare",
      progress: dev.totals.repos,
      target: 40,
      icon: "FolderGit2",
      accent: "#CBD5E1",
      criteriaLabel: "40 public repositories",
      available: dev.liveCount > 0,
    },
    {
      id: "dev_polyglot_core",
      title: "Polyglot Core",
      description: "Multiple language lanes, one builder identity.",
      track: "dev",
      tier: "gold",
      rarity: "rare",
      progress: languages,
      target: 8,
      icon: "Code2",
      accent: "#F8C14A",
      criteriaLabel: "8 detected languages",
      available: dev.liveCount > 0,
    },
    {
      id: "dev_office_signal",
      title: "Office Signal",
      description: "Professional work is synced and visible in the system.",
      track: "dev",
      tier: "silver",
      rarity: "rare",
      progress: professionalActivity ? 1 : 0,
      target: 1,
      icon: "Building2",
      accent: "#CBD5E1",
      criteriaLabel: "Professional GitHub activity synced",
      available: dev.liveCount > 0,
    },
    {
      id: "dev_open_source_pulse",
      title: "Open Source Pulse",
      description: "Open-source activity is part of the dedication graph.",
      track: "dev",
      tier: "gold",
      rarity: "rare",
      progress: openSourceActivity ? 1 : 0,
      target: 1,
      icon: "GitPullRequest",
      accent: "#F8C14A",
      criteriaLabel: "Open-source activity present",
      available: dev.liveCount > 0,
    },
    {
      id: "dev_craft_marathon",
      title: "Craft Marathon",
      description: "A thousand yearly GitHub contributions. No casual badge.",
      track: "dev",
      tier: "diamond",
      rarity: "legendary",
      progress: bestGitHubContribution,
      target: 1500,
      icon: "Gem",
      accent: "#B7F3FF",
      criteriaLabel: "1500 GitHub contributions",
      available: dev.liveCount > 0,
    },
    {
      id: "cp_solver_100",
      title: "Problem Solver I",
      description: "The first hundred problems across live platforms.",
      track: "competitive",
      tier: "bronze",
      rarity: "common",
      progress: totalSolved,
      target: 300,
      icon: "Target",
      accent: "#C47A3A",
      criteriaLabel: "300 live-synced problems solved",
      available: hasLiveCp,
    },
    {
      id: "cp_solver_500",
      title: "Problem Solver II",
      description: "Five hundred solved problems, forged one session at a time.",
      track: "competitive",
      tier: "gold",
      rarity: "rare",
      progress: totalSolved,
      target: 800,
      icon: "Trophy",
      accent: "#F8C14A",
      criteriaLabel: "800 live-synced problems solved",
      available: hasLiveCp,
    },
    {
      id: "cp_solver_1000",
      title: "Problem Solver III",
      description: "A four-digit problem count that starts to feel heavy.",
      track: "competitive",
      tier: "platinum",
      rarity: "epic",
      progress: totalSolved,
      target: 1500,
      icon: "Award",
      accent: "#8DE7E1",
      criteriaLabel: "1500 live-synced problems solved",
      available: hasLiveCp,
    },
    {
      id: "cp_algorithmic_climber",
      title: "Algorithmic Climber",
      description: "A serious climb through fifteen hundred problems.",
      track: "competitive",
      tier: "diamond",
      rarity: "legendary",
      progress: totalSolved,
      target: 2200,
      icon: "Mountain",
      accent: "#B7F3FF",
      criteriaLabel: "2200 live-synced problems solved",
      available: hasLiveCp,
    },
    {
      id: "cp_contest_regular",
      title: "Contest Regular",
      description: "Rated contests are now part of the rhythm.",
      track: "competitive",
      tier: "gold",
      rarity: "rare",
      progress: totalContests,
      target: 50,
      icon: "Swords",
      accent: "#F8C14A",
      criteriaLabel: "50 rated contests",
      available: hasLiveCp,
    },
    {
      id: "cp_arena_veteran",
      title: "Arena Veteran",
      description: "A hundred rated contests leaves a mark.",
      track: "competitive",
      tier: "diamond",
      rarity: "legendary",
      progress: totalContests,
      target: 150,
      icon: "ShieldCheck",
      accent: "#B7F3FF",
      criteriaLabel: "150 rated contests",
      available: hasLiveCp,
    },
    {
      id: "cp_top_percentile",
      title: "Top Percentile",
      description: "Top-tier standing on a live competitive profile.",
      track: "competitive",
      tier: "platinum",
      rarity: "epic",
      progress: bestTopPercent || /expert|candidate master|master|international|grandmaster/.test(bestRankText) ? 1 : 0,
      target: 1,
      icon: "BadgeCheck",
      accent: "#8DE7E1",
      criteriaLabel: "Top 20% or comparable rank",
      available: hasLiveCp,
    },
    {
      id: "cp_knight_track",
      title: "Knight Track",
      description: "A ranked profile with unmistakable competitive weight.",
      track: "competitive",
      tier: "diamond",
      rarity: "legendary",
      progress: /knight|guardian|expert|master|grandmaster|4★|5★|6★|7★/.test(bestRankText) ? 1 : 0,
      target: 1,
      icon: "Shield",
      accent: "#B7F3FF",
      criteriaLabel: "Knight or comparable rank",
      available: hasLiveCp,
    },
    {
      id: "cp_multi_platform_rated",
      title: "Multi-Platform Rated",
      description: "Rated signal across more than one arena.",
      track: "competitive",
      tier: "platinum",
      rarity: "epic",
      progress: ratedPlatforms,
      target: 3,
      icon: "Network",
      accent: "#8DE7E1",
      criteriaLabel: "3 live rated platforms",
      available: hasLiveCp,
    },
    {
      id: "monthly_grind",
      title: "Monthly Grind",
      description: "Twenty active days inside a single calendar month.",
      track: "monthly",
      tier: "gold",
      rarity: "rare",
      progress: stats.bestMonthlyActiveDays,
      target: 24,
      icon: "CalendarDays",
      accent: "#F8C14A",
      criteriaLabel: "24 active days in one month",
    },
    {
      id: "monthly_perfect",
      title: "Perfect Month",
      description: "A calendar month with every day claimed.",
      track: "monthly",
      tier: "diamond",
      rarity: "legendary",
      progress: stats.bestMonthlyCoverage,
      target: 100,
      icon: "Sparkles",
      accent: "#B7F3FF",
      criteriaLabel: "100% active days in a calendar month",
    },
    {
      id: "monthly_double_grind",
      title: "Double Grind",
      description: "Two separate months with twenty active days.",
      track: "monthly",
      tier: "platinum",
      rarity: "epic",
      progress: stats.monthlyGrindCount,
      target: 4,
      icon: "CalendarClock",
      accent: "#8DE7E1",
      criteriaLabel: "4 Monthly Grind months",
    },
    {
      id: "monthly_cp_badge",
      title: "CP Month Badge",
      description: "A month where competitive practice took over.",
      track: "monthly",
      tier: "platinum",
      rarity: "epic",
      progress: stats.bestMonthlyCompetitiveCount,
      target: 100,
      icon: "Brain",
      accent: "#8DE7E1",
      criteriaLabel: "100 CP activity count in one month",
      available: hasLiveCp,
    },
    {
      id: "monthly_builder_badge",
      title: "Builder Month Badge",
      description: "A month with builder energy written all over it.",
      track: "monthly",
      tier: "platinum",
      rarity: "epic",
      progress: stats.bestMonthlyGithubCount,
      target: 250,
      icon: "Hammer",
      accent: "#8DE7E1",
      criteriaLabel: "250 GitHub activity count in one month",
      available: dev.liveCount > 0,
    },
    {
      id: "prestige_builder_prime",
      title: "Builder Prime",
      description: "A prestige mark for a year with both code and arena force.",
      track: "prestige",
      tier: "diamond",
      rarity: "legendary",
      progress: Math.min(stats.yearlyScore, stats.hasBalancedSourcesThisYear ? stats.yearlyScore : 5999),
      target: 6000,
      icon: "Orbit",
      accent: "#B7F3FF",
      criteriaLabel: "6000 yearly score with GitHub and CP activity",
      available: hasLiveCp && dev.liveCount > 0,
    },
    {
      id: "prestige_iron_discipline",
      title: "Iron Discipline",
      description: "A 180-day streak. This is the kind of badge that changes behavior.",
      track: "prestige",
      tier: "mythic",
      rarity: "ascendant",
      progress: stats.bestStreak,
      target: 365,
      icon: "Crown",
      accent: "#D7B56D",
      criteriaLabel: "365-day best streak",
    },
    {
      id: "prestige_365_streak",
      title: "Unbroken Season",
      description: "A full year-long streak. This is intentionally brutal.",
      track: "prestige",
      tier: "mythic",
      rarity: "ascendant",
      progress: stats.bestStreak,
      target: 730,
      icon: "Infinity",
      accent: "#D7B56D",
      criteriaLabel: "730-day best streak",
    },
    {
      id: "prestige_ascendant_year",
      title: "Ascendant Year",
      description: "The app's crown badge: consistency, competitive volume, and craft.",
      track: "prestige",
      tier: "mythic",
      rarity: "ascendant",
      progress: Math.min(stats.yearsWith200ActiveDays, totalSolved >= 3000 && bestGitHubContribution >= 3000 ? stats.yearsWith200ActiveDays : 4),
      target: 5,
      icon: "Crown",
      accent: "#D7B56D",
      criteriaLabel: "5 strong years, 3000 solved, 3000 GitHub contributions",
      available: hasLiveCp && dev.liveCount > 0,
    },
    {
      id: "prestige_crown_consistency",
      title: "Crown of Consistency",
      description: "Twelve monthly grind badges chained into one crown.",
      track: "prestige",
      tier: "mythic",
      rarity: "ascendant",
      progress: stats.monthlyGrindCount,
      target: 12,
      icon: "Crown",
      accent: "#D7B56D",
      criteriaLabel: "12 Monthly Grind months",
    },
    {
      id: "prestige_decade_signal",
      title: "Decade Signal",
      description: "A ten-year dedication archive with thousands of active days.",
      track: "prestige",
      tier: "mythic",
      rarity: "ascendant",
      progress: stats.decadeActiveDays,
      target: 2200,
      icon: "Landmark",
      accent: "#D7B56D",
      criteriaLabel: "2200 active days inside a 10-year window",
    },
    {
      id: "prestige_iron_archive",
      title: "Iron Archive",
      description: "Five separate years with serious active-day density.",
      track: "prestige",
      tier: "mythic",
      rarity: "ascendant",
      progress: stats.yearsWith200ActiveDays,
      target: 5,
      icon: "Archive",
      accent: "#D7B56D",
      criteriaLabel: "5 years with 200+ active days",
    },
    {
      id: "prestige_prime_discipline",
      title: "Prime Discipline",
      description: "Three separate high-score years, not one lucky burst.",
      track: "prestige",
      tier: "mythic",
      rarity: "ascendant",
      progress: stats.yearsWith1000Score,
      target: 3,
      icon: "BadgeCheck",
      accent: "#D7B56D",
      criteriaLabel: "3 years with 1000+ dedication score",
    },
  ];

  const dedicationPrestige = new Set([
    "prestige_iron_discipline",
    "prestige_365_streak",
    "prestige_crown_consistency",
  ]);
  const badges = rules
    .map(badge)
    .filter((item): item is BadgeAchievement => item != null)
    .filter(
      (item) =>
        item.track === "dedication" ||
        item.track === "monthly" ||
        (item.track === "prestige" && dedicationPrestige.has(item.id))
    )
    .filter(isProLevel);
  return {
    badges: sortBadges(badges),
    featuredBadges: selectFeaturedBadges(badges),
  };
}

export function buildDevBadges(dev: DevProfileData) {
  const activeGithubDays = Object.values(dev.activityByDay).filter((value) => value > 0).length;
  const languages = dev.languages.length;
  const live = dev.liveCount > 0;
  const rules: BadgeRule[] = [
    {
      id: "dev_commit_spark",
      title: "Commit Spark",
      description: "The yearly contribution graph has a visible pulse.",
      track: "dev",
      tier: "bronze",
      rarity: "common",
      progress: dev.totals.contributions,
      target: 500,
      icon: "GitCommitHorizontal",
      accent: "#C47A3A",
      criteriaLabel: "500 GitHub contributions",
      available: live,
    },
    {
      id: "dev_ship_rhythm",
      title: "Ship Rhythm",
      description: "A hundred GitHub days with code in motion.",
      track: "dev",
      tier: "gold",
      rarity: "rare",
      progress: activeGithubDays,
      target: 150,
      icon: "ShipWheel",
      accent: "#F8C14A",
      criteriaLabel: "150 active GitHub days",
      available: live,
    },
    {
      id: "dev_repo_builder",
      title: "Repo Builder",
      description: "A portfolio of repositories with real breadth.",
      track: "dev",
      tier: "silver",
      rarity: "rare",
      progress: dev.totals.repos,
      target: 40,
      icon: "FolderGit2",
      accent: "#CBD5E1",
      criteriaLabel: "40 public repositories",
      available: live,
    },
    {
      id: "dev_polyglot_core",
      title: "Polyglot Core",
      description: "Multiple language lanes, one builder identity.",
      track: "dev",
      tier: "gold",
      rarity: "rare",
      progress: languages,
      target: 8,
      icon: "Code2",
      accent: "#F8C14A",
      criteriaLabel: "8 detected languages",
      available: live,
    },
    {
      id: "dev_craft_marathon",
      title: "Craft Marathon",
      description: "A thousand yearly GitHub contributions. No casual badge.",
      track: "dev",
      tier: "diamond",
      rarity: "legendary",
      progress: dev.totals.contributions,
      target: 1500,
      icon: "Gem",
      accent: "#B7F3FF",
      criteriaLabel: "1500 GitHub contributions",
      available: live,
    },
    {
      id: "dev_200_days",
      title: "Builder's Calendar",
      description: "Two hundred GitHub-active days in the trailing year.",
      track: "dev",
      tier: "diamond",
      rarity: "legendary",
      progress: activeGithubDays,
      target: 240,
      icon: "CalendarCheck",
      accent: "#B7F3FF",
      criteriaLabel: "240 active GitHub days",
      available: live,
    },
    {
      id: "dev_2500_contributions",
      title: "Monolith Year",
      description: "Two thousand five hundred contributions in one trailing year.",
      track: "dev",
      tier: "mythic",
      rarity: "ascendant",
      progress: dev.totals.contributions,
      target: 3500,
      icon: "Crown",
      accent: "#D7B56D",
      criteriaLabel: "3500 GitHub contributions",
      available: live,
    },
    {
      id: "dev_multi_account_sync",
      title: "Full Signal Sync",
      description: "Every configured GitHub account is live.",
      track: "dev",
      tier: "platinum",
      rarity: "epic",
      progress: dev.liveCount,
      target: dev.accounts.length || 1,
      icon: "Satellite",
      accent: "#8DE7E1",
      criteriaLabel: "All GitHub accounts synced",
      available: dev.accounts.length > 0,
    },
    {
      id: "dev_repo_50",
      title: "Repository Vault",
      description: "Fifty public repositories across synced accounts.",
      track: "dev",
      tier: "diamond",
      rarity: "legendary",
      progress: dev.totals.repos,
      target: 75,
      icon: "Archive",
      accent: "#B7F3FF",
      criteriaLabel: "75 public repositories",
      available: live,
    },
    {
      id: "dev_language_10",
      title: "Ten-Language Core",
      description: "A broad language footprint across public repositories.",
      track: "dev",
      tier: "platinum",
      rarity: "epic",
      progress: languages,
      target: 12,
      icon: "Braces",
      accent: "#8DE7E1",
      criteriaLabel: "12 detected languages",
      available: live,
    },
  ];
  return sortBadges(rules.map(badge).filter((item): item is BadgeAchievement => item != null).filter(isProLevel));
}

export function buildCompetitiveBadges(competitive: CPProfile) {
  const livePlatforms = competitive.platforms.filter((platform) => platform.live);
  const totalSolved = livePlatforms.reduce((sum, platform) => sum + (platform.solved ?? 0), 0);
  const totalContests = livePlatforms.reduce((sum, platform) => sum + (platform.rated ? platform.contests ?? 0 : 0), 0);
  const ratedPlatforms = livePlatforms.filter((platform) => platform.rated).length;
  const bestRankText = livePlatforms.map((platform) => platform.rank ?? "").join(" ").toLowerCase();
  const bestTopPercent = livePlatforms.some((platform) => {
    const match = platform.rank?.match(/top\s+([\d.]+)%/i);
    return match ? Number(match[1]) <= 20 : false;
  });
  const activeDays = competitive.activityByDay
    ? Object.values(competitive.activityByDay).filter((value) => value > 0).length
    : (competitive.activity ?? []).filter((value) => value > 0).length;
  const hasLiveCp = livePlatforms.length > 0;

  const rules: BadgeRule[] = [
    {
      id: "cp_solver_100",
      title: "Problem Solver I",
      description: "The first hundred problems across live platforms.",
      track: "competitive",
      tier: "bronze",
      rarity: "common",
      progress: totalSolved,
      target: 300,
      icon: "Target",
      accent: "#C47A3A",
      criteriaLabel: "300 live-synced problems solved",
      available: hasLiveCp,
    },
    {
      id: "cp_solver_500",
      title: "Problem Solver II",
      description: "Five hundred solved problems, forged one session at a time.",
      track: "competitive",
      tier: "gold",
      rarity: "rare",
      progress: totalSolved,
      target: 800,
      icon: "Trophy",
      accent: "#F8C14A",
      criteriaLabel: "800 live-synced problems solved",
      available: hasLiveCp,
    },
    {
      id: "cp_solver_1000",
      title: "Problem Solver III",
      description: "A four-digit problem count that starts to feel heavy.",
      track: "competitive",
      tier: "platinum",
      rarity: "epic",
      progress: totalSolved,
      target: 1500,
      icon: "Award",
      accent: "#8DE7E1",
      criteriaLabel: "1500 live-synced problems solved",
      available: hasLiveCp,
    },
    {
      id: "cp_algorithmic_climber",
      title: "Algorithmic Climber",
      description: "A serious climb through fifteen hundred problems.",
      track: "competitive",
      tier: "diamond",
      rarity: "legendary",
      progress: totalSolved,
      target: 2200,
      icon: "Mountain",
      accent: "#B7F3FF",
      criteriaLabel: "2200 live-synced problems solved",
      available: hasLiveCp,
    },
    {
      id: "cp_solver_2500",
      title: "Problem Sovereign",
      description: "Two thousand five hundred solved problems. This is a crown-tier number.",
      track: "competitive",
      tier: "mythic",
      rarity: "ascendant",
      progress: totalSolved,
      target: 3500,
      icon: "Crown",
      accent: "#D7B56D",
      criteriaLabel: "3500 live-synced problems solved",
      available: hasLiveCp,
    },
    {
      id: "cp_contest_regular",
      title: "Contest Regular",
      description: "Rated contests are now part of the rhythm.",
      track: "competitive",
      tier: "gold",
      rarity: "rare",
      progress: totalContests,
      target: 50,
      icon: "Swords",
      accent: "#F8C14A",
      criteriaLabel: "50 rated contests",
      available: hasLiveCp,
    },
    {
      id: "cp_arena_veteran",
      title: "Arena Veteran",
      description: "A hundred rated contests leaves a mark.",
      track: "competitive",
      tier: "diamond",
      rarity: "legendary",
      progress: totalContests,
      target: 150,
      icon: "ShieldCheck",
      accent: "#B7F3FF",
      criteriaLabel: "150 rated contests",
      available: hasLiveCp,
    },
    {
      id: "cp_200_contests",
      title: "Arena Immortal",
      description: "Two hundred rated contests. Very few profiles should hold this.",
      track: "competitive",
      tier: "mythic",
      rarity: "ascendant",
      progress: totalContests,
      target: 300,
      icon: "ShieldHalf",
      accent: "#D7B56D",
      criteriaLabel: "300 rated contests",
      available: hasLiveCp,
    },
    {
      id: "cp_top_percentile",
      title: "Top Percentile",
      description: "Top-tier standing on a live competitive profile.",
      track: "competitive",
      tier: "platinum",
      rarity: "epic",
      progress: bestTopPercent || /expert|candidate master|master|international|grandmaster/.test(bestRankText) ? 1 : 0,
      target: 1,
      icon: "BadgeCheck",
      accent: "#8DE7E1",
      criteriaLabel: "Top 20% or comparable rank",
      available: hasLiveCp,
    },
    {
      id: "cp_knight_track",
      title: "Knight Track",
      description: "A ranked profile with unmistakable competitive weight.",
      track: "competitive",
      tier: "diamond",
      rarity: "legendary",
      progress: /knight|guardian|expert|master|grandmaster|4★|5★|6★|7★/.test(bestRankText) ? 1 : 0,
      target: 1,
      icon: "Shield",
      accent: "#B7F3FF",
      criteriaLabel: "Knight or comparable rank",
      available: hasLiveCp,
    },
    {
      id: "cp_multi_platform_rated",
      title: "Multi-Platform Rated",
      description: "Rated signal across more than one arena.",
      track: "competitive",
      tier: "platinum",
      rarity: "epic",
      progress: ratedPlatforms,
      target: 3,
      icon: "Network",
      accent: "#8DE7E1",
      criteriaLabel: "3 live rated platforms",
      available: hasLiveCp,
    },
    {
      id: "cp_180_active_days",
      title: "Arena Calendar",
      description: "One hundred eighty active CP days.",
      track: "competitive",
      tier: "diamond",
      rarity: "legendary",
      progress: activeDays,
      target: 240,
      icon: "CalendarRange",
      accent: "#B7F3FF",
      criteriaLabel: "240 active CP days",
      available: hasLiveCp,
    },
  ];
  return sortBadges(rules.map(badge).filter((item): item is BadgeAchievement => item != null).filter(isProLevel));
}

function sortBadges(badges: BadgeAchievement[]) {
  return [...badges].sort((a, b) => {
    const statusDelta = Number(b.status === "earned") - Number(a.status === "earned");
    if (statusDelta) return statusDelta;
    const rarityDelta = RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity];
    if (rarityDelta) return rarityDelta;
    const tierDelta = TIER_RANK[b.tier] - TIER_RANK[a.tier];
    if (tierDelta) return tierDelta;
    return TRACK_PRIORITY[b.track] - TRACK_PRIORITY[a.track];
  });
}

function progressRatio(badge: BadgeAchievement) {
  return badge.target > 0 ? badge.progress / badge.target : 0;
}

function highestEarned(badges: BadgeAchievement[], predicate: (badge: BadgeAchievement) => boolean) {
  return sortBadges(badges.filter((badge) => badge.status === "earned" && predicate(badge)))[0];
}

function closestProgress(badges: BadgeAchievement[], predicate: (badge: BadgeAchievement) => boolean) {
  return [...badges]
    .filter((badge) => badge.status === "in_progress" && predicate(badge))
    .sort((a, b) => progressRatio(b) - progressRatio(a))[0];
}

export function selectFeaturedBadges(badges: BadgeAchievement[]) {
  const picks = [
    highestEarned(badges, (badge) => badge.tier === "mythic" || badge.tier === "diamond"),
    highestEarned(badges, (badge) => badge.track === "dedication"),
    highestEarned(badges, (badge) => badge.track === "competitive"),
    closestProgress(badges, (badge) => badge.track === "prestige"),
    closestProgress(badges, (badge) => badge.track === "monthly"),
  ].filter((badge): badge is BadgeAchievement => !!badge);

  const unique = new Map<string, BadgeAchievement>();
  for (const badge of picks) unique.set(badge.id, badge);
  for (const badge of sortBadges(badges)) {
    if (unique.size >= 5) break;
    unique.set(badge.id, badge);
  }
  return [...unique.values()].slice(0, 5);
}
