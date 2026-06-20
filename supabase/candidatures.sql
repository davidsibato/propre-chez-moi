-- ─────────────────────────────────────────────────────────────
-- Run this in Supabase SQL Editor to enable the application form
-- ─────────────────────────────────────────────────────────────

-- 1. Table for prestataire applications
create table if not exists candidatures (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  prenom      text not null,
  nom         text not null,
  email       text not null,
  telephone   text not null,
  ville       text not null,
  experience  integer,
  motivation  text not null,
  services    text[] not null default '{}',
  cv_url      text,
  id_url      text,
  statut      text not null default 'en_attente'
              check (statut in ('en_attente','en_cours','acceptee','refusee'))
);

-- Index for admin queries
create index if not exists candidatures_statut_idx on candidatures(statut);
create index if not exists candidatures_ville_idx  on candidatures(ville);

-- RLS: nobody reads/writes directly — only service role (API route) can
alter table candidatures enable row level security;
-- No policies = public has zero access. Service role bypasses RLS.

-- 2. Storage bucket for uploaded files
-- Run via Supabase Dashboard → Storage → New bucket, OR via this SQL:
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pcv-applications',
  'pcv-applications',
  true,                -- public URLs so email links work without signed URLs expiring
  5242880,             -- 5 MB
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg','image/png','image/webp'
  ]
) on conflict (id) do nothing;

-- Storage policy: service role can upload (API route), public can read (email links)
create policy "service role uploads"
  on storage.objects for insert
  to service_role
  with check (bucket_id = 'pcv-applications');

create policy "public read application files"
  on storage.objects for select
  to public
  using (bucket_id = 'pcv-applications');
