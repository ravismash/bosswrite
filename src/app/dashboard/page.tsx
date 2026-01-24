"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AudienceSelector from "@/components/AudienceSelector";
import { LogOut, HelpCircle, MessageSquare, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [samples, setSamples] = useState("");
  const [userType, setUserType] = useState("solopreneur");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/login");
      const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
      if (profile) setCredits(profile.credits);
    };
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePost = async () => {
    if (credits !== null && credits < 1) return alert("Out of credits!");
    setLoading(true);
    setResult("");

    try {
      setStep("Extracting Voice DNA...");
      const dnaRes = await fetch("/api/extract-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: [samples] }),
      });
      const dnaData = await dnaRes.json();
      if (!dnaRes.ok) throw new Error(dnaData.error || "DNA Extraction failed");
      
      setStep("Fetching Transcript...");
      const transRes = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });
      const transData = await transRes.json();
      if (!transRes.ok) throw new Error(transData.error || "Transcription failed");
      
      setStep("Writing Manifesto...");
      const ghostRes = await fetch("/api/ghostwrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          transcript: transData.transcript, 
          voiceProfile: dnaData.voiceJson, 
          audience: userType 
        }),
      });
      const ghostData = await ghostRes.json();
      if (!ghostRes.ok) throw new Error(ghostData.error || "Ghostwriting failed");
      
      setResult(ghostData.post);
      if (credits !== null) setCredits(credits - 1); 

    } catch (error: any) {
      alert(`⚠️ ERROR: ${error.message}`);
    } finally {
      setLoading(false);
      setStep("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-inter">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-1/3 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter font-montserrat">BossWrite</h1>
            <button onClick={handleLogout} className="text-zinc-500 hover:text-white transition-colors" title="Logout">
              <LogOut size={20} />
            </button>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-6">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Available Credits</p>
              <p className="text-4xl font-black text-white italic">{credits ?? "..."}</p>
            </div>
            
            <AudienceSelector selected={userType} onChange={setUserType} />
          </div>

          {/* HELP & FEEDBACK SECTION */}
          <div className="mt-auto space-y-4 bg-zinc-950 p-6 rounded-3xl border border-dashed border-zinc-800">
            <Link href="/help" className="flex items-center gap-3 text-zinc-400 hover:text-red-500 transition-all group">
              <HelpCircle size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Pro Guide (200w Tips)</span>
            </Link>
            
            <a href="mailto:support@bosswrite.ai?subject=BossWrite Feedback" className="flex items-center gap-3 text-zinc-400 hover:text-white transition-all group">
              <MessageSquare size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Send Feedback</span>
            </a>
          </div>
        </aside>

        {/* MAIN AREA */}
        <main className="flex-1 space-y-6">
          <div className="space-y-4">
            <input 
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none focus:border-red-600 transition-all text-sm"
              placeholder="YouTube URL (Max 45 mins)" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <textarea 
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl h-48 outline-none focus:border-red-600 transition-all text-sm"
              placeholder="Paste your past posts or writing samples here to clone your DNA..." 
              value={samples} onChange={(e) => setSamples(e.target.value)}
            />
            <button 
              disabled={loading || !youtubeUrl} onClick={generatePost}
              className={`w-full py-5 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg ${
                loading ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-red-600 hover:bg-white hover:text-black shadow-red-900/20"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                  {step}
                </span>
              ) : "Execute Manifesto"}
            </button>
          </div>

          {/* RESULT SECTION */}
          {result && (
            <div className="relative mt-10 p-8 bg-white text-black rounded-3xl animate-in fade-in slide-in-from-bottom-4 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  LinkedIn Optimized Manifesto
                </span>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-xs font-bold hover:text-red-600 transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}{" "}
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>
              
              <p className="whitespace-pre-wrap font-serif text-xl leading-relaxed italic text-zinc-900">
                {result}
              </p>
              
              <div className="mt-8 pt-4 border-t border-zinc-100 italic text-[10px] text-zinc-400">
                Tip: The &quot;See More&quot; cutoff usually occurs at line 5. Ensure your hook is sharp.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}