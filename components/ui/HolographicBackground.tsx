"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PointMaterial, Points } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, useTransform, motion } from "framer-motion";

// Cyberpunk particles floating in the background
function CyberParticles() {
  const ref = useRef<THREE.Points>(null);
  
  // Create 1000 random points in a sphere
  const [positions] = useState(() => {
    const p = new Float32Array(1000 * 3);
    for (let i = 0; i < 1000; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 * Math.cbrt(Math.random()); // Spread radius
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 30;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

// Glowing wireframe geometric shape
function HolographicShape({ position, rotationSpeed, type }: { position: [number, number, number], rotationSpeed: number, type: "icosahedron" | "torus" | "octahedron" }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed;
      meshRef.current.rotation.y += delta * (rotationSpeed * 1.5);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh ref={meshRef}>
        {type === "icosahedron" && <icosahedronGeometry args={[1.5, 0]} />}
        {type === "torus" && <torusGeometry args={[1.2, 0.4, 16, 100]} />}
        {type === "octahedron" && <octahedronGeometry args={[1.5, 0]} />}
        <meshBasicMaterial
          color="#7c3aed"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

export default function HolographicBackground() {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  // Fade in the background between 200px and 800px scroll depth
  // This ensures it only appears *after* the Hero section
  const opacity = useTransform(scrollY, [200, 800], [0, 1]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      style={{ opacity }}
      className="fixed inset-0 z-0 pointer-events-none"
    >
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        
        {/* Background Particles */}
        <CyberParticles />

        {/* Floating Holographic Shapes */}
        <HolographicShape position={[-8, 4, -5]} rotationSpeed={0.2} type="icosahedron" />
        <HolographicShape position={[8, -5, -8]} rotationSpeed={0.15} type="torus" />
        <HolographicShape position={[-6, -6, -10]} rotationSpeed={0.25} type="octahedron" />
        <HolographicShape position={[7, 6, -12]} rotationSpeed={0.1} type="icosahedron" />
      </Canvas>
    </motion.div>
  );
}
