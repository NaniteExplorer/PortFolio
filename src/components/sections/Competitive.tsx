import { getLiveCompetitive } from "@/lib/competitive-live";
import { CompetitiveTeaser } from "./CompetitiveTeaser";

/**
 * Server wrapper for the home-page competitive teaser. Fetches the live-merged
 * profile (official Codeforces/LeetCode APIs + CodeChef scrape, cached per
 * REVALIDATE window) and hands it to the presentational client component — so
 * the home snapshot shows the same live numbers as the /competitive page, with
 * `data/competitive.ts` acting only as the fallback when a source is down.
 */
export async function Competitive() {
  const profile = await getLiveCompetitive();
  return <CompetitiveTeaser profile={profile} />;
}
