"use client";

import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GlassCard renders a glassmorphic container with custom backdrop filters.
 * It tracks mouse movement to dynamically project an iridescent hover highlight
 * and glowing border spotlight following the cursor coordinates.
 */
export default function GlassCard({ children, className = "" }: GlassCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card p-6 backdrop-blur-2xl transition-all duration-500 hover:border-accent-cyan/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] ${className}`}
    >
      {/* Iridescent shimmer spot */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              300px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 0.12),
              rgba(124, 58, 237, 0.06) 40%,
              transparent 80%
            )
          `,
        }}
      />
      {/* Subtle border glow spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl border border-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              100px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 0.35),
              transparent 70%
            )
          `,
          WebkitMaskImage: "linear-gradient(white, white)",
          maskImage: "linear-gradient(white, white)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
