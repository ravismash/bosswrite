"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User, LogOut, CreditCard, Mail } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<number>(0);

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
        
        // Fetch profile for credits
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
          
        if (profile) setCredits(profile.credits);
      }
      setLoading(false);
    }
    getUserData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Redirect to landing page
    router.refresh();
  };

  if (loading) return <div className="p-12 text-zinc-500">Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black text-zinc-900 tracking-tight">Settings</h1>
        <p className="text-zinc-500 mt-2">Manage your account preferences.</p>
      </div>

      {/* ACCOUNT CARD */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Profile</h2>
        
        {/* Email Row */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-100 rounded-full">
            <Mail className="w-5 h-5 text-zinc-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase">Email Address</p>
            <p className="text-zinc-900 font-medium">{userEmail}</p>
          </div>
        </div>

        {/* Credits Row */}
        <div className="flex items-center gap-4 border-t border-zinc-100 pt-6">
          <div className="p-3 bg-amber-50 rounded-full">
            <ZapIcon className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase">Credit Balance</p>
            <p className="text-zinc-900 font-medium">{credits} Credits available</p>
          </div>
        </div>
      </div>

      {/* DANGER ZONE / ACTIONS */}
      <div className="space-y-4">
        {/* Customer Portal Link (Optional - for canceling subs) */}
        <a 
            href="https://bosswrite.lemonsqueezy.com/billing" 
            target="_blank"
            className="flex items-center justify-between w-full p-4 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors group"
        >
            <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900" />
                <span className="font-medium text-zinc-700 group-hover:text-zinc-900">Manage Subscription</span>
            </div>
            <span className="text-xs text-zinc-400">Invoices & Cancellation &rarr;</span>
        </a>

        {/* Sign Out Button */}
        <button 
          onClick={handleSignOut}
          className="flex items-center justify-center w-full p-4 text-red-600 font-bold bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

    </div>
  );
}

// Icon helper
function ZapIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}