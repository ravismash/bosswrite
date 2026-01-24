import { createBrowserClient } from '@supabase/ssr'

// This is the updated, standard way to create a client for "use client" components
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

// Export a constant instance for easy use
export const supabase = createClient()