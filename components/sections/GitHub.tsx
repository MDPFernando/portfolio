"use client";

import { useGitHubData } from "@/hooks/useGitHubData";
import ContributionGraph from "@/components/ui/ContributionGraph";
import GlassCard from "@/components/ui/GlassCard";
import { Star, GitFork, BookOpen, Users, GitCommit, ExternalLink, Code2, Zap, Target, Heart } from "lucide-react";

const GITHUB_USERNAME = "MDPFernando";
const GITHUB_URL = "https://github.com/MDPFernando";

/** Personal story bullets — inspired by friend's README style */
const BIO_BULLETS = [
  { icon: "🎓", text: "2nd-year CS undergraduate at NSBM Green University, Sri Lanka" },
  { icon: "🚀", text: "Building NET — a cyberpunk e-commerce platform with Spring Boot" },
  { icon: "🌱", text: "Currently mastering Spring Boot, REST APIs & modern web dev" },
  { icon: "💡", text: "I love turning real-world problems into clean, working software" },
  { icon: "🤝", text: "Open to collaborations on open-source & student projects" },
  { icon: "🏠", text: "Based in Negombo, Western Province, Sri Lanka" },
  { icon: "⚡", text: "Fun fact: Coffee ☕ + code = unstoppable" },
];

export default function GitHub() {
  const { data, loading, error } = useGitHubData();

  if (loading) {
    return (
      <section className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        <div className="h-10 bg-white/5 rounded-md w-1/4 animate-pulse" />
        <div className="h-[200px] bg-white/5 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[160px] bg-white/5 rounded-xl animate-pulse" />
          <div className="h-[160px] bg-white/5 rounded-xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 text-center border border-dashed border-surface-border rounded-xl">
        <p className="text-text-muted font-mono text-sm">
          {"// Failed to stream GitHub telemetry data."}
        </p>
      </section>
    );
  }

  const totalLangWeight = data.languages.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <section id="github" className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 relative">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent-violet/5 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-cyan/4 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="mb-16 text-center md:text-left">
        <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
          {"// 04. OPEN SOURCE"}
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase">
          GitHub Activity
        </h2>
      </div>

      {/* ── TOP ROW: Bio Card + Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

        {/* Personal Bio Card */}
        <div className="lg:col-span-7 bg-surface-card border border-surface-border rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-cyan/10 to-transparent rounded-bl-full" />
          
          {/* Profile header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={`https://avatars.githubusercontent.com/${GITHUB_USERNAME}`}
                alt="GitHub Avatar"
                className="w-14 h-14 rounded-full border-2 border-accent-cyan/40 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/profile.jpg";
                }}
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full w-4 h-4 border-2 border-space-950 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dineth Prashansa</h3>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="text-accent-cyan font-mono text-xs hover:underline flex items-center gap-1 group"
              >
                @{GITHUB_USERNAME}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
            {/* Open to collab badge */}
            <div className="ml-auto flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open to Collab
            </div>
          </div>

          {/* Bio bullets */}
          <ul className="space-y-2.5">
            {BIO_BULLETS.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm group">
                <span className="text-base leading-none mt-0.5 shrink-0">{item.icon}</span>
                <span className="text-text-muted group-hover:text-white transition-colors duration-200 leading-relaxed">
                  {item.text}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 hover:border-accent-cyan/60 text-accent-cyan font-mono text-xs px-4 py-2.5 rounded-lg transition-all duration-200 group"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View GitHub Profile
            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {[
            { icon: GitCommit, label: "Total Contributions", value: data.totalContributions, color: "text-accent-cyan", bg: "bg-accent-cyan/10", border: "border-accent-cyan/20" },
            { icon: BookOpen, label: "Repositories", value: data.totalRepos, color: "text-accent-violet", bg: "bg-accent-violet/10", border: "border-accent-violet/20" },
            { icon: Users, label: "Followers", value: data.followers, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
            { icon: Star, label: "Stars Earned", value: data.topRepos.reduce((acc, r) => acc + r.stars, 0), color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
          ].map(({ icon: Icon, label, value, color, bg, border }) => (
            <div key={label} className={`${bg} border ${border} rounded-xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200`}>
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <div>
                <p className={`text-3xl font-extrabold font-mono ${color}`}>{value}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-wider mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTRIBUTION HEATMAP ── */}
      <div className="bg-surface-card border border-surface-border rounded-2xl p-6 backdrop-blur-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-5 border-b border-surface-border pb-4 gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-cyan" />
              <span>Contribution Activity</span>
            </h3>
            <p className="text-[11px] text-text-muted font-mono mt-0.5">
              365-day commit telemetry — every green square is a push 🔥
            </p>
          </div>
          <div className="text-left md:text-right font-mono">
            <span className="text-2xl font-extrabold text-accent-cyan">{data.totalContributions}</span>
            <p className="text-[10px] text-text-muted uppercase tracking-wider">contributions this year</p>
          </div>
        </div>
        <ContributionGraph calendarData={data.contributionCalendar} />
      </div>

      {/* ── BOTTOM ROW: Languages + Repos ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Language Distribution */}
        <div className="lg:col-span-4 bg-surface-card border border-surface-border rounded-xl p-6 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 font-mono flex items-center gap-2">
            <Code2 className="w-4 h-4 text-accent-cyan" />
            Language Stack
          </h3>

          {/* Segmented bar */}
          <div className="w-full h-2.5 rounded-full flex overflow-hidden bg-white/5 mb-5">
            {data.languages.map((lang) => {
              const pct = ((lang.count / totalLangWeight) * 100).toFixed(1);
              return (
                <div
                  key={lang.name}
                  style={{ width: `${pct}%`, backgroundColor: lang.color }}
                  title={`${lang.name}: ${pct}%`}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                />
              );
            })}
          </div>

          {/* Language legend with bars */}
          <div className="space-y-3">
            {data.languages.map((lang) => {
              const pct = ((lang.count / totalLangWeight) * 100).toFixed(1);
              return (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                      <span className="font-mono text-xs text-white font-bold">{lang.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-text-muted">{pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: lang.color, opacity: 0.7 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Repository Cards */}
        <div className="lg:col-span-8">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 font-mono flex items-center gap-2">
            <Target className="w-4 h-4 text-accent-cyan" />
            Pinned Repositories
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {data.topRepos.map((repo) => (
              <a key={repo.name} href={repo.url} target="_blank" rel="noreferrer" className="block group">
                <GlassCard className="flex flex-col sm:flex-row sm:items-center justify-between hover:border-accent-cyan/35 cursor-pointer p-5 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <svg className="w-4 h-4 text-text-muted shrink-0" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                      </svg>
                      <h4 className="text-sm font-bold text-white group-hover:text-accent-cyan transition-colors truncate">
                        {repo.name}
                      </h4>
                      <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    <p className="text-text-muted text-xs line-clamp-2 font-sans font-normal leading-relaxed">
                      {repo.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: repo.languageColor }} />
                      <span className="text-text-primary">{repo.language}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400" />
                      {repo.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-accent-cyan" />
                      {repo.forks}
                    </span>
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>

          {/* More repos CTA */}
          <a
            href={`${GITHUB_URL}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 border border-dashed border-surface-border rounded-xl text-text-muted hover:text-accent-cyan hover:border-accent-cyan/40 font-mono text-xs transition-all duration-200 group"
          >
            <Heart className="w-3.5 h-3.5 group-hover:text-accent-cyan" />
            View all repositories on GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
}
