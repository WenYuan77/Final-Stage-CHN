import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Browser Supabase client for client-side data fetching (e.g. portfolio, site settings).
 * Uses the anon key; ensure RLS policies allow public read on site_settings, categories, portfolio_images.
 */
export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function isSupabaseBrowserConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
