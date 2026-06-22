export interface ProfileData {
  name: string;
  title: string;
  bio_short: string;
  bio_long: string;
  photo_url: string;
  logo_url?: string;
  cv_url: string;
  location: string;
  timezone: string;
  availability_status: string;
  availability_message: string;
  hero_phrases: string[];
  social_links: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    devto?: string;
    hashnode?: string;
  };
}

export interface ProjectData {
  id: string;
  title: string;
  short_desc: string;
  long_desc: string;
  images: string[];
  tech_stack: string[];
  github_url?: string;
  demo_url?: string;
  stars: number;
  is_featured: boolean;
  type: "web" | "mobile" | "api" | "tool";
  is_published: boolean;
  sort_order: number;
}

export interface CertificateData {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  verify_url?: string;
  image_url: string;
  category: string;
}

export interface SkillData {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Languages" | "Tools" | "Learning";
  proficiency: number;
  icon: string;
  radar_placement: "Adopt" | "Trial" | "Assess" | "Hold";
  sort_order: number;
}

export interface ExperienceData {
  id: string;
  type: "work" | "education";
  title: string;
  organization: string;
  start_date: string;
  end_date?: string;
  description: string;
  location: string;
  tags: string[];
  sort_order: number;
}

export const mockProfile: ProfileData = {
  name: "Dineth Prashansa",
  title: "CS Undergraduate & Tech Explorer",
  bio_short: "Undergraduate student pursuing a B.Sc. (Hons) in Computer Science at NSBM Green University, passionate about technology exploration and software development.",
  bio_long: "I am a 2nd year Computer Science undergraduate at NSBM Green University, Sri Lanka, pursuing a UGC-approved B.Sc. (Hons) in Computer Science. As an enthusiastic tech explorer, I am focused on understanding computer science fundamentals, building software solutions, and exploring emerging technologies.",
  photo_url: "/profile.jpg",
  logo_url: "/logo.png",
  cv_url: "#",
  location: "Negombo, Western Province, Sri Lanka",
  timezone: "UTC +05:30",
  availability_status: "available",
  availability_message: "Open to learning opportunities, collaborations, and academic projects",
  hero_phrases: ["CS Undergraduate", "Tech Explorer", "Software Builder", "NSBM Student"],
  social_links: {
    github: "https://github.com/MDPFernando",
    linkedin: "https://www.linkedin.com/in/dineth-prashansa-77491a37b",
  },
};

export const mockProjects: ProjectData[] = [
  {
    id: "p_net",
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
  },
];

export const mockSkills: SkillData[] = [
  { id: "s1", name: "Next.js", category: "Frontend", proficiency: 92, icon: "nextjs-plain", radar_placement: "Adopt", sort_order: 0 },
  { id: "s2", name: "TypeScript", category: "Languages", proficiency: 95, icon: "typescript-plain", radar_placement: "Adopt", sort_order: 1 },
  { id: "s3", name: "Three.js / R3F", category: "Frontend", proficiency: 80, icon: "threejs-original", radar_placement: "Trial", sort_order: 2 },
  { id: "s4", name: "Go Lang", category: "Languages", proficiency: 75, icon: "go-original-wordmark", radar_placement: "Assess", sort_order: 3 },
  { id: "s5", name: "PostgreSQL", category: "Backend", proficiency: 88, icon: "postgresql-plain", radar_placement: "Adopt", sort_order: 4 },
  { id: "s6", name: "Docker", category: "Tools", proficiency: 85, icon: "docker-plain", radar_placement: "Adopt", sort_order: 5 },
  { id: "s7", name: "Rust", category: "Languages", proficiency: 60, icon: "rust-plain", radar_placement: "Assess", sort_order: 6 },
  { id: "s8", name: "Redis", category: "Backend", proficiency: 78, icon: "redis-plain", radar_placement: "Trial", sort_order: 7 },
  { id: "s9", name: "Tailwind CSS", category: "Frontend", proficiency: 95, icon: "tailwindcss-plain", radar_placement: "Adopt", sort_order: 8 },
];

export const mockCertificates: CertificateData[] = [
  {
    id: "c1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    issue_date: "2025-08-15",
    credential_id: "AWS-ASA-9942",
    verify_url: "https://aws.amazon.com",
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Cloud",
  },
  {
    id: "c2",
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta",
    issue_date: "2024-04-10",
    credential_id: "META-FED-883",
    verify_url: "https://coursera.org",
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&h=300",
    category: "Programming",
  },
];

export const mockExperience: ExperienceData[] = [
  {
    id: "e1",
    type: "education",
    title: "B.Sc. (Hons) in Computer Science",
    organization: "NSBM Green University",
    start_date: "2024-03-01",
    end_date: "2027-03-01",
    description: "Pursuing a UGC-approved B.Sc. (Hons) in Computer Science. Focused on database systems, software engineering, object-oriented programming, data structures, and algorithms.",
    location: "Homagama, Sri Lanka",
    tags: ["Computer Science", "Algorithms", "Software Engineering", "OOP"],
    sort_order: 0,
  },
];

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

export const mockBlogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "Synthesizing Keplers: Orbits in R3F Shaders",
    slug: "synthesizing-keplers-orbits-r3f-shaders",
    content: "# Synthesizing Keplerian Orbits with Custom WebGL Shaders\n\nKeplerian orbits govern satellite movements across Keplerian coordinates. Visualizing these orbits at 60 FPS requires computing position matrices on-gpu rather than the CPU...\n\n```glsl\n// Vertex shader snippet\nvoid main() {\n  vec3 orbitPos = computeKeplerianOrbit(aSemiMajor, aEccentricity);\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(orbitPos, 1.0);\n}\n```\n\nEnjoy GPU-accelerated orbit mapping!",
    cover_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450",
    tags: ["WebGL", "Three.js", "GLSL"],
    is_published: true,
    read_time: 5,
    created_at: "2026-06-10T12:00:00Z"
  },
  {
    id: "b2",
    title: "Rust for CS Students: Why Safety Matters",
    slug: "rust-for-cs-students-why-safety-matters",
    content: "# Why CS Students Should Learn Rust\n\nMemory safety is a fundamental pillar of modern system security. Rust achieves compile-time safety checks using memory ownership rules...",
    cover_url: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=800&h=450",
    tags: ["Rust", "Systems", "Security"],
    is_published: true,
    read_time: 4,
    created_at: "2026-05-18T10:00:00Z"
  }
];

