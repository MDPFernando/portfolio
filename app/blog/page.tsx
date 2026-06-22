import { createClientServer } from "@/lib/supabase";
import { mockBlogPosts } from "@/lib/mockData";
import BlogListClient from "./BlogListClient";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";

export const revalidate = 3600;

async function getBlogPosts() {
  const supabase = createClientServer();
  if (!supabase) {
    return mockBlogPosts;
  }
  let posts = mockBlogPosts;

  try {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      posts = data;
    }
  } catch (e) {
    console.warn("Supabase fetch failed inside blog index, using fallback data");
  }

  return posts;
}

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <>
      {/* Background radial gradient mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-950 via-space-950 to-black" />

      <div className="relative z-10 w-full min-h-screen text-text-primary flex flex-col font-sans overflow-x-hidden">
        <Navigation />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24">
          <BlogListClient posts={posts} />
        </main>

        <Footer />
      </div>
    </>
  );
}
