"use client";

import dynamic from "next/dynamic";

// Dynamically import the ParticleFieldCanvas client component with SSR disabled
const ParticleFieldCanvas = dynamic(
  () => import("./ParticleFieldCanvas"),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-space-950/20" />,
  }
);

/**
 * ParticleField acts as a boundary component that only mounts Three.js elements
 * in browser environments, optimizing bundle distribution.
 */
export default function ParticleField() {
  return <ParticleFieldCanvas />;
}
