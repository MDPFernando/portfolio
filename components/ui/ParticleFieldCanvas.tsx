"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Particles holds the buffer attributes for 2500 elements and performs
 * real-time vertex displacement in the useFrame loop based on mouse repulsion.
 */
function Particles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 2500;
  const { viewport } = useThree();

  // Create cached particles data once
  const { positions, basePositions } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Scatter points across screen coordinates
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 12;
      const z = (Math.random() - 0.5) * 6;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;
    }

    return { positions: pos, basePositions: base };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!posAttr) return;

    // Convert mouse to viewport coords
    const pointerX = state.pointer.x * (viewport.width / 2);
    const pointerY = state.pointer.y * (viewport.height / 2);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // Organic sinusoidal drift
      const time = state.clock.getElapsedTime();
      const driftX = Math.sin(time * 0.15 + i) * 0.001;
      const driftY = Math.cos(time * 0.2 + i) * 0.001;

      basePositions[i3] += driftX;
      basePositions[i3 + 1] += driftY;

      // Mouse repulsion vector
      const dx = x - pointerX;
      const dy = y - pointerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulseRadius = 2.5;

      if (dist < repulseRadius && dist > 0.01) {
        // Push force increases when mouse is closer
        const force = (repulseRadius - dist) / repulseRadius;
        const pushX = (dx / dist) * force * 0.18;
        const pushY = (dy / dist) * force * 0.18;

        x += pushX;
        y += pushY;
      } else {
        // Elastic recovery back to origin coordinates
        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        x += (bx - x) * 0.04;
        y += (by - y) * 0.04;
      }

      // Smooth depth adjustment
      const bz = basePositions[i3 + 2];
      z += (bz - z) * 0.04;

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#06B6D4" /* Accent cyan */
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleFieldCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <Particles />
      </Canvas>
    </div>
  );
}
