"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      // Check if the user has an active session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // If logged in, send them to the dashboard
        router.replace("/dashboard");
      } else {
        // If not logged in, send them to the login page
        router.replace("/login");
      }
    };

    checkUser();
  }, [router]);

  // While checking auth, show a clean black loading screen
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-black italic uppercase animate-pulse">
          BossWrite
        </h1>
        <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase">
          Authenticating...
        </p>
      </div>
    </div>
  );
}