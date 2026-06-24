import { createClientServer } from "@/lib/supabase";
import Navigation from "@/components/sections/Navigation";
import Footer from "@/components/sections/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";
import PortfolioClientWrapper from "@/components/ui/PortfolioClientWrapper";
import {
  mockProfile,
  mockProjects,
  mockSkills,
  mockCertificates,
  mockExperience,
  mockBlogPosts,
} from "@/lib/mockData";

import HolographicBackground from "@/components/ui/HolographicBackground";

// Disable caching so admin updates reflect instantly
export const revalidate = 0;

async function getPortfolioData() {
  const supabase = createClientServer();
  if (!supabase) {
    return { profile: mockProfile, projects: mockProjects, skills: mockSkills, experience: mockExperience, certificates: mockCertificates, posts: mockBlogPosts };
  }

  let profile = mockProfile;
  let projects = mockProjects;
  let skills = mockSkills;
  let experience = mockExperience;
  let certificates = mockCertificates;
  let posts = mockBlogPosts;

  try {
    const { data: profData } = await supabase.from("profiles").select("*").maybeSingle();
    if (profData) {
      profile = profData;
    }
  } catch (e) {
    console.warn("Supabase profile fetch error, using local fallback");
  }

  try {
    const { data: projData } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    if (projData && projData.length > 0) {
      projects = projData;
    }
  } catch (e) {
    console.warn("Supabase projects fetch error, using local fallback");
  }

  try {
    const { data: skillData } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });
    if (skillData && skillData.length > 0) {
      skills = skillData;
    }
  } catch (e) {
    console.warn("Supabase skills fetch error, using local fallback");
  }

  try {
    const { data: expData } = await supabase
      .from("experience")
      .select("*")
      .order("sort_order", { ascending: true });
    if (expData && expData.length > 0) {
      experience = expData;
    }
  } catch (e) {
    console.warn("Supabase experience fetch error, using local fallback");
  }

  try {
    const { data: certData } = await supabase
      .from("certificates")
      .select("*")
      .order("issue_date", { ascending: false });
    if (certData && certData.length > 0) {
      certificates = certData;
    }
  } catch (e) {
    console.warn("Supabase certificates fetch error, using local fallback");
  }

  try {
    const { data: postData } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (postData && postData.length > 0) {
      posts = postData;
    }
  } catch (e) {
    console.warn("Supabase blog posts fetch error, using local fallback");
  }

  return { profile, projects, skills, experience, certificates, posts };
}

export default async function HomePage() {
  const data = await getPortfolioData();

  return (
    <SmoothScroll>
      <CustomCursor />
      
      {/* Background radial gradient mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-space-950 via-space-950 to-black" />
      
      {/* 3D Holographic Particles & Wireframes (fades in on scroll) */}
      <HolographicBackground />

      {/* Main interface wrapper */}
      <div className="relative z-10 w-full min-h-screen text-text-primary flex flex-col font-sans overflow-x-hidden">
        <main className="flex-1 w-full flex flex-col">
          <PortfolioClientWrapper initialData={data} />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}
