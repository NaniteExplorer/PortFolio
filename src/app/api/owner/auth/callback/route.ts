import { NextResponse } from "next/server";
import { OWNER_SESSION_COOKIE, profileSyncConfig } from "@/data/profile-sync";
import {
  createOwnerSessionToken,
  isAllowedOwnerEmail,
  ownerSessionCookieOptions,
} from "@/lib/owner-auth";
import { OWNER_OAUTH_STATE_COOKIE, appOrigin } from "@/lib/owner-oauth";

interface GoogleTokenResponse {
  access_token?: string;
}

interface GoogleUserInfo {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

function ownerRedirect(req: Request, status?: string) {
  const url = new URL("/owner", appOrigin(req));
  if (status) url.searchParams.set("status", status);
  return url;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = req.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${OWNER_OAUTH_STATE_COOKIE}=`))
    ?.split("=")[1];

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.redirect(ownerRedirect(req, "invalid_oauth_state"));
  }

  const clientId = process.env[profileSyncConfig.owner.clientIdEnv];
  const clientSecret = process.env[profileSyncConfig.owner.clientSecretEnv];
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(ownerRedirect(req, "auth_not_configured"));
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${appOrigin(req)}/api/owner/auth/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokenBody = (await tokenRes.json()) as GoogleTokenResponse;
    if (!tokenRes.ok || !tokenBody.access_token) {
      return NextResponse.redirect(ownerRedirect(req, "token_exchange_failed"));
    }

    const userRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenBody.access_token}` },
    });
    const user = (await userRes.json()) as GoogleUserInfo;
    const ownerEmail = user.email;
    if (!userRes.ok || !user.email_verified || !ownerEmail || !isAllowedOwnerEmail(ownerEmail)) {
      return NextResponse.redirect(ownerRedirect(req, "not_owner"));
    }

    const exp =
      Math.floor(Date.now() / 1000) + profileSyncConfig.owner.sessionMaxAgeSeconds;
    const sessionToken = createOwnerSessionToken({
      email: ownerEmail,
      name: user.name,
      picture: user.picture,
      exp,
    });

    const res = NextResponse.redirect(ownerRedirect(req, "signed_in"));
    res.cookies.set(OWNER_SESSION_COOKIE, sessionToken, ownerSessionCookieOptions());
    res.cookies.delete(OWNER_OAUTH_STATE_COOKIE);
    return res;
  } catch {
    return NextResponse.redirect(ownerRedirect(req, "auth_failed"));
  }
}
