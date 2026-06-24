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
  const data = initialData;

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
