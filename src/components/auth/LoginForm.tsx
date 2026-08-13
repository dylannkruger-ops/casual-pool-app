"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Pill } from "@/components/glass/Pill";
import { env } from "@/lib/env";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Magic-link + Google sign-in. Preserves the intended destination (`redirect`)
 * through the auth round-trip via the callback's `next` param. Degrades to a
 * clear notice when Supabase isn't configured.
 */
export function LoginForm({ redirect }: { redirect: string }) {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const callbackUrl = `${env.siteUrl}/auth/callback?next=${encodeURIComponent(redirect)}`;

  if (!supabase) {
    return (
      <div className="rounded-panel border border-warning/30 bg-warning/5 p-4 text-sm text-warning">
        Authentication isn&apos;t configured on this deployment. Add your
        Supabase environment variables (see the README) to enable sign-in. You
        can still browse the whole library and preview every item.
      </div>
    );
  }

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setMessage(null);
    const { error } = await supabase!.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("sent");
      setMessage(`Check ${email} for a sign-in link.`);
    }
  }

  async function signInWithGoogle() {
    setMessage(null);
    const { error } = await supabase!.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-panel border border-accent/30 bg-accent/5 p-5 text-center"
      >
        <div className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-accent/15">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent" aria-hidden>
            <path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" />
          </svg>
        </div>
        <p className="text-sm text-bone">{message}</p>
        <p className="mt-2 text-xs text-faint">
          The link opens Lucen and signs you in. You can close this tab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={signInWithGoogle}
        className="glass flex h-11 w-full items-center justify-center gap-3 rounded-pill text-sm font-medium text-bone transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--glass-border-strong)] focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.9 3.4 14.7 2.4 12 2.4c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.06-1.1-.15-1.6H12z" />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-faint">
        <span className="h-px flex-1 bg-[var(--glass-border)]" />
        <span className="font-mono">or email link</span>
        <span className="h-px flex-1 bg-[var(--glass-border)]" />
      </div>

      <form onSubmit={sendMagicLink} className="space-y-3">
        <label htmlFor="email" className="sr-only">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 w-full rounded-pill border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] px-5 text-sm text-bone placeholder:text-faint focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        />
        <Pill
          type="submit"
          size="lg"
          loading={status === "sending"}
          className="w-full"
        >
          Send magic link
        </Pill>
      </form>

      {status === "error" && message && (
        <p role="alert" className="text-sm text-danger">
          {message}
        </p>
      )}
    </div>
  );
}

export default LoginForm;
