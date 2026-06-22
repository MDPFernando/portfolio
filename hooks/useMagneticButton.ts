"use client";

import { useRef, useState, useEffect } from "react";

/**
 * useMagneticButton hook calculates a relative (x, y) offset pointing
 * from the center of the element to the user's cursor when the cursor is
 * close to the element. Used for immersive CTA attractions.
 */
export function useMagneticButton() {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = element.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;

      // Calculate distance between mouse and center
      const distance = Math.sqrt(dx * dx + dy * dy);
      const activeRadius = Math.max(width, height) * 1.5;

      if (distance < activeRadius) {
        // Attract element by 35% of the mouse offset
        setPosition({ x: dx * 0.35, y: dy * 0.35 });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return { ref, position };
}
