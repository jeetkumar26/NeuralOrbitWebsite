-- Neural Orbit Waitlist Table
-- Run this in your Supabase SQL editor

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  company text,
  role text,
  created_at timestamptz default now()
);

-- Index for fast duplicate checks
create index if not exists waitlist_email_idx on waitlist(email);

-- RLS: allow anonymous inserts only
alter table waitlist enable row level security;

create policy "Allow anon inserts" on waitlist
  for insert with check (true);

create policy "Allow service reads" on waitlist
  for select using (false);
