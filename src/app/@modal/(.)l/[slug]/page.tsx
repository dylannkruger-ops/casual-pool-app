import { notFound } from "next/navigation";
import { Modal } from "@/components/item/Modal";
import { ItemDetail } from "@/components/item/ItemDetail";
import { getItemBySlug } from "@/lib/data/items";

export const dynamic = "force-dynamic";

/**
 * Intercepting route: when the library grid links to /l/[slug] on the client,
 * this renders the detail inside a modal instead of a full navigation. A hard
 * refresh or direct visit falls through to /l/[slug]/page.tsx.
 */
export default async function ItemModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);
  if (!item) notFound();

  return (
    <Modal>
      <ItemDetail item={item} variant="modal" />
    </Modal>
  );
}
