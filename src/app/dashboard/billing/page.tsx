"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Zap, CheckCircle2, CreditCard, ShieldCheck, Loader2 } from "lucide-react";

export default function BillingPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Current Credits on Load
  useEffect(() => {
    async function fetchCredits() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();
      
      setCredits(data?.credits || 0);
      setLoading(false);
    }
    fetchCredits();
  }, []);

  // 2. CONFIG: Your Lemon Squeezy Checkout Links
  // Go to Lemon Squeezy -> Products -> Share -> Copy "Checkout Link"
  const PLANS = [
    {
      name: "Starter Pack",
      credits: 20,
      price: "$19",
      url: "https://your-store.lemonsqueezy.com/checkout/buy/variant-1", 
      popular: false,
      features: ["20 AI Manifestos", "Basic Support", "Standard Speed"]
    },
    {
      name: "Pro Volume",
      credits: 100,
      price: "$79",
      url: "https://your-store.lemonsqueezy.com/checkout/buy/variant-2", 
      popular: true, // Highlights this card
      features: ["100 AI Manifestos", "Priority Support", "Fast Generation", "Voice DNA Pro"]
    },
    {
      name: "Agency Scale",
      credits: 500,
      price: "$299",
      url: "https://your-store.lemonsqueezy.com/checkout/buy/variant-3",
      popular: false,
      features: ["500 AI Manifestos", "Direct Founder Support", "Max Speed", "Commercial License"]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-12">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-900 text-white p-8 rounded-3xl shadow-xl shadow-zinc-900/20">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Credit Balance</h1>
          <p className="text-zinc-400 mt-2 font-medium">Use credits to generate AI manifestos.</p>
        </div>
        
        <div className="flex items-center gap-5 bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="p-3 bg-red-600 rounded-xl shadow-lg shadow-red-900/50">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Available Credits</p>
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mt-1 text-zinc-500" />
            ) : (
              <p className="text-4xl font-black tracking-tight">{credits}</p>
            )}
          </div>
        </div>
      </div>

      {/* --- PRICING CARDS --- */}
      <div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-8 flex items-center gap-2">
          <CreditCard className="w-6 h-6" /> Top Up Wallet
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div 
              key={plan.name}
              className={`relative p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                plan.popular 
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-xl ring-4 ring-zinc-100" 
                  : "bg-white text-zinc-900 border-zinc-200 hover:border-zinc-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
                  Best Value
                </div>
              )}

              <div className="space-y-4">
                <h3 className={`font-bold text-lg ${plan.popular ? "text-zinc-400" : "text-zinc-500"}`}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                  <span className={`text-sm font-medium ${plan.popular ? "text-zinc-500" : "text-zinc-400"}`}>/ one-time</span>
                </div>
                
                <div className="py-6 space-y-3">
                   {plan.features.map((feature, i) => (
                     <Feature key={i} text={feature} dark={plan.popular} />
                   ))}
                </div>

                <a 
                  href={plan.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full py-4 rounded-xl font-bold uppercase tracking-widest text-center transition-all ${
                    plan.popular 
                      ? "bg-white text-zinc-900 hover:bg-zinc-200" 
                      : "bg-zinc-900 text-white hover:bg-black hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  }`}
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- TRUST FOOTER --- */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-zinc-400 text-xs font-medium uppercase tracking-widest pt-8 border-t border-zinc-200">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          Secure Payments via Lemon Squeezy
        </div>
        <span className="hidden md:block">•</span>
        <div>Instant Credit Delivery</div>
        <span className="hidden md:block">•</span>
        <div>30-Day Money Back Guarantee</div>
      </div>
    </div>
  );
}

// Helper Component for List Items
function Feature({ text, dark }: { text: string; dark: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${dark ? "text-zinc-300" : "text-zinc-600"}`}>
      <CheckCircle2 className={`w-5 h-5 shrink-0 ${dark ? "text-green-400" : "text-green-600"}`} />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}