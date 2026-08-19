"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";
import { HeartMesh } from "./HeartMesh";
import { ParticleField } from "./ParticleField";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export default function HeroCanvas() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} color="#4a3a66" />
        <pointLight position={[3, 3, 4]} intensity={70} color="#ffffff" />
        <pointLight position={[-4.5, -2, 2.5]} intensity={80} color="#00f2fe" />
        <pointLight position={[0.5, -3.5, -2]} intensity={60} color="#ff2a5f" />
        <spotLight
          position={[0, 5, 3]}
          angle={0.5}
          penumbra={1}
          intensity={40}
          color="#ffe4ec"
        />

        <HeartMesh reducedMotion={reducedMotion} />
        <ParticleField reducedMotion={reducedMotion} />

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            mipmapBlur
            luminanceThreshold={0.18}
            luminanceSmoothing={0.4}
            intensity={1.4}
            radius={0.85}
          />
          <Noise opacity={0.015} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
