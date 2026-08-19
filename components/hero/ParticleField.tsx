"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePointerRef } from "./usePointerRef";

interface ParticleFieldProps {
  count?: number;
  reducedMotion?: boolean;
}

const LOVE = new THREE.Color("#ff2a5f");
const ENERGY = new THREE.Color("#00f2fe");

const BOUNDS = { x: 5.5, y: 3.4, z: 2.6 };
const REPEL_RADIUS = 1.6;
const REPEL_STRENGTH = 0.9;

/** Procedural soft-round sprite so points render as glowing dust, not squares. */
function createDotTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.6)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

interface ParticleData {
  basePositions: Float32Array;
  phases: Float32Array;
  colors: Float32Array;
  live: Float32Array;
}

function createParticleData(count: number): ParticleData {
  const basePositions = new Float32Array(count * 3);
  const phases = new Float32Array(count * 2);
  const colors = new Float32Array(count * 3);
  const live = new Float32Array(count * 3);
  const tmpColor = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const ix = i * 3;
    const x = (Math.random() * 2 - 1) * BOUNDS.x;
    const y = (Math.random() * 2 - 1) * BOUNDS.y;
    const z = (Math.random() * 2 - 1) * BOUNDS.z;

    basePositions[ix] = x;
    basePositions[ix + 1] = y;
    basePositions[ix + 2] = z;
    live[ix] = x;
    live[ix + 1] = y;
    live[ix + 2] = z;

    phases[i * 2] = Math.random() * Math.PI * 2;
    phases[i * 2 + 1] = 0.15 + Math.random() * 0.35;

    tmpColor.copy(LOVE).lerp(ENERGY, Math.random());
    colors[ix] = tmpColor.r;
    colors[ix + 1] = tmpColor.g;
    colors[ix + 2] = tmpColor.b;
  }

  return { basePositions, phases, colors, live };
}

export function ParticleField({ count = 700, reducedMotion = false }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const pointer = usePointerRef();

  // Created once and never mutated afterward, so it's ordinary render-safe
  // state (unlike `live` below, which is rewritten every frame and so must
  // live in a ref, touched only inside useFrame/useEffect — never read here
  // in the render body).
  const [dotTexture] = useState(createDotTexture);

  const dataRef = useRef<ParticleData | null>(null);
  if (dataRef.current === null) {
    dataRef.current = createParticleData(count);
  }

  // Wire up the position/color buffers imperatively on mount instead of via
  // declarative <bufferAttribute> JSX, so the mutable `live`/`colors` arrays
  // are only ever touched outside of render. useLayoutEffect (not useEffect)
  // so this runs before R3F's own useFrame registration effect, which fires
  // as early as the next animation frame.
  useLayoutEffect(() => {
    const geometry = geometryRef.current;
    const data = dataRef.current;
    if (!geometry || !data) return;
    geometry.setAttribute("position", new THREE.BufferAttribute(data.live, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
  }, []);

  useFrame((three, delta) => {
    const points = pointsRef.current;
    const data = dataRef.current;
    // Guards against the first frame or two, in case this fires before the
    // layout effect above has attached the position/color buffers.
    if (!points || !data || !points.geometry.attributes.position) return;
    const { basePositions, phases, live } = data;

    const t = three.clock.elapsedTime;
    const motionScale = reducedMotion ? 0.15 : 1;

    // Map the pointer's normalized device coords to this scene's world plane
    // (matches the field's spread so repulsion lines up with the visible cursor).
    const pointerWorldX = pointer.current.x * BOUNDS.x * 1.05;
    const pointerWorldY = pointer.current.y * BOUNDS.y * 1.05;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const phaseOffset = phases[i * 2];
      const driftSpeed = phases[i * 2 + 1];

      const driftX = Math.sin(t * driftSpeed + phaseOffset) * 0.35 * motionScale;
      const driftY = Math.cos(t * driftSpeed * 0.8 + phaseOffset) * 0.3 * motionScale;

      let targetX = basePositions[ix] + driftX;
      let targetY = basePositions[ix + 1] + driftY;
      const targetZ = basePositions[ix + 2];

      const dx = targetX - pointerWorldX;
      const dy = targetY - pointerWorldY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS && dist > 0.0001) {
        const force = (1 - dist / REPEL_RADIUS) ** 2 * REPEL_STRENGTH;
        targetX += (dx / dist) * force;
        targetY += (dy / dist) * force;
      }

      const damp = 1 - Math.exp(-delta * 3.2);
      live[ix] += (targetX - live[ix]) * damp;
      live[ix + 1] += (targetY - live[ix + 1]) * damp;
      live[ix + 2] += (targetZ - live[ix + 2]) * damp;
    }

    points.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef} />
      <pointsMaterial
        size={0.065}
        map={dotTexture}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}
