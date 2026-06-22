"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPost } from "@/lib/mockData";

interface BlogListClientProps {
  posts: BlogPost[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [localPosts, setLocalPosts] = useState<BlogPost[]>(posts);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("local_posts");
      if (saved) {
        try {
          setLocalPosts(JSON.parse(saved));
        } catch (err) {
          console.error("Failed to parse offline posts:", err);
        }
      }
    }
  }, [posts]);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    localPosts.forEach((post) => {
      post.tags.forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [localPosts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return localPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
      return matchesSearch && matchesTag;
    });
  }, [localPosts, searchQuery, selectedTag]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-12">
      {/* Back to Home CTA */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-accent-cyan hover:underline group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Return to Central Grid</span>
        </Link>
      </div>

      {/* Header Title */}
      <div>
        <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
          {"// TRANSMISSIONS ARCHIVE"}
        </p>
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-white uppercase tracking-tight">
          Systems Journal
        </h1>
        <p className="text-text-muted text-sm md:text-base mt-4 max-w-2xl font-normal leading-relaxed">
          Log files, design sprints, technical walkthroughs, and CS research articles.
        </p>
      </div>

      {/* Filters: Search & Tags */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-surface-border pb-8">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-xl pl-11 pr-4 py-3 text-xs font-mono text-white placeholder-text-muted transition-colors"
            placeholder="Search transmission logs..."
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider mr-2">
            Filter Tags:
          </span>
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider rounded-lg border transition-all ${
              selectedTag === null
                ? "bg-accent-cyan/15 border-accent-cyan text-accent-cyan"
                : "bg-white/[0.01] border-surface-border text-text-muted hover:text-white"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider rounded-lg border transition-all ${
                selectedTag === tag
                  ? "bg-accent-cyan/15 border-accent-cyan text-accent-cyan"
                  : "bg-white/[0.01] border-surface-border text-text-muted hover:text-white"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      <motion.div layout className="relative">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 border border-dashed border-surface-border rounded-2xl"
            >
              <p className="font-mono text-xs text-text-muted">
                {"// No telemetry match found for the current query."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                  <GlassCard className="h-full flex flex-col justify-between hover:border-accent-cyan/30 cursor-pointer group p-5">
                    <div>
                      {/* Cover Image */}
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-4 bg-white/5 border border-white/5">
                        <img
                          src={post.cover_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded border border-accent-cyan/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors leading-snug line-clamp-2 pt-1 font-heading">
                          {post.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-surface-border pt-4 mt-6">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.read_time} min read</span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
