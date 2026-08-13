import { NextResponse } from "next/server";
import { gateItemAccess } from "@/lib/gate";
import { getItemSecret, getSignedAssetUrl } from "@/lib/data/secrets";
import { createAdminClient } from "@/lib/supabase/server";
import { isSeedMode } from "@/lib/env";

/**
 * POST /api/items/[slug]/download
 * Same gate as the prompt route, then returns a short-lived Supabase signed URL
 * for the asset bundle. Records the download for analytics (best-effort).
 *
 * In seed mode there is no storage to sign against, so it returns a clear
 * "demo" response rather than a broken link.
 */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const gate = await gateItemAccess(slug);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.code });
  }

  const secret = await getItemSecret(gate.item.slug, gate.item.id);
  if (!secret?.assetBundlePath) {
    return NextResponse.json(
      { error: "This item has no downloadable assets." },
      { status: 404 },
    );
  }

  // Record the download (best-effort; never blocks the response).
  if (gate.user) {
    const admin = createAdminClient();
    if (admin) {
      await admin
        .from("downloads")
        .insert({ user_id: gate.user.id, item_id: gate.item.id })
        .then(
          () => undefined,
          () => undefined,
        );
    }
  }

  if (isSeedMode) {
    return NextResponse.json({
      seed: true,
      message:
        "Demo mode — asset bundles aren't wired without Supabase Storage. Configure Supabase and upload a bundle via /admin to enable real downloads.",
      bundlePath: secret.assetBundlePath,
    });
  }

  const url = await getSignedAssetUrl(secret.assetBundlePath, 120);
  if (!url) {
    return NextResponse.json(
      { error: "Could not prepare the download. Try again shortly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url, expiresIn: 120 });
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
