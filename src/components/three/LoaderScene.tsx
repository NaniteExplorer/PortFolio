"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * A pulsing wireframe torus-knot wrapped in a ring of orbiting points — a
 * miniature echo of the hero's FloatingKnot, reused as the universal loading
 * indicator so the wait feels like part of the site rather than a generic
 * spinner. Accent-colored (#ff004f) to match the portfolio's signature.
 */
function Knot() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.7;
    ref.current.rotation.y += delta * 1.0;
    // Gentle breathing pulse.
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.07;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <group ref={ref}>
      <mesh>
        <torusKnotGeometry args={[1, 0.34, 110, 16]} />
        <meshStandardMaterial
          color="#ff004f"
          emissive="#ff004f"
          emissiveIntensity={0.65}
          roughness={0.2}
          metalness={0.85}
          wireframe
        />
      </mesh>
    </group>
  );
}

/** A thin halo of points slowly orbiting the knot for extra depth. */
function OrbitRing({ count = 90 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const r = 1.9 + Math.random() * 0.4;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.5;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        color="#ff004f"
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * Self-contained R3F canvas for the loader. Client-only (loaded via
 * next/dynamic in Loader3D). Performance-guarded: dpr clamped, frameloop paused
 * for reduced-motion users (renders a single static frame).
 */
export default function LoaderScene() {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 4]} intensity={2} color="#ff004f" />
      <pointLight position={[-4, -2, -3]} intensity={1.2} color="#ffffff" />
      <Knot />
      {!reduced && <OrbitRing />}
    </Canvas>
  );
}
