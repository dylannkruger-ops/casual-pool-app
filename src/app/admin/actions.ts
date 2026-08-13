"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";
import { env, isSeedMode } from "@/lib/env";

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null)?.trim() ?? "";
}
function list(fd: FormData, key: string): string[] {
  return str(fd, key)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

async function uploadFile(
  bucket: string,
  path: string,
  file: File,
): Promise<void> {
  const admin = createAdminClient();
  if (!admin) throw new Error("Storage unavailable.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage
    .from(bucket)
    .upload(path, buffer, { contentType: file.type, upsert: true });
  if (error) throw new Error(`Upload failed: ${error.message}`);
}

/**
 * Create or update an item and its secret. Admin-only. Handles optional file
 * uploads for preview image, preview video and the asset bundle zip.
 */
export async function saveItem(formData: FormData) {
  await requireAdmin();
  if (isSeedMode) {
    throw new Error(
      "Seed mode — configure Supabase to persist items. See the README.",
    );
  }
  const admin = createAdminClient();
  if (!admin) throw new Error("Database unavailable.");

  const id = str(formData, "id");
  const slug = str(formData, "slug");
  if (!slug) throw new Error("Slug is required.");

  const record: Record<string, unknown> = {
    slug,
    title: str(formData, "title"),
    tagline: str(formData, "tagline"),
    description: str(formData, "description"),
    category: str(formData, "category"),
    tier: str(formData, "tier"),
    tags: list(formData, "tags"),
    tech_stack: list(formData, "techStack"),
    live_demo_url: str(formData, "liveDemoUrl") || null,
    is_new: bool(formData, "isNew"),
    drop_week: str(formData, "dropWeek") || null,
    sort_order: Number(str(formData, "sortOrder")) || 0,
    published: bool(formData, "published"),
  };
  if (id) record.id = id;

  // Preview image upload (public bucket).
  const previewImage = formData.get("previewImage") as File | null;
  if (previewImage && previewImage.size > 0) {
    const path = `${slug}/${Date.now()}-${previewImage.name}`;
    await uploadFile(env.mediaBucket, path, previewImage);
    const { data } = admin.storage.from(env.mediaBucket).getPublicUrl(path);
    record.preview_image_url = data.publicUrl;
  }

  // Preview video upload (public bucket).
  const previewVideo = formData.get("previewVideo") as File | null;
  if (previewVideo && previewVideo.size > 0) {
    const path = `${slug}/${Date.now()}-${previewVideo.name}`;
    await uploadFile(env.mediaBucket, path, previewVideo);
    const { data } = admin.storage.from(env.mediaBucket).getPublicUrl(path);
    record.preview_video_url = data.publicUrl;
  }

  // Upsert the item and get its id back.
  const { data: saved, error } = await admin
    .from("items")
    .upsert(record, { onConflict: "id" })
    .select("id")
    .single();
  if (error || !saved) throw new Error(error?.message ?? "Save failed.");
  const itemId = saved.id as string;

  // Asset bundle upload (private bucket) → path stored on the secret.
  let assetBundlePath = str(formData, "assetBundlePath") || null;
  const assetBundle = formData.get("assetBundle") as File | null;
  if (assetBundle && assetBundle.size > 0) {
    assetBundlePath = `${slug}/${assetBundle.name}`;
    await uploadFile(env.assetBucket, assetBundlePath, assetBundle);
  }

  // Upsert the secret.
  const promptText = str(formData, "promptText");
  if (promptText) {
    const { error: secretErr } = await admin.from("item_secrets").upsert(
      {
        item_id: itemId,
        prompt_text: promptText,
        iteration_notes: str(formData, "iterationNotes") || null,
        asset_bundle_path: assetBundlePath,
      },
      { onConflict: "item_id" },
    );
    if (secretErr) throw new Error(secretErr.message);
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

/** Toggle an item's published flag. */
export async function togglePublish(formData: FormData) {
  await requireAdmin();
  if (isSeedMode) return;
  const admin = createAdminClient();
  if (!admin) return;

  const id = str(formData, "id");
  const next = str(formData, "next") === "true";
  await admin.from("items").update({ published: next }).eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/");
}

/** Delete an item (cascades to its secret + downloads). */
export async function deleteItem(formData: FormData) {
  await requireAdmin();
  if (isSeedMode) return;
  const admin = createAdminClient();
  if (!admin) return;

  const id = str(formData, "id");
  await admin.from("items").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}
