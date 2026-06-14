"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

/** Lightweight accent ring shown while the Three.js scene chunk loads. */
function CssFallback() {
  return (
    <div className="h-full w-full animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
  );
}

/**
 * Lazy, client-only Three.js loading scene. ssr:false keeps three.js out of the
 * server bundle; the CSS ring shows for the brief moment before the chunk
 * arrives.
 */
const LoaderScene = dynamic(() => import("@/components/three/LoaderScene"), {
  ssr: false,
  loading: () => <CssFallback />,
});

const SIZES = {
  sm: "h-14 w-14",
  md: "h-24 w-24",
  lg: "h-36 w-36",
} as const;

interface Loader3DProps {
  /** Visual size of the canvas. Defaults to "md". */
  size?: keyof typeof SIZES;
  /** Optional caption shown beneath the loader, e.g. "Loading…". */
  label?: string;
  className?: string;
}

/**
 * The portfolio's universal loading indicator: a pulsing wireframe torus-knot
 * rendered with Three.js, matching the hero's 3D motif. Use it as an overlay
 * (see SmartImage) or standalone on route-level loading screens.
 */
export function Loader3D({ size = "md", label, className }: Loader3DProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      role="status"
      aria-label={label || "Loading"}
    >
      <div className={SIZES[size]}>
        <LoaderScene />
      </div>
      {label && (
        <p className="animate-pulse text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          {label}
        </p>
      )}
    </div>
  );
}
