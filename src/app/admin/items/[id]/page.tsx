import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin, getAdminItem } from "@/lib/admin";
import { saveItem, deleteItem } from "../../actions";
import { Nav } from "@/components/glass/Nav";
import { Pill } from "@/components/glass/Pill";
import { isSeedMode } from "@/lib/env";
import type { Item, ItemSecret } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit item", robots: { index: false } };

const inputCls =
  "h-10 w-full rounded-panel border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] px-3 text-sm text-bone placeholder:text-faint focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1";
const areaCls =
  "w-full rounded-panel border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] px-3 py-2 text-sm text-bone placeholder:text-faint focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-1";
const labelCls = "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.1em] text-muted";

export default async function ItemEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const isNew = id === "new";

  let item: Item | null = null;
  let secret: ItemSecret | null = null;
  if (!isNew) {
    const res = await getAdminItem(id);
    if (!res.item) notFound();
    item = res.item;
    secret = res.secret;
  }

  return (
    <div className="relative min-h-dvh">
      <Nav />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-28">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-faint hover:text-bone"
        >
          ← Back to items
        </Link>
        <h1 className="font-display text-3xl font-semibold text-bone">
          {isNew ? "New item" : `Edit ${item?.title}`}
        </h1>

        {isSeedMode && (
          <div className="mt-4 rounded-panel border border-warning/30 bg-warning/5 p-4 text-sm text-warning">
            Seed mode — saving is disabled until Supabase is configured.
          </div>
        )}

        <form action={saveItem} className="mt-8 space-y-5">
          {!isNew && <input type="hidden" name="id" value={item!.id} />}
          {secret?.assetBundlePath && (
            <input
              type="hidden"
              name="assetBundlePath"
              value={secret.assetBundlePath}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input name="title" required defaultValue={item?.title} className={inputCls} placeholder="Meridian" />
            </Field>
            <Field label="Slug">
              <input name="slug" required defaultValue={item?.slug} className={inputCls} placeholder="meridian" />
            </Field>
          </div>

          <Field label="Tagline">
            <input name="tagline" defaultValue={item?.tagline} className={inputCls} placeholder="A calm, credible landing page." />
          </Field>

          <Field label="Description">
            <textarea name="description" rows={3} defaultValue={item?.description} className={areaCls} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select name="category" defaultValue={item?.category ?? "template"} className={inputCls}>
                <option value="template">template</option>
                <option value="scene">scene</option>
                <option value="background">background</option>
                <option value="section">section</option>
              </select>
            </Field>
            <Field label="Tier">
              <select name="tier" defaultValue={item?.tier ?? "premium"} className={inputCls}>
                <option value="free">free</option>
                <option value="premium">premium</option>
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tags (comma-separated)">
              <input name="tags" defaultValue={item?.tags.join(", ")} className={inputCls} placeholder="saas, landing" />
            </Field>
            <Field label="Tech stack (comma-separated)">
              <input name="techStack" defaultValue={item?.techStack.join(", ")} className={inputCls} placeholder="Next.js, Tailwind" />
            </Field>
          </div>

          <Field label="Live demo URL (optional)">
            <input name="liveDemoUrl" defaultValue={item?.liveDemoUrl ?? ""} className={inputCls} placeholder="https://…" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Drop week (Friday)">
              <input type="date" name="dropWeek" defaultValue={item?.dropWeek ?? ""} className={inputCls} />
            </Field>
            <Field label="Sort order">
              <input type="number" name="sortOrder" defaultValue={item?.sortOrder ?? 0} className={inputCls} />
            </Field>
            <div className="flex items-end gap-5 pb-2">
              <Checkbox name="isNew" label="New" defaultChecked={item?.isNew} />
              <Checkbox name="published" label="Published" defaultChecked={item?.published} />
            </div>
          </div>

          {/* Media uploads */}
          <fieldset className="space-y-4 rounded-card border border-[var(--glass-border)] p-4">
            <legend className="px-2 font-mono text-[11px] uppercase tracking-widest text-accent">
              Media
            </legend>
            <Field label="Preview image (poster)">
              <input type="file" name="previewImage" accept="image/*" className="text-sm text-muted file:mr-3 file:rounded-pill file:border-0 file:bg-accent/15 file:px-3 file:py-1.5 file:text-accent" />
            </Field>
            <Field label="Preview video (mp4/webm, looping)">
              <input type="file" name="previewVideo" accept="video/*" className="text-sm text-muted file:mr-3 file:rounded-pill file:border-0 file:bg-accent/15 file:px-3 file:py-1.5 file:text-accent" />
            </Field>
            {item?.previewVideoUrl || item?.previewImageUrl ? (
              <p className="font-mono text-xs text-faint">
                Current media set. Upload to replace.
              </p>
            ) : null}
          </fieldset>

          {/* Secret */}
          <fieldset className="space-y-4 rounded-card border border-[var(--glass-border)] p-4">
            <legend className="px-2 font-mono text-[11px] uppercase tracking-widest text-accent">
              Gated payload (never sent to non-subscribers)
            </legend>
            <Field label="Build prompt (800+ words)">
              <textarea name="promptText" rows={8} defaultValue={secret?.promptText ?? ""} className={areaCls} placeholder="ROLE & STACK…" />
            </Field>
            <Field label="Iteration notes (optional)">
              <textarea name="iterationNotes" rows={2} defaultValue={secret?.iterationNotes ?? ""} className={areaCls} />
            </Field>
            <Field label="Asset bundle (.zip, optional)">
              <input type="file" name="assetBundle" accept=".zip,application/zip" className="text-sm text-muted file:mr-3 file:rounded-pill file:border-0 file:bg-accent/15 file:px-3 file:py-1.5 file:text-accent" />
            </Field>
            {secret?.assetBundlePath && (
              <p className="font-mono text-xs text-faint">
                Current bundle: {secret.assetBundlePath}
              </p>
            )}
          </fieldset>

          <div className="flex items-center justify-between gap-3 pt-2">
            <Pill type="submit" size="lg" variant={isSeedMode ? "secondary" : "primary"}>
              {isNew ? "Create item" : "Save changes"}
            </Pill>
            {!isNew && !isSeedMode && (
              <button
                formAction={deleteItem}
                className="rounded-pill px-4 py-2 text-sm text-danger transition-colors hover:bg-danger/10 focus-visible:outline-2 focus-visible:outline-danger focus-visible:outline-offset-2"
              >
                Delete item
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-bone">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-accent"
      />
      {label}
    </label>
  );
}
