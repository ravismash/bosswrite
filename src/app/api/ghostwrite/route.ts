import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client (Server-Side)
// We use SERVICE_ROLE_KEY to ensure we can read roles and update credits securely
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { prompt, voiceProfile, audience, userId } = await req.json();

    // ---------------------------------------------------------
    // 🛡️ STEP 1: SECURITY & CREDIT CHECK
    // ---------------------------------------------------------
    
    // Fetch the user's profile (Role & Credits)
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("credits, role")
      .eq("id", userId) // Ensure you pass userId from the frontend or extract from auth header
      .single();

    if (error || !profile) {
      return new Response(JSON.stringify({ error: "User profile not found" }), { status: 401 });
    }

    const isAdmin = profile.role === 'admin';
    const hasCredits = (profile.credits || 0) > 0;

    // 🛑 STOP if not admin AND no credits
    if (!isAdmin && !hasCredits) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), { status: 403 });
    }

    // ---------------------------------------------------------
    // 🧠 STEP 2: AI GENERATION
    // ---------------------------------------------------------

    const result = streamText({
      model: google("gemini-2.0-flash"), // Updated to stable 1.5 (Change to 2.0 if you have beta access)
      maxOutputTokens: 1000, // Enough for ~700 words
      temperature: 0.8, 

      system: `You are a clinical $100M Founder. Target: ${audience}.
      
      POST GUIDELINES:
      - Write a high-impact manifesto based on the provided transcript.
      - LENGTH: Strictly between 250 and 300 words.
      - FORMAT: Use 3-4 concise paragraphs with punchy bold headers.
      - TONE: Clinical, zero-fluff, high-conviction.
      
      CRITICAL: Do not exceed 300 words.`,
      
      prompt: `TRANSCRIPT: ${prompt}\nDNA: ${JSON.stringify(voiceProfile)}`,
      
      // ---------------------------------------------------------
      // 💰 STEP 3: CREDIT DEDUCTION (ON SUCCESS)
      // ---------------------------------------------------------
      onFinish: async ({ text, usage }) => {
        // Only deduct if NOT an admin
        if (!isAdmin) {
          console.log(`📉 Deducting credit for user ${userId}`);
          await supabase
            .from("profiles")
            .update({ credits: profile.credits - 1 })
            .eq("id", userId);
        } else {
          console.log(`🛡️ Admin generated content. No credits deducted.`);
        }

        const wordCount = text.split(/\s+/).length;
        console.log(`--- POST GENERATED ---`);
        console.log(`Words: ${wordCount} | Tokens: ${usage.totalTokens}`);
      },
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("DEBUG_GEMINI_ERROR:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}