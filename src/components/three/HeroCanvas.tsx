"use client";

import dynamic from "next/dynamic";

/**
 * Lazy, client-only loader for the Three.js hero scene. Using ssr:false keeps
 * three.js out of the server bundle and prevents it from blocking first paint;
 * a soft gradient placeholder shows while the canvas loads.
 */
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-full bg-accent/5 blur-3xl" />
  ),
});

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-0" aria-hidden>
      <HeroScene />
    </div>
  );
}
