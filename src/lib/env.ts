/**
 * Environment access + capability flags.
 *
 * Lucen is built to run in two modes:
 *   • **live**  — Supabase + Stripe env vars present; real DB, auth, billing.
 *   • **seed**  — no backend configured; the app serves the in-repo seed
 *                 content so the whole site is browsable and demoable.
 *
 * Nothing here throws at import time — a missing var simply flips a capability
 * flag off, so a production build never fails for want of a secret. Server
 * routes that require a capability check the relevant flag and respond with a
 * clear message when it is absent.
 */

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  stripePriceMonthly: process.env.STRIPE_PRICE_MONTHLY ?? "",
  stripePriceAnnual: process.env.STRIPE_PRICE_ANNUAL ?? "",

  assetBucket: process.env.SUPABASE_ASSET_BUCKET ?? "asset-bundles",
  mediaBucket: process.env.SUPABASE_MEDIA_BUCKET ?? "preview-media",

  adminEmails: (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
} as const;

/** Public Supabase config present — enough for client auth + reads. */
export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey,
);

/** Service-role key present — required for secrets, signed URLs, admin writes. */
export const hasServiceRole = Boolean(
  isSupabaseConfigured && env.supabaseServiceRoleKey,
);

/** Stripe fully configured — secret key + both price IDs. */
export const isStripeConfigured = Boolean(
  env.stripeSecretKey && env.stripePriceMonthly && env.stripePriceAnnual,
);

/** True when running purely on seed content (no live DB). */
export const isSeedMode = !isSupabaseConfigured;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return env.adminEmails.includes(email.toLowerCase());
}
