-- Phase 1 foundation. Run in the Supabase SQL editor.
create extension if not exists pgcrypto;

create table profiles (id uuid primary key references auth.users on delete cascade, display_name text, created_at timestamptz default now());
create table weddings (
  id uuid primary key default gen_random_uuid(),
  name text not null, wedding_date date, location text,
  total_budget numeric(12,2) default 0,
  invite_code text unique default substr(replace(gen_random_uuid()::text,'-',''),1,10),
  created_at timestamptz default now());
create table wedding_members (
  wedding_id uuid references weddings on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text not null check (role in ('owner','editor','viewer')) default 'editor',
  primary key (wedding_id, user_id));
create table tasks (id uuid primary key default gen_random_uuid(), wedding_id uuid not null references weddings on delete cascade,
  title text not null, due_date date, done boolean default false, assigned_to uuid references auth.users, created_at timestamptz default now());
create table expenses (id uuid primary key default gen_random_uuid(), wedding_id uuid not null references weddings on delete cascade,
  description text not null, estimated numeric(12,2) default 0, actual numeric(12,2) default 0, due_date date, created_at timestamptz default now());
create table guests (id uuid primary key default gen_random_uuid(), wedding_id uuid not null references weddings on delete cascade,
  first_name text not null, last_name text, invited boolean default true,
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending','attending','declined')), created_at timestamptz default now());

create function is_member(w uuid) returns boolean language sql security definer stable set search_path=public
  as $$ select exists(select 1 from wedding_members where wedding_id=w and user_id=auth.uid()) $$;
create function can_edit(w uuid) returns boolean language sql security definer stable set search_path=public
  as $$ select exists(select 1 from wedding_members where wedding_id=w and user_id=auth.uid() and role in ('owner','editor')) $$;

alter table profiles enable row level security; alter table weddings enable row level security;
alter table wedding_members enable row level security; alter table tasks enable row level security;
alter table expenses enable row level security; alter table guests enable row level security;

create policy "own profile" on profiles for all using (id=auth.uid()) with check (id=auth.uid());
create policy "members read" on weddings for select using (is_member(id));
create policy "editors update" on weddings for update using (can_edit(id));
create policy "see co-members" on wedding_members for select using (is_member(wedding_id));
do $$ declare t text; begin foreach t in array array['tasks','expenses','guests'] loop
  execute format('create policy "read" on %I for select using (is_member(wedding_id))', t);
  execute format('create policy "write" on %I for all using (can_edit(wedding_id)) with check (can_edit(wedding_id))', t);
end loop; end $$;

create function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into profiles(id, display_name) values (new.id, split_part(new.email,'@',1)); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create function create_wedding(p_name text, p_date date, p_location text, p_budget numeric) returns uuid
language plpgsql security definer set search_path=public as $$
declare w uuid; begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  insert into weddings(name,wedding_date,location,total_budget) values (p_name,p_date,p_location,coalesce(p_budget,0)) returning id into w;
  insert into wedding_members values (w, auth.uid(), 'owner'); return w; end $$;

create function join_wedding(p_code text) returns uuid
language plpgsql security definer set search_path=public as $$
declare w uuid; begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  select id into w from weddings where invite_code = p_code;
  if w is null then raise exception 'Invalid invite code'; end if;
  insert into wedding_members values (w, auth.uid(), 'editor') on conflict do nothing; return w; end $$;

alter publication supabase_realtime add table tasks, expenses, guests, weddings;
