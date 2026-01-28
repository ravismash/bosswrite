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

  if (isAuthLoading) return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black uppercase tracking-widest animate-pulse">Authenticating Boss...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-inter relative">
      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between mb-12 pb-8 border-b border-zinc-800">
        <div />
        <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter font-montserrat absolute left-1/2 transform -translate-x-1/2">
          BossWrite
        </h1>
        <button 
          onClick={() => supabase.auth.signOut().then(() => router.push("/login"))} 
          className="text-zinc-500 hover:text-white transition-all p-2 rounded-lg hover:bg-zinc-900"
          title="Logout"
        >
          <LogOut size={24} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        {/* SIDEBAR - FIXED */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col gap-8">
          <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 space-y-6 flex-1">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Available Credits</p>
              <p className="text-4xl font-black text-white italic">{credits ?? "..."}</p>
            </div>
            {/* ✅ AudienceSelector now properly contained */}
            <div className="w-full">
              <AudienceSelector selected={userType} onChange={setUserType} />
            </div>
          </div>
          
          {/* BOTTOM LEFT LINKS */}
          <div className="space-y-4 bg-zinc-950 p-6 rounded-3xl border border-dashed border-zinc-800">
            <Link href="/help" className="flex items-center gap-3 text-zinc-400 hover:text-red-500 transition-all group">
              <HelpCircle size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Pro Guide</span>
            </Link>
            <a href="mailto:support@bosswrite.ai" className="flex items-center gap-3 text-zinc-400 hover:text-white transition-all">
              <MessageSquare size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Send Feedback</span>
            </a>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 space-y-6 min-w-0">
          <div className="space-y-4">
            <input 
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl outline-none focus:border-red-600 transition-all text-sm text-white"
              placeholder="YouTube URL" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <textarea 
              className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl h-48 outline-none focus:border-red-600 transition-all text-sm text-white"
              placeholder="Paste writing samples..." value={samples} onChange={(e) => setSamples(e.target.value)}
            />
            <button 
              disabled={loading || isAiWriting} onClick={generatePost}
              className={`w-full py-5 rounded-xl font-black uppercase tracking-widest transition-all ${
                loading || isAiWriting ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-red-600 hover:bg-white hover:text-black shadow-lg shadow-red-900/20"
              }`}
            >
              {loading || isAiWriting ? (
                <span className="flex items-center justify-center gap-2">
                   <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                   {step || "Generating..."}
                </span>
              ) : "Execute Manifesto"}
            </button>
          </div>

          {completion && (
            <div className="relative mt-10 p-8 bg-white text-black rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
                <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  LinkedIn Optimized Manifesto
                </span>
                <button onClick={copyToClipboard} className="flex items-center gap-2 text-xs font-bold hover:text-red-600 transition-colors">
                  {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />} {copied ? "COPIED" : "COPY"}
                </button>
              </div>
              <p className="whitespace-pre-wrap font-serif text-xl leading-relaxed italic text-zinc-900">
                {completion}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
