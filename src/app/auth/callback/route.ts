import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth / magic-link callback. Supabase redirects here with a `code` (PKCE);
 * we exchange it for a session (cookies are set via the server client) and
 * bounce to the intended destination carried in `next`.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/account";
  // Only allow same-site relative redirects.
  const safeNext = next.startsWith("/") ? next : "/account";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(safeNext, url.origin));
      }
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=auth", url.origin),
  );
}
