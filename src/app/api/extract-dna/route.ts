import { NextResponse } from "next/server";
import OpenAI from "openai";

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "LinkedIn Agent DNA",
  }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { posts } = body;

    if (!posts || !Array.isArray(posts)) {
      return NextResponse.json({ 
        error: "Missing or invalid data", 
        message: "The 'posts' field must be an array of strings." 
      }, { status: 400 });
    }

    // Combine posts but slice them if they are too long to save on input costs
    const combinedPosts = posts.join("\n\n").slice(0, 6000); 

    const completion = await openrouter.chat.completions.create({
      model: "openai/gpt-4o-mini", 
      messages: [
        { 
          role: "system", 
          content: `You are a linguistic profiler for a CEO. 
          Analyze the writing style and return ONLY a JSON object with: 
          "sentenceStructure", "hookPattern", "forbiddenWords", "tone", "formatting".` 
        },
        { 
          role: "user", 
          content: `Analyze this writing style: ${combinedPosts}` 
        },
      ],
      response_format: { type: "json_object" }, 
      // --- FIX: Lower max_tokens to prevent 402 error ---
      max_tokens: 800, 
      temperature: 0.3, // Lower temp for more stable JSON output
    });

    const content = completion.choices[0].message.content;
    
    if (!content) throw new Error("No content received from AI");

    const voiceJson = JSON.parse(content);
    return NextResponse.json({ voiceJson });

  } catch (error: any) {
    console.error("DEBUG ERROR:", error);
    
    // Improved error handling for the frontend
    const statusCode = error.status || 500;
    return NextResponse.json({ 
      error: "API Error", 
      message: error.message 
    }, { status: statusCode });
  }
}