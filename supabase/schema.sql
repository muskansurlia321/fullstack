-- TrustHire database schema (Supabase Postgres)
-- Run this in Supabase SQL Editor.

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),

  input_type text not null check (input_type in ('pdf', 'text')),
  input_excerpt text,
  offer_text text,

  scam_score numeric not null check (scam_score >= 0 and scam_score <= 100),
  hf_model text,
  labels jsonb,
  red_flags jsonb,
  explanation text,
  raw_response jsonb
);

create index if not exists analyses_user_id_created_at_idx
  on public.analyses (user_id, created_at desc);

alter table public.analyses enable row level security;

-- Users can read their own analyses
drop policy if exists "analyses_select_own" on public.analyses;
create policy "analyses_select_own"
on public.analyses
for select
using (auth.uid() = user_id);

-- Users can insert their own analyses
drop policy if exists "analyses_insert_own" on public.analyses;
create policy "analyses_insert_own"
on public.analyses
for insert
with check (auth.uid() = user_id);

-- Users can update their own analyses
drop policy if exists "analyses_update_own" on public.analyses;
create policy "analyses_update_own"
on public.analyses
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Users can delete their own analyses
drop policy if exists "analyses_delete_own" on public.analyses;
create policy "analyses_delete_own"
on public.analyses
for delete
using (auth.uid() = user_id);

