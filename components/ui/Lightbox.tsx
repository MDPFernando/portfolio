"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LightboxProps {
  src: string | null;
  alt: string;
  onClose: () => void;
}

/**
 * Lightbox provides a full-viewport modal overlay for viewing images,
 * featuring smooth animations and escape-key close triggers.
 */
export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!src) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-space-950/95 backdrop-blur-lg p-4 cursor-zoom-out"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-text-muted hover:text-text-primary p-2 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md transition-colors"
          aria-label="Close image viewer"
        >
          <X className="w-6 h-6" />
        </button>
        <motion.img
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain border border-surface-border cursor-default"
          onClick={(e) => e.stopPropagation()}
        />
      </motion.div>
    </AnimatePresence>
  );
}
