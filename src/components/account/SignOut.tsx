"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Signs the user out (clears the Supabase session) and returns home. */
export function SignOut() {
  const router = useRouter();
  const supabase = createClient();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="rounded-pill px-3 py-1.5 text-sm text-faint transition-colors hover:text-bone focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50"
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

export default SignOut;
