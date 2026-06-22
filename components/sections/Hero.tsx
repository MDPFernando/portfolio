"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ParticleField from "@/components/ui/ParticleField";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowDown } from "lucide-react";
import { ProfileData } from "@/lib/mockData";

interface HeroProps {
  profile: ProfileData;
}

/**
 * Hero component renders the landing view.
 * It loads the 3D particle field, displays a typewriter carousel of phrases,
 * renders a glitch name display, and shows smooth scrolling CTAs.
 */
export default function Hero({ profile }: HeroProps) {
  const phrases = useMemo(() => {
    return profile.hero_phrases && profile.hero_phrases.length > 0
      ? profile.hero_phrases
      : ["Creative Builder", "Full-Stack Developer"];
  }, [profile.hero_phrases]);
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const activeWord = phrases[currentPhraseIdx];
    const typingSpeed = isDeleting ? 40 : 85;

    if (!isDeleting && displayedText === activeWord) {
      // Pause at end of word before deleting
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedText === "") {
      setIsDeleting(false);
      setCurrentPhraseIdx((prev) => (prev + 1) % phrases.length);
    } else {
      timer = setTimeout(() => {
        const nextText = isDeleting
          ? activeWord.substring(0, displayedText.length - 1)
          : activeWord.substring(0, displayedText.length + 1);
        setDisplayedText(nextText);
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIdx, phrases]);

  // Smooth scroll handler
  const handleScrollToProjects = () => {
    const projectsSec = document.getElementById("projects");
    if (projectsSec) {
      projectsSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-12">
      {/* 3D background canvas */}
      <ParticleField />

      {/* Radial overlay to dim corners */}
      <div className="absolute inset-0 bg-gradient-to-t from-space-950 via-transparent to-transparent pointer-events-none z-0" />

      {/* Floating Status Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute top-24 right-4 md:right-12 z-20 flex items-center gap-2 bg-surface-card border border-surface-border px-4 py-2 rounded-full backdrop-blur-md"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
          {profile.availability_message}
        </span>
      </motion.div>

      {/* Main Content Area */}
      <div className="relative z-10 text-center max-w-4xl flex flex-col items-center">
        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-accent-cyan font-mono text-xs md:text-sm uppercase tracking-[0.25em] mb-4"
        >
          {profile.title}
        </motion.p>

        {/* Glitchy Name Header */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-8xl font-extrabold uppercase font-heading tracking-tight text-white mb-6 select-none glitch-text"
          data-text={profile.name}
        >
          {profile.name}
        </motion.h1>

        {/* Typewriter Carousel */}
        <div className="h-8 md:h-10 mb-12 flex items-center justify-center font-mono text-text-muted text-sm md:text-xl">
          <span>I am a&nbsp;</span>
          <span className="text-accent-violet font-semibold border-r-2 border-accent-violet pr-1 animate-pulse">
            {displayedText}
          </span>
        </div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
        >
          <MagneticButton>
            <button
              onClick={handleScrollToProjects}
              className="px-8 py-3.5 bg-accent-violet hover:bg-accent-violet/90 text-white rounded-lg font-mono text-sm font-semibold transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] border border-accent-violet/20"
            >
              View My Work
            </button>
          </MagneticButton>

          <MagneticButton>
            <a
              href={profile.cv_url}
              download
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-text-primary rounded-lg font-mono text-sm font-semibold transition-all border border-surface-border hover:border-text-muted/30"
            >
              Download CV
            </a>
          </MagneticButton>
        </motion.div>
      </div>

      {/* Scroll Down Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        onClick={handleScrollToProjects}
        className="absolute bottom-8 cursor-pointer flex flex-col items-center gap-2 text-text-muted hover:text-accent-cyan transition-colors z-10"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ArrowDown className="w-4 h-4 text-accent-cyan" />
        </motion.div>
      </motion.div>
    </section>
  );
}
