"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Browser Supabase client (anon key). Used by client components for auth
 * (magic link, OAuth) and any RLS-protected read the anon role is allowed.
 *
 * Returns null when Supabase isn't configured (seed mode) so callers can show
 * a "configure Supabase" affordance instead of crashing.
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
