import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/glass/Nav";
import { Footer } from "@/components/Footer";
import { ItemDetail } from "@/components/item/ItemDetail";
import { getItemBySlug } from "@/lib/data/items";

// Access is user-dependent, so never cache the rendered page.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) return { title: "Not found" };

  return {
    title: item.title,
    description: item.tagline,
    openGraph: {
      title: `${item.title} · Lucen`,
      description: item.tagline,
      type: "article",
    },
  };
}

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();

  return (
    <div className="relative min-h-dvh">
      <Nav />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-28">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-faint transition-colors hover:text-bone"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to library
        </Link>
        <ItemDetail item={item} variant="page" />
      </main>
      <Footer />
    </div>
  );
}
