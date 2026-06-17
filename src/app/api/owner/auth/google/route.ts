import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { profileSyncConfig } from "@/data/profile-sync";
import { OWNER_OAUTH_STATE_COOKIE, appOrigin } from "@/lib/owner-oauth";

export async function GET(req: Request) {
  const clientId = process.env[profileSyncConfig.owner.clientIdEnv];
  if (!clientId) {
    return NextResponse.json(
      { ok: false, error: "Google owner auth is not configured." },
      { status: 500 }
    );
  }

  const origin = appOrigin(req);
  const state = randomBytes(24).toString("hex");
  const redirectUri = `${origin}/api/owner/auth/callback`;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "select_account");

  const res = NextResponse.redirect(authUrl);
  res.cookies.set(OWNER_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  return res;
}
