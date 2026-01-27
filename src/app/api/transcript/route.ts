import { extractVideoId, getFromSupabase, saveToSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const videoId = extractVideoId(url);

    if (!videoId) return Response.json({ error: "Invalid URL" }, { status: 400 });

    // 1. Check Supabase Cache First
    const cached = await getFromSupabase(videoId);
    if (cached) return Response.json({ transcript: cached.content, source: "cache" });

    // 2. Fetch from TranscriptAPI v2
    // v2 uses a GET request with query params for better caching
    const apiUrl = `https://transcriptapi.com/api/v2/youtube/transcript?video_url=${encodeURIComponent(url)}&format=text`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        // ✅ Authentication: sk_ format is standard for v2
        "Authorization": `Bearer ${process.env.TRANSCRIPT_API_KEY}`,
      },
    });

    // 🛡️ JSON Guard
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType?.includes("application/json")) {
      const errorBody = await response.text();
      console.error(`API Error ${response.status}:`, errorBody);
      return Response.json({ error: `API Error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    // 3. Save to Cache for 10k User Scale
    if (data.transcript) {
      await saveToSupabase(videoId, data.transcript, "DNA_EXTRACTED");
    }

    return Response.json({ transcript: data.transcript });

  } catch (error: any) {
    console.error("V2_ROUTE_ERROR:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}