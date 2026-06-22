import { createClientServer } from "@/lib/supabase";
import { createServerClient } from "@supabase/ssr";
import { mockBlogPosts } from "@/lib/mockData";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import { notFound } from "next/navigation";

// Refresh dynamic cache every 1 hour
export const revalidate = 3600;

// Tell Next.js which paths exist statically for optimization
export async function generateStaticParams() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!url || !anonKey) {
    return mockBlogPosts.map(p => ({ slug: p.slug }));
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) { return undefined; },
      set(name: string, value: string, options: any) {},
      remove(name: string, options: any) {},
    }
  });
  let slugs: { slug: string }[] = [];

  try {
    const { data } = await supabase.from("blog_posts").select("slug").eq("is_published", true);
    if (data && data.length > 0) {
      slugs = data;
    } else {
      slugs = mockBlogPosts.map(p => ({ slug: p.slug }));
    }
  } catch (e) {
    slugs = mockBlogPosts.map(p => ({ slug: p.slug }));
  }

  return slugs;
}

async function getBlogPostBySlug(slug: string) {
  const supabase = createClientServer();
  if (!supabase) {
    return mockBlogPosts.find((p) => p.slug === slug) || null;
  }

  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (data) return data;
  } catch (e) {
    console.warn("Supabase fetch failed inside blog detail page, looking in mock array");
  }

  // Local fallback search
  return mockBlogPosts.find((p) => p.slug === slug) || null;
}

import BlogPostClientWrapper from "@/components/ui/BlogPostClientWrapper";

export default async function BlogPostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);

  return (
    <>
      {/* Background radial gradient mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-950 via-space-950 to-black" />

      <div className="relative z-10 w-full min-h-screen text-text-primary flex flex-col font-sans overflow-x-hidden">
        <Navigation />

        <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-24">
          <BlogPostClientWrapper initialPost={post} slug={params.slug} />
        </main>

        <Footer />
      </div>
    </>
  );
}
