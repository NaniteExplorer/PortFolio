import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/data/config";
import { buildMetadata } from "@/lib/seo";
import { cpAggregates } from "@/lib/competitive";
import { getLiveCompetitive } from "@/lib/competitive-live";
import { CompetitiveView } from "@/components/competitive/CompetitiveView";

export const metadata: Metadata = buildMetadata({
  title: "Competitive Programming",
  description:
    "Live analytics of my competitive programming journey — ratings, problems solved, and contest history across LeetCode, Codeforces, and CodeChef.",
  path: "/competitive",
});

// Refresh the live snapshot at most every 12h (matches the integration cache).
export const revalidate = 43200;

/**
 * /competitive — full competitive-programming analytics dashboard.
 * Server component: fetches a LIVE snapshot (Codeforces/LeetCode/AtCoder APIs +
 * best-effort scrapes), overlaid on the static fallback, then hands data to a
 * client view for the animated charts. Disabled via `competitiveEnabled`.
 */
export default async function CompetitivePage() {
  if (!siteConfig.competitiveEnabled) notFound();

  const profile = await getLiveCompetitive();
  const stats = cpAggregates(profile);

  return <CompetitiveView profile={profile} stats={stats} />;
}
