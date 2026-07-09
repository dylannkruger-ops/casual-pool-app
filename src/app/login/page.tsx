import type { Metadata } from "next";
import Link from "next/link";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Lucen to unlock premium build prompts and assets.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;
  const dest = redirect && redirect.startsWith("/") ? redirect : "/account";

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-16">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 rounded-pill px-2 py-1 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        <span className="size-2 rounded-full bg-accent shadow-[0_0_10px_2px_rgba(79,227,232,0.6)]" />
        <span className="font-display text-xl font-semibold tracking-tight text-bone">
          lucen
        </span>
      </Link>

      <GlassPanel variant="strong" className="w-full max-w-sm p-7">
        <h1 className="font-display text-2xl font-semibold text-bone">
          Sign in
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Unlock the full prompts and bundled assets. No password to remember.
        </p>

        {error === "auth" && (
          <p
            role="alert"
            className="mt-4 rounded-panel border border-danger/30 bg-danger/5 p-3 text-sm text-danger"
          >
            That sign-in link didn&apos;t work. Request a fresh one below.
          </p>
        )}

        <div className="mt-6">
          <LoginForm redirect={dest} />
        </div>
      </GlassPanel>

      <p className="mt-6 max-w-sm text-center text-xs text-faint">
        By continuing you agree to the{" "}
        <Link href="/terms" className="text-muted underline-offset-2 hover:text-bone hover:underline">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/licence" className="text-muted underline-offset-2 hover:text-bone hover:underline">
          licence
        </Link>
        .
      </p>
    </main>
  );
}
