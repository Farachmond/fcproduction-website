-- FCPRODUCTION reviewsysteem
-- Plak dit in Supabase → SQL Editor → New query → Run (eenmalig).

create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (char_length(name) between 2 and 80),
  company       text check (company is null or char_length(company) <= 100),
  rating        smallint not null check (rating between 1 and 5),
  body          text not null check (char_length(body) between 10 and 1500),
  status        text not null default 'pending'
                check (status in ('published', 'pending', 'hidden', 'rejected')),
  spam_reasons  text[] not null default '{}',
  content_hash  text not null,
  ip_hash       text,
  consent       boolean not null default false check (consent = true),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists reviews_status_created_idx on public.reviews (status, created_at desc);
create index if not exists reviews_content_hash_idx on public.reviews (content_hash);

-- Pogingen per (gehasht) IP-adres, voor rate limiting van het formulier en de admin-login.
create table if not exists public.rate_events (
  id          bigint generated always as identity primary key,
  kind        text not null check (kind in ('review', 'login')),
  ip_hash     text not null,
  created_at  timestamptz not null default now()
);

create index if not exists rate_events_lookup_idx on public.rate_events (kind, ip_hash, created_at desc);

-- Row Level Security AAN en GEEN policies: bezoekers (anon/authenticated) kunnen
-- niets lezen of schrijven. Alleen de server van de website gebruikt de
-- service_role-sleutel en praat met de database.
alter table public.reviews enable row level security;
alter table public.rate_events enable row level security;

revoke all on public.reviews from anon, authenticated;
revoke all on public.rate_events from anon, authenticated;
