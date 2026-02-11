"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Zap, Loader2, CheckCircle2 } from "lucide-react";

export default function BillingPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setUserId(user.id);
      setUserEmail(user.email || null);

      const { data } = await supabase
        .from("profiles")
        .select("credits")
        .eq("id", user.id)
        .single();
      
      setCredits(data?.credits || 0);
      setLoading(false);
    }
    fetchData();
  }, []);

  // ✅ HELPER: Safely builds the URL with User ID, Email AND Redirect
  const getCheckoutUrl = (baseUrl: string) => {
    if (!userId || !userEmail) return "#";

    try {
      const url = new URL(baseUrl);
      
      // 1. Attach User ID (Hidden Data for Webhook)
      url.searchParams.set("checkout[custom][user_id]", userId);
      
      // 2. Pre-fill Email (Prevents email mismatch errors)
      url.searchParams.set("checkout[email]", userEmail);

      // 3. 🚀 AUTO-REDIRECT: Send them back to dashboard after payment
      // window.location.origin gets your current site (e.g. localhost:3000 or your-app.com)
      url.searchParams.set("checkout[redirect_url]", `${window.location.origin}/dashboard`);

      return url.toString();
    } catch (e) {
      console.error("Invalid URL:", baseUrl);
      return "#";
    }
  };

  const PLANS = [
    {
      id: "monthly",
      name: "Monthly",
      price: "$9.99",
      frequency: "/ mo",
      credits: 50,
      // 👇 Your specific Monthly Link
      url: "https://bosswrite.lemonsqueezy.com/checkout/buy/d4818e82-44ba-484e-b68a-6fb9d01a1a69?enabled=1294424",
      //url: "https://bosswrite.lemonsqueezy.com/checkout/buy/de1f0d88-24d4-45c9-a445-9d49207ee61d?enabled=1295723",
      popular: false,
    },
    {
      id: "yearly",
      name: "Yearly",
      price: "$100",
      frequency: "/ yr",
      credits: 1000, 
      // 👇 Your specific Yearly Link
      url: "https://bosswrite.lemonsqueezy.com/checkout/buy/2c7ff9c2-92ac-4f93-af87-32d581b7b703?enabled=1295941",
      //url : "https://bosswrite.lemonsqueezy.com/checkout/buy/607d086f-7ceb-40bd-af5f-4a10a7989054?enabled=1295725",
      popular: true,
      saveLabel: "Best Value: 1000 Credits"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-10">
      
      {/* HEADER */}
      <div className="flex items-center justify-between bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
        <div>
          <h1 className="text-xl font-bold text-zinc-900">Your Wallet</h1>
          <p className="text-sm text-zinc-500">
            Logged in as: <span className="font-mono text-zinc-700">{userEmail}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-zinc-200 shadow-sm">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
          ) : (
            <span className="text-2xl font-black text-zinc-900">{credits}</span>
          )}
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        {PLANS.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-8 rounded-3xl border-2 transition-all ${
              plan.popular 
                ? "bg-zinc-900 border-zinc-900 text-white shadow-xl" 
                : "bg-white border-zinc-100 text-zinc-900 hover:border-zinc-300"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <div className="text-center space-y-2 mb-8">
              <h3 className={`font-bold uppercase tracking-widest ${plan.popular ? "text-zinc-400" : "text-zinc-400"}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                <span className={`text-sm font-medium ${plan.popular ? "text-zinc-500" : "text-zinc-400"}`}>
                  {plan.frequency}
                </span>
              </div>
              <div className={`text-sm font-bold py-1 px-3 rounded-full inline-block ${
                 plan.popular ? "bg-zinc-800 text-green-400" : "bg-zinc-100 text-zinc-600"
              }`}>
                {plan.credits} Credits
              </div>
            </div>

            <a 
              href={getCheckoutUrl(plan.url)}
              className={`block w-full py-4 rounded-xl font-bold uppercase tracking-widest text-center transition-all ${
                plan.popular 
                  ? "bg-white text-zinc-900 hover:bg-zinc-200" 
                  : "bg-zinc-900 text-white hover:bg-black"
              } ${!userId ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {userId ? "Choose Plan" : "Loading..."}
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}