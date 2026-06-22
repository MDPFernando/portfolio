"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RadarSkill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  radar_placement: string; // 'Adopt' | 'Trial' | 'Assess' | 'Hold'
}

interface TechRadarProps {
  skills: RadarSkill[];
}

/**
 * TechRadar displays a futuristic visual radar of current skill placements.
 * Using SVG vector coordinates and a custom trigonometry layout, it distributes
 * technologies across rings (Adopt, Trial, Assess, Hold) dynamically.
 */
export default function TechRadar({ skills }: TechRadarProps) {
  const [hoveredSkill, setHoveredSkill] = useState<RadarSkill | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map placements to ranges
  const rings = [
    { name: "Adopt", r: 50, color: "rgba(6, 182, 212, 0.15)", text: "#06b6d4" },
    { name: "Trial", r: 100, color: "rgba(124, 58, 237, 0.1)", text: "#7c3aed" },
    { name: "Assess", r: 150, color: "rgba(245, 158, 11, 0.05)", text: "#f59e0b" },
    { name: "Hold", r: 200, color: "rgba(148, 163, 184, 0.03)", text: "#94a3b8" },
  ];

  // Group and project skills to points deterministically
  const skillPoints = useMemo(() => {
    const grouped: Record<string, RadarSkill[]> = {
      Adopt: [],
      Trial: [],
      Assess: [],
      Hold: [],
    };

    skills.forEach((skill) => {
      if (grouped[skill.radar_placement]) {
        grouped[skill.radar_placement].push(skill);
      } else {
        // Fallback default
        grouped["Assess"].push(skill);
      }
    });

    const points: Array<{
      skill: RadarSkill;
      x: number;
      y: number;
      color: string;
    }> = [];

    Object.entries(grouped).forEach(([placement, group]) => {
      const total = group.length;
      group.forEach((skill, index) => {
        // Deterministic placement using trigonometry
        const hashAngle = skill.name.charCodeAt(0) + (skill.name.charCodeAt(1) || 0);
        const baseAngle = (index / (total || 1)) * 2 * Math.PI;
        const angle = baseAngle + (hashAngle % 10) * 0.08;

        let rMin = 15, rMax = 42;
        let color = "#06b6d4"; // Cyan
        if (placement === "Trial") {
          rMin = 60;
          rMax = 90;
          color = "#7c3aed"; // Violet
        } else if (placement === "Assess") {
          rMin = 110;
          rMax = 140;
          color = "#f59e0b"; // Amber
        } else if (placement === "Hold") {
          rMin = 160;
          rMax = 190;
          color = "#64748b"; // Slate
        }

        const hashRadius = skill.name.charCodeAt(skill.name.length - 1) || 0;
        const r = rMin + (hashRadius % (rMax - rMin));

        const x = 200 + r * Math.cos(angle);
        const y = 200 + r * Math.sin(angle);

        points.push({ skill, x, y, color });
      });
    });

    return points;
  }, [skills]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top - 15,
    });
  };

  return (
    <div className="relative w-full max-w-[450px] mx-auto bg-surface-card border border-surface-border p-6 rounded-2xl backdrop-blur-xl">
      <h3 className="text-center text-sm uppercase tracking-widest text-text-muted mb-6">
        Technology Radar
      </h3>

      <div className="relative aspect-square w-full">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredSkill(null)}
        >
          {/* Grid Rings */}
          {rings
            .slice()
            .reverse()
            .map((ring, idx) => {
              const actualIdx = rings.length - 1 - idx;
              return (
                <g key={ring.name}>
                  {/* Concentric circle */}
                  <circle
                    cx="200"
                    cy="200"
                    r={ring.r}
                    fill={ring.color}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1"
                  />
                  {/* Label */}
                  <text
                    x="200"
                    y={200 - ring.r + 12}
                    textAnchor="middle"
                    fill={ring.text}
                    className="text-[9px] uppercase tracking-wider font-bold select-none opacity-60"
                  >
                    {ring.name}
                  </text>
                </g>
              );
            })}

          {/* Radar Sweep Animation Line */}
          <motion.line
            x1="200"
            y1="200"
            x2="200"
            y2="0"
            stroke="rgba(6, 182, 212, 0.15)"
            strokeWidth="1.5"
            style={{ originX: "200px", originY: "200px" }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />

          {/* Axis gridlines */}
          <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

          {/* Center Dot */}
          <circle cx="200" cy="200" r="3" fill="#06b6d4" />

          {/* Skill Dots */}
          {skillPoints.map((pt) => {
            const isHovered = hoveredSkill?.id === pt.skill.id;
            return (
              <g
                key={pt.skill.id}
                onMouseEnter={() => setHoveredSkill(pt.skill)}
                className="cursor-pointer"
              >
                {/* Glow ring on hover */}
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r="7"
                  fill="transparent"
                  stroke={pt.color}
                  strokeWidth="1.5"
                  animate={{ scale: isHovered ? [1, 1.6, 1] : 1, opacity: isHovered ? 0.7 : 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                {/* Core dot */}
                <motion.circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 5.5 : 4}
                  fill={pt.color}
                  shadow-lg="true"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip Overlay */}
        <AnimatePresence>
          {hoveredSkill && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute pointer-events-none bg-space-950/90 border border-surface-border p-3 rounded-lg shadow-xl z-50 text-xs min-w-[120px]"
              style={{ left: tooltipPos.x, top: tooltipPos.y }}
            >
              <p className="font-bold text-text-primary">{hoveredSkill.name}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-text-muted">{hoveredSkill.category}</span>
                <span className="text-[10px] font-mono font-bold text-accent-cyan">
                  {hoveredSkill.proficiency}%
                </span>
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-accent-cyan"
                  style={{ width: `${hoveredSkill.proficiency}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
