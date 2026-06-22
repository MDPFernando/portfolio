"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TechRadar from "@/components/ui/TechRadar";
import { SkillData } from "@/lib/mockData";

interface SkillsProps {
  skills: SkillData[];
}

/**
 * SkillCard renders an individual technology card containing the logo
 * and an animating circular proficiency ring.
 */
function SkillCard({ skill }: { skill: SkillData }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const strokeOffset = circ - (skill.proficiency / 100) * circ;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-surface-card border border-surface-border rounded-xl p-4 flex items-center justify-between backdrop-blur-xl relative group"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl text-accent-cyan group-hover:text-accent-violet transition-colors">
          {/* Load Devicon colored logo */}
          <i className={`devicon-${skill.icon} text-2xl`}></i>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">{skill.name}</h4>
          <p className="text-[10px] text-text-muted font-mono">{skill.category}</p>
        </div>
      </div>

      {/* Circle progress overlay */}
      <div className="relative w-12 h-12">
        <svg className="w-full h-full rotate-[-90deg]">
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.03)"
            strokeWidth="3.5"
          />
          <motion.circle
            cx="24"
            cy="24"
            r={r}
            fill="transparent"
            stroke={skill.radar_placement === "Hold" ? "#64748b" : "#06b6d4"}
            strokeWidth="3.5"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: strokeOffset }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold text-text-primary">
          {skill.proficiency}%
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Skills section renders technological categories, progressive rings,
 * and the main SVG Technology Radar side-by-side.
 */
export default function Skills({ skills }: SkillsProps) {
  const categories: Array<"All" | SkillData["category"]> = [
    "All",
    "Frontend",
    "Backend",
    "Languages",
    "Tools",
    "Learning",
  ];
  const [activeTab, setActiveTab] = useState<"All" | SkillData["category"]>("All");

  const filteredSkills = skills.filter((skill) => {
    if (activeTab === "All") return true;
    return skill.category === activeTab;
  });

  return (
    <section id="skills" className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 relative">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-cyan/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* Section Header */}
      <div className="mb-16 text-center md:text-left">
        <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
          {"// 02. TECHNICAL"}
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase">
          Skills & Tech Stack
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: Skills categories lists */}
        <div className="lg:col-span-7 space-y-8">
          {/* Tabs header list */}
          <div className="flex flex-wrap gap-2 border-b border-surface-border pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-wider rounded-lg border transition-all duration-300 ${
                  activeTab === cat
                    ? "bg-accent-cyan/15 border-accent-cyan text-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "bg-white/[0.02] border-surface-border text-text-muted hover:text-white hover:border-text-muted/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards dynamic list grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Side: Technology Radar visual */}
        <div className="lg:col-span-5 flex justify-center lg:sticky lg:top-24">
          <TechRadar skills={skills} />
        </div>
      </div>
    </section>
  );
}
