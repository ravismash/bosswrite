import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  // 1. Check for session
  const { data: { session } } = await supabase.auth.getSession();

  // 2. Sign out if needed
  if (session) {
    await supabase.auth.signOut();
  }

  // 3. Force redirect to Login
  // request.nextUrl.origin ensures we redirect to localhost:3000/login (or your production domain)
  return NextResponse.redirect(`${request.nextUrl.origin}/login`, {
    status: 302,
  });
}