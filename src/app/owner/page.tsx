import type { Metadata } from "next";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { OwnerDashboard } from "@/components/owner/OwnerDashboard";
import { getAdminHealth, getAdminSettings } from "@/lib/admin-settings";
import { getOwnerSession } from "@/lib/owner-auth";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Owner Dashboard",
  description: "Private owner controls for refreshing portfolio profile data.",
  path: "/owner",
});

export default async function OwnerPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const session = getOwnerSession();
  const status = searchParams?.status;
  const settings = session ? await getAdminSettings() : null;
  const health = session ? await getAdminHealth() : null;

  return (
    <div className="container min-h-screen pt-32 pb-24">
      <header className="mb-10 max-w-3xl">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent backdrop-blur">
          <ShieldCheck size={14} />
          Owner Controls
        </div>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Owner Dashboard</h1>
        <p className="mt-4 text-muted">
          Refresh the live profile caches without exposing platform APIs or manual tokens to visitors.
        </p>
      </header>

      {status && <OwnerStatus status={status} />}

      {session && settings && health ? (
        <OwnerDashboard
          owner={{
            email: session.email,
            name: session.name,
            picture: session.picture,
          }}
          initialSettings={settings}
          health={health}
        />
      ) : (
        <Card className="max-w-2xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
          <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/25 bg-accent/10 text-accent">
              <LockKeyhole size={24} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Private Access
              </p>
              <h2 className="mt-2 text-2xl font-bold">Sign in as owner</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Google verifies your email, then the server checks it against the owner allowlist
                before opening refresh controls.
              </p>

              <a
                href="/api/owner/auth/google"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_-12px_rgb(var(--accent))] transition-colors hover:bg-accent-2"
              >
                <KeyRound size={16} />
                Continue with Google
              </a>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function OwnerStatus({ status }: { status: string }) {
  const message =
    status === "signed_in"
      ? "Signed in successfully."
      : status === "session_expired"
        ? "Your owner session expired. Sign in again to refresh profile data."
      : status === "not_owner"
        ? "That Google account is not on the owner allowlist."
        : status === "auth_not_configured"
          ? "Google owner auth is not fully configured."
          : status === "invalid_oauth_state"
            ? "The login session expired. Please try again."
            : status.includes("failed")
              ? "Google sign-in failed. Please try again."
              : null;

  if (!message) return null;

  const isError = status !== "signed_in";
  return (
    <div
      className={`mb-6 max-w-3xl rounded-2xl border p-4 text-sm ${
        isError
          ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
      }`}
    >
      {message}
    </div>
  );
}
