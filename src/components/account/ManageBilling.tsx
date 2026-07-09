"use client";

import { useState } from "react";
import { Pill } from "@/components/glass/Pill";

/** Opens the Stripe Customer Portal (cancel / upgrade / card changes). */
export function ManageBilling({
  label = "Manage billing",
  variant = "secondary",
}: {
  label?: string;
  variant?: "primary" | "secondary";
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/portal", { method: "POST" });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.url) {
      window.location.href = body.url;
    } else {
      setError(body.error ?? "Couldn't open billing.");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Pill onClick={open} loading={busy} variant={variant} size="md">
        {label}
      </Pill>
      {error && (
        <p role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default ManageBilling;
