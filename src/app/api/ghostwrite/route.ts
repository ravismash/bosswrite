import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { prompt, voiceProfile, audience, userId } = await req.json();

    // --- 1. Security Check (Unchanged) ---
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("credits, role")
      .eq("id", userId)
      .single();

    if (error || !profile) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    
    const isAdmin = profile.role === 'admin';
    const hasCredits = (profile.credits || 0) > 0;

    if (!isAdmin && !hasCredits) return new Response(JSON.stringify({ error: "Insufficient credits" }), { status: 403 });

    // --- 2. The "Opinionated" System Prompt ---
    const systemInstruction = `
    You are an elite Ghostwriter for a $100M Founder.
    TARGET AUDIENCE: ${audience}
    
    YOUR GOAL: 
    Write a high-performance LinkedIn Opinion Piece based on the provided transcript.
    
    ⛔ WHAT TO AVOID (CRITICAL):
    - DO NOT SUMMARIZE the video.
    - DO NOT use phrases like "The speaker says", "In this video", or "He mentions".
    - DO NOT report news.
    
    ✅ WHAT TO DO:
    - STEAL the core idea from the transcript and make it YOUR OWN opinion.
    - Use "I" and "We". Speak from personal conviction.
    - Take a strong stance. Agree, disagree, or amplify the point.
    - Pivot the topic to broader business/life lessons for the reader.

    MANDATORY STRUCTURE:
    1. THE HOT TAKE (Hook): A polarizing statement derived from the video's strongest point.
    2. THE CONTEXT: Why this matters right now (connect it to the market/society).
    3. THE LESSON: 3-4 bullet points on how to apply this mindset.
    4. THE PUNCHLINE: A final, 1-sentence mic drop.

    TONE:
    - Clinical, authoritative, "Boss" energy.
    - Short sentences. punchy.
    - DNA Profile: ${JSON.stringify(voiceProfile)}
    `;

    // --- 3. AI Generation ---
    const result = streamText({
      model: google("gemini-2.0-flash"), // Use 'gemini-1.5-pro' for even better reasoning if available
      maxOutputTokens: 1000, 
      temperature: 0.9, // Higher temp = more opinionated/creative

      system: systemInstruction,
      prompt: `TRANSCRIPT SOURCE MATERIAL:\n${prompt}`,
      
      onFinish: async ({ text }) => {
        if (!isAdmin) {
          await supabase.from("profiles").update({ credits: profile.credits - 1 }).eq("id", userId);
        }
      },
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}