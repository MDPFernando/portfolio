"use client";

import GlassCard from "@/components/ui/GlassCard";
import { Github, Linkedin, Twitter, Instagram, Youtube, Globe, ArrowUpRight } from "lucide-react";
import { ProfileData } from "@/lib/mockData";

interface SocialProps {
  profile: ProfileData;
}

/**
 * Social section displays a dashboard grid of social media platforms.
 * It reads configurations from the profile settings and maps each brand
 * to their hex codes and glows on hover.
 */
export default function Social({ profile }: SocialProps) {
  const { social_links } = profile;

  const platforms = [
    {
      name: "GitHub",
      url: social_links.github,
      icon: <Github className="w-6 h-6" />,
      color: "group-hover:text-white group-hover:border-white/30",
      glow: "hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
      desc: "Open source repositories & development logs.",
    },
    {
      name: "LinkedIn",
      url: social_links.linkedin,
      icon: <Linkedin className="w-6 h-6" />,
      color: "group-hover:text-[#0A66C2] group-hover:border-[#0A66C2]/30",
      glow: "hover:shadow-[0_0_25px_rgba(10,102,194,0.15)]",
      desc: "Professional networks & industry connections.",
    },
    {
      name: "Twitter / X",
      url: social_links.twitter,
      icon: <Twitter className="w-6 h-6" />,
      color: "group-hover:text-[#1DA1F2] group-hover:border-[#1DA1F2]/30",
      glow: "hover:shadow-[0_0_25px_rgba(29,161,242,0.15)]",
      desc: "Daily tech thoughts & building in public logs.",
    },
    {
      name: "Instagram",
      url: social_links.instagram,
      icon: <Instagram className="w-6 h-6" />,
      color: "group-hover:text-[#E1306C] group-hover:border-[#E1306C]/30",
      glow: "hover:shadow-[0_0_25px_rgba(225,48,108,0.15)]",
      desc: "Visual design journals & student life captures.",
    },
    {
      name: "YouTube",
      url: social_links.youtube,
      icon: <Youtube className="w-6 h-6" />,
      color: "group-hover:text-[#FF0000] group-hover:border-[#FF0000]/30",
      glow: "hover:shadow-[0_0_25px_rgba(255,0,0,0.15)]",
      desc: "Coding walkthrough videos & project showcases.",
    },
    {
      name: "Dev.to",
      url: social_links.devto,
      icon: <Globe className="w-6 h-6" />,
      color: "group-hover:text-[#0A0A0A] group-hover:border-white/30",
      glow: "hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]",
      desc: "Technical writing, tutorials, & developer chats.",
    },
  ];

  // Filter out platforms that don't have configured URLs
  const activePlatforms = platforms.filter((p) => p.url);

  if (activePlatforms.length === 0) return null;

  return (
    <section id="socials" className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 relative">
      <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] bg-accent-violet/5 rounded-full filter blur-[120px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* Section Header */}
      <div className="mb-16 text-center md:text-left">
        <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
          {"// 08. TELECOMMUNICATION"}
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase">
          Social Media Hub
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activePlatforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noreferrer"
            className="block group"
          >
            <GlassCard
              className={`h-full flex flex-col justify-between p-6 border border-surface-border transition-all duration-300 ${platform.glow}`}
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted transition-all duration-300 ${platform.color}`}
                  >
                    {platform.icon}
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-white transition-colors font-heading uppercase">
                  {platform.name}
                </h3>
                <p className="text-text-muted text-xs mt-2 font-sans font-normal leading-relaxed">
                  {platform.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-surface-border flex items-center gap-1 font-mono text-[9px] text-accent-cyan uppercase tracking-widest">
                <span>ESTABLISH CONNECTION</span>
              </div>
            </GlassCard>
          </a>
        ))}
      </div>
    </section>
  );
}
