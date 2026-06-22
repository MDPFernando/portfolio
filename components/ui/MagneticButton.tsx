"use client";

import React from "react";
import { motion } from "framer-motion";
import { useMagneticButton } from "@/hooks/useMagneticButton";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * MagneticButton wraps any interactive node to apply a soft spring pull
 * that draws the item closer to the cursor during near-hover states.
 */
export default function MagneticButton({ children, className = "" }: MagneticButtonProps) {
  const { ref, position } = useMagneticButton();

  return (
    <motion.div
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 180, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
