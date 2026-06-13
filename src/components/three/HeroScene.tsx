"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { ParticleField } from "@/components/three/ParticleField";
import { FloatingKnot } from "@/components/three/FloatingKnot";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * The R3F canvas for the hero. Client-only (loaded via next/dynamic in
 * HeroCanvas) and performance-guarded:
 *  - dpr clamped to [1, 2]
 *  - frameloop paused for reduced-motion users (renders a single static frame)
 */
export default function HeroScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={2} color="#ff004f" />

      <Suspense fallback={null}>
        <ParticleField count={reduced ? 800 : 2500} />
        <FloatingKnot />
        <Environment preset="city" />
      </Suspense>

      {/* Subtle interactivity; no zoom/pan to keep it tasteful. */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.4}
        enableRotate={false}
      />
    </Canvas>
  );
}
