"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Supabase sends the magic link to the provided email
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This MUST match your redirect URL in the Supabase Dashboard
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Check your email for the magic link!" });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 selection:bg-red-600">
      <div className="w-full max-w-sm">
        
        {/* Branding */}
        <div className="text-center mb-10">
          <Link href="/" className="group">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-red-600 transition-colors">
              BossWrite
            </h1>
          </Link>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
            The Executive Ghostwriter
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
          <h2 className="text-xl font-black uppercase italic mb-6">Access HQ</h2>
          
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Professional Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                required
                className="w-full bg-black border border-zinc-700 p-4 rounded-xl focus:border-red-600 outline-none transition-all text-sm text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${
                loading 
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" 
                  : "bg-white text-black hover:bg-red-600 hover:text-white active:scale-[0.98]"
              }`}
            >
              {loading ? "Transmitting..." : "Get Magic Link"}
            </button>
          </form>

          {/* Feedback UI */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-xs font-bold text-center animate-in ${
              message.type === "success" 
                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                : "bg-red-500/10 text-red-500 border border-red-500/20"
            }`}>
              {message.text}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
          Secure • Passwordless • Single-Use Link
        </p>
      </div>
    </div>
  );
}