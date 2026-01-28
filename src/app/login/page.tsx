"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Fingerprint } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-zinc-900 p-4 selection:bg-red-100 selection:text-red-900">
      <div className="w-full max-w-sm">
        
        {/* Branding */}
        <div className="text-center mb-10">
          <Link href="/" className="group inline-block">
            <div className="flex justify-center mb-4">
               <div className="w-12 h-12 bg-white rounded-xl border border-zinc-200 flex items-center justify-center shadow-sm group-hover:border-red-600 transition-colors">
                 <Fingerprint className="w-6 h-6 text-zinc-900 group-hover:text-red-600 transition-colors" />
               </div>
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 group-hover:text-red-600 transition-colors">
              BossWrite
            </h1>
          </Link>
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">
            The Executive Ghostwriter
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-xl shadow-zinc-200/50">
          <h2 className="text-xl font-black uppercase italic mb-6 text-zinc-900">Access HQ</h2>
          
          <form onSubmit={handleMagicLink} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                Professional Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                required
                className="w-full bg-white border border-zinc-200 p-4 rounded-xl focus:border-red-600 outline-none transition-all text-sm text-zinc-900 placeholder:text-zinc-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg ${
                loading 
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none" 
                  : "bg-zinc-900 text-white hover:bg-red-600 hover:shadow-red-600/20 active:scale-[0.98]"
              }`}
            >
              {loading ? "Transmitting..." : "Get Magic Link"}
            </button>
          </form>

          {/* Feedback UI */}
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-xs font-bold text-center animate-in fade-in slide-in-from-top-2 ${
              message.type === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
          Secure • Passwordless • Single-Use Link
        </p>
      </div>
    </div>
  );
}