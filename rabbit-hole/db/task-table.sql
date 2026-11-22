create table if not exists public.task (
  id uuid primary key default gen_random_uuid(),
  task_name text not null,
  estimated_complete_time text,
  description text not null
);

alter table public.task
  add column if not exists task_name text,
  add column if not exists estimated_complete_time text,
  add column if not exists description text;

alter table public.task enable row level security;

grant select, insert on table public.task to anon, authenticated;

create policy "Allow public task reads"
on public.task
for select
to anon, authenticated
using (true);

create policy "Allow public task inserts"
on public.task
for insert
to anon, authenticated
with check (true);
