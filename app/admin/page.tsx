"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  User,
  LayoutGrid,
  Award,
  BookOpen,
  MessageSquare,
  Briefcase,
  Cpu,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Save,
  Check,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  Inbox,
  ShieldCheck,
  Lock
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";
import {
  mockProfile,
  mockProjects,
  mockSkills,
  mockCertificates,
  mockExperience,
  mockBlogPosts,
  BlogPost,
  ProjectData,
  SkillData,
  ExperienceData,
  CertificateData,
  ProfileData
} from "@/lib/mockData";
import ImageCropperModal from "@/components/ui/ImageCropperModal";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "profile" | "projects" | "skills" | "experience" | "certificates" | "blog" | "messages"
  >("overview");

  // Environmental setup state
  const [isBypassMode, setIsBypassMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [consoleLogs, setConsoleLogs] = useState<string[]>(["Initializing System Console..."]);

  // Local collections state initialized with mockData
  const [errorMsg, setErrorMsg] = useState("");
  
  // Cropper State
  const [cropperModalOpen, setCropperModalOpen] = useState(false);
  const [cropperImageUrl, setCropperImageUrl] = useState("");
  const [cropperTarget, setCropperTarget] = useState<"profile" | "logo" | null>(null);
  const [cropperAspectRatio, setCropperAspectRatio] = useState<number | undefined>(1);
  const [profile, setProfile] = useState<ProfileData>(mockProfile);
  const [projects, setProjects] = useState<ProjectData[]>(mockProjects);
  const [skills, setSkills] = useState<SkillData[]>(mockSkills);
  const [experience, setExperience] = useState<ExperienceData[]>(mockExperience);
  const [certificates, setCertificates] = useState<CertificateData[]>(mockCertificates);
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [messages, setMessages] = useState<any[]>([
    {
      id: "m1",
      name: "Elon Musk",
      email: "elon@spacex.com",
      message: "Impressive WebGL location coordinate ping. Let's discuss telemetry options for orbital interfaces.",
      created_at: "2026-06-17T08:30:00Z"
    },
    {
      id: "m2",
      name: "Ada Lovelace",
      email: "ada@analyticalengine.org",
      message: "The strategic technology radar is deterministically structured. Excellent analytical craftsmanship.",
      created_at: "2026-06-16T14:45:00Z"
    }
  ]);

  // Form states for items creation/editing
  const [editingProject, setEditingProject] = useState<Partial<ProjectData> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillData> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<ExperienceData> | null>(null);
  const [editingCertificate, setEditingCertificate] = useState<Partial<CertificateData> | null>(null);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);

  // Security Form State
  const [securityEmail, setSecurityEmail] = useState("username");
  const [securityPassword, setSecurityPassword] = useState("admin123");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // Helper log emitter
  const logSystem = (msg: string) => {
    setConsoleLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Check local session token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = sessionStorage.getItem("is_admin_logged_in");
      if (isLoggedIn !== "true") {
        router.push("/login");
      }
    }
  }, [router]);

  // Initial load logic from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const localProfile = localStorage.getItem("local_profile");
        if (localProfile) {
          setProfile(JSON.parse(localProfile));
          logSystem("Hydrated profile settings from Local Storage cache.");
        }
      } catch (e) {
        console.warn("Failed to parse local profile:", e);
      }

      try {
        const localProjects = localStorage.getItem("local_projects");
        if (localProjects) {
          setProjects(JSON.parse(localProjects));
          logSystem("Hydrated creation items from Local Storage cache.");
        }
      } catch (e) {
        console.warn("Failed to parse local projects:", e);
      }

      try {
        const localCreds = localStorage.getItem("admin_creds");
        if (localCreds) {
          const creds = JSON.parse(localCreds);
          setSecurityEmail(creds.email);
          setSecurityPassword(creds.password);
        }
      } catch (e) {
        console.warn("Failed to parse admin creds");
      }

      try {
        const localSkills = localStorage.getItem("local_skills");
        if (localSkills) {
          setSkills(JSON.parse(localSkills));
          logSystem("Hydrated skill radar nodes from Local Storage cache.");
        }
      } catch (e) {
        console.warn("Failed to parse local skills:", e);
      }

      try {
        const localExperience = localStorage.getItem("local_experience");
        if (localExperience) {
          setExperience(JSON.parse(localExperience));
          logSystem("Hydrated experience timeline from Local Storage cache.");
        }
      } catch (e) {
        console.warn("Failed to parse local experience:", e);
      }

      try {
        const localCertificates = localStorage.getItem("local_certificates");
        if (localCertificates) {
          setCertificates(JSON.parse(localCertificates));
          logSystem("Hydrated credentials list from Local Storage cache.");
        }
      } catch (e) {
        console.warn("Failed to parse local certificates:", e);
      }

      try {
        const localPosts = localStorage.getItem("local_posts");
        if (localPosts) {
          setPosts(JSON.parse(localPosts));
          logSystem("Hydrated transmission logs from Local Storage cache.");
        }
      } catch (e) {
        console.warn("Failed to parse local posts:", e);
      }
    }
  }, []);

  const dataUrlToFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCropperComplete = async (croppedImageUrl: string) => {
    if (!cropperTarget) return;
    try {
      const file = dataUrlToFile(croppedImageUrl, `${cropperTarget}_cropped.png`);
      const url = await handleFileUpload(file, "profile"); // use profile bucket
      
      if (cropperTarget === "profile") {
        setProfile((prev) => ({ ...prev, photo_url: url }));
      } else if (cropperTarget === "logo") {
        setProfile((prev) => ({ ...prev, logo_url: url }));
      }
    } catch (err) {
      console.error("Cropper upload error:", err);
    }
  };

  const handleFileUpload = async (file: File, type: "profile" | "project" | "certificate" | "blog") => {
    logSystem(`Processing file upload [${type}]: ${file.name}`);

    // If Supabase is active, upload to bucket
    if (!isBypassMode && url && anonKey) {
      try {
        const supabase = createBrowserClient(url, anonKey);
        const fileExt = file.name.split(".").pop();
        const bucketName = type === "profile" ? "avatar" : type === "project" ? "projects" : type === "certificate" ? "certificates" : "blog";
        const fileName = `${type}_${Date.now()}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, { cacheControl: "3600", upsert: true });

        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);
          logSystem(`Cloud sync complete. Public URL: ${publicUrl}`);
          return publicUrl;
        } else {
          logSystem(`Cloud sync failed: ${error.message}. Encoding to local Data URL...`);
        }
      } catch (err: any) {
        logSystem(`Cloud sync exception: ${err.message}. Encoding to local Data URL...`);
      }
    }

    // Default base64 Data URL fallback
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (!url || !anonKey) {
      setIsBypassMode(true);
      logSystem("Supabase connection details offline. Operating in Local Cache sandbox.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const supabase = createBrowserClient(url, anonKey);
        
        // Fetch profiles
        const { data: prof } = await supabase.from("profiles").select("*").maybeSingle();
        if (prof) setProfile(prof);

        // Fetch projects
        const { data: projs } = await supabase.from("projects").select("*").order("sort_order");
        if (projs && projs.length > 0) setProjects(projs);

        // Fetch skills
        const { data: sks } = await supabase.from("skills").select("*").order("sort_order");
        if (sks && sks.length > 0) setSkills(sks);

        // Fetch experience
        const { data: exp } = await supabase.from("experience").select("*").order("sort_order");
        if (exp && exp.length > 0) setExperience(exp);

        // Fetch certificates
        const { data: certs } = await supabase.from("certificates").select("*").order("issue_date", { ascending: false });
        if (certs && certs.length > 0) setCertificates(certs);

        // Fetch posts
        const { data: blgs } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
        if (blgs && blgs.length > 0) setPosts(blgs);

        // Fetch contact messages
        const { data: msgs } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
        if (msgs) setMessages(msgs);

        logSystem("Supabase database connection established. Telemetry sync active.");
      } catch (e: any) {
        logSystem("Database sync exception: " + e.message + ". Defaulting to Local Cache.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [url, anonKey]);

  const handleLogout = async () => {
    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      await supabase.auth.signOut();
    }
    logSystem("Terminating session logs...");
    router.push("/login");
  };

  // General profile update
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    logSystem("Profile save sequence initiated.");
    
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("local_profile", JSON.stringify(profile));
        logSystem("Profile updates cached to Local Storage.");
      } catch (err: any) {
        logSystem(`Local Storage Error: ${err.message}. Image might be too large.`);
        alert("Failed to save! The image might be too large. Try a smaller crop.");
        return;
      }
    }
    
    if (isBypassMode) {
      logSystem("Profile update simulation confirmed.");
      alert("Configuration saved successfully!");
      return;
    }
    
    const supabase = createBrowserClient(url, anonKey);
    const { error } = await supabase.from("profiles").upsert(profile);
    if (error) {
      logSystem(`Profile save error: ${error.message}`);
      alert(`Failed to save: ${error.message}`);
    } else {
      logSystem("Profile updates synced successfully.");
      alert("Configuration saved to cloud successfully!");
    }
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "admin_creds",
          JSON.stringify({ email: securityEmail, password: securityPassword })
        );
        logSystem("Security credentials updated successfully.");
        alert("Security credentials updated! Use these to log in next time.");
      } catch (err) {
        alert("Failed to save credentials to local storage.");
      }
    }
  };

  // Generic Save and delete functions
  const saveProject = async (item: Partial<ProjectData>) => {
    if (!item.title) return;
    const isNew = !item.id;
    const projectItem = {
      ...item,
      id: item.id || crypto.randomUUID(),
      stars: item.stars || 0,
      sort_order: item.sort_order || 0,
      type: item.type || "web",
      is_published: item.is_published !== undefined ? item.is_published : true,
      is_featured: item.is_featured || false,
      tech_stack: item.tech_stack || [],
      images: item.images || []
    } as ProjectData;

    if (!isBypassMode) {
      // Strip any base64 data URLs — Supabase cannot store them (too large)
      const dbItem = {
        ...projectItem,
        images: projectItem.images.filter((img) => !img.startsWith("data:"))
      };

      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.from("projects").upsert(dbItem);
      if (error) {
        logSystem(`Project sync error: ${error.message}`);
        window.alert(`🚨 SYNC FAILED: ${error.message}\n\nTip: If you uploaded an image file, please paste a URL instead.`);
        return; // Keep form open so user can fix it
      } else {
        window.alert("✅ NODE CACHED SUCCESSFULLY\n\nYour creation has been synchronized to the main interface.");
      }
    } else {
      window.alert("✅ NODE CACHED LOCALLY (Bypass Mode)");
    }

    // Only update local state and close form after success
    let updatedList;
    if (isNew) {
      updatedList = [...projects, projectItem];
    } else {
      updatedList = projects.map((p) => (p.id === item.id ? projectItem : p));
    }
    setProjects(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_projects", JSON.stringify(updatedList));
    }
    setEditingProject(null);
    logSystem(`Project '${item.title}' successfully cached.`);
  };

  const deleteProject = async (id: string) => {
    const updatedList = projects.filter((p) => p.id !== id);
    setProjects(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_projects", JSON.stringify(updatedList));
    }
    logSystem(`Project node '${id}' removed.`);
    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) window.alert(`🚨 DELETE FAILED: ${error.message}`);
      else window.alert("🗑️ NODE PURGED\n\nProject has been removed from cloud.");
    }
  };

  const saveSkill = async (item: Partial<SkillData>) => {
    if (!item.name) return;
    const isNew = !item.id;
    const skillItem = {
      ...item,
      id: item.id || crypto.randomUUID(),
      proficiency: item.proficiency || 80,
      radar_placement: item.radar_placement || "Trial"
    } as SkillData;

    let updatedList;
    if (isNew) {
      updatedList = [...skills, skillItem];
    } else {
      updatedList = skills.map((s) => (s.id === item.id ? skillItem : s));
    }
    setSkills(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_skills", JSON.stringify(updatedList));
    }
    setEditingSkill(null);
    logSystem(`Skill '${item.name}' saved.`);

    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.from("skills").upsert(skillItem);
      if (error) {
        logSystem(`Skill sync error: ${error.message}`);
        window.alert(`🚨 SYNC FAILED: ${error.message}`);
      } else {
        window.alert("✅ RADAR UPDATED\n\nSkill node has been synchronized.");
      }
    }
  };

  const deleteSkill = async (id: string) => {
    const updatedList = skills.filter((s) => s.id !== id);
    setSkills(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_skills", JSON.stringify(updatedList));
    }
    logSystem(`Skill node '${id}' removed.`);
    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.from("skills").delete().eq("id", id);
      if (error) window.alert(`🚨 DELETE FAILED: ${error.message}`);
      else window.alert("🗑️ NODE PURGED\n\nSkill has been removed from cloud.");
    }
  };

  const saveExperience = async (item: Partial<ExperienceData>) => {
    if (!item.title) return;
    const isNew = !item.id;
    const expItem = {
      ...item,
      id: item.id || crypto.randomUUID(),
      tags: item.tags || []
    } as ExperienceData;

    let updatedList;
    if (isNew) {
      updatedList = [...experience, expItem];
    } else {
      updatedList = experience.map((e) => (e.id === item.id ? expItem : e));
    }
    setExperience(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_experience", JSON.stringify(updatedList));
    }
    setEditingExperience(null);
    logSystem(`Experience '${item.title}' saved.`);

    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.from("experience").upsert(expItem);
      if (error) {
        logSystem(`Experience sync error: ${error.message}`);
        window.alert(`🚨 SYNC FAILED: ${error.message}`);
      } else {
        window.alert("✅ HISTORY LOGGED\n\nExperience record has been synchronized.");
      }
    }
  };

  const deleteExperience = async (id: string) => {
    const updatedList = experience.filter((e) => e.id !== id);
    setExperience(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_experience", JSON.stringify(updatedList));
    }
    logSystem(`Experience node '${id}' removed.`);
    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) window.alert(`🚨 DELETE FAILED: ${error.message}`);
      else window.alert("🗑️ NODE PURGED\n\nExperience entry has been removed.");
    }
  };

  const saveCertificate = async (item: Partial<CertificateData>) => {
    if (!item.title) return;
    const isNew = !item.id;
    const certItem = {
      ...item,
      id: item.id || crypto.randomUUID()
    } as CertificateData;

    let updatedList;
    if (isNew) {
      updatedList = [...certificates, certItem];
    } else {
      updatedList = certificates.map((c) => (c.id === item.id ? certItem : c));
    }
    setCertificates(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_certificates", JSON.stringify(updatedList));
    }
    setEditingCertificate(null);
    logSystem(`Certificate '${item.title}' saved.`);

    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.from("certificates").upsert(certItem);
      if (error) {
        logSystem(`Certificate sync error: ${error.message}`);
        window.alert(`🚨 SYNC FAILED: ${error.message}`);
      } else {
        window.alert("✅ CREDENTIAL VALIDATED\n\nCertificate entry has been synchronized.");
      }
    }
  };

  const deleteCertificate = async (id: string) => {
    const updatedList = certificates.filter((c) => c.id !== id);
    setCertificates(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_certificates", JSON.stringify(updatedList));
    }
    logSystem(`Certificate node '${id}' removed.`);
    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) window.alert(`🚨 DELETE FAILED: ${error.message}`);
      else window.alert("🗑️ NODE PURGED\n\nCertificate has been removed.");
    }
  };

  const savePost = async (item: Partial<BlogPost>) => {
    if (!item.title) return;
    const isNew = !item.id;
    const postItem = {
      ...item,
      id: item.id || crypto.randomUUID(),
      slug: item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      is_published: item.is_published !== undefined ? item.is_published : true,
      read_time: item.read_time || 5,
      created_at: item.created_at || new Date().toISOString()
    } as BlogPost;

    let updatedList;
    if (isNew) {
      updatedList = [postItem, ...posts];
    } else {
      updatedList = posts.map((p) => (p.id === item.id ? postItem : p));
    }
    setPosts(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_posts", JSON.stringify(updatedList));
    }
    setEditingPost(null);
    logSystem(`Journal Post '${item.title}' saved.`);

    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.from("blog_posts").upsert(postItem);
      if (error) {
        logSystem(`Blog sync error: ${error.message}`);
        window.alert(`🚨 SYNC FAILED: ${error.message}`);
      } else {
        window.alert("✅ TRANSMISSION BROADCASTED\n\nJournal post has been synchronized.");
      }
    }
  };

  const deletePost = async (id: string) => {
    const updatedList = posts.filter((p) => p.id !== id);
    setPosts(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("local_posts", JSON.stringify(updatedList));
    }
    logSystem(`Blog post '${id}' deleted.`);
    if (!isBypassMode) {
      const supabase = createBrowserClient(url, anonKey);
      await supabase.from("blog_posts").delete().eq("id", id);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-xs text-text-muted gap-4">
        <div className="w-8 h-8 rounded-full border border-t-accent-cyan border-white/5 animate-spin" />
        <div>DECRYPTING CONTROL MODULES...</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative overflow-hidden font-sans">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-surface-border bg-space-950/80 backdrop-blur-md flex flex-col justify-between p-6 z-10 shrink-0">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div>
            <img 
              src={profile.logo_url || "/logo.png"} 
              alt="System Logo" 
              className="h-10 w-auto object-contain mb-2"
            />
            <h2 className="font-heading font-extrabold uppercase text-white tracking-wider text-base">
              SYSTEM PORTAL
            </h2>
            <p className="text-[9px] font-mono text-text-muted uppercase tracking-widest mt-1">
              Terminal Node Admin
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {[
              { id: "overview", label: "Dashboard", icon: LayoutGrid },
              { id: "profile", label: "Profile Specs", icon: User },
              { id: "projects", label: "Creations", icon: Sparkles },
              { id: "skills", label: "Tech Radar", icon: Cpu },
              { id: "experience", label: "History", icon: Briefcase },
              { id: "certificates", label: "Credentials", icon: Award },
              { id: "blog", label: "Transmissions", icon: BookOpen },
              { id: "messages", label: "Inbox feed", icon: Inbox }
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id as any);
                    logSystem(`Switched console grid tab to [${t.label.toUpperCase()}]`);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-[11px] uppercase tracking-wider text-left transition-all ${
                    activeTab === t.id
                      ? "bg-accent-violet/15 border border-accent-violet/35 text-white shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                      : "text-text-muted hover:text-white border border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === t.id ? "text-accent-cyan" : "text-text-muted"}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-surface-border mt-8 space-y-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-mono text-[11px] text-text-muted hover:text-red-400 hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10"
          >
            <LogOut className="w-4 h-4 text-text-muted" />
            <span>Terminate Console</span>
          </button>
        </div>
      </aside>

      {/* Main Console Workspace */}
      <main className="flex-1 flex flex-col min-w-0 z-10 overflow-y-auto">
        {/* Top bar status */}
        <header className="border-b border-surface-border px-8 py-5 flex items-center justify-between bg-space-950/20 backdrop-blur-sm gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider truncate">
              Telemetry Server: {isBypassMode ? "LOCAL_SANDBOX" : "SUPABASE_ACTIVE"}
            </span>
          </div>

          <div className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
            Operator: <span className="text-white font-bold">{profile.name}</span>
          </div>
        </header>

        {/* Central Grid Workspace */}
        <div className="flex-1 p-8 max-w-6xl w-full mx-auto space-y-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold uppercase font-heading text-white tracking-tight">
                  Status Metrics
                </h1>
                <p className="text-xs font-mono text-text-muted mt-1 uppercase">
                  Central systems configuration feed.
                </p>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface-card border border-surface-border p-5 rounded-xl">
                  <h3 className="text-text-muted font-mono text-[10px] uppercase tracking-widest">
                    Creations
                  </h3>
                  <p className="text-3xl font-extrabold text-white font-mono mt-2">{projects.length}</p>
                </div>
                <div className="bg-surface-card border border-surface-border p-5 rounded-xl">
                  <h3 className="text-text-muted font-mono text-[10px] uppercase tracking-widest">
                    Radar Nodes
                  </h3>
                  <p className="text-3xl font-extrabold text-white font-mono mt-2">{skills.length}</p>
                </div>
                <div className="bg-surface-card border border-surface-border p-5 rounded-xl">
                  <h3 className="text-text-muted font-mono text-[10px] uppercase tracking-widest">
                    Transmissions
                  </h3>
                  <p className="text-3xl font-extrabold text-white font-mono mt-2">{posts.length}</p>
                </div>
                <div className="bg-surface-card border border-surface-border p-5 rounded-xl">
                  <h3 className="text-text-muted font-mono text-[10px] uppercase tracking-widest">
                    Inbox
                  </h3>
                  <p className="text-3xl font-extrabold text-white font-mono mt-2">{messages.length}</p>
                </div>
              </div>

              {/* System Console logger */}
              <GlassCard className="p-6">
                <h3 className="text-xs font-mono text-white uppercase tracking-wider border-b border-surface-border pb-3">
                  Telemetric Console Logs
                </h3>
                <div className="mt-4 bg-black/60 rounded-lg p-4 font-mono text-[10px] text-accent-cyan space-y-1.5 h-44 overflow-y-auto scrollbar-thin select-all">
                  {consoleLogs.map((log, i) => (
                    <div key={i}>{log}</div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold uppercase font-heading text-white tracking-tight">
                  Profile Configuration
                </h1>
                <p className="text-xs font-mono text-text-muted mt-1 uppercase">
                  Modify identity properties mapped inside index landing cards.
                </p>
              </div>

              <GlassCard className="p-6">
                <form onSubmit={handleProfileSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        Sub-title / Role
                      </label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        Geo-Pin Coordinates / Location
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        Time Zone Mapped
                      </label>
                      <input
                        type="text"
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block">
                        Avatar Node (Photo URL or Upload)
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={profile.photo_url}
                          onChange={(e) => setProfile({ ...profile, photo_url: e.target.value })}
                          className="flex-1 bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                          placeholder="https://example.com/avatar.jpg"
                        />
                        <label className="cursor-pointer shrink-0 bg-white/5 hover:bg-white/10 px-4 py-2.5 border border-surface-border rounded-lg text-xs font-mono text-text-primary transition-colors hover:text-accent-cyan">
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setCropperTarget("profile");
                                setCropperAspectRatio(1); // 1:1 for profile
                                setCropperImageUrl(url);
                                setCropperModalOpen(true);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted block">
                        System Logo (Logo URL or Upload)
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={profile.logo_url || ""}
                          onChange={(e) => setProfile({ ...profile, logo_url: e.target.value })}
                          className="flex-1 bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                          placeholder="https://example.com/logo.png"
                        />
                        <label className="cursor-pointer shrink-0 bg-white/5 hover:bg-white/10 px-4 py-2.5 border border-surface-border rounded-lg text-xs font-mono text-text-primary transition-colors hover:text-accent-cyan">
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                setCropperTarget("logo");
                                setCropperAspectRatio(undefined); // free form for logo
                                setCropperImageUrl(url);
                                setCropperModalOpen(true);
                              }
                              e.target.value = "";
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        CV Download Node URL
                      </label>
                      <input
                        type="text"
                        value={profile.cv_url}
                        onChange={(e) => setProfile({ ...profile, cv_url: e.target.value })}
                        className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      Status Beacon Message
                    </label>
                    <input
                      type="text"
                      value={profile.availability_message}
                      onChange={(e) => setProfile({ ...profile, availability_message: e.target.value })}
                      className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      Telemetry bio short
                    </label>
                    <textarea
                      rows={2}
                      value={profile.bio_short}
                      onChange={(e) => setProfile({ ...profile, bio_short: e.target.value })}
                      className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg p-4 text-xs font-mono text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                      Core Mission Statement (bio long)
                    </label>
                    <textarea
                      rows={4}
                      value={profile.bio_long}
                      onChange={(e) => setProfile({ ...profile, bio_long: e.target.value })}
                      className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-lg p-4 text-xs font-mono text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-accent-violet hover:bg-accent-violet/90 text-white rounded-lg font-mono text-xs font-semibold transition-all border border-accent-violet/20"
                    >
                      <Save className="w-4 h-4" />
                      <span>Commit Configuration</span>
                    </button>
                  </div>
                </form>
              </GlassCard>

              {/* Security & Access Management */}
              <GlassCard className="border border-red-500/20 p-6 md:p-8 backdrop-blur-xl relative mt-8">
                <div className="absolute top-0 right-0 p-4">
                  <Lock className="w-5 h-5 text-red-500/40" />
                </div>
                <h2 className="text-lg font-bold uppercase font-heading text-red-400 mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" />
                  Security & Access Control
                </h2>
                <form onSubmit={handleSecuritySave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        Admin Login Identifier (Username)
                      </label>
                      <input
                        type="text"
                        required
                        value={securityEmail}
                        onChange={(e) => setSecurityEmail(e.target.value)}
                        className="w-full bg-white/[0.02] border border-red-500/20 focus:border-red-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                        Decryption Phrase (Password)
                      </label>
                      <input
                        type="password"
                        required
                        value={securityPassword}
                        onChange={(e) => setSecurityPassword(e.target.value)}
                        className="w-full bg-white/[0.02] border border-red-500/20 focus:border-red-500 focus:outline-none rounded-lg px-4 py-2.5 text-xs font-mono text-white transition-colors"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-100 rounded-lg font-mono text-xs font-semibold transition-all border border-red-500/30"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Update Credentials</span>
                    </button>
                  </div>
                </form>
              </GlassCard>
            </div>
          )}

          {/* TAB: CREATIONS / PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold uppercase font-heading text-white tracking-tight">
                    Project Matrix
                  </h1>
                  <p className="text-xs font-mono text-text-muted mt-1 uppercase">
                    Configure showcase portfolio catalog creations.
                  </p>
                </div>
                <button
                  onClick={() => setEditingProject({})}
                  className="flex items-center gap-2 px-4 py-2.5 bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Build Node</span>
                </button>
              </div>

              {/* Projects Forms Slider */}
              {editingProject && (
                <GlassCard className="p-6 border border-accent-cyan/30">
                  <h3 className="text-xs font-mono text-white uppercase tracking-wider mb-4">
                    {editingProject.id ? "Edit Creation Frame" : "Register Creation Node"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={editingProject.title || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Tech Stack (comma-separated)"
                      value={editingProject.tech_stack?.join(", ") || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          tech_stack: e.target.value.split(",").map((s) => s.trim())
                        })
                      }
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Cover Image URL"
                        value={editingProject.images?.[0] || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, images: [e.target.value] })}
                        className="flex-1 bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                      />
                      <label className="cursor-pointer shrink-0 bg-white/5 hover:bg-white/10 px-4 py-2.5 border border-surface-border rounded-lg text-xs font-mono text-text-primary transition-colors hover:text-accent-cyan">
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file, "project");
                              setEditingProject({ ...editingProject, images: [url] });
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="GitHub Code URL"
                      value={editingProject.github_url || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Live Deployment URL (demo_url)"
                      value={editingProject.demo_url || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, demo_url: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <select
                      value={editingProject.type || "web"}
                      onChange={(e) => setEditingProject({ ...editingProject, type: e.target.value as any })}
                      className="bg-black border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    >
                      <option value="web">Web Interface</option>
                      <option value="mobile">Mobile Application</option>
                      <option value="api">Backend Engine / API</option>
                      <option value="tool">System Utility Tool</option>
                    </select>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs font-mono text-text-muted cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.is_featured || false}
                          onChange={(e) => setEditingProject({ ...editingProject, is_featured: e.target.checked })}
                          className="w-4 h-4 accent-accent-violet rounded"
                        />
                        <span>Featured Node</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-mono text-text-muted cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.is_published !== false}
                          onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                          className="w-4 h-4 accent-accent-violet rounded"
                        />
                        <span>Published Node</span>
                      </label>
                    </div>
                  </div>
                  <textarea
                    placeholder="Short summary description"
                    rows={2}
                    value={editingProject.short_desc || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, short_desc: e.target.value })}
                    className="w-full bg-white/[0.02] border border-surface-border rounded-lg p-4 text-xs font-mono text-white mt-4"
                  />
                  <textarea
                    placeholder="Long project details..."
                    rows={4}
                    value={editingProject.long_desc || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, long_desc: e.target.value })}
                    className="w-full bg-white/[0.02] border border-surface-border rounded-lg p-4 text-xs font-mono text-white mt-4"
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => saveProject(editingProject)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-accent-violet hover:bg-accent-violet/90 text-white rounded-lg font-mono text-xs font-semibold"
                    >
                      <Check className="w-4 h-4" />
                      <span>Cache Node</span>
                    </button>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-surface-border rounded-lg font-mono text-xs text-text-primary"
                    >
                      Dismiss
                    </button>
                  </div>
                </GlassCard>
              )}

              {/* Projects List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-surface-card border border-surface-border rounded-xl p-5 flex items-start justify-between gap-4"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-accent-cyan uppercase tracking-wider">
                        {proj.type}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1 leading-snug">{proj.title}</h4>
                      <p className="text-xs text-text-muted mt-1.5 line-clamp-2">{proj.short_desc}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-muted hover:text-white transition-colors"
                        aria-label="Edit project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-text-muted hover:text-red-400 transition-colors"
                        aria-label="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TECH RADAR / SKILLS */}
          {activeTab === "skills" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold uppercase font-heading text-white tracking-tight">
                    Technology Radar Matrix
                  </h1>
                  <p className="text-xs font-mono text-text-muted mt-1 uppercase">
                    Modify active radar vectors and expertise levels.
                  </p>
                </div>
                <button
                  onClick={() => setEditingSkill({})}
                  className="flex items-center gap-2 px-4 py-2.5 bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Build Node</span>
                </button>
              </div>

              {editingSkill && (
                <GlassCard className="p-6 border border-accent-cyan/30">
                  <h3 className="text-xs font-mono text-white uppercase tracking-wider mb-4">
                    Register Tech Node
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Skill Name (e.g. TypeScript)"
                      value={editingSkill.name || ""}
                      onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Icon Name (e.g. typescript-plain)"
                      value={editingSkill.icon || ""}
                      onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <select
                      value={editingSkill.category || "Frontend"}
                      onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                      className="bg-black border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    >
                      <option value="Frontend">Frontend UI</option>
                      <option value="Backend">Backend Service</option>
                      <option value="Languages">Programming Language</option>
                      <option value="Tools">Development Tool</option>
                    </select>
                    <select
                      value={editingSkill.radar_placement || "Trial"}
                      onChange={(e) => setEditingSkill({ ...editingSkill, radar_placement: e.target.value as any })}
                      className="bg-black border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    >
                      <option value="Adopt">Adopt Ring</option>
                      <option value="Trial">Trial Ring</option>
                      <option value="Assess">Assess Ring</option>
                      <option value="Hold">Hold Ring</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Proficiency % (0-100)"
                      value={editingSkill.proficiency || ""}
                      onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => saveSkill(editingSkill)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-accent-violet hover:bg-accent-violet/90 text-white rounded-lg font-mono text-xs font-semibold"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Tech Node</span>
                    </button>
                    <button
                      onClick={() => setEditingSkill(null)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-surface-border rounded-lg font-mono text-xs text-text-primary"
                    >
                      Dismiss
                    </button>
                  </div>
                </GlassCard>
              )}

              {/* Skills Listing Table */}
              <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
                <table className="w-full border-collapse text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-surface-border bg-white/[0.01] text-text-muted">
                      <th className="p-4">Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Proficiency</th>
                      <th className="p-4">Radar Placement</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((sk) => (
                      <tr key={sk.id} className="border-b border-surface-border/50 hover:bg-white/[0.01]">
                        <td className="p-4 font-bold text-white">{sk.name}</td>
                        <td className="p-4 text-text-muted">{sk.category}</td>
                        <td className="p-4 text-accent-cyan">{sk.proficiency}%</td>
                        <td className="p-4 text-accent-amber">{sk.radar_placement}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button
                            onClick={() => setEditingSkill(sk)}
                            className="p-1.5 bg-white/5 hover:bg-white/10 rounded text-text-muted hover:text-white"
                            aria-label="Edit skill"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSkill(sk.id)}
                            className="p-1.5 bg-white/5 hover:bg-red-500/10 rounded text-text-muted hover:text-red-400"
                            aria-label="Delete skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold uppercase font-heading text-white tracking-tight">
                    Historical Timeline
                  </h1>
                  <p className="text-xs font-mono text-text-muted mt-1 uppercase">
                    Configure work roles and education milestone nodes.
                  </p>
                </div>
                <button
                  onClick={() => setEditingExperience({})}
                  className="flex items-center gap-2 px-4 py-2.5 bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Build Node</span>
                </button>
              </div>

              {editingExperience && (
                <GlassCard className="p-6 border border-accent-cyan/30">
                  <h3 className="text-xs font-mono text-white uppercase tracking-wider mb-4">
                    Register Timeline Node
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Title / Role"
                      value={editingExperience.title || ""}
                      onChange={(e) => setEditingExperience({ ...editingExperience, title: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Organization"
                      value={editingExperience.organization || ""}
                      onChange={(e) => setEditingExperience({ ...editingExperience, organization: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Start Date (e.g. 2025-01-15)"
                      value={editingExperience.start_date || ""}
                      onChange={(e) => setEditingExperience({ ...editingExperience, start_date: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="End Date (blank if current)"
                      value={editingExperience.end_date || ""}
                      onChange={(e) => setEditingExperience({ ...editingExperience, end_date: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <select
                      value={editingExperience.type || "work"}
                      onChange={(e) => setEditingExperience({ ...editingExperience, type: e.target.value as any })}
                      className="bg-black border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    >
                      <option value="work">Professional Work</option>
                      <option value="education">Academic Education</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Role description/accomplishments details..."
                    rows={4}
                    value={editingExperience.description || ""}
                    onChange={(e) => setEditingExperience({ ...editingExperience, description: e.target.value })}
                    className="w-full bg-white/[0.02] border border-surface-border rounded-lg p-4 text-xs font-mono text-white mt-4"
                  />
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => saveExperience(editingExperience)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-accent-violet hover:bg-accent-violet/90 text-white rounded-lg font-mono text-xs font-semibold"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Timeline Node</span>
                    </button>
                    <button
                      onClick={() => setEditingExperience(null)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-surface-border rounded-lg font-mono text-xs text-text-primary"
                    >
                      Dismiss
                    </button>
                  </div>
                </GlassCard>
              )}

              {/* Experience list mapping */}
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-surface-card border border-surface-border p-5 rounded-xl flex items-start justify-between gap-4"
                  >
                    <div>
                      <span className="text-[9px] font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded uppercase tracking-wider">
                        {exp.type}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1.5 leading-snug">
                        {exp.title} at <span className="text-accent-cyan">{exp.organization}</span>
                      </h4>
                      <p className="text-[10px] font-mono text-text-muted mt-1">
                        {exp.start_date} {exp.end_date ? `to ${exp.end_date}` : "// Present"}
                      </p>
                      <p className="text-xs text-text-muted mt-2 line-clamp-2">{exp.description}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditingExperience(exp)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-muted hover:text-white"
                        aria-label="Edit experience"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-text-muted hover:text-red-400"
                        aria-label="Delete experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CERTIFICATES */}
          {activeTab === "certificates" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold uppercase font-heading text-white tracking-tight">
                    Credentials Vault
                  </h1>
                  <p className="text-xs font-mono text-text-muted mt-1 uppercase">
                    Configure certified records showcased inside credentials grids.
                  </p>
                </div>
                <button
                  onClick={() => setEditingCertificate({})}
                  className="flex items-center gap-2 px-4 py-2.5 bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Build Node</span>
                </button>
              </div>

              {editingCertificate && (
                <GlassCard className="p-6 border border-accent-cyan/30">
                  <h3 className="text-xs font-mono text-white uppercase tracking-wider mb-4">
                    Register Credential Node
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Title (e.g. AWS Solutions Architect)"
                      value={editingCertificate.title || ""}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, title: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Issuer (e.g. Amazon Web Services)"
                      value={editingCertificate.issuer || ""}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, issuer: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Issue Date (e.g. 2025-08-15)"
                      value={editingCertificate.issue_date || ""}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, issue_date: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <input
                      type="text"
                      placeholder="Verification URL"
                      value={editingCertificate.verify_url || ""}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, verify_url: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Certificate Image URL"
                        value={editingCertificate.image_url || ""}
                        onChange={(e) => setEditingCertificate({ ...editingCertificate, image_url: e.target.value })}
                        className="flex-1 bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                      />
                      <label className="cursor-pointer shrink-0 bg-white/5 hover:bg-white/10 px-4 py-2.5 border border-surface-border rounded-lg text-xs font-mono text-text-primary transition-colors hover:text-accent-cyan">
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleFileUpload(file, "certificate");
                              setEditingCertificate({ ...editingCertificate, image_url: url });
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      placeholder="Category Tag (e.g. Cloud, Code)"
                      value={editingCertificate.category || ""}
                      onChange={(e) => setEditingCertificate({ ...editingCertificate, category: e.target.value })}
                      className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                    />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => saveCertificate(editingCertificate)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-accent-violet hover:bg-accent-violet/90 text-white rounded-lg font-mono text-xs font-semibold"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Credential</span>
                    </button>
                    <button
                      onClick={() => setEditingCertificate(null)}
                      className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-surface-border rounded-lg font-mono text-xs text-text-primary"
                    >
                      Dismiss
                    </button>
                  </div>
                </GlassCard>
              )}

              {/* Certificates List mapping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-surface-card border border-surface-border rounded-xl p-5 flex gap-4 items-center justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {cert.image_url && (
                        <div className="w-16 h-12 shrink-0 bg-white/5 rounded overflow-hidden border border-white/5">
                          <img src={cert.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white leading-snug truncate">{cert.title}</h4>
                        <p className="text-[10px] text-text-muted mt-0.5 truncate">{cert.issuer}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setEditingCertificate(cert)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-muted hover:text-white"
                        aria-label="Edit certificate"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCertificate(cert.id)}
                        className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-text-muted hover:text-red-400"
                        aria-label="Delete certificate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BLOG / JOURNAL EDIT SCREEN (SPLIT PREVIEW EDITOR) */}
          {activeTab === "blog" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold uppercase font-heading text-white tracking-tight">
                    Systems Transmissions Journal
                  </h1>
                  <p className="text-xs font-mono text-text-muted mt-1 uppercase">
                    Compose technical logs featuring split-screen markdown validation previews.
                  </p>
                </div>
                {!editingPost && (
                  <button
                    onClick={() =>
                      setEditingPost({
                        title: "",
                        content: "# New Transmission Log\n\nStart writing technical logs here using markdown...",
                        tags: ["Code"],
                        is_published: true
                      })
                    }
                    className="flex items-center gap-2 px-4 py-2.5 bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/30 text-accent-cyan rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Write Log</span>
                  </button>
                )}
              </div>

              {/* SPLIT PREVIEW EDITOR PANEL */}
              {editingPost ? (
                <div className="space-y-6">
                  {/* Metadata Input Fields */}
                  <GlassCard className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Log Title"
                        value={editingPost.title || ""}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white col-span-2"
                      />
                      <input
                        type="number"
                        placeholder="Read Time (minutes)"
                        value={editingPost.read_time || ""}
                        onChange={(e) => setEditingPost({ ...editingPost, read_time: Number(e.target.value) })}
                        className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                      />
                      <input
                        type="text"
                        placeholder="Tags (comma-separated)"
                        value={editingPost.tags?.join(", ") || ""}
                        onChange={(e) =>
                          setEditingPost({
                            ...editingPost,
                            tags: e.target.value.split(",").map((s) => s.trim())
                          })
                        }
                        className="bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                      />
                      <div className="flex gap-2 items-center md:col-span-2">
                        <input
                          type="text"
                          placeholder="Cover Image URL"
                          value={editingPost.cover_url || ""}
                          onChange={(e) => setEditingPost({ ...editingPost, cover_url: e.target.value })}
                          className="flex-1 bg-white/[0.02] border border-surface-border rounded-lg px-4 py-2.5 text-xs font-mono text-white"
                        />
                        <label className="cursor-pointer shrink-0 bg-white/5 hover:bg-white/10 px-4 py-2.5 border border-surface-border rounded-lg text-xs font-mono text-text-primary transition-colors hover:text-accent-cyan">
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await handleFileUpload(file, "blog");
                                setEditingPost({ ...editingPost, cover_url: url });
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-mono text-text-muted cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPost.is_published !== false}
                          onChange={(e) => setEditingPost({ ...editingPost, is_published: e.target.checked })}
                          className="w-4 h-4 accent-accent-violet rounded"
                        />
                        <span>Publish Transmission</span>
                      </label>
                    </div>
                  </GlassCard>

                  {/* Split editor window */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-h-[400px]">
                    {/* Left: Input Textarea */}
                    <div className="flex flex-col bg-surface-card border border-surface-border rounded-xl overflow-hidden">
                      <div className="px-4 py-2 border-b border-surface-border bg-white/[0.01] font-mono text-[10px] text-text-muted uppercase tracking-wider">
                        Source Markdown
                      </div>
                      <textarea
                        rows={18}
                        value={editingPost.content || ""}
                        onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        className="flex-1 w-full bg-transparent border-0 focus:outline-none focus:ring-0 p-5 font-mono text-xs text-white leading-relaxed resize-y scrollbar-thin"
                      />
                    </div>

                    {/* Right: Render Preview */}
                    <div className="flex flex-col bg-surface-card border border-surface-border rounded-xl overflow-hidden">
                      <div className="px-4 py-2 border-b border-surface-border bg-white/[0.01] font-mono text-[10px] text-accent-cyan uppercase tracking-wider">
                        Dynamic Visual Preview
                      </div>
                      <div className="flex-1 p-5 overflow-y-auto max-h-[400px] scrollbar-thin">
                        <MarkdownRenderer content={editingPost.content || ""} />
                      </div>
                    </div>
                  </div>

                  {/* Action triggers */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => savePost(editingPost)}
                      className="flex items-center gap-2 px-6 py-3 bg-accent-violet hover:bg-accent-violet/90 text-white rounded-lg font-mono text-xs font-semibold"
                    >
                      <Check className="w-4 h-4" />
                      <span>Sync Transmission</span>
                    </button>
                    <button
                      onClick={() => setEditingPost(null)}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-surface-border rounded-lg font-mono text-xs text-text-primary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* Blog post list view */
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-surface-card border border-surface-border p-5 rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <h4 className="text-base font-bold text-white leading-snug truncate">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-text-muted mt-1.5">
                          <span className="text-accent-cyan">/{post.slug}</span>
                          <span>{post.read_time} min read</span>
                          <span>•</span>
                          <span className="flex gap-1">
                            {post.tags.map((t) => (
                              <span key={t}>#{t}</span>
                            ))}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-muted hover:text-white"
                          aria-label="Edit post"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-text-muted hover:text-red-400"
                          aria-label="Delete post"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MESSAGES / INBOX VIEW */}
          {activeTab === "messages" && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-extrabold uppercase font-heading text-white tracking-tight">
                  Inbox Transmissions
                </h1>
                <p className="text-xs font-mono text-text-muted mt-1 uppercase">
                  Read inquiries and messages dispatched from your contact form.
                </p>
              </div>

              {/* Messages Inbox Grid */}
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-surface-border rounded-xl">
                    <p className="font-mono text-xs text-text-muted">
                      {"// Inbox queue is currently empty."}
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <GlassCard key={msg.id} className="p-5 space-y-3 relative">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-3">
                        <div>
                          <h4 className="text-sm font-bold text-white font-mono">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-[10px] text-accent-cyan hover:underline">
                            {msg.email}
                          </a>
                        </div>
                        <div className="text-[9px] font-mono text-text-muted flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.message}
                      </p>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      <ImageCropperModal
        isOpen={cropperModalOpen}
        onClose={() => setCropperModalOpen(false)}
        imageUrl={cropperImageUrl}
        onCropComplete={handleCropperComplete}
        aspectRatio={cropperAspectRatio}
        title={cropperTarget === "logo" ? "Edit System Logo" : "Edit Profile Avatar"}
      />
    </div>
  );
}
