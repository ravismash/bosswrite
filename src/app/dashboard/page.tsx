"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AudienceSelector from "@/components/AudienceSelector";
import LinkedInPreview from "@/components/LinkedInPreview";
import Link from "next/link";
import { useCompletion } from "@ai-sdk/react";
import { 
  Wand2, 
  CreditCard, 
  Zap, 
  Youtube,
  FileText
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  
  // Input State
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [samples, setSamples] = useState("");
  const [userType, setUserType] = useState("solopreneur");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("");
  
  // Auth & Credit State
  const [credits, setCredits] = useState<number | null>(null);
  const [role, setRole] = useState<string>("user");
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 1. AI HOOK (✅ FIXED: Added streamProtocol: 'text')
  const { completion, complete, isLoading: isAiWriting } = useCompletion({
    api: "/api/ghostwrite",
    streamProtocol: 'text', // <--- THIS LINE FIXES THE PARSING ERROR
    onFinish: () => {
      setLoading(false);
      setStep("");
      // Visual update only (server handles real deduction)
      if (role !== 'admin' && credits !== null) {
        setCredits(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }
    },
    onError: (err) => {
      console.error("AI Error:", err);
      // Clean up the error message if it's a JSON string
      let msg = err.message;
      try {
        const parsed = JSON.parse(msg);
        if (parsed.error) msg = parsed.error;
      } catch (e) {
        // ignore json parse error, stick to original string
      }
      alert(`⚠️ ${msg}`);
      setLoading(false);
      setStep("");
    }
  });

  // 2. CHECK SESSION & CREDITS
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("credits, role")
        .eq("id", user.id)
        .single();
        
      if (profile) {
        setCredits(profile.credits);
        setRole(profile.role);
      }
      setIsAuthLoading(false);
    };
    checkSession();
  }, [router]);

  // 3. GENERATION LOGIC
  const generatePost = async () => {
    // 🛡️ Credit Gate
    if (role !== 'admin' && (credits !== null && credits < 1)) {
        return; 
    }
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // --- STEP A: Fetch Transcript ---
      let transcriptText = "";
      
      if (youtubeUrl) {
        setStep("Fetching Transcript...");
        const transRes = await fetch("/api/transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: youtubeUrl }),
        });
        const transData = await transRes.json();
        if (!transData.transcript) throw new Error("Could not extract transcript.");
        transcriptText = transData.transcript;
      } else {
        transcriptText = samples;
      }

      // --- STEP B: Extract Voice DNA ---
      let voiceProfile = {};
      if (samples) {
        setStep("Extracting Voice DNA...");
        const dnaRes = await fetch("/api/extract-dna", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ posts: [samples] }),
        });
        const dnaData = await dnaRes.json();
        voiceProfile = dnaData.voiceJson;
      }

      // --- STEP C: Generate Manifesto ---
      setStep("Ghostwriting...");
      
      complete(transcriptText, {
        body: { 
          voiceProfile, 
          audience: userType,
          userId: user.id 
        }
      });

    } catch (error: any) {
      console.error("Workflow Error:", error);
      alert(`⚠️ ${error.message}`);
      setLoading(false);
      setStep("");
    }
  };

  if (isAuthLoading) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-black italic tracking-tighter uppercase text-zinc-900">
             Mission Control
           </h1>
           <p className="text-zinc-500 font-medium">
             Deploy AI to turn content into influence.
           </p>
        </div>

        {/* CREDIT DISPLAY */}
        <div className="flex items-center gap-3">
          {role === 'admin' ? (
             <div className="bg-zinc-900 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                Admin Mode (∞)
             </div>
          ) : (
             <Link href="/dashboard/billing">
                <div className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all hover:scale-105 ${
                  (credits || 0) > 0 
                  ? "bg-white border-zinc-200 text-zinc-700" 
                  : "bg-red-50 border-red-200 text-red-700 animate-pulse"
                }`}>
                  <Zap className={`w-4 h-4 ${(credits || 0) > 0 ? "fill-yellow-400 text-yellow-500" : "fill-red-500 text-red-500"}`} />
                  <span className="font-bold text-sm">{(credits ?? 0)} Credits</span>
                </div>
             </Link>
          )}
        </div>
      </header>

      {/* INPUT AREA */}
      <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/40 space-y-8">
        <div>
           <label className="flex items-center gap-2 text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">
             <div className="w-2 h-2 bg-red-500 rounded-full"></div> Target Audience
           </label>
           <AudienceSelector selected={userType} onChange={setUserType} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div>
              <label className="flex items-center gap-2 text-xs font-black text-zinc-900 uppercase tracking-widest mb-2">
                 <Youtube className="w-4 h-4" /> YouTube Source
              </label>
              <input 
                className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl outline-none focus:border-zinc-900 transition-all text-sm font-medium placeholder:text-zinc-400"
                placeholder="https://youtube.com/watch?v=..." 
                value={youtubeUrl} 
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
           </div>
           <div>
              <label className="flex items-center gap-2 text-xs font-black text-zinc-900 uppercase tracking-widest mb-2">
                 <FileText className="w-4 h-4" /> Voice Samples
              </label>
              <textarea 
                className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-xl h-[52px] focus:h-32 transition-all duration-300 outline-none focus:border-zinc-900 text-sm font-medium placeholder:text-zinc-400 resize-none"
                placeholder="Paste previous posts or notes..." 
                value={samples} 
                onChange={(e) => setSamples(e.target.value)}
              />
           </div>
        </div>

        <div className="pt-2">
          {(credits || 0) > 0 || role === 'admin' ? (
             <button 
               disabled={loading || isAiWriting || (!youtubeUrl && !samples)} 
               onClick={generatePost}
               className="w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg bg-zinc-900 text-white hover:bg-black hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
             >
               {loading || isAiWriting ? (
                 <>
                   <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                   {step || "Processing..."}
                 </>
               ) : (
                 <>
                   <Wand2 className="w-5 h-5" /> Execute Manifesto
                 </>
               )}
             </button>
          ) : (
             <Link href="/dashboard/billing" target="_blank">
               <button className="w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg bg-red-600 text-white hover:bg-red-700 hover:scale-[1.01] flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" /> Recharge Credits
               </button>
             </Link>
          )}
        </div>
      </div>

      {/* OUTPUT */}
      {completion && (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="font-bold text-zinc-400 uppercase tracking-widest text-xs flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Generated Output
            </h3>
          </div>
          <div className="flex justify-center">
            <LinkedInPreview content={completion} role={userType} />
          </div>
        </div>
      )}
    </div>
  );
}