-- ============================================================================
-- Storage buckets for preview media and asset bundles.
--
-- Both buckets are PRIVATE. Preview media is served through short-lived signed
-- URLs (or made public per-object if you prefer); asset bundles are ONLY ever
-- reachable via a signed URL minted server-side after an access check. No
-- storage RLS policy grants the anon/authenticated roles direct object reads,
-- so the service-role key (server-side) is the only path in.
-- ============================================================================

-- Preview media is public-read (posters + looping videos are meant to be seen,
-- and benefit from CDN caching). Uploads still require the service role.
insert into storage.buckets (id, name, public)
values ('preview-media', 'preview-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('asset-bundles', 'asset-bundles', false)
on conflict (id) do nothing;

-- asset-bundles has NO public/authenticated policies: it is reachable only via
-- service-role signed URLs minted server-side after an access check. Keep it
-- private, always. preview-media is public-read by virtue of the bucket flag
-- above; uploads to either bucket go through the service role in the admin.
