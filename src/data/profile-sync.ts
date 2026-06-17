export const PROFILE_SYNC_SECRET_ENV = "SYNC_REFRESH_TOKEN" as const;
export const OWNER_SESSION_COOKIE = "portfolio_owner_session" as const;

export const profileSyncCacheTags = {
  dev: "dev",
  competitive: "competitive",
  dedication: "dedication",
} as const;

export const profileSyncConfig = {
  revalidateSeconds: 60 * 60 * 12,
  owner: {
    clientIdEnv: "GOOGLE_CLIENT_ID",
    clientSecretEnv: "GOOGLE_CLIENT_SECRET",
    emailsEnv: "GOOGLE_OWNER_EMAILS",
    sessionSecretEnv: "OWNER_SESSION_SECRET",
    sessionMaxAgeSeconds: 60 * 60 * 24 * 14,
  },
  targets: {
    dev: {
      label: "Developer Profile",
      tags: [profileSyncCacheTags.dev, profileSyncCacheTags.dedication],
      paths: ["/dev", "/dedication", "/"],
    },
    competitive: {
      label: "Competitive Profile",
      tags: [profileSyncCacheTags.competitive, profileSyncCacheTags.dedication],
      paths: ["/competitive", "/dedication", "/"],
    },
  },
} as const;

export type ProfileSyncTarget = keyof typeof profileSyncConfig.targets;

export const profileSyncTargets = Object.keys(
  profileSyncConfig.targets
) as ProfileSyncTarget[];

export function isProfileSyncTarget(value: unknown): value is ProfileSyncTarget {
  return (
    typeof value === "string" &&
    profileSyncTargets.includes(value as ProfileSyncTarget)
  );
}
