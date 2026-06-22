"use client";

import { ArrowUp, Github, Linkedin, Twitter } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

/**
 * Footer component wraps standard copyright text, floating scroll-to-top,
 * and brand shortcuts.
 */
export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-surface-border bg-space-950/80 backdrop-blur-md relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Brand Copyright */}
        <div className="text-center md:text-left">
          <p className="font-heading font-extrabold uppercase text-white tracking-wider text-sm">
            Dineth Prashansa
          </p>
          <p className="text-[10px] font-mono text-text-muted mt-1">
            &copy; {year} {"// SYSTEM PROTOCOL ACTIVATED. ALL RIGHTS RESERVED."}
          </p>
        </div>

        {/* Center: Social Links */}
        <div className="flex items-center gap-4 text-text-muted">
          <a
            href="https://github.com/MDPFernando"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/dineth-prashansa-77491a37b"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>

        {/* Right Side: Scroll-To-Top button */}
        <div className="flex items-center justify-end">
          <MagneticButton>
            <button
              onClick={handleScrollToTop}
              className="w-10 h-10 bg-white/5 hover:bg-white/10 text-text-primary hover:text-accent-cyan rounded-lg border border-surface-border flex items-center justify-center transition-colors"
              aria-label="Scroll to top of page"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
}
