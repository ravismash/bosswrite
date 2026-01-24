import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");

// Helper to convert H:M:S or M:S string to total seconds
function parseDuration(durationStr: string): number {
  const parts = durationStr.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; // H:M:S
  if (parts.length === 2) return parts[0] * 60 + parts[1]; // M:S
  return parts[0] || 0; // S
}

export async function POST(req: Request) {
  const tempFiles: string[] = [];

  try {
    const { url } = await req.json();

    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    if (!process.env.DEEPGRAM_API_KEY) return NextResponse.json({ error: "API key missing" }, { status: 500 });

    // 0️⃣ Duration Check - Fixed Logic
    try {
      const durationOutput = execSync(
        `yt-dlp --get-duration "${url}"`, 
        { encoding: "utf8" }
      ).trim();

      const durationInSeconds = parseDuration(durationOutput);
      const MAX_DURATION = 45 * 60; // 2700 seconds

      if (durationInSeconds > MAX_DURATION) {
        return NextResponse.json(
          { error: "Video too long. We only accept YouTube videos of less than 45 minutes." },
          { status: 400 }
        );
      }
    } catch (e) {
      console.error("Duration check failed:", e);
      return NextResponse.json({ error: "Could not verify video length." }, { status: 500 });
    }

    const id = Date.now();
    const audioPath = path.join("/tmp", `audio_${id}.m4a`);

    // 1️⃣ Download audio
    try {
      execSync(
        `yt-dlp -f "ba[ext=m4a]" -o "${audioPath}" "${url}" --max-filesize 50M --quiet`,
        { stdio: "ignore" }
      );
      tempFiles.push(audioPath);
    } catch (err) {
      return NextResponse.json({ error: "Audio extraction failed." }, { status: 500 });
    }

    // 2️⃣ Transcription
    const audioBuffer = fs.readFileSync(audioPath);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      model: "nova-2",
      smart_format: true,
      diarize: true,
    });

    if (error || !result) throw new Error(error?.message || "Transcription failed.");

    // 3️⃣ Extract Primary Speaker
    const utterances = result.results?.utterances || [];
    let transcript = "";
    const primarySpeaker = utterances[0]?.speaker ?? 0;

    for (const u of utterances) {
      if (u.speaker === primarySpeaker) transcript += u.transcript + " ";
    }

    // Fallback if no diarization
    if (!transcript.trim()) {
      transcript = result.results?.channels[0]?.alternatives[0]?.transcript || "";
    }

    // 4️⃣ Cleanup
    tempFiles.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));

    return NextResponse.json({ success: true, transcript: transcript.trim() });

  } catch (err: any) {
    tempFiles.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
/*import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");

export async function POST(req: Request) {
  const tempFiles: string[] = [];

  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    if (!process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json({ error: "Deepgram API key missing" }, { status: 500 });
    }

    // 0️⃣ Duration Check (NEW)
    try {
      // --get-duration returns seconds for yt-dlp
      const durationOutput = execSync(
        `yt-dlp --get-duration --print "%(duration)s" "${url}"`, 
        { encoding: "utf8" }
      ).trim();

      const durationInSeconds = parseInt(durationOutput, 10);
      const MAX_DURATION = 45 * 60; // 2700 seconds

      if (durationInSeconds > MAX_DURATION) {
        return NextResponse.json(
          { error: "Video too long. We only accept YouTube videos of less than 45 minutes." },
          { status: 400 }
        );
      }
    } catch (e) {
      console.warn("Duration check failed, attempting to proceed...", e);
      // Optional: You can choose to throw error here or proceed if yt-dlp fails metadata fetch
    }

    const id = Date.now();
    const basePath = path.join("/tmp", `audio_${id}`);
    const audioPath = `${basePath}.m4a`;

    // 1️⃣ Download audio
    try {
      execSync(
        `yt-dlp -f "ba[ext=m4a]" -o "${audioPath}" "${url}" --max-filesize 50M --quiet`,
        { stdio: "ignore" }
      );
      tempFiles.push(audioPath);
    } catch {
      return NextResponse.json(
        { error: "Audio extraction failed. yt-dlp may be missing or URL is invalid." },
        { status: 500 }
      );
    }

    // 2️⃣ Transcription
    const audioBuffer = fs.readFileSync(audioPath);
    const response = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      model: "nova-2",
      smart_format: true,
      diarize: true,
      punctuate: true,
      utterances: true,
    });

    const result = response.result;
    if (!result) throw new Error("Deepgram returned no transcription result.");

    // 3️⃣ Extract PRIMARY speaker only
    const utterances = result.results?.utterances || [];
    let transcript = "";
    let primarySpeaker: number | null = null;

    for (const u of utterances) {
      if (primarySpeaker === null) primarySpeaker = u.speaker;
      if (u.speaker === primarySpeaker) transcript += u.transcript + " ";
    }

    if (!transcript.trim()) {
      transcript = result.results?.channels?.[0]?.alternatives?.[0]?.transcript || "No speech detected.";
    }

    // 4️⃣ Cleanup
    tempFiles.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));

    return NextResponse.json({
      success: true,
      transcript: transcript.trim(),
    });

  } catch (err: any) {
    tempFiles.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
    console.error("TRANSCRIPTION_ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Transcription failed." },
      { status: 500 }
    );
  }
}
*/
/*
import { NextResponse } from "next/server";
import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { url, userId } = await req.json();

    if (!url || !userId) {
      return NextResponse.json({ error: "Missing URL or User ID" }, { status: 400 });
    }

    // 1️⃣ Get Audio Link via Cobalt (Fast, Free, No Decipher Errors)
    const cobaltResponse = await fetch("https://api.cobalt.tools/api/json", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ url: url, downloadMode: "audio", audioFormat: "mp3" }),
    });

    const cobaltData = await cobaltResponse.json();
    if (!cobaltData.url) throw new Error("Could not extract audio from YouTube.");
    const audioUrl = cobaltData.url;

    // 2️⃣ Use the correct ASYNC method for Deepgram
    // Format: transcribeUrlCallback(source, callbackUrl, options)
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/transcript?userId=${userId}`;

    const { result, error } = await deepgram.listen.prerecorded.transcribeUrlCallback(
      { url: audioUrl },
      callbackUrl, // Second argument is the URL string
      {
        model: "nova-2",
        smart_format: true,
        diarize: true,
        punctuate: true,
      }
    );

    if (error) {
      console.error("Deepgram SDK Error:", error);
      throw new Error("Deepgram rejected the async request.");
    }

    // 3️⃣ Success - Return immediately while Deepgram works in the background
    return NextResponse.json({ 
      success: true, 
      message: "Transcription started", 
      requestId: result?.request_id 
    });

  } catch (err: any) {
    console.error("PHASE_1_ERROR:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
  */