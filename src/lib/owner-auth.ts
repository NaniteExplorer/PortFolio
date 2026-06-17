import "server-only";

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { OWNER_SESSION_COOKIE, profileSyncConfig } from "@/data/profile-sync";

const DEFAULT_OWNER_EMAILS = ["debasishrana1452003@gmail.com"];

export interface OwnerSession {
  email: string;
  name?: string;
  picture?: string;
  exp: number;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function sessionSecret() {
  return process.env[profileSyncConfig.owner.sessionSecretEnv] ?? process.env.SYNC_REFRESH_TOKEN;
}

function sign(payload: string, secret: string) {
  return base64url(createHmac("sha256", secret).update(payload).digest());
}

export function configuredOwnerEmails() {
  const configured = (process.env[profileSyncConfig.owner.emailsEnv] ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return configured.length ? configured : DEFAULT_OWNER_EMAILS;
}

export function isAllowedOwnerEmail(email?: string | null) {
  if (!email) return false;
  return configuredOwnerEmails().includes(email.toLowerCase());
}

export function createOwnerSessionToken(session: OwnerSession) {
  const secret = sessionSecret();
  if (!secret) throw new Error("Owner session secret is not configured.");

  const payload = base64url(JSON.stringify(session));
  return `${payload}.${sign(payload, secret)}`;
}

export function readOwnerSessionToken(token?: string): OwnerSession | null {
  const secret = sessionSecret();
  if (!secret || !token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload, secret);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(decodeBase64url(payload)) as OwnerSession;
    if (!session.email || !session.exp || session.exp < Math.floor(Date.now() / 1000)) return null;
    if (!isAllowedOwnerEmail(session.email)) return null;
    return session;
  } catch {
    return null;
  }
}

export function getOwnerSession() {
  return readOwnerSessionToken(cookies().get(OWNER_SESSION_COOKIE)?.value);
}

export function ownerSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: profileSyncConfig.owner.sessionMaxAgeSeconds,
  };
}
