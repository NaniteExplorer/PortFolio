import { NextResponse } from "next/server";
import { getDevProfile } from "@/lib/dev-live";

/**
 * Live numbers for the About section's stat band:
 *  - `repos`         → public repo count of the personal GitHub account
 *  - `contributions` → total contributions (trailing year) across all accounts
 *
 * Both come from the cached dev-profile aggregation. When GitHub can't be
 * reached (no token configured / API error) the values come back as 0 and the
 * About section falls back to the static numbers in `data/about.ts`.
 */
export async function GET() {
  try {
    const profile = await getDevProfile();
    const personal =
      profile.accounts.find((a) => a.kind === "Personal" && a.ok) ??
      profile.accounts.find((a) => a.ok) ??
      profile.accounts[0];

    return NextResponse.json({
      repos: personal?.publicRepos ?? 0,
      contributions: profile.totals.contributions ?? 0,
      ok: profile.liveCount > 0,
    });
  } catch {
    return NextResponse.json({ repos: 0, contributions: 0, ok: false });
  }
}
