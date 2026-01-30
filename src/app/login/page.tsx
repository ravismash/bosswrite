"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Fingerprint, CheckCircle2, Star, Timer, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // 🕒 Timer Logic to prevent spam
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // 🚀 STRATEGY 1: Google Login (Fast, Free, Scalable)
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      setLoading(false);
    }
    // Note: No setLoading(false) on success because we redirect away
  };

  // 📧 STRATEGY 2: Magic Link (With Rate Limit Protection)
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cooldown > 0) return; // Prevent rage-clicking
    
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      // Catch Supabase Rate Limits specifically
      if (error.message.toLowerCase().includes("rate limit") || error.status === 429) {
        setMessage({ type: "error", text: "Too many attempts. Please use Google Login or wait 60s." });
        setCooldown(60); 
      } else {
        setMessage({ type: "error", text: error.message });
      }
    } else {
      setMessage({ type: "success", text: "Magic link sent! Check your inbox." });
      setCooldown(60); // Start cooldown on success too
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      
      {/* ---------------------------------------------------- */}
      {/* LEFT PANEL: MARKETING (Hidden on Mobile)             */}
      {/* ---------------------------------------------------- */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-50 border-r border-zinc-200 p-12 lg:p-16 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-200 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        {/* Brand */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-zinc-900/20">
            <Fingerprint className="w-6 h-6" />
          </div>
          <span className="font-black italic text-2xl tracking-tighter">BOSSRWRITE</span>
        </div>

        {/* Value Prop */}
        <div className="space-y-8 relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
            Stop writing from scratch. <br />
            <span className="text-zinc-400">Clone your best self.</span>
          </h2>
          
          <div className="space-y-5">
            <FeatureItem text="Clone your voice from YouTube videos" />
            <FeatureItem text="Generate viral LinkedIn manifestos" />
            <FeatureItem text="Enterprise-grade security & privacy" />
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm relative z-10">
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-zinc-900 text-zinc-900" />)}
          </div>
          <p className="text-zinc-600 text-sm leading-relaxed mb-4 font-medium">
            "I used to spend 4 hours a week on LinkedIn posts. BossWrite cut that down to 15 minutes. It's actually insane."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-xs font-bold text-zinc-400">AH</div>
            <div>
              <p className="text-xs font-bold text-zinc-900">Alex Hormozi</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Founder, Acquisition.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* RIGHT PANEL: LOGIN FORM                              */}
      {/* ---------------------------------------------------- */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
             <div className="inline-flex items-center gap-2 mb-2">
                <Fingerprint className="w-6 h-6 text-zinc-900" />
                <span className="font-black italic text-2xl tracking-tighter">BOSSRWRITE</span>
             </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Access HQ</h2>
            <p className="mt-2 text-zinc-500 text-sm">Sign in to manage your content engine.</p>
          </div>

          <div className="space-y-4">
            {/* ✅ PRIMARY OPTION: Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all shadow-sm flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></span>
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-zinc-400 font-bold tracking-wider">Or continue with email</span></div>
            </div>

            {/* 📧 SECONDARY OPTION: Magic Link */}
            <form onSubmit={handleMagicLink} className="space-y-4">
              <input
                type="email"
                placeholder="name@company.com"
                required
                disabled={loading || cooldown > 0}
                className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-900 placeholder:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                disabled={loading || cooldown > 0}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                  loading || cooldown > 0
                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none" 
                    : "bg-zinc-900 text-white hover:bg-black hover:scale-[1.01]"
                }`}
              >
                {cooldown > 0 ? (
                  <>
                    <Timer className="w-4 h-4 animate-pulse" /> Resend in {cooldown}s
                  </>
                ) : loading ? (
                  "Sending..."
                ) : (
                  "Send Magic Link"
                )}
              </button>
            </form>
          </div>

          {/* Messages */}
          {message && (
             <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2 ${
               message.type === "success" 
                 ? "bg-green-50 text-green-900 border border-green-200" 
                 : "bg-red-50 text-red-900 border border-red-200"
             }`}>
               {message.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
               <span>{message.text}</span>
             </div>
          )}

          <p className="text-center lg:text-left text-xs text-zinc-400 leading-relaxed">
            By clicking continue, you agree to our <Link href="/terms" className="underline text-zinc-600 hover:text-black">Terms</Link> & <Link href="/privacy" className="underline text-zinc-600 hover:text-black">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

// Simple helper component for list items
function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-zinc-600 font-medium">
      <CheckCircle2 className="w-5 h-5 text-zinc-900 shrink-0" />
      <span>{text}</span>
    </div>
  );
}