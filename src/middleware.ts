import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Create an initial response
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Correctly spread options to avoid "Expression expected" error
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Get current user session
  const { data: { session } } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname

  // Define route types
  const isDashboard = path.startsWith('/dashboard')
  const isLoginPage = path === '/login'
  // Public routes that don't need a session
  const isPublicRoute = ['/', '/terms', '/privacy', '/refund', '/contact'].includes(path)

  // 1. If NO session and trying to access private dashboard -> Redirect to Login
  if (!session && isDashboard) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If SESSION exists and trying to access login -> Redirect to Dashboard
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // 3. Otherwise, allow the request to proceed (including public legal pages)
  return response
}

// Config to ensure middleware runs on all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (svg, png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}