"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Calendar, Briefcase, GraduationCap, MapPin } from "lucide-react";
import { ExperienceData } from "@/lib/mockData";

interface ExperienceProps {
  experience: ExperienceData[];
}

/**
 * TimelineCard renders an individual card on either the left or right side of the
 * central axis, using intersection observers to fade in.
 */
function TimelineCard({
  item,
  index,
  isLeft,
}: {
  item: ExperienceData;
  index: number;
  isLeft: boolean;
}) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-100px" });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const isWork = item.type === "work";

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col md:flex-row items-center w-full my-8 ${
        isLeft ? "md:justify-start" : "md:justify-end"
      }`}
    >
      {/* Connector Pin on central line */}
      <div className="absolute left-4 md:left-1/2 -translate-x-[9px] w-[18px] h-[18px] rounded-full bg-space-950 border-2 border-accent-cyan z-20 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-accent-violet animate-pulse" />
      </div>

      {/* Card Wrapper */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        className={`w-[calc(100%-40px)] ml-10 md:ml-0 md:w-[calc(50%-35px)]`}
      >
        <GlassCard className="relative p-6 border border-surface-border hover:border-accent-violet/30 transition-all">
          {/* Card header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="inline-flex items-center gap-1 bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9px] font-mono text-accent-cyan uppercase tracking-widest">
                {isWork ? (
                  <>
                    <Briefcase className="w-3 h-3 text-accent-cyan" />
                    <span>Work</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3 h-3 text-accent-amber" />
                    <span>Education</span>
                  </>
                )}
              </span>
              <h3 className="text-base font-extrabold text-white font-heading mt-2">
                {item.title}
              </h3>
              <p className="text-xs text-accent-violet font-semibold font-mono mt-0.5">
                {item.organization}
              </p>
            </div>

            {/* Date */}
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {formatDate(item.start_date)} - {formatDate(item.end_date || "")}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-text-muted text-xs leading-relaxed mb-4 font-sans font-normal">
            {item.description}
          </p>

          {/* Footer tags */}
          <div className="flex flex-wrap gap-1.5 border-t border-surface-border pt-4 mt-4">
            <div className="flex items-center gap-1 text-[10px] text-text-muted font-mono mr-2">
              <MapPin className="w-3 h-3 text-accent-cyan" />
              <span>{item.location}</span>
            </div>

            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-mono bg-white/5 px-2 py-0.5 rounded text-text-muted border border-white/5"
              >
                {tag}
              </span>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}

/**
 * Experience Timeline displays alternating cards along a central vector line
 * that expands dynamically based on scrolling progress.
 */
export default function Experience({ experience }: ExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track page scroll to scale the vertical timeline axis line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Sort experience chronologically (newest first)
  const sortedExperience = [...experience].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <section
      id="experience"
      ref={containerRef}
      className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 relative overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-accent-cyan/5 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      {/* Section Header */}
      <div className="mb-16 text-center md:text-left">
        <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
          {"// 05. HISTORICAL"}
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase">
          Experience & Education
        </h2>
      </div>

      {/* Timeline Wrapper */}
      <div className="relative w-full max-w-5xl mx-auto mt-12">
        {/* Central Axis Guide Line */}
        <div className="absolute left-4 md:left-1/2 -translate-x-[1px] top-2 bottom-2 w-[2px] bg-white/[0.04] z-0" />

        {/* Animated Active Line overlay */}
        <motion.div
          style={{ scaleY, originY: 0 }}
          className="absolute left-4 md:left-1/2 -translate-x-[1px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-accent-cyan via-accent-violet to-accent-amber z-10"
        />

        {/* Timeline items map */}
        <div className="flex flex-col relative z-20">
          {sortedExperience.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <TimelineCard
                key={item.id}
                item={item}
                index={index}
                isLeft={isLeft}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
