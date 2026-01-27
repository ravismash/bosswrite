import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { prompt, voiceProfile, audience } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-flash"),
      // ✅ 1. Use maxOutputTokens for hard API limits. 
      // 100 tokens ≈ 75 words. For a 300-word post, 600 tokens provides a safe buffer.
      maxOutputTokens: 9000, 
      
      // ✅ 2. Temperature 0.7-0.9 is the "sweet spot" for professional length.
      // Higher (1.2+) makes it ramble; Lower (0.2) makes it too short.
      temperature: 0.8, 

      system: `You are a clinical $100M Founder. Target: ${audience}.
      
      POST GUIDELINES:
      - Write a high-impact manifesto based on the provided transcript.
      - LENGTH: Strictly between 250 and 300 words.
      - FORMAT: Use 3-4 concise paragraphs with punchy bold headers.
      - TONE: Clinical, zero-fluff, high-conviction.
      
      CRITICAL: Do not exceed 300 words. If you reach the limit, finish the sentence and stop.`,
      
      prompt: `TRANSCRIPT: ${prompt}\nDNA: ${JSON.stringify(voiceProfile)}`,
      
      onFinish: ({ text, usage }) => {
        const wordCount = text.split(/\s+/).length;
        console.log(`--- POST GENERATED ---`);
        console.log(`Words: ${wordCount} | Tokens: ${usage.totalTokens}`);
      },
    });

    // 2. toDataStreamResponse() is the modern standard for AI SDK UI hooks.
    // It handles the Data Stream Protocol automatically.
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("DEBUG_GEMINI_ERROR:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
/*import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { prompt, voiceProfile, audience } = await req.json();

    // 1. streamText is synchronous in v6; do NOT await it here if you want to stream.
    // Ensure the model is passed via the google() function, not a string.
    const result = streamText({
      model: google("gemini-2.5-flash"),
      system: `You are a clinical $100M Founder. Target: ${audience}.`,
      prompt: `TRANSCRIPT: ${prompt}\nDNA: ${JSON.stringify(voiceProfile)}`,
      onFinish: ({ text, usage }) => {
        console.log("--- FINAL GENERATED POST ---");
        console.log(text);
        console.log(`Usage: ${usage.totalTokens} tokens`);
      },
    });

    // 2. toDataStreamResponse() is the modern standard for AI SDK UI hooks.
    // It handles the Data Stream Protocol automatically.
    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error("DEBUG_GEMINI_ERROR:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unknown error occurred" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
*/