import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function seedNET() {
  const { error } = await supabase.from("projects").upsert({
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // Valid UUID
    title: "NET (Next Era Technologies)",
    short_desc: "Future-grade cybernetic e-commerce platform built with Spring Boot featuring a cyberpunk/futuristic aesthetic.",
    long_desc: "A premium, production-ready e-commerce platform featuring a state-of-the-art cyberpunk/futuristic aesthetic. Engineered with Spring Boot, styled with a custom dark-mode glassmorphism UI, this application offers a shopper portal (with holographic landing page, dynamic search suggestions, quantum cart, and order tracking timeline) and a full admin control panel.",
    images: [
      "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&q=80&w=800&h=450",
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=800&h=450"
    ],
    tech_stack: ["Spring Boot", "Java 21", "Thymeleaf", "HTML5/CSS3", "MySQL", "Docker"],
    github_url: "https://github.com/MDPFernando/ecommerce",
    demo_url: "https://ecommerce-production-ca52.up.railway.app/",
    stars: 18,
    is_featured: true,
    type: "web",
    is_published: true,
    sort_order: 0,
  });

  if (error) {
    console.error("Error seeding NET:", error);
  } else {
    console.log("Successfully seeded NET project into Supabase!");
  }
}

seedNET();
