import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profileSyncConfig } from "@/data/profile-sync";
import { getAdminSettings, mergeSiteConfig } from "@/lib/admin-settings";
import { buildMetadata } from "@/lib/seo";
import { cpAggregates } from "@/lib/competitive";
import { getLiveCompetitive } from "@/lib/competitive-live";
import { CompetitiveView } from "@/components/competitive/CompetitiveView";

export const metadata: Metadata = buildMetadata({
  title: "Competitive Programmer",
  description:
    "Debasish Rana's competitive programming profile with live ratings, problems solved, and contest history across LeetCode, Codeforces, CodeChef, AtCoder, and more.",
  path: "/competitive",
  keywords: [
    "Debasish Rana competitive programmer",
    "Debasish Rana Codeforces",
    "Debasish Rana LeetCode",
    "Nanite CodeChef",
    "Nanite AtCoder",
    "NIT Rourkela competitive programmer",
  ],
});

// Refresh the live snapshot at most every 12h (matches the integration cache).
export const revalidate = profileSyncConfig.revalidateSeconds;

/**
 * /competitive - full competitive-programming analytics dashboard.
 */
export default async function CompetitivePage() {
  const config = mergeSiteConfig(await getAdminSettings());
  if (!config.competitiveEnabled) notFound();

  const profile = await getLiveCompetitive();
  const stats = cpAggregates(profile);

  return <CompetitiveView profile={profile} stats={stats} />;
}
