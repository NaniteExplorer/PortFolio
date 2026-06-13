import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { competitive } from "@/data/competitive";
import { siteConfig } from "@/data/config";
import { buildMetadata } from "@/lib/seo";
import { cpAggregates } from "@/lib/competitive";
import { CompetitiveView } from "@/components/competitive/CompetitiveView";

export const metadata: Metadata = buildMetadata({
  title: "Competitive Programming",
  description:
    "Live analytics of my competitive programming journey — ratings, problems solved, and contest history across LeetCode, Codeforces, CodeChef, AtCoder, and more.",
  path: "/competitive",
});

/**
 * /competitive — full competitive-programming analytics dashboard.
 * Server component: computes aggregates, then hands data to a client view for
 * the animated charts. Disabled if `competitiveEnabled` is false in config.
 */
export default function CompetitivePage() {
  if (!siteConfig.competitiveEnabled) notFound();

  const stats = cpAggregates(competitive);

  return <CompetitiveView profile={competitive} stats={stats} />;
}
