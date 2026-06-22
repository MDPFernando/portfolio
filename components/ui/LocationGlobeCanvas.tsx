"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Globe represents a rotating grid sphere. Includes a beacon line and a
 * glowing mesh sphere positioned at Sri Lanka's geo-coordinates.
 */
function Globe() {
  const groupRef = useRef<THREE.Group>(null);

  // Sri Lanka coordinates: lat 7.87, lon 80.77. Map onto sphere of radius R = 2
  const { pinPos, beaconPos } = useMemo(() => {
    const r = 2.0;
    const lat = 7.87;
    const lon = 80.77;

    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(r * Math.sin(phi) * Math.sin(theta));
    const y = r * Math.cos(phi);
    const z = r * Math.sin(phi) * Math.cos(theta);

    return {
      pinPos: new THREE.Vector3(x, y, z),
      beaconPos: new THREE.Vector3(x * 1.4, y * 1.4, z * 1.4),
    };
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation on Y axis
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe sphere */}
      <mesh>
        <sphereGeometry args={[2, 24, 24]} />
        <meshBasicMaterial
          color="#7C3AED" // Violet
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Latitudinal and Longitudinal rings to look futuristic */}
      <mesh>
        <sphereGeometry args={[1.99, 8, 8]} />
        <meshBasicMaterial
          color="#06B6D4" // Cyan
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Inner solid sphere to block backface grids */}
      <mesh>
        <sphereGeometry args={[1.97, 32, 32]} />
        <meshBasicMaterial color="#050510" transparent opacity={0.6} />
      </mesh>

      {/* Location Pin */}
      <mesh position={pinPos}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#06B6D4" />
      </mesh>

      {/* Outer Pulse ring around Pin */}
      <mesh position={pinPos}>
        <ringGeometry args={[0.1, 0.15, 16]} />
        <meshBasicMaterial color="#06B6D4" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      {/* Beacon Light Line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([
              pinPos.x, pinPos.y, pinPos.z,
              beaconPos.x, beaconPos.y, beaconPos.z
            ]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#06B6D4" linewidth={2} transparent opacity={0.8} />
      </line>
    </group>
  );
}

export default function LocationGlobeCanvas() {
  return (
    <div className="w-full h-full min-h-[260px] md:min-h-[320px] relative">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.5} />
        <Globe />
      </Canvas>
    </div>
  );
}
