import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/data/config";
import { buildMetadata } from "@/lib/seo";
import { getDevProfile } from "@/lib/dev-live";
import { DevView } from "@/components/dev/DevView";

export const metadata: Metadata = buildMetadata({
  title: "Developer Profile",
  description:
    "Live engineering analytics — commits, contributions, and languages clubbed across all my GitHub accounts (personal, open-source, and work).",
  path: "/dev",
});

// Refresh the aggregated GitHub snapshot at most every 12h.
export const revalidate = 43200;

/**
 * /dev — multi-account GitHub analytics. Aggregates every account in
 * `data/devprofile.ts` server-side, then renders the animated dashboard.
 */
export default async function DevPage() {
  if (!siteConfig.devProfileEnabled) notFound();

  const data = await getDevProfile();
  return <DevView data={data} />;
}
