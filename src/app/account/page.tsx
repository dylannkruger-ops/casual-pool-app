import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/glass/Nav";
import { Footer } from "@/components/Footer";
import { GlassPanel } from "@/components/glass/GlassPanel";
import { Chip } from "@/components/glass/Chip";
import { Pill } from "@/components/glass/Pill";
import { EmptyState } from "@/components/EmptyState";
import { ManageBilling } from "@/components/account/ManageBilling";
import { SignOut } from "@/components/account/SignOut";
import { getUser, getEntitlement } from "@/lib/auth";
import { getDownloads } from "@/lib/data/downloads";
import { isStripeConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Account",
  description: "Your Lucen subscription, billing and download history.",
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

const STATUS_COPY: Record<string, { label: string; tone: "accent" | "premium" | "free" }> = {
  active: { label: "Active", tone: "accent" },
  trialing: { label: "Trialing", tone: "accent" },
  past_due: { label: "Past due", tone: "premium" },
  canceled: { label: "Canceled", tone: "free" },
};

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/login?redirect=/account");

  const { hasAccess, subscription } = await getEntitlement(user.id);
  const downloads = await getDownloads(user.id);

  return (
    <div className="relative min-h-dvh">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-28">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              Account
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-bone">
              {user.displayName ?? user.email ?? "Your account"}
            </h1>
            {user.email && user.displayName && (
              <p className="mt-1 text-sm text-muted">{user.email}</p>
            )}
          </div>
          <SignOut />
        </div>

        {/* Past-due grace banner */}
        {subscription?.status === "past_due" && (
          <div className="mb-6 rounded-panel border border-warning/30 bg-warning/5 p-4 text-sm text-warning">
            Your last payment didn&apos;t go through. You still have access for
            now — update your card to avoid losing it.
          </div>
        )}

        {/* Subscription card */}
        <GlassPanel variant="strong" className="p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-semibold text-bone">
                  {subscription
                    ? subscription.plan === "annual"
                      ? "Pro annual"
                      : "Pro monthly"
                    : "Free plan"}
                </h2>
                {subscription && (
                  <Chip tone={STATUS_COPY[subscription.status]?.tone ?? "free"}>
                    {STATUS_COPY[subscription.status]?.label ?? subscription.status}
                  </Chip>
                )}
              </div>

              <p className="mt-2 text-sm text-muted">
                {!subscription &&
                  "Browse everything and use every free layer. Upgrade to unlock all premium prompts and assets."}
                {subscription?.status === "canceled" &&
                  `Access continues until ${fmtDate(subscription.currentPeriodEnd)}.`}
                {(subscription?.status === "active" ||
                  subscription?.status === "trialing") &&
                  `Renews on ${fmtDate(subscription.currentPeriodEnd)}.`}
                {subscription?.status === "past_due" &&
                  "Payment retrying. Update your card in billing."}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              {subscription?.stripeCustomerId ? (
                <ManageBilling />
              ) : (
                <Pill href="/pricing" size="md">
                  {subscription ? "See plans" : "Upgrade to Pro"}
                </Pill>
              )}
            </div>
          </div>

          {!isStripeConfigured && (
            <p className="mt-4 border-t border-[var(--glass-border)] pt-4 text-xs text-faint">
              Billing isn&apos;t configured on this deployment — add your Stripe
              keys (see the README) to enable checkout and the customer portal.
            </p>
          )}
        </GlassPanel>

        {/* Access summary */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <MiniStat
            label="Premium access"
            value={hasAccess ? "Unlocked" : "Locked"}
            tone={hasAccess ? "accent" : "muted"}
          />
          <MiniStat
            label="Plan"
            value={subscription?.plan ? subscription.plan : "free"}
          />
          <MiniStat label="Downloads" value={String(downloads.length)} />
        </div>

        {/* Download history */}
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold text-bone">
            Download history
          </h2>
          {downloads.length === 0 ? (
            <EmptyState
              title="No downloads yet"
              message="Asset bundles you download will appear here. Browse the library and grab your first layer."
              action={
                <Pill href="/" variant="secondary">
                  Browse the library
                </Pill>
              }
              icon={
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
              }
            />
          ) : (
            <GlassPanel className="divide-y divide-[var(--glass-border)]">
              {downloads.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <Link
                    href={d.itemSlug ? `/l/${d.itemSlug}` : "#"}
                    className="text-sm font-medium text-bone hover:text-accent"
                  >
                    {d.itemTitle ?? "Item"}
                  </Link>
                  <span className="font-mono text-xs text-faint">
                    {fmtDate(d.createdAt)}
                  </span>
                </div>
              ))}
            </GlassPanel>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function MiniStat({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "accent" | "muted";
}) {
  return (
    <GlassPanel className="p-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
        {label}
      </p>
      <p
        className={`mt-1.5 font-display text-xl font-semibold capitalize ${
          tone === "accent" ? "text-accent" : "text-bone"
        }`}
      >
        {value}
      </p>
    </GlassPanel>
  );
}
