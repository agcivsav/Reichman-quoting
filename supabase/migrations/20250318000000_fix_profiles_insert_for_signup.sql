-- Fix: Add missing INSERT policy for profiles table
-- Without this policy, the handle_new_user trigger cannot insert into profiles,
-- causing signup to fail with Internal Server Error (500).
--
-- Run this in Supabase Dashboard > SQL Editor, or: supabase db push

-- Add INSERT policy (required for trigger to create profile on signup)
drop policy if exists "users can insert own profile" on profiles;
create policy "users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Harden trigger: set search_path to prevent search_path injection
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
