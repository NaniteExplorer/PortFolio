"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCw } from "lucide-react";
import type { ProfileSyncTarget } from "@/data/profile-sync";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "portfolio.profileSyncToken";

type RefreshState = "idle" | "refreshing" | "success" | "error";

const LABELS: Record<ProfileSyncTarget, string> = {
  dev: "dev",
  competitive: "CP",
};

export function ProfileRefreshButton({
  target,
  alwaysVisible = false,
}: {
  target: ProfileSyncTarget;
  alwaysVisible?: boolean;
}) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [hasOwnerSession, setHasOwnerSession] = useState(false);
  const [state, setState] = useState<RefreshState>("idle");
  const [message, setMessage] = useState("Refresh live data");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ownerMode = params.get("owner") === "1";
    const storedToken = window.localStorage.getItem(STORAGE_KEY);

    if (storedToken) setToken(storedToken);
    setVisible(alwaysVisible || ownerMode || !!storedToken);

    fetch("/api/owner/session")
      .then((res) => res.json())
      .then((body: { authenticated?: boolean }) => {
        if (body.authenticated) {
          setHasOwnerSession(true);
          setVisible(true);
        }
      })
      .catch(() => undefined);
  }, [alwaysVisible]);

  useEffect(() => {
    if (state !== "success" && state !== "error") return;
    const id = window.setTimeout(() => {
      setState("idle");
      setMessage("Refresh live data");
    }, 3500);
    return () => window.clearTimeout(id);
  }, [state]);

  if (!visible) return null;

  async function refreshProfile() {
    let activeToken = token ?? window.localStorage.getItem(STORAGE_KEY);
    if (!activeToken && !hasOwnerSession) {
      activeToken = window.prompt("Enter your owner sync token");
      if (!activeToken) return;
      window.localStorage.setItem(STORAGE_KEY, activeToken);
      setToken(activeToken);
    }

    setState("refreshing");
    setMessage(`Refreshing ${LABELS[target]} data`);

    try {
      const res = await fetch("/api/profile-sync/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {}),
        },
        credentials: "same-origin",
        body: JSON.stringify({ target }),
      });
      const body = (await res.json().catch(() => null)) as { error?: string } | null;

      if (!res.ok) {
        if (res.status === 401) {
          if (activeToken) {
            window.localStorage.removeItem(STORAGE_KEY);
            setToken(null);
          }
          window.location.href = "/owner?status=session_expired";
          return;
        }
        throw new Error(body?.error ?? "Refresh failed.");
      }

      setState("success");
      setMessage(`${LABELS[target]} data refreshed`);
      router.refresh();
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Refresh failed.");
    }
  }

  const isRefreshing = state === "refreshing";
  const isSuccess = state === "success";
  const isError = state === "error";

  return (
    <button
      type="button"
      onClick={refreshProfile}
      disabled={isRefreshing}
      title={message}
      aria-label={`Refresh ${LABELS[target]} profile data`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-70",
        isError
          ? "border-rose-500/40 bg-rose-500/10 text-rose-300"
          : isSuccess
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
            : "border-accent/30 bg-accent/10 text-accent hover:border-accent/60 hover:bg-accent/15"
      )}
    >
      {isSuccess ? (
        <Check size={13} />
      ) : (
        <RefreshCw size={13} className={isRefreshing ? "animate-spin" : ""} />
      )}
      <span>{isRefreshing ? "Refreshing" : isSuccess ? "Refreshed" : "Refresh"}</span>
    </button>
  );
}
