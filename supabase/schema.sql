-- ============================================================
-- PropreChezVous — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- USERS (extends Supabase auth.users)
-- ────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nom         text not null,
  prenom      text not null,
  telephone   text,
  role        text not null check (role in ('client','prestataire','admin')) default 'client',
  ville       text,
  quartier    text,
  adresse     text,
  created_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- PRESTATAIRES (extra info for role = prestataire)
-- ────────────────────────────────────────────────────────────
create table public.prestataires (
  id              uuid primary key references public.profiles(id) on delete cascade,
  bio             text,
  tarif_horaire   integer not null default 3000,  -- FCFA
  note            numeric(3,2) default 0,
  nombre_avis     integer default 0,
  disponible      boolean default true,
  certifie        boolean default false,
  experience      integer default 0,
  created_at      timestamptz default now()
);

create table public.prestataire_services (
  id              uuid primary key default uuid_generate_v4(),
  prestataire_id  uuid references public.prestataires(id) on delete cascade,
  service         text not null
);

-- ────────────────────────────────────────────────────────────
-- RESERVATIONS
-- ────────────────────────────────────────────────────────────
create table public.reservations (
  id              uuid primary key default uuid_generate_v4(),
  client_id       uuid references public.profiles(id),
  prestataire_id  uuid references public.prestataires(id),
  service         text not null,
  date            date not null,
  heure_debut     time not null,
  duree           integer not null,           -- heures
  adresse         text,
  quartier        text,
  ville           text,
  instructions    text,
  montant         integer not null,            -- FCFA
  statut          text not null
                    check (statut in ('en_attente','confirmee','en_cours','terminee','annulee'))
                    default 'en_attente',
  paiement_statut text not null
                    check (paiement_statut in ('en_attente','paye','rembourse'))
                    default 'en_attente',
  paiement_methode text
                    check (paiement_methode in ('airtel_money','orange_money','cash')),
  paiement_numero text,
  transaction_id  text,
  created_at      timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- AVIS
-- ────────────────────────────────────────────────────────────
create table public.avis (
  id              uuid primary key default uuid_generate_v4(),
  reservation_id  uuid references public.reservations(id) on delete cascade,
  client_id       uuid references public.profiles(id),
  prestataire_id  uuid references public.prestataires(id),
  note            integer not null check (note between 1 and 5),
  commentaire     text,
  created_at      timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- Row Level Security
-- ────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.prestataires enable row level security;
alter table public.prestataire_services enable row level security;
alter table public.reservations enable row level security;
alter table public.avis enable row level security;

-- Profiles: users can read all, update only their own
create policy "Profiles lisibles par tous"    on public.profiles for select using (true);
create policy "Profil modifiable par owner"   on public.profiles for update using (auth.uid() = id);
create policy "Profil insérable à l'inscription" on public.profiles for insert with check (auth.uid() = id);

-- Prestataires: anyone can read
create policy "Prestataires lisibles par tous" on public.prestataires for select using (true);
create policy "Prestataire modifiable par owner" on public.prestataires for update using (auth.uid() = id);
create policy "Prestataire insérable par owner" on public.prestataires for insert with check (auth.uid() = id);

-- Prestataire services: anyone can read
create policy "Services lisibles par tous" on public.prestataire_services for select using (true);
create policy "Services gérés par prestataire" on public.prestataire_services for all using (auth.uid() = prestataire_id);

-- Reservations: client sees theirs, prestataire sees theirs
create policy "Réservation visible client" on public.reservations for select using (auth.uid() = client_id or auth.uid() = prestataire_id);
create policy "Réservation créée par client" on public.reservations for insert with check (auth.uid() = client_id);
create policy "Réservation modifiable par parties" on public.reservations for update using (auth.uid() = client_id or auth.uid() = prestataire_id);

-- Avis: anyone can read
create policy "Avis lisibles par tous" on public.avis for select using (true);
create policy "Avis créé par client" on public.avis for insert with check (auth.uid() = client_id);

-- ────────────────────────────────────────────────────────────
-- Trigger: update note moyenne after new avis
-- ────────────────────────────────────────────────────────────
create or replace function update_prestataire_note()
returns trigger language plpgsql as $$
begin
  update public.prestataires
  set
    note = (select avg(note) from public.avis where prestataire_id = new.prestataire_id),
    nombre_avis = (select count(*) from public.avis where prestataire_id = new.prestataire_id)
  where id = new.prestataire_id;
  return new;
end;
$$;

create trigger after_avis_insert
  after insert on public.avis
  for each row execute function update_prestataire_note();

-- ────────────────────────────────────────────────────────────
-- Admin policy: bypass RLS via service role (server-side only)
-- Use SUPABASE_SERVICE_ROLE_KEY in admin routes, never client-side
-- ────────────────────────────────────────────────────────────
