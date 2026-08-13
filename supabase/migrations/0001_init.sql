-- ============================================================================
-- Lucen — initial schema, RLS, and triggers.
-- Run with the Supabase CLI (`supabase db push`) or paste into the SQL editor.
--
-- Gating architecture: prompt text + asset paths live ONLY in item_secrets,
-- which has RLS enabled and NO policies granting client reads. The anon and
-- authenticated roles therefore cannot read it at all; access flows solely
-- through server routes using the service-role key.
-- ============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Enums ----------------------------------------------------------------------
do $$ begin
  create type item_category as enum ('template', 'scene', 'background', 'section');
exception when duplicate_object then null; end $$;

do $$ begin
  create type item_tier as enum ('free', 'premium');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_status as enum ('active', 'trialing', 'past_due', 'canceled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_plan as enum ('monthly', 'annual');
exception when duplicate_object then null; end $$;

-- profiles -------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now()
);

-- subscriptions --------------------------------------------------------------
create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  status                 subscription_status not null default 'active',
  current_period_end     timestamptz,
  plan                   subscription_plan,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (user_id)
);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_customer_idx on public.subscriptions (stripe_customer_id);

-- items ----------------------------------------------------------------------
create table if not exists public.items (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  title             text not null,
  tagline           text not null default '',
  description       text not null default '',
  category          item_category not null,
  tags              text[] not null default '{}',
  tier              item_tier not null default 'premium',
  preview_video_url text,
  preview_image_url text,
  live_demo_url     text,
  tech_stack        text[] not null default '{}',
  is_new            boolean not null default false,
  drop_week         date,
  sort_order        integer not null default 0,
  published         boolean not null default false,
  created_at        timestamptz not null default now()
);
create index if not exists items_published_idx on public.items (published, sort_order);
create index if not exists items_category_idx on public.items (category);

-- item_secrets ---------------------------------------------------------------
-- The paid payload. RLS on, NO client policies: unreadable except via service role.
create table if not exists public.item_secrets (
  item_id           uuid primary key references public.items (id) on delete cascade,
  prompt_text       text not null,
  iteration_notes   text,
  asset_bundle_path text
);

-- downloads (analytics) ------------------------------------------------------
create table if not exists public.downloads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  item_id    uuid not null references public.items (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists downloads_user_idx on public.downloads (user_id, created_at desc);

-- ============================================================================
-- Row-level security
-- ============================================================================
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.items         enable row level security;
alter table public.item_secrets  enable row level security;
alter table public.downloads     enable row level security;

-- profiles: a user sees and edits only their own row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- subscriptions: a user may read only their own; all writes are server-side
-- (service role bypasses RLS), never from the client.
drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id);

-- items: anyone (incl. anon) may read published items. Unpublished are hidden.
drop policy if exists "items_select_published" on public.items;
create policy "items_select_published" on public.items
  for select using (published = true);

-- item_secrets: NO policies. RLS is on, so anon/authenticated get zero rows.
-- Only the service-role key (server-side) can read or write this table.

-- downloads: a user may read and insert only their own rows.
drop policy if exists "downloads_select_own" on public.downloads;
create policy "downloads_select_own" on public.downloads
  for select using (auth.uid() = user_id);

drop policy if exists "downloads_insert_own" on public.downloads;
create policy "downloads_insert_own" on public.downloads
  for insert with check (auth.uid() = user_id);

-- ============================================================================
-- Triggers
-- ============================================================================

-- Create a profile row automatically when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep subscriptions.updated_at fresh.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_touch on public.subscriptions;
create trigger subscriptions_touch
  before update on public.subscriptions
  for each row execute function public.touch_updated_at();
