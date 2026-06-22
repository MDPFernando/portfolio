"use client";

import { useEffect, useState } from "react";
import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import GitHub from "@/components/sections/GitHub";
import Experience from "@/components/sections/Experience";
import Certificates from "@/components/sections/Certificates";
import Blog from "@/components/sections/Blog";
import Social from "@/components/sections/Social";
import Contact from "@/components/sections/Contact";

interface PortfolioClientWrapperProps {
  initialData: {
    profile: any;
    projects: any[];
    skills: any[];
    experience: any[];
    certificates: any[];
    posts: any[];
  };
}

export default function PortfolioClientWrapper({ initialData }: PortfolioClientWrapperProps) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localProfile = localStorage.getItem("local_profile");
      const localProjects = localStorage.getItem("local_projects");
      const localSkills = localStorage.getItem("local_skills");
      const localExperience = localStorage.getItem("local_experience");
      const localCertificates = localStorage.getItem("local_certificates");
      const localPosts = localStorage.getItem("local_posts");

      const updated = { ...initialData };
      
      try {
        if (localProfile) updated.profile = JSON.parse(localProfile);
        if (localProjects) {
          // Merge: use localStorage overrides but fall back to initialData fields
          // so new fields added to mockData (like demo_url) are never lost
          const cachedProjects: any[] = JSON.parse(localProjects);
          updated.projects = initialData.projects.map((base: any) => {
            const cached = cachedProjects.find((c: any) => c.id === base.id);
            return cached ? { ...base, ...cached } : base;
          });
          // Also append any cached projects not in initialData
          cachedProjects.forEach((c: any) => {
            if (!updated.projects.find((p: any) => p.id === c.id)) {
              updated.projects.push(c);
            }
          });
        }
        if (localSkills) updated.skills = JSON.parse(localSkills);
        if (localExperience) updated.experience = JSON.parse(localExperience);
        if (localCertificates) updated.certificates = JSON.parse(localCertificates);
        if (localPosts) updated.posts = JSON.parse(localPosts);
      } catch (err) {
        console.error("Failed to parse local sandbox cache:", err);
      }

      setData(updated);
    }
  }, [initialData]);

  return (
    <>
      <Navigation logoUrl={data.profile?.logo_url} />
      <Hero profile={data.profile} />
      <About profile={data.profile} />
      <Skills skills={data.skills} />
      <Projects projects={data.projects} />
      <GitHub />
      <Experience experience={data.experience} />
      <Certificates certificates={data.certificates} />
      <Blog posts={data.posts} />
      <Social profile={data.profile} />
      <Contact />
    </>
  );
}
