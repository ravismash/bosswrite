import { createBrowserClient } from '@supabase/ssr'

// This is the updated, standard way to create a client for "use client" components
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Export a constant instance for easy use
export const supabase = createClient()
/**
 * Extracts the 11-character YouTube video ID from various URL formats
 * (Standard, Shortened, Embed, and Shorts)
 */
export function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
export async function getFromSupabase(videoId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("transcripts") // Ensure you have a 'transcripts' table
    .select("content, dna")
    .eq("video_id", videoId)
    .single();

  if (error || !data) return null;
  return data;
}

export async function saveToSupabase(videoId: string, content: string, dna: string) {
  const supabase = await createClient();
  
  await supabase.from("transcripts").upsert({
    video_id: videoId,
    content: content,
    dna: dna,
    updated_at: new Date().toISOString(),
  });
}