import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { profileSyncConfig } from "@/data/profile-sync";
import { getAdminSettings, mergeSiteConfig } from "@/lib/admin-settings";
import { buildMetadata } from "@/lib/seo";
import { getDedicationProfile } from "@/lib/dedication";
import { DedicationView } from "@/components/dedication/DedicationView";

export const metadata: Metadata = buildMetadata({
  title: "Dedication Graph",
  description:
    "A unified activity dashboard for Debasish Rana, combining GitHub contributions, professional work, and competitive programming activity over time.",
  path: "/dedication",
  keywords: [
    "Debasish Rana dedication graph",
    "Debasish Rana GitHub contributions",
    "Debasish Rana competitive programming activity",
  ],
});

export const revalidate = profileSyncConfig.revalidateSeconds;

export default async function DedicationPage() {
  const config = mergeSiteConfig(await getAdminSettings());
  if (!config.dedicationEnabled) notFound();

  const data = await getDedicationProfile();
  return <DedicationView data={data} />;
}
