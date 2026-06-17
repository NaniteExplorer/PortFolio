import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profileSyncConfig } from "@/data/profile-sync";
import { getAdminSettings, mergeSiteConfig } from "@/lib/admin-settings";
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
export const revalidate = profileSyncConfig.revalidateSeconds;

/**
 * /competitive — full competitive-programming analytics dashboard.
 * Server component: fetches a LIVE snapshot (Codeforces/LeetCode/AtCoder APIs +
 * best-effort scrapes), overlaid on the static fallback, then hands data to a
 * client view for the animated charts. Disabled via `competitiveEnabled`.
 */
export default async function CompetitivePage() {
  const config = mergeSiteConfig(await getAdminSettings());
  if (!config.competitiveEnabled) notFound();

  const profile = await getLiveCompetitive();
  const stats = cpAggregates(profile);

  return <CompetitiveView profile={profile} stats={stats} />;
}
