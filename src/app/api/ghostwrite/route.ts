import { NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * 1. INITIALIZATION
 * Ensure GOOGLE_AI_KEY is in your .env.local
 */
const apiKey = process.env.GOOGLE_AI_KEY;

const client = new OpenAI({
  apiKey: apiKey || "",
  // IMPORTANT: The trailing slash after /openai/ is required for many SDKs
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" 
});

/**
 * 2. AUDIENCE PROFILES
 */
const AUDIENCE_PROFILES: Record<string, any> = {
  solopreneur: {
    label: "Individual Operator",
    focus: "Decoupling time from money and the failure of hustle.",
    requiredLexicon: "Time-liability, linear input, biological limits, permissionless leverage.",
    forbidden: "management, headcount, dividends, board of directors, corporate.",
    temperature: 0.85
  },
  agency_owner: {
    label: "Systems Architect",
    focus: "The removal of the founder as a bottleneck through SOPs and systems.",
    requiredLexicon: "Throughput, human variable, marginal cost, repeatable units, operational engine.",
    forbidden: "hustle, solopreneur, solo, personal brand, passive income.",
    temperature: 0.8
  },
  executive: {
    label: "Capital Allocator",
    focus: "Asymmetric upside, equity dominance, and capital efficiency.",
    requiredLexicon: "Capital allocation, structural power, equity, asymmetric returns, market dominance.",
    forbidden: "freedom, escape the 9-5, quit your job, happiness, unlock, journey.",
    temperature: 0.7
  },
  ghostwriter: {
    label: "Authority Architect",
    focus: "Building intellectual gravity and high-signal authority.",
    requiredLexicon: "Intellectual weight, signal-to-noise, logical dominance, market irrelevance.",
    forbidden: "engagement, algorithm, likes, virality, hook, template.",
    temperature: 0.8
  }
};

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google AI Key Missing. Add GOOGLE_AI_KEY to your .env.local" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    
    const { 
      transcript,    
      voiceProfile,  
      audience, 
      linkedinSamples 
    } = body;

    const inputData = transcript || "";

    if (!inputData) {
       return NextResponse.json({ error: "No transcript data provided." }, { status: 400 });
    }

    const profile = AUDIENCE_PROFILES[audience?.toLowerCase()] || AUDIENCE_PROFILES.solopreneur;
    const dnaContext = voiceProfile ? JSON.stringify(voiceProfile) : (linkedinSamples || "Ownership is the law.");

    const completion = await client.chat.completions.create({
      // Use the stable 2026 model ID
      model: "gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content: `
            You are a $100M Founder writing a manifesto for a ${profile.label}. 
            TONE: Clinical, cold, and declarative. You state laws of physics, not advice.

            STRICT AUDIENCE RULES:
            1. FOCUS: ${profile.focus}
            2. REQUIRED TERMINOLOGY: ${profile.requiredLexicon}
            3. FORBIDDEN FOR THIS AUDIENCE: ${profile.forbidden}

            GLOBAL OPERATIONAL LAWS:
            - Use Second Person ("You") exclusively. 
            - No academic transitions (moreover, consequently, therefore).
            - No soft words (success, prosperity, financial freedom, journey).
            - The first sentence must be a direct confrontation of a structural failure.
            - Use dense, logical, and sophisticated sentence structures.
          `
        },
        {
          role: "user",
          content: `
            TRANSCRIPT DATA: ${inputData} 
            VOICE DNA PROFILE: ${dnaContext}

            TASK: Write a 180 - 220-word LinkedIn manifesto. End with a cold, definitive period.
          `
        }
      ],
      temperature: profile.temperature,
      // Penalties are removed here as they often trigger 400 errors in the Gemini bridge
      max_tokens: 5000, 
    });

    const post = completion.choices?.[0]?.message?.content?.trim() || "";
    const cleanPost = post.replace(/^(Post:|Manifesto:|LinkedIn Post:|Here is)/i, "").trim();

    return NextResponse.json({ success: true, post: cleanPost });

  } catch (error: any) {
    console.error("GHOSTWRITE_API_ERROR (GEMINI):", error);
    
    // Improved error reporting for 404/403 debugging
    return NextResponse.json(
      { error: error.message || "Internal Server Error", code: error.status },
      { status: error.status || 500 }
    );
  }
}