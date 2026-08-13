import { NextResponse } from "next/server";
import { gateItemAccess } from "@/lib/gate";
import { getItemSecret } from "@/lib/data/secrets";

/**
 * POST /api/items/[slug]/prompt
 * Returns the build prompt for an item — but only after the server-side gate
 * confirms access (free tier, or an active subscription for premium). The
 * prompt text is never present in any client bundle or RSC payload; it exists
 * client-side only as the body of this authorised response.
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
  if (!secret) {
    return NextResponse.json(
      { error: "This item has no prompt yet." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    slug: gate.item.slug,
    title: gate.item.title,
    promptText: secret.promptText,
    iterationNotes: secret.iterationNotes,
    hasAssets: Boolean(secret.assetBundlePath),
  });
}

// Only POST is allowed — GET would be too easy to trigger by accident / prefetch.
export function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
