"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, Eye, ExternalLink, Calendar, Bookmark } from "lucide-react";
import Lightbox from "@/components/ui/Lightbox";
import GlassCard from "@/components/ui/GlassCard";
import { CertificateData } from "@/lib/mockData";

interface CertificatesProps {
  certificates: CertificateData[];
}

/**
 * Certificates section lists certification cards, offers lightbox expansions,
 * and hosts the "Wall of Fame" rotation alignment toggle.
 */
export default function Certificates({ certificates }: CertificatesProps) {
  const [viewMode, setViewMode] = useState<"grid" | "wall">("grid");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxAlt, setLightboxAlt] = useState<string>("");

  // Extract unique categories
  const categories = useMemo(() => {
    const list = new Set(certificates.map((c) => c.category));
    return ["All", ...Array.from(list)];
  }, [certificates]);

  // Filter lists
  const filteredCertificates = useMemo(() => {
    return certificates.filter((cert) => {
      if (activeCategory === "All") return true;
      return cert.category === activeCategory;
    });
  }, [certificates, activeCategory]);

  // Generate random rotations for Wall of Fame once based on certificate title hash
  const rotatedStyles = useMemo(() => {
    return certificates.reduce((acc, cert) => {
      const charSum = cert.title.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
      const angle = (charSum % 7) - 3; // -3deg to +3deg
      acc[cert.id] = angle;
      return acc;
    }, {} as Record<string, number>);
  }, [certificates]);

  const handleOpenLightbox = (imageUrl: string, title: string) => {
    setLightboxImage(imageUrl);
    setLightboxAlt(title);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  return (
    <section id="certificates" className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 relative">
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-accent-amber/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
            {"// 06. CREDENTIALS"}
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase">
            Certificates
          </h2>
        </div>

        {/* View Mode and Toggles */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1.5 bg-white/[0.02] border border-surface-border p-1 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-md transition-all ${
                  activeCategory === cat
                    ? "bg-accent-cyan/15 text-accent-cyan"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex bg-white/[0.02] border border-surface-border p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider ${
                viewMode === "grid" ? "bg-white/10 text-white" : "text-text-muted hover:text-white"
              }`}
              aria-label="Grid layout"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("wall")}
              className={`p-1.5 rounded-md transition-all flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider ${
                viewMode === "wall" ? "bg-white/10 text-white" : "text-text-muted hover:text-white"
              }`}
              aria-label="Wall layout"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wall of Fame</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <motion.div layout className="relative">
        <AnimatePresence mode="popLayout">
          {viewMode === "grid" ? (
            /* STANDARD GRID MODE */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredCertificates.map((cert) => (
                <GlassCard
                  key={cert.id}
                  className="flex flex-col h-full border border-surface-border hover:border-accent-amber/30 transition-all p-5"
                >
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black mb-4 group border border-white/5">
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                    <div
                      onClick={() => handleOpenLightbox(cert.image_url, cert.title)}
                      className="absolute inset-0 bg-space-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300 cursor-pointer"
                    >
                      <Eye className="w-5 h-5 text-accent-cyan" />
                      <span className="font-mono text-xs text-white">Inspect Node</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-accent-amber uppercase tracking-wider">
                        {cert.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5 leading-snug">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-1 font-semibold">{cert.issuer}</p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-border">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(cert.issue_date)}</span>
                      </div>
                      {cert.verify_url && (
                        <a
                          href={cert.verify_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[10px] font-mono text-accent-cyan hover:underline"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          ) : (
            /* WALL OF FAME (CORKBOARD INTERACTIVE ROTATED PAPERS) */
            <motion.div
              key="wall"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap justify-center gap-8 py-10 bg-white/[0.01] border border-surface-border rounded-2xl p-6 md:p-12 relative"
            >
              {filteredCertificates.map((cert) => {
                const rotation = rotatedStyles[cert.id] || 0;
                return (
                  <motion.div
                    key={cert.id}
                    className="relative w-64 z-20"
                    style={{ rotate: `${rotation}deg` }}
                    whileHover={{
                      rotate: 0,
                      scale: 1.05,
                      zIndex: 40,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="bg-zinc-900 border border-zinc-700/80 p-3 shadow-[5px_10px_20px_rgba(0,0,0,0.5)] rounded-sm flex flex-col justify-between">
                      {/* Thumbtack pin decoration */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600/80 border border-red-800 shadow-md flex items-center justify-center z-30">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      </div>

                      <div className="relative aspect-video w-full overflow-hidden bg-black mb-3 border border-zinc-800">
                        <img
                          src={cert.image_url}
                          alt={cert.title}
                          className="w-full h-full object-cover"
                        />
                        <div
                          onClick={() => handleOpenLightbox(cert.image_url, cert.title)}
                          className="absolute inset-0 bg-space-950/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity duration-200"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="text-[10px] font-sans">
                        <p className="text-zinc-400 font-bold leading-tight truncate">
                          {cert.title}
                        </p>
                        <div className="flex items-center justify-between text-[8px] text-zinc-500 mt-2 font-mono">
                          <span>{cert.issuer}</span>
                          {cert.verify_url && (
                            <a
                              href={cert.verify_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-accent-cyan hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Verify</span>
                              <ExternalLink className="w-2 h-2" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox inspection */}
      <Lightbox
        src={lightboxImage}
        alt={lightboxAlt}
        onClose={() => setLightboxImage(null)}
      />
    </section>
  );
}
