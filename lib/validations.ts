import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  bio_short: z.string().min(10, "Short bio must be at least 10 characters"),
  bio_long: z.string().min(20, "Long bio must be at least 20 characters"),
  photo_url: z.string().url("Photo URL must be a valid URL"),
  cv_url: z.string().url("CV URL must be a valid URL").or(z.string().length(0)).optional(),
  location: z.string().min(2, "Location is required"),
  timezone: z.string().min(2, "Timezone is required"),
  availability_status: z.string().min(2, "Availability status is required"),
  availability_message: z.string().min(2, "Availability message is required"),
  hero_phrases: z.array(z.string()).min(1, "At least one typewriter phrase is required"),
  social_links: z.object({
    github: z.string().url("Invalid GitHub URL").or(z.string().length(0)).optional(),
    linkedin: z.string().url("Invalid LinkedIn URL").or(z.string().length(0)).optional(),
    twitter: z.string().url("Invalid Twitter URL").or(z.string().length(0)).optional(),
    instagram: z.string().url("Invalid Instagram URL").or(z.string().length(0)).optional(),
    youtube: z.string().url("Invalid YouTube URL").or(z.string().length(0)).optional(),
    devto: z.string().url("Invalid Dev.to URL").or(z.string().length(0)).optional(),
    hashnode: z.string().url("Invalid Hashnode URL").or(z.string().length(0)).optional(),
  }),
});

export const projectSchema = z.object({
  title: z.string().min(2, "Title is required"),
  short_desc: z.string().min(5, "Short description is required"),
  long_desc: z.string().min(10, "Long description is required"),
  images: z.array(z.string()).min(1, "At least one screenshot is required"),
  tech_stack: z.array(z.string()).min(1, "At least one technology is required"),
  github_url: z.string().url("Invalid GitHub URL").or(z.string().length(0)).optional(),
  demo_url: z.string().url("Invalid Live Demo URL").or(z.string().length(0)).optional(),
  is_featured: z.boolean().default(false),
  type: z.enum(["web", "mobile", "api", "tool"]),
  is_published: z.boolean().default(true),
  sort_order: z.number().default(0),
});

export const certificateSchema = z.object({
  title: z.string().min(2, "Title is required"),
  issuer: z.string().min(2, "Issuer is required"),
  issue_date: z.string().min(10, "Issue date is required (YYYY-MM-DD)"),
  expiry_date: z.string().or(z.string().length(0)).optional(),
  credential_id: z.string().optional(),
  verify_url: z.string().url("Invalid verification URL").or(z.string().length(0)).optional(),
  image_url: z.string().url("Invalid certificate image URL"),
  category: z.string().min(2, "Category is required"),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["Frontend", "Backend", "Languages", "Tools", "Learning"]),
  proficiency: z.number().min(0).max(100, "Proficiency must be between 0 and 100"),
  icon: z.string().min(1, "Icon representation is required"),
  radar_placement: z.enum(["Adopt", "Trial", "Assess", "Hold"]),
  sort_order: z.number().default(0),
});

export const experienceSchema = z.object({
  type: z.enum(["work", "education"]),
  title: z.string().min(2, "Title is required"),
  organization: z.string().min(2, "Organization is required"),
  start_date: z.string().min(10, "Start date is required (YYYY-MM-DD)"),
  end_date: z.string().or(z.string().length(0)).optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  tags: z.array(z.string()).default([]),
  sort_order: z.number().default(0),
});

export const blogPostSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and dashes"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  cover_url: z.string().url("Cover image URL is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  is_published: z.boolean().default(false),
  read_time: z.number().default(1),
});
