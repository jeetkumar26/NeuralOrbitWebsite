-- ═══════════════════════════════════════════════════════════════════
-- Neural Orbit WEBSITE — Supabase Tables
-- Run this in the SQL Editor at:
-- https://supabase.com/dashboard/project/mqubjchmdcitprbvbeje/editor
-- ═══════════════════════════════════════════════════════════════════

-- 1. Waitlist / Early Access form
create table if not exists website_waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  company     text,
  role        text,
  source      text default 'website',       -- where they signed up
  created_at  timestamptz default now()
);

alter table website_waitlist enable row level security;
create policy "service role only" on website_waitlist
  for all using (auth.role() = 'service_role');

-- 2. Founder Demo requests
create table if not exists website_demo_requests (
  id          uuid primary key default gen_random_uuid(),
  first_name  text,
  last_name   text,
  email       text not null,
  company     text,
  team_size   text,
  bottleneck  text,
  status      text default 'pending',       -- pending | contacted | booked
  created_at  timestamptz default now()
);

alter table website_demo_requests enable row level security;
create policy "service role only" on website_demo_requests
  for all using (auth.role() = 'service_role');

-- 3. Contact form messages
create table if not exists website_contact (
  id          uuid primary key default gen_random_uuid(),
  name        text,
  email       text not null,
  subject     text,
  message     text,
  status      text default 'unread',        -- unread | read | replied
  created_at  timestamptz default now()
);

alter table website_contact enable row level security;
create policy "service role only" on website_contact
  for all using (auth.role() = 'service_role');
