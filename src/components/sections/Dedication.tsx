import { getDedicationProfile } from "@/lib/dedication";
import { DedicationTeaser } from "@/components/sections/DedicationTeaser";

export async function Dedication() {
  const data = await getDedicationProfile();
  return <DedicationTeaser data={data} />;
}
