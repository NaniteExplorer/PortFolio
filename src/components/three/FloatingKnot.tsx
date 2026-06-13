"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * A slowly morphing, floating torus knot — the focal 3D accent in the hero.
 * Wrapped in <Float> for organic drift; MeshDistortMaterial gives it a living,
 * liquid-metal surface.
 */
export function FloatingKnot() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={1.6}>
        <torusKnotGeometry args={[1, 0.32, 180, 32]} />
        <MeshDistortMaterial
          color="#ff004f"
          emissive="#5b0a23"
          roughness={0.18}
          metalness={0.85}
          distort={0.32}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}
