"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

/**
 * Lazy, client-only loader for the Three.js hero scene. Using ssr:false keeps
 * three.js out of the server bundle and prevents it from blocking first paint.
 */
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <HeroSceneLoader />,
});

export function HeroCanvas({
  density = "balanced",
}: {
  density?: "low" | "balanced" | "high";
}) {
  const [ready, setReady] = useState(false);

  return (
    <div className="absolute inset-0 -z-0" aria-hidden>
      <HeroScene density={density} onReady={() => setReady(true)} />
      <HeroSceneLoader hidden={ready} />
    </div>
  );
}

function HeroSceneLoader({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center bg-bg transition-opacity duration-700",
        hidden ? "pointer-events-none opacity-0" : "opacity-100"
      )}
    >
      <div className="relative flex flex-col items-center gap-5">
        <div className="relative grid h-24 w-24 place-items-center sm:h-28 sm:w-28">
          <span className="absolute inset-0 rounded-full border border-border/80" />
          <span className="absolute inset-2 animate-spin rounded-full border border-accent/20 border-t-accent" />
          <span className="absolute inset-6 rounded-full border border-surface-2" />
          <span className="h-3 w-3 rounded-full bg-accent shadow-[0_0_28px_rgb(var(--accent)/0.6)]" />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Rendering Scene
          </p>
          <p className="mt-2 text-sm text-muted">Preparing the portfolio canvas</p>
        </div>
      </div>
    </div>
  );
}
