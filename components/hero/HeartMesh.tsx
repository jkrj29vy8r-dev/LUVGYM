"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePointerRef } from "./usePointerRef";

interface HeartMeshProps {
  reducedMotion?: boolean;
}

/** Reference visible-width (world units) the base scale/position were tuned against. */
const REFERENCE_VIEWPORT_WIDTH = 6.4;
const BASE_SCALE = 1.15;
/** Resting height, in world units, that the float bob oscillates around. */
const BASE_Y = 1.18;

/**
 * The classic two-lobe heart outline (see three.js' shape-geometry examples),
 * extruded and beveled into a glossy 3D gem. Coordinates are in the 0..1
 * range with the twin lobes at the top and the point at the bottom, which is
 * already the conventional "right way up" orientation.
 */
function createHeartGeometry() {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;

  shape.moveTo(x + 0.25, y + 0.25);
  shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
  shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
  shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 0.95);
  shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
  shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
  shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.45,
    bevelEnabled: true,
    bevelThickness: 0.09,
    bevelSize: 0.07,
    bevelSegments: 12,
    curveSegments: 32,
    steps: 1,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

export function HeartMesh({ reducedMotion = false }: HeartMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const pointer = usePointerRef();
  const geometry = useMemo(() => createHeartGeometry(), []);

  // Keep the heart's on-screen size roughly consistent across aspect ratios:
  // a narrow/portrait viewport has much less visible world-width at the same
  // camera distance, so without this the heart balloons to fill the screen.
  const viewportWidth = useThree((s) => s.viewport.width);
  const responsiveScale =
    BASE_SCALE * THREE.MathUtils.clamp(viewportWidth / REFERENCE_VIEWPORT_WIDTH, 0.45, 1);

  // Persist current tilt/float state across frames for spring-damped easing.
  const state = useRef({ tiltX: 0, tiltY: 0, floatY: 0 });

  useFrame((three, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = three.clock.elapsedTime;
    const motionScale = reducedMotion ? 0.08 : 1;

    // Idle bob + a gentle back-and-forth sway (never a full spin, so the
    // heart's face never turns away from camera).
    const bob = Math.sin(t * 0.9) * 0.18 * motionScale;
    const idleSway = Math.sin(t * 0.18) * 0.06 * motionScale;

    // Critically-damped approach toward the pointer-driven tilt target
    // ("physics" feel: smooth spring settle rather than an instant snap).
    // Kept small deliberately — this is a reactive tilt, not a turntable.
    const targetTiltY = pointer.current.x * 0.22 * motionScale;
    const targetTiltX = -pointer.current.y * 0.14 * motionScale;
    const dampFactor = 1 - Math.exp(-delta * 4.5);

    state.current.tiltX += (targetTiltX - state.current.tiltX) * dampFactor;
    state.current.tiltY += (targetTiltY - state.current.tiltY) * dampFactor;
    state.current.floatY += (bob - state.current.floatY) * (1 - Math.exp(-delta * 3));

    group.rotation.x = state.current.tiltX;
    group.rotation.y = idleSway + state.current.tiltY;
    group.rotation.z = pointer.current.x * 0.035 * motionScale;
    group.position.y = BASE_Y + state.current.floatY;

    // Gentle emissive pulse layered on top of the bloom glow.
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.55 + Math.sin(t * 1.6) * 0.12 * motionScale;
    }
  });

  return (
    <group ref={groupRef} position={[0, BASE_Y, -0.4]} scale={responsiveScale}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={materialRef}
          color="#ff2a5f"
          emissive="#ff2a5f"
          emissiveIntensity={0.55}
          roughness={0.18}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.12}
          reflectivity={0.6}
          ior={1.45}
          sheen={0.4}
          sheenColor="#00f2fe"
        />
      </mesh>
    </group>
  );
}
