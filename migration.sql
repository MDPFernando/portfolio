-- Supabase Schema Migration Script
-- Database configuration for Futuristic Portfolio Web Application

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio_short TEXT NOT NULL,
    bio_long TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    cv_url TEXT,
    location TEXT NOT NULL,
    timezone TEXT NOT NULL,
    availability_status TEXT NOT NULL,
    availability_message TEXT NOT NULL,
    hero_phrases TEXT[] NOT NULL DEFAULT '{}',
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    short_desc TEXT NOT NULL,
    long_desc TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github_url TEXT,
    demo_url TEXT,
    stars INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    type TEXT NOT NULL CHECK (type IN ('web', 'mobile', 'api', 'tool')),
    is_published BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'Languages', 'Tools', 'Learning')),
    proficiency INTEGER NOT NULL CHECK (proficiency >= 0 AND proficiency <= 100),
    icon TEXT NOT NULL,
    radar_placement TEXT NOT NULL CHECK (radar_placement IN ('Adopt', 'Trial', 'Assess', 'Hold', 'Learning')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('work', 'education')),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    credential_id TEXT,
    verify_url TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT false,
    read_time INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Row Level Security Policies (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 8a. Public Read policies for dynamic portfolios sections
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access to published projects" ON public.projects FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read access to skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read access to experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Allow public read access to certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read access to published posts" ON public.blog_posts FOR SELECT USING (is_published = true);

-- 8b. Public write policy for contact dispatcher
CREATE POLICY "Allow public insert to contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- 8c. Authenticated Administrator modification policies
CREATE POLICY "Allow authenticated full write profiles" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full write projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full write skills" ON public.skills FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full write experience" ON public.experience FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full write certificates" ON public.certificates FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full write blog posts" ON public.blog_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full write contact messages" ON public.contact_messages FOR ALL TO authenticated USING (true);

-- 9. Seed Initial Default Data (Optional / Starter Pack)
INSERT INTO public.profiles (name, title, bio_short, bio_long, photo_url, location, timezone, availability_status, availability_message, hero_phrases, social_links)
VALUES (
    'Dinesh Kumar',
    'Creative Developer & CS Student',
    'Building immersive WebGL experiences and highly scalable full-stack applications.',
    'I am a computer science student and software builder specializing in interactive 3D web interfaces, robust backend pipelines, and real-time cloud data. Based in Sri Lanka, I craft systems that sit at the intersection of high performance and elegant design.',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300',
    'Colombo, Sri Lanka',
    'UTC +05:30',
    'available',
    'Currently available for freelance projects',
    ARRAY['Full-Stack Developer', 'Creative Builder', 'Problem Solver', 'CS Student'],
    '{"github": "https://github.com", "linkedin": "https://linkedin.com", "twitter": "https://twitter.com", "devto": "https://dev.to"}'::jsonb
) ON CONFLICT DO NOTHING;

INSERT INTO public.skills (name, category, proficiency, icon, radar_placement, sort_order)
VALUES 
('Next.js', 'Frontend', 92, 'nextjs-plain', 'Adopt', 0),
('TypeScript', 'Languages', 95, 'typescript-plain', 'Adopt', 1),
('Three.js / R3F', 'Frontend', 80, 'threejs-original', 'Trial', 2),
('Go Lang', 'Languages', 75, 'go-original-wordmark', 'Assess', 3),
('PostgreSQL', 'Backend', 88, 'postgresql-plain', 'Adopt', 4),
('Docker', 'Tools', 85, 'docker-plain', 'Adopt', 5),
('Rust', 'Languages', 60, 'rust-plain', 'Learning', 6)
ON CONFLICT DO NOTHING;
