"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid, List, Github, ExternalLink, Star, ChevronLeft, ChevronRight, X, ArrowUpRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import { ProjectData } from "@/lib/mockData";

interface ProjectsProps {
  projects: ProjectData[];
}

/**
 * Projects section allows browsing projects, filtering by type, toggling layouts,
 * and clicking on a card to open a full modal display.
 */
export default function Projects({ projects }: ProjectsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilter, setActiveFilter] = useState<"all" | ProjectData["type"]>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  // Carousel index for selected project
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Fetch unique project types
  const filterTypes: Array<"all" | ProjectData["type"]> = ["all", "web", "mobile", "api", "tool"];

  // Filter items
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (activeFilter === "all") return true;
      return project.type === activeFilter;
    });
  }, [projects, activeFilter]);

  const handleNextScreenshot = (e: React.MouseEvent, maxLen: number) => {
    e.stopPropagation();
    setCarouselIndex((prev) => (prev + 1) % maxLen);
  };

  const handlePrevScreenshot = (e: React.MouseEvent, maxLen: number) => {
    e.stopPropagation();
    setCarouselIndex((prev) => (prev - 1 + maxLen) % maxLen);
  };

  return (
    <section id="projects" className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 relative">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-violet/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
          {"// 03. CREATIONS"}
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase">
            Featured Projects
          </h2>
        </div>

        {/* Filters and View Toggles */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Category Filter list */}
          <div className="flex gap-1.5 bg-white/[0.02] border border-surface-border p-1 rounded-lg">
            {filterTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-md transition-all ${
                  activeFilter === type
                    ? "bg-accent-cyan/15 text-accent-cyan"
                    : "text-text-muted hover:text-white"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Toggle buttons */}
          <div className="flex bg-white/[0.02] border border-surface-border p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid" ? "bg-white/10 text-white" : "text-text-muted hover:text-white"
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list" ? "bg-white/10 text-white" : "text-text-muted hover:text-white"
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display Content */}
      <motion.div layout className="relative">
        <AnimatePresence mode="popLayout">
          {viewMode === "grid" ? (
            /* GRID VIEW MODE */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project) => (
                <div key={project.id} onClick={() => { setSelectedProject(project); setCarouselIndex(0); }}>
                  <GlassCard className="h-full flex flex-col cursor-pointer border border-surface-border hover:border-accent-cyan/35 transition-all group">
                    {/* Project Hero Image */}
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4 bg-white/5 border border-white/5">
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                      />
                      {project.is_featured && (
                        <span className="absolute top-3 left-3 bg-accent-violet text-white font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold shadow-md">
                          Featured
                        </span>
                      )}
                      <span className="absolute top-3 right-3 bg-space-950/80 text-accent-cyan font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-accent-cyan/25 backdrop-blur-sm">
                        {project.type}
                      </span>
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-emerald-500/90 hover:bg-emerald-500 text-white font-mono text-[9px] uppercase tracking-wider px-2.5 py-1.5 rounded-full font-bold backdrop-blur-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105"
                        >
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                          </span>
                          <span>Go Live</span>
                        </a>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors truncate">
                            {project.title}
                          </h3>
                          <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent-cyan transition-colors shrink-0" />
                        </div>
                        <p className="text-text-muted text-xs line-clamp-3 mb-6">
                          {project.short_desc}
                        </p>
                      </div>

                      {/* Stack & Links */}
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.tech_stack.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="text-[9px] font-mono bg-white/5 px-2 py-1 rounded text-text-muted border border-white/5"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.tech_stack.length > 4 && (
                            <span className="text-[9px] font-mono bg-white/5 px-2 py-1 rounded text-accent-cyan font-bold border border-white/5">
                              +{project.tech_stack.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Stars & Details indicators */}
                        <div className="flex items-center justify-between border-t border-surface-border pt-3 mt-auto">
                          <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-mono">
                            <Star className="w-3.5 h-3.5 text-accent-amber" />
                            <span>{project.stars}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-text-muted hover:text-white transition-colors"
                              >
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {project.demo_url && (
                              <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-text-muted hover:text-accent-cyan transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </motion.div>
          ) : (
            /* COMPACT LIST VIEW MODE */
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-surface-card border border-surface-border rounded-xl overflow-hidden backdrop-blur-xl"
            >
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-surface-border text-text-muted uppercase text-[9px] tracking-widest bg-white/[0.01]">
                      <th className="p-4">Title</th>
                      <th className="p-4">Type</th>
                      <th className="p-4 hidden sm:table-cell">Technologies</th>
                      <th className="p-4 text-center">Stars</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => (
                      <tr
                        key={project.id}
                        onClick={() => { setSelectedProject(project); setCarouselIndex(0); }}
                        className="border-b border-surface-border hover:bg-white/[0.02] cursor-pointer transition-colors"
                      >
                        <td className="p-4 font-bold text-white font-heading text-sm font-sans truncate max-w-[150px]">
                          {project.title}
                        </td>
                        <td className="p-4">
                          <span className="text-accent-cyan uppercase text-[10px]">
                            {project.type}
                          </span>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {project.tech_stack.map((tech) => (
                              <span
                                key={tech}
                                className="bg-white/5 border border-white/5 text-text-muted px-2 py-0.5 rounded text-[10px]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <Star className="w-3 h-3 text-accent-amber" />
                            <span>{project.stars}</span>
                          </div>
                        </td>
                        <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center gap-3">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-text-muted hover:text-white transition-colors"
                              >
                                <Github className="w-4 h-4" />
                              </a>
                            )}
                            {project.demo_url && (
                              <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-text-muted hover:text-accent-cyan transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* FULLSCREEN DETAIL MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-space-950/80 backdrop-blur-xl z-[9999] flex items-center justify-center p-4 md:p-8 overflow-y-auto cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-space-950 border border-surface-border w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row cursor-default"
            >
              {/* Left Column: Carousel Screenshots */}
              <div className="md:w-1/2 bg-black flex flex-col justify-center relative aspect-video md:aspect-auto">
                <img
                  src={selectedProject.images[carouselIndex]}
                  alt={`${selectedProject.title} screenshot ${carouselIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Carousel Controls */}
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => handlePrevScreenshot(e, selectedProject.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-space-950/60 p-2 rounded-full border border-surface-border text-white backdrop-blur-sm hover:bg-space-950 transition-colors"
                      aria-label="Previous screenshot"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleNextScreenshot(e, selectedProject.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-space-950/60 p-2 rounded-full border border-surface-border text-white backdrop-blur-sm hover:bg-space-950 transition-colors"
                      aria-label="Next screenshot"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Dot Index indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-space-950/50 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/5">
                  {selectedProject.images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        carouselIndex === i ? "bg-accent-cyan scale-125" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Project details information */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between max-h-[90vh] overflow-y-auto">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[9px] font-mono text-accent-cyan uppercase tracking-widest border border-accent-cyan/20 px-2 py-0.5 rounded bg-accent-cyan/5">
                        {selectedProject.type}
                      </span>
                      <h3 className="text-2xl font-bold font-heading text-white mt-2">
                        {selectedProject.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="text-text-muted hover:text-white bg-white/5 p-1.5 rounded-full border border-surface-border"
                      aria-label="Close details"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4 text-xs md:text-sm text-text-muted leading-relaxed">
                    <p className="font-semibold text-white">OVERVIEW / TRANSMISSION:</p>
                    <p>{selectedProject.long_desc}</p>
                  </div>
                </div>

                <div className="mt-8 border-t border-surface-border pt-6">
                  {/* Tech stack badge block */}
                  <p className="text-[10px] font-mono text-text-muted mb-2 uppercase tracking-widest">
                  {"// Tech Infrastructure"}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {selectedProject.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono bg-white/5 px-2.5 py-1 rounded border border-white/5 text-text-primary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    {selectedProject.github_url && (
                      <a
                        href={selectedProject.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex justify-center items-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-surface-border font-mono text-xs font-semibold transition-all"
                      >
                        <Github className="w-4 h-4" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {selectedProject.demo_url && (
                      <a
                        href={selectedProject.demo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex justify-center items-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"
                      >
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                        <span>Go Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
