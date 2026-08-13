import Link from "next/link";
import { PreviewMedia } from "@/components/library/PreviewMedia";
import { Chip } from "@/components/glass/Chip";
import { UnlockPanel } from "./UnlockPanel";
import { LockedTeaser } from "./LockedTeaser";
import { getUser, getEntitlement } from "@/lib/auth";
import type { Item } from "@/lib/types";

const CATEGORY_LABEL: Record<Item["category"], string> = {
  template: "Template",
  scene: "Scene",
  background: "Background",
  section: "Section",
};

/**
 * The item detail body — shared by the full route (/l/[slug]) and the modal
 * (intercepting route). Resolves access on the server: free items and entitled
 * users get the interactive unlock panel; locked premium items get the blurred
 * teaser (whose text is filler, never the real prompt).
 */
export async function ItemDetail({
  item,
  variant = "page",
}: {
  item: Item;
  variant?: "page" | "modal";
}) {
  const user = await getUser();
  const entitlement = user ? await getEntitlement(user.id) : null;
  const hasAccess = item.tier === "free" || Boolean(entitlement?.hasAccess);
  const isAuthed = Boolean(user);

  return (
    <article className={variant === "modal" ? "" : "mx-auto max-w-4xl"}>
      {/* Preview */}
      <div className="relative">
        {item.liveDemoUrl ? (
          <div className="aspect-[16/10] w-full overflow-hidden rounded-card border border-[var(--glass-border)]">
            <iframe
              src={item.liveDemoUrl}
              title={`${item.title} live demo`}
              className="size-full"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <PreviewMedia item={item} active />
        )}
      </div>

      {/* Header */}
      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="accent">{CATEGORY_LABEL[item.category]}</Chip>
          <Chip tone={item.tier === "free" ? "free" : "premium"}>
            {item.tier === "free" ? "Free" : "Premium"}
          </Chip>
          {item.isNew && <Chip tone="new">New</Chip>}
        </div>

        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-bone sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-2 text-lg text-muted">{item.tagline}</p>
      </header>

      {/* Description + tech */}
      <div className="mt-5 space-y-4">
        <p className="text-[15px] leading-relaxed text-bone/80">
          {item.description}
        </p>
        {item.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.techStack.map((tech) => (
              <Chip key={tech}>{tech}</Chip>
            ))}
          </div>
        )}
        <p className="text-sm text-faint">
          Commercial licence — use the output in client and commercial work.{" "}
          <Link
            href="/licence"
            className="text-muted underline-offset-2 hover:text-bone hover:underline"
          >
            Read the terms
          </Link>
          .
        </p>
      </div>

      {/* Gate */}
      <div className="mt-7 border-t border-[var(--glass-border)] pt-7">
        {hasAccess ? (
          <UnlockPanel slug={item.slug} showHowTo />
        ) : (
          <LockedTeaser isAuthed={isAuthed} redirect={`/l/${item.slug}`} />
        )}
      </div>
    </article>
  );
}

export default ItemDetail;
