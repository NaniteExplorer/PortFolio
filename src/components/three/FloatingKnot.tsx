"use client";

import { useEffect, useRef } from "react";
import { MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * A slowly morphing, floating torus knot — the focal 3D accent in the hero.
 * Wrapped in <Float> for organic drift; MeshDistortMaterial gives it a living,
 * liquid-metal surface.
 */
export function FloatingKnot() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();

    const tick = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(time * 0.0015) * 0.18;
        groupRef.current.rotation.z = Math.sin(time * 0.001) * 0.08;
      }

      if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.15;
        meshRef.current.rotation.y += delta * 0.2;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <group ref={groupRef}>
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
    </group>
  );
}
