-- ═══════════════════════════════════════════════════════════
-- AiPosting — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── USER ACCOUNTS ──────────────────────────────────────────
-- Extended user data beyond Supabase auth
create table if not exists user_accounts (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  plan        text not null default 'free' check (plan in ('free','pro','business','enterprise')),
  plan_status text not null default 'active' check (plan_status in ('active','cancelled','past_due')),
  stripe_customer_id  text unique,
  stripe_subscription_id text unique,
  mrr         integer not null default 0,
  evals_count integer not null default 0,
  scripts_count integer not null default 0,
  active_profile_id uuid,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── PROFILES ───────────────────────────────────────────────
-- Each user can have multiple content profiles
create table if not exists profiles (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references user_accounts(id) on delete cascade,

  -- Basic identity
  name          text not null,
  account_type  text not null check (account_type in ('personal','business')),
  tone_of_voice text,
  audience      text,
  technical_skill text,
  context       text,
  macro_themes  jsonb default '[]',
  sells_products boolean default false,
  products_services text,

  -- Visual identity
  color         text default '#6366f1',
  emoji         text default '🎯',

  -- Strategic identity (OB5)
  identidade    jsonb default '{}',

  -- Deep Research result
  research      jsonb,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast profile lookups
create index if not exists profiles_user_id_idx on profiles(user_id);

-- ─── SCRIPTS ────────────────────────────────────────────────
-- Generated scripts/content history
create table if not exists scripts (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references user_accounts(id) on delete cascade,
  profile_id  uuid not null references profiles(id) on delete cascade,

  -- Content metadata
  title       text,
  format_id   text not null,
  format_label text,
  variation_id text,
  variation_label text,
  framework_id text,
  framework_label text,
  funnel      text check (funnel in ('topo','meio','fundo')),
  theme       text,

  -- Field values used
  field_values jsonb default '{}',

  -- Generated content
  result      text,
  tokens_used integer default 0,

  created_at  timestamptz not null default now()
);

create index if not exists scripts_profile_id_idx on scripts(profile_id);
create index if not exists scripts_user_id_idx on scripts(user_id);
create index if not exists scripts_created_at_idx on scripts(created_at desc);

-- ─── VIRAL SCORES ───────────────────────────────────────────
-- Saved content evaluations
create table if not exists viral_scores (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references user_accounts(id) on delete cascade,
  profile_id  uuid references profiles(id) on delete set null,

  title       text,
  format_id   text not null,
  scores      jsonb not null default '{}',
  final_score integer not null,
  diagnosis   jsonb,

  created_at  timestamptz not null default now()
);

create index if not exists viral_scores_user_id_idx on viral_scores(user_id);

-- ─── PLAN LIMITS ────────────────────────────────────────────
-- Reference table for plan limits
create table if not exists plan_limits (
  plan          text primary key,
  max_profiles  integer not null,
  max_scripts_per_month integer not null,
  max_evals_per_month integer not null,
  deep_research boolean not null default false,
  video_generation boolean not null default false,
  price_brl     integer not null default 0
);

insert into plan_limits values
  ('free',       1,   10,  10, false, false, 0),
  ('pro',        3,   50,  50, true,  false, 9700),
  ('business',   10,  200, 200, true, true,  29700),
  ('enterprise', 999, 999, 999, true, true,  99000)
on conflict (plan) do nothing;

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

alter table user_accounts enable row level security;
alter table profiles enable row level security;
alter table scripts enable row level security;
alter table viral_scores enable row level security;

-- user_accounts: only own row
create policy "Users can read own account"
  on user_accounts for select
  using (auth.uid() = id);

create policy "Users can update own account"
  on user_accounts for update
  using (auth.uid() = id);

-- profiles: only own profiles
create policy "Users can manage own profiles"
  on profiles for all
  using (auth.uid() = user_id);

-- scripts: only own scripts
create policy "Users can manage own scripts"
  on scripts for all
  using (auth.uid() = user_id);

-- viral_scores: only own scores
create policy "Users can manage own scores"
  on viral_scores for all
  using (auth.uid() = user_id);

-- plan_limits: read-only for everyone
create policy "Plan limits are public"
  on plan_limits for select
  to anon, authenticated
  using (true);

-- ─── TRIGGERS ───────────────────────────────────────────────

-- Auto-create user_account on sign up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_accounts (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_accounts_updated_at
  before update on user_accounts
  for each row execute procedure update_updated_at();

create trigger profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at();

-- ─── ADMIN VIEW ─────────────────────────────────────────────
-- For the admin dashboard (uses service role key)
create or replace view admin_overview as
select
  ua.id,
  ua.email,
  ua.full_name,
  ua.plan,
  ua.plan_status,
  ua.mrr,
  ua.evals_count,
  ua.scripts_count,
  ua.created_at,
  count(p.id) as profiles_count,
  count(s.id) as scripts_total
from user_accounts ua
left join profiles p on p.user_id = ua.id
left join scripts s on s.user_id = ua.id
group by ua.id
order by ua.created_at desc;
