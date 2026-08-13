"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pill } from "@/components/glass/Pill";

/**
 * Checkout trigger for a plan. Creates a Stripe Checkout Session server-side
 * and redirects. If the user isn't signed in the API returns 401 and we send
 * them to /login, preserving the intent to land back on pricing.
 */
export function PlanButton({
  plan,
  label,
  variant = "primary",
}: {
  plan: "monthly" | "annual";
  label: string;
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan, redirect: "/account" }),
    });

    if (res.status === 401) {
      router.push("/login?redirect=/pricing");
      return;
    }

    const body = await res.json().catch(() => ({}));
    if (res.ok && body.url) {
      window.location.href = body.url;
    } else {
      setError(body.error ?? "Couldn't start checkout.");
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      <Pill
        onClick={checkout}
        loading={busy}
        variant={variant}
        size="lg"
        className="w-full"
      >
        {label}
      </Pill>
      {error && (
        <p role="alert" className="mt-2 text-center text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default PlanButton;
