"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { notFound } from "next/navigation";
import { BlogPost } from "@/lib/mockData";

interface BlogPostClientWrapperProps {
  initialPost: BlogPost | null;
  slug: string;
}

export default function BlogPostClientWrapper({ initialPost, slug }: BlogPostClientWrapperProps) {
  const [post, setPost] = useState<BlogPost | null>(initialPost);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("local_posts");
      if (saved) {
        try {
          const posts: BlogPost[] = JSON.parse(saved);
          const found = posts.find((p) => p.slug === slug);
          if (found) {
            setPost(found);
          }
        } catch (err) {
          console.error("Failed to parse local posts", err);
        }
      }
      setLoaded(true);
    }
  }, [slug, initialPost]);

  if (!post && loaded) {
    notFound();
  }

  // Loading state skeleton or pre-render fallback
  const activePost = post || initialPost;
  if (!activePost) {
    return (
      <div className="py-24 text-center font-mono text-xs text-text-muted">
        {"// Securing journal telemetry node..."}
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <article className="space-y-8">
      {/* Header info */}
      <div className="space-y-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs text-accent-cyan hover:underline group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>All Transmissions</span>
        </Link>

        <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white uppercase tracking-tight leading-tight pt-2">
          {activePost.title}
        </h1>

        {/* Subtitle Telemetry */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-text-muted border-b border-surface-border pb-6 pt-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(activePost.created_at)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{activePost.read_time} min read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span className="flex gap-1.5">
              {activePost.tags.map((t: string) => (
                <span key={t} className="text-accent-cyan">
                  #{t}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {activePost.cover_url && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-surface-border bg-white/5">
          <img src={activePost.cover_url} alt={activePost.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Markdown rendered body */}
      <div className="pt-4">
        <MarkdownRenderer content={activePost.content} />
      </div>
    </article>
  );
}
