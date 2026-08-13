import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseJsClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured, hasServiceRole } from "@/lib/env";

/**
 * Request-scoped server client (anon key + user's cookies). Reads the signed-in
 * user, respects RLS. Use in Server Components, Route Handlers and Server
 * Actions. Returns null in seed mode.
 *
 * In a Server Component the cookie store is read-only; the try/catch around
 * `set` is the documented @supabase/ssr pattern — cookie refresh is handled by
 * middleware, so a no-op here is safe.
 */
export async function createClient() {
  if (!isSupabaseConfigured) return null;

  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component — middleware owns cookie refresh.
        }
      },
    },
  });
}

/**
 * Service-role client. Bypasses RLS — use ONLY on the server for privileged
 * work: reading item_secrets after an access check, minting signed URLs,
 * writing subscriptions from the Stripe webhook, admin CRUD. Never expose the
 * service-role key to the client. Returns null when unconfigured.
 */
export function createAdminClient() {
  if (!hasServiceRole) return null;

  return createSupabaseJsClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
