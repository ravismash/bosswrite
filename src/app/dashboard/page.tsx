"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AudienceSelector from "@/components/AudienceSelector";
import { LogOut, HelpCircle, MessageSquare, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useCompletion } from "@ai-sdk/react";

export default function DashboardPage() {
  const router = useRouter();
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [samples, setSamples] = useState("");
  const [userType, setUserType] = useState("solopreneur");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 1. AI HOOK SETUP
  const { completion, complete, isLoading: isAiWriting } = useCompletion({
    api: "/api/ghostwrite",
    streamProtocol: 'text', 
    onFinish: (prompt, completion) => {
      setLoading(false);
      setStep("");
      if (credits !== null) setCredits(prev => (prev !== null ? prev - 1 : null));
    },
    onError: (err) => {
      console.error("AI Error:", err);
      alert(`⚠️ GHOSTWRITE ERROR: ${err.message}`);
      setLoading(false);
      setStep("");
    }
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();
        if (profile) setCredits(profile.credits);
        setIsAuthLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePost = async () => {
    if (credits !== null && credits < 1) return alert("Out of credits!");
    
    setLoading(true);

    try {
      setStep("Extracting Voice DNA...");
      const dnaRes = await fetch("/api/extract-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: [samples] }),
      });
      const dnaData = await dnaRes.json();
      
      setStep("Fetching Transcript...");
      const transRes = await fetch("/api/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl }),
      });
      const transData = await transRes.json();
      
      if (!transData.transcript) throw new Error("No transcript found");

      setStep("Writing Manifesto...");
      complete(transData.transcript, {
        body: { 
          voiceProfile: dnaData.voiceJson, 
          audience: userType 
        }
      });

    } catch (error: any) {
      console.error("Workflow Error:", error);
      alert(`⚠️ ERROR: ${error.message}`);
      setLoading(false);
      setStep("");
    }
  };

  if (isAuthLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-zinc-900 font-black uppercase tracking-widest animate-pulse">Authenticating Boss...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-zinc-600 p-6 md:p-12 font-inter relative">
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between mb-12 pb-8 border-b border-zinc-200">
        <div />
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter font-montserrat text-zinc-900 absolute left-1/2 transform -translate-x-1/2">
          BossWrite
        </h1>
        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push("/login"))} 
          className="text-zinc-400 hover:text-red-600 transition-all p-2 rounded-lg hover:bg-red-50"
          title="Logout"
        >
          <LogOut size={24} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        {/* SIDEBAR - FIXED */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col gap-8">
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-lg shadow-zinc-200/50 space-y-6 flex-1">
            <div>
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2">Available Credits</p>
              <p className="text-5xl font-black text-zinc-900 italic">{credits ?? "..."}</p>
            </div>
            {/* ✅ AudienceSelector */}
            <div className="w-full pt-4 border-t border-zinc-100">
              <AudienceSelector selected={userType} onChange={setUserType} />
            </div>
          </div>
          
          {/* BOTTOM LEFT LINKS */}
          <div className="space-y-4 bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <Link href="/help" className="flex items-center gap-3 text-zinc-500 hover:text-red-600 transition-all group">
              <HelpCircle size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Pro Guide</span>
            </Link>
            <a href="mailto:support@bosswrite.ai" className="flex items-center gap-3 text-zinc-500 hover:text-red-600 transition-all">
              <MessageSquare size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Send Feedback</span>
            </a>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 space-y-6 min-w-0">
          <div className="space-y-4 bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm">
            <div>
                <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wide mb-2">Source Material</label>
                <input 
                className="w-full bg-gray-50 border border-zinc-200 p-4 rounded-xl outline-none focus:border-red-600 focus:bg-white transition-all text-sm text-zinc-900 placeholder:text-zinc-400"
                placeholder="Paste YouTube URL here..." value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-zinc-900 uppercase tracking-wide mb-2 mt-2">Writing Samples (Optional)</label>
                <textarea 
                className="w-full bg-gray-50 border border-zinc-200 p-4 rounded-xl h-40 outline-none focus:border-red-600 focus:bg-white transition-all text-sm text-zinc-900 placeholder:text-zinc-400 resize-none"
                placeholder="Paste your previous posts here to match style..." value={samples} onChange={(e) => setSamples(e.target.value)}
                />
            </div>

            <button 
              disabled={loading || isAiWriting} onClick={generatePost}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl ${
                loading || isAiWriting ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none" : "bg-red-600 hover:bg-black text-white shadow-red-600/20"
              }`}
            >
              {loading || isAiWriting ? (
                <span className="flex items-center justify-center gap-2">
                   <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                   {step || "Generating..."}
                </span>
              ) : "Execute Manifesto"}
            </button>
          </div>

          {completion && (
            <div className="relative mt-10 p-10 bg-white text-zinc-900 rounded-3xl border border-zinc-200 shadow-2xl shadow-zinc-200/50 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-8 border-b border-zinc-100 pb-6">
                <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Generated Output
                </span>
                <button onClick={copyToClipboard} className="flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-red-600 transition-colors">
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />} {copied ? "COPIED" : "COPY"}
                </button>
              </div>
              <p className="whitespace-pre-wrap font-serif text-xl leading-relaxed text-zinc-800 selection:bg-red-100">
                {completion}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}