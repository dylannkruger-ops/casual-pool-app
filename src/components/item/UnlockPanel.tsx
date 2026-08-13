"use client";

import { useState, useCallback } from "react";
import { Pill } from "@/components/glass/Pill";
import { HowToUse } from "./HowToUse";
import { cn } from "@/lib/utils";

type PromptResponse = {
  promptText: string;
  iterationNotes: string | null;
  hasAssets: boolean;
};

/**
 * The entitled/free unlock surface. Fetches the prompt from the gated API on
 * demand (never present in the page payload), copies it, reveals it, and
 * downloads the asset bundle. Every action has loading, success and error
 * states; a small transient toast confirms copy/download.
 */
export function UnlockPanel({
  slug,
  showHowTo,
}: {
  slug: string;
  /** Show the 5-step accordion (premium/entitled items). */
  showHowTo: boolean;
}) {
  const [prompt, setPrompt] = useState<PromptResponse | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [busy, setBusy] = useState<null | "copy" | "reveal" | "download">(null);
  const [toast, setToast] = useState<{ tone: "ok" | "err"; msg: string } | null>(
    null,
  );

  const flash = useCallback((tone: "ok" | "err", msg: string) => {
    setToast({ tone, msg });
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const fetchPrompt = useCallback(async (): Promise<PromptResponse | null> => {
    if (prompt) return prompt;
    const res = await fetch(`/api/items/${slug}/prompt`, { method: "POST" });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      flash("err", body.error ?? "Couldn't load the prompt.");
      return null;
    }
    const data = (await res.json()) as PromptResponse;
    setPrompt(data);
    return data;
  }, [prompt, slug, flash]);

  const onCopy = useCallback(async () => {
    setBusy("copy");
    const data = await fetchPrompt();
    if (data) {
      try {
        await navigator.clipboard.writeText(data.promptText);
        flash("ok", "Prompt copied to your clipboard.");
      } catch {
        setRevealed(true);
        flash("err", "Clipboard blocked — prompt revealed below to copy.");
      }
    }
    setBusy(null);
  }, [fetchPrompt, flash]);

  const onReveal = useCallback(async () => {
    setBusy("reveal");
    const data = await fetchPrompt();
    if (data) setRevealed((r) => !r);
    setBusy(null);
  }, [fetchPrompt]);

  const onDownload = useCallback(async () => {
    setBusy("download");
    const res = await fetch(`/api/items/${slug}/download`, { method: "POST" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      flash("err", body.error ?? "Download failed.");
    } else if (body.seed) {
      flash("ok", "Demo mode — configure Supabase Storage for real downloads.");
    } else if (body.url) {
      flash("ok", "Your download is starting.");
      window.location.href = body.url;
    }
    setBusy(null);
  }, [slug, flash]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Pill onClick={onCopy} loading={busy === "copy"} size="md">
          Copy prompt
        </Pill>
        <Pill
          onClick={onReveal}
          loading={busy === "reveal"}
          variant="secondary"
          size="md"
        >
          {revealed ? "Hide prompt" : "Reveal prompt"}
        </Pill>
        <Pill
          onClick={onDownload}
          loading={busy === "download"}
          variant="secondary"
          size="md"
        >
          Download assets
        </Pill>
      </div>

      {toast && (
        <p
          role="status"
          className={cn(
            "rounded-panel border px-4 py-2.5 text-sm",
            toast.tone === "ok"
              ? "border-accent/30 bg-accent/5 text-accent"
              : "border-danger/30 bg-danger/5 text-danger",
          )}
        >
          {toast.msg}
        </p>
      )}

      {revealed && prompt && (
        <div className="rounded-card border border-[var(--glass-border)] bg-[rgba(5,6,8,0.5)]">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-4 py-2.5">
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
              Build prompt
            </span>
            <span className="font-mono text-[11px] text-faint">
              {prompt.promptText.split(/\s+/).length} words
            </span>
          </div>
          <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap px-4 py-4 font-mono text-[12.5px] leading-relaxed text-bone/85">
            {prompt.promptText}
          </pre>
          {prompt.iterationNotes && (
            <div className="border-t border-[var(--glass-border)] px-4 py-3">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Iteration notes
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {prompt.iterationNotes}
              </p>
            </div>
          )}
        </div>
      )}

      {showHowTo && (
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted">
            How to use
          </p>
          <HowToUse />
        </div>
      )}
    </div>
  );
}

export default UnlockPanel;
