"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import LocationGlobe from "@/components/ui/LocationGlobe";
import { ProfileData } from "@/lib/mockData";

interface AboutProps {
  profile: ProfileData;
}

/**
 * Counter component handles the count-up animation when it becomes
 * visible on the screen.
 */
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 2; // seconds
    const fps = 30;
    const totalFrames = duration * fps;
    const increment = end / totalFrames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      start += increment;
      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / fps);

    return () => clearInterval(timer);
  }, [inView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/**
 * About section compiles bio summaries, count-up achievements,
 * location visualizers, and interests tags.
 */
export default function About({ profile }: AboutProps) {
  const containerRef = useRef(null);
  const isContainerInView = useInView(containerRef, { once: true, margin: "-100px" });

  const stats = [
    { label: "Years Experience", value: 2, suffix: "+" },
    { label: "Projects Completed", value: 15, suffix: "+" },
    { label: "Certificates Earned", value: 10, suffix: "" },
    { label: "GitHub Commits", value: 1480, suffix: "+" },
  ];

  const interests = [
    "Machine Learning",
    "WebGL & 3D Shaders",
    "System Design",
    "Mechanical Keyboards",
    "Astronomy",
    "Sci-Fi Novels",
  ];

  return (
    <section
      id="about"
      ref={containerRef}
      className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-accent-violet/5 rounded-full filter blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center md:text-left">
          <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
            {"// 01. INTROSPECTIVE"}
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase">
            About Me
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Avatar Profile and Globe visual */}
          <div className="lg:col-span-5 flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isContainerInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="relative w-64 h-64 md:w-80 md:h-80 rounded-full p-1 bg-gradient-to-tr from-accent-violet via-accent-cyan to-accent-amber shadow-[0_0_40px_rgba(124,58,237,0.15)]"
            >
              <div className="w-full h-full rounded-full bg-space-950 overflow-hidden relative">
                {/* Profile Picture */}
                <img
                  src={profile.photo_url}
                  alt={profile.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 ease-in-out scale-105 hover:scale-100"
                />
              </div>
            </motion.div>

            {/* Sub 3D Globe with metadata */}
            <div className="w-full max-w-sm bg-surface-card border border-surface-border rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden">
              <div className="w-28 h-28 shrink-0">
                <LocationGlobe />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest">
                  Location Ping
                </p>
                <h4 className="text-sm font-bold text-white mt-1 truncate">{profile.location}</h4>
                <p className="text-xs text-text-muted mt-1 font-mono">{profile.timezone}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">
                    ONLINE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Bio Text and Counters */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isContainerInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 text-text-muted text-sm md:text-base leading-relaxed"
            >
              <h3 className="text-white text-lg md:text-xl font-bold font-heading">
                TRANSMITTING COGNITIVE IDENTITY...
              </h3>
              <p>{profile.bio_long}</p>
            </motion.div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-surface-card border border-surface-border rounded-xl p-4 text-center backdrop-blur-xl"
                >
                  <h4 className="text-2xl md:text-3xl font-extrabold font-heading text-white font-mono">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </h4>
                  <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Interests Pills */}
            <div className="space-y-3">
              <h4 className="text-white font-mono text-xs uppercase tracking-widest">
                {"// Sub-Systems / Interfacing:"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono bg-white/[0.03] border border-surface-border px-3.5 py-1.5 rounded-full text-text-muted hover:text-accent-cyan hover:border-accent-cyan/35 transition-colors duration-300"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
