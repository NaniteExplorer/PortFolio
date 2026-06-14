import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig } from "@/data/config";
import { buildMetadata } from "@/lib/seo";
import { getDedicationProfile } from "@/lib/dedication";
import { DedicationView } from "@/components/dedication/DedicationView";

export const metadata: Metadata = buildMetadata({
  title: "Dedication Graph",
  description:
    "A unified dedication dashboard combining GitHub contributions, professional work, and competitive programming activity over time.",
  path: "/dedication",
});

export const revalidate = 43200;

export default async function DedicationPage() {
  if (!siteConfig.dedicationEnabled) notFound();

  const data = await getDedicationProfile();
  return <DedicationView data={data} />;
}
