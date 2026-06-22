"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Navigation provides a sticky glass header menu that detects scroll depth to transition
 * background opacity, featuring a mobile responsive foldout drawer.
 */
export default function Navigation({ logoUrl }: { logoUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "GitHub", href: "#github" },
    { name: "Experience", href: "#experience" },
    { name: "Certificates", href: "#certificates" },
    { name: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[990] transition-all duration-300 ${
          scrolled
            ? "bg-space-950/80 border-b border-surface-border backdrop-blur-md py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo Name */}
          <a
            href="#"
            onClick={(e) => handleLinkClick(e, "#")}
            className="flex items-center"
          >
            <img 
              src={logoUrl || "/logo.png"} 
              alt="Dineth Prashansa Logo" 
              className="h-20 w-auto object-contain hover:scale-110 transition-transform duration-300" 
              style={{ filter: "drop-shadow(0px 4px 6px rgba(0, 212, 255, 0.4)) drop-shadow(0px 0px 15px rgba(0, 212, 255, 0.2))" }}
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-text-muted">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="hover:text-white transition-colors relative py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Call to action trigger */}
          <div className="hidden lg:block">
            <MagneticButton>
              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, "#contact")}
                className="inline-flex items-center gap-1.5 bg-accent-violet hover:bg-accent-violet/90 text-white font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-colors border border-accent-violet/20"
              >
                <span>Hire Node</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </MagneticButton>
          </div>

          {/* Mobile Menu Burger Icon */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-text-primary hover:text-accent-cyan p-1 bg-white/5 border border-surface-border rounded-lg"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 pt-24 pb-8 px-4 bg-space-950/98 border-b border-surface-border backdrop-blur-xl z-[980] flex flex-col items-center gap-6 shadow-2xl lg:hidden"
          >
            <nav className="flex flex-col items-center gap-5 font-mono text-sm uppercase tracking-widest text-text-muted">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="hover:text-white transition-colors py-1"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, "#contact")}
              className="inline-flex items-center justify-center w-full gap-1.5 bg-accent-violet hover:bg-accent-violet/90 text-white font-mono text-xs uppercase tracking-wider py-3.5 rounded-lg transition-colors border border-accent-violet/20"
            >
              <span>Establish Connection</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
