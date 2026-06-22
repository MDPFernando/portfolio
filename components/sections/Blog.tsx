"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_url: string;
  tags: string[];
  is_published: boolean;
  read_time: number;
  created_at: string;
}

interface BlogProps {
  posts: BlogPost[];
}

/**
 * Blog section previews the latest published markdown articles from
 * Supabase, formatting tag badges and dynamic slug redirects.
 */
export default function Blog({ posts }: BlogProps) {
  // Take latest 3 posts
  const recentPosts = posts
    .filter((p) => p.is_published)
    .slice(0, 3);

  if (recentPosts.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <section id="blog" className="py-24 w-full max-w-7xl mx-auto px-4 md:px-8 relative">
      {/* Header */}
      <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="text-accent-cyan font-mono text-xs uppercase tracking-[0.2em] mb-2">
            {"// 07. TRANSMISSIONS"}
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase">
            Latest Articles
          </h2>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-accent-cyan hover:underline group"
        >
          <span>View All Transmissions</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recentPosts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="block">
            <GlassCard className="h-full flex flex-col justify-between hover:border-accent-cyan/30 cursor-pointer group p-5">
              <div>
                {/* Cover image */}
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
                      <span key={tag} className="text-[9px] font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded border border-accent-cyan/10">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-accent-cyan transition-colors leading-snug line-clamp-2 pt-1">
                    {post.title}
                  </h3>
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
      </div>
    </section>
  );
}
