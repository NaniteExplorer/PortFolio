import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profileSyncConfig } from "@/data/profile-sync";
import { getAdminSettings, mergeSiteConfig } from "@/lib/admin-settings";
import { buildMetadata } from "@/lib/seo";
import { getDevProfile } from "@/lib/dev-live";
import { DevView } from "@/components/dev/DevView";

export const metadata: Metadata = buildMetadata({
  title: "Developer Profile",
  description:
    "Debasish Rana's GitHub developer profile across NaniteExplorer and related accounts, including commits, contributions, repositories, and open-source work.",
  path: "/dev",
  keywords: [
    "Debasish Rana GitHub",
    "NaniteExplorer",
    "Nanite Explorer",
    "Debasish Rana developer profile",
    "Debasish Rana open source",
  ],
});

// Refresh the aggregated GitHub snapshot at most every 12h.
export const revalidate = profileSyncConfig.revalidateSeconds;

/**
 * /dev - multi-account GitHub analytics dashboard.
 */
export default async function DevPage() {
  const config = mergeSiteConfig(await getAdminSettings());
  if (!config.devProfileEnabled) notFound();

  const data = await getDevProfile();
  return <DevView data={data} />;
}
