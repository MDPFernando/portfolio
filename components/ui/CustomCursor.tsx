"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CustomCursor component renders a glowing dot that matches the mouse position
 * exactly, paired with a larger trailing ring that tracks the mouse with a spring
 * animation. It expands and changes color when hovering over interactive elements.
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "hover" | "click">("default");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 35, stiffness: 350, mass: 0.5 };
  const cursorRingX = useSpring(cursorX, springConfig);
  const cursorRingY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only show custom cursor on desktop screens (with fine pointers)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.body.classList.add("custom-cursor-active");

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("data-cursor") === "hover";

      if (isInteractive) {
        setCursorType("hover");
      } else {
        setCursorType("default");
      }
    };

    const handleMouseDown = () => setCursorType("click");
    const handleMouseUp = () => setCursorType("default");

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-accent-cyan rounded-full pointer-events-none z-[9999] mix-blend-screen -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
        style={{ x: cursorX, y: cursorY }}
      />
      {/* Trailing Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 border pointer-events-none"
        style={{ x: cursorRingX, y: cursorRingY }}
        animate={{
          width: cursorType === "hover" ? 44 : cursorType === "click" ? 22 : 28,
          height: cursorType === "hover" ? 44 : cursorType === "click" ? 22 : 28,
          borderColor: cursorType === "hover" ? "rgba(6, 182, 212, 0.8)" : "rgba(124, 58, 237, 0.5)",
          backgroundColor: cursorType === "hover" ? "rgba(6, 182, 212, 0.08)" : "rgba(124, 58, 237, 0)",
          boxShadow: cursorType === "hover" ? "0 0 15px rgba(6, 182, 212, 0.2)" : "0 0 0px rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      />
    </>
  );
}
