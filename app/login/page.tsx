"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Lock, Mail, Server, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isBypassMode, setIsBypassMode] = useState(false);

  // Initialize supabase browser client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  
  useEffect(() => {
    if (!url || !anonKey) {
      setIsBypassMode(true);
    }
  }, [url, anonKey]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (isBypassMode) {
      // Local authentication for bypass mode
      const storedCredsStr = localStorage.getItem("admin_creds");
      let validEmail = "username";
      let validPassword = "admin123";

      if (storedCredsStr) {
        try {
          const creds = JSON.parse(storedCredsStr);
          validEmail = creds.email;
          validPassword = creds.password;
        } catch (e) {
          console.warn("Invalid admin creds in local storage");
        }
      }

      if (email === validEmail && password === validPassword) {
        setSuccessMsg("Local credentials verified. Initializing console...");
        sessionStorage.setItem("is_admin_logged_in", "true");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1000);
      } else {
        setErrorMsg("Invalid local credentials. Access denied.");
        setLoading(false);
      }
      return;
    }

    try {
      const supabase = createBrowserClient(url, anonKey);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Session validated successfully. Initializing console...");
        sessionStorage.setItem("is_admin_logged_in", "true");
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1200);
      }
    } catch (e: any) {
      setErrorMsg("An unexpected auth handler crash occurred: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-black">
      {/* Background neon dots & grid */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-violet/10 via-space-950 to-black" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent-cyan/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <GlassCard className="border border-surface-border p-8 backdrop-blur-2xl relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-full bg-accent-violet/10 border border-accent-violet/30 text-accent-violet mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold uppercase font-heading text-white tracking-wider">
              Control Panel Login
            </h1>
            <p className="text-xs font-mono text-text-muted mt-2 uppercase tracking-widest">
              Security Protocol Core // Decrypting Auth
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Display message logs */}
            {errorMsg && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs font-mono text-red-400">
                {"// ERROR: "}{errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-mono text-emerald-400">
                {"// SUCCESS: "}{successMsg}
              </div>
            )}

            {isBypassMode && (
              <div className="p-3.5 bg-accent-amber/10 border border-accent-amber/20 rounded-lg text-xs font-mono text-accent-amber">
                {"// LOCAL AUTH MODE: Offline bypass protection active. Enter credentials to decrypt the workspace."}
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                Security Identifier (Username)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-xl pl-11 pr-4 py-3 text-xs font-mono text-white placeholder-text-muted transition-colors"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                Verification Phrase (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.02] border border-surface-border focus:border-accent-cyan focus:outline-none rounded-xl pl-11 pr-4 py-3 text-xs font-mono text-white placeholder-text-muted transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-accent-violet hover:bg-accent-violet/90 disabled:bg-accent-violet/40 text-white rounded-lg font-mono text-sm font-semibold transition-all border border-accent-violet/20 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              >
                <span>Decrypt Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Back Home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-text-muted hover:text-white transition-colors"
            >
              <Server className="w-3.5 h-3.5" />
              <span>System Grid Exit</span>
            </Link>
          </div>

        </GlassCard>
      </div>
    </main>
  );
}
