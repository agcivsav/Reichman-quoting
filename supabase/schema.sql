-- ============================================
-- Reichman Sales Quoting Dashboard Schema
-- ============================================

-- Profiles (extends auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  license_number text,
  company_name text,
  address text,
  city text,
  state text,
  zip text,
  role text default 'customer' check (role in ('admin','sales_rep','customer')),
  created_at timestamptz default now()
);

-- Products catalog
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  sku text,
  category text,
  description text,
  available_pack_sizes text[],
  active boolean default true,
  created_at timestamptz default now()
);

-- Sales Rep <-> Customer assignments
create table if not exists sales_rep_assignments (
  id uuid default gen_random_uuid() primary key,
  sales_rep_id uuid references profiles(id) on delete cascade,
  customer_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(sales_rep_id, customer_id)
);

-- Quotes
create table if not exists quotes (
  id uuid default gen_random_uuid() primary key,
  quote_number serial,
  customer_id uuid references profiles(id),
  sales_rep_id uuid references profiles(id),
  status text default 'new' check (status in ('new','open','quoting','agreed','closed')),
  notes text,
  cart_data jsonb,
  customer_license text,
  customer_phone text,
  customer_company text,
  source text default 'portal' check (source in ('portal','external_site','manual')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quote items
create table if not exists quote_items (
  id uuid default gen_random_uuid() primary key,
  quote_id uuid references quotes(id) on delete cascade,
  product_requested text not null,
  product_quoted text,
  pack_size_requested text,
  pack_size_quoted text,
  quantity_requested numeric,
  quantity_quoted numeric,
  unit_price numeric,
  total_price numeric generated always as (quantity_quoted * unit_price) stored,
  is_substitution boolean default false,
  substitution_reason text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Quote messages (in-portal messaging)
create table if not exists quote_messages (
  id uuid default gen_random_uuid() primary key,
  quote_id uuid references quotes(id) on delete cascade,
  sender_id uuid references profiles(id),
  sender_name text,
  message text not null,
  is_internal boolean default false,
  created_at timestamptz default now()
);

-- API keys for external site integration
create table if not exists api_keys (
  id uuid default gen_random_uuid() primary key,
  name text,
  key_value text unique,
  active boolean default true,
  created_at timestamptz default now()
);

-- Updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger quotes_updated_at
  before update on quotes
  for each row execute function update_updated_at_column();

-- Auto-create profile on signup
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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============ RLS ============
alter table profiles enable row level security;
alter table quotes enable row level security;
alter table quote_items enable row level security;
alter table quote_messages enable row level security;
alter table products enable row level security;

-- Profiles
create policy "users can view own profile" on profiles for select using (auth.uid() = id);
create policy "users can update own profile" on profiles for update using (auth.uid() = id);
create policy "users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "admins view all profiles" on profiles for select using (
  auth.uid() in (select id from profiles where role = 'admin')
);

-- Products (public read)
create policy "anyone can view products" on products for select using (true);
create policy "admins manage products" on products for all using (
  auth.uid() in (select id from profiles where role = 'admin')
);

-- Quotes
create policy "view quotes" on quotes for select using (
  auth.uid() in (select id from profiles where role = 'admin')
  or auth.uid() = sales_rep_id
  or auth.uid() = customer_id
);
create policy "insert quotes" on quotes for insert with check (true);
create policy "update quotes" on quotes for update using (
  auth.uid() in (select id from profiles where role in ('admin','sales_rep'))
  or auth.uid() = customer_id
);

-- Quote items
create policy "view quote items" on quote_items for select using (
  exists (
    select 1 from quotes q where q.id = quote_id and (
      auth.uid() in (select id from profiles where role = 'admin')
      or auth.uid() = q.sales_rep_id
      or auth.uid() = q.customer_id
    )
  )
);
create policy "manage quote items" on quote_items for all using (
  exists (
    select 1 from quotes q where q.id = quote_id and
      auth.uid() in (select id from profiles where role in ('admin','sales_rep'))
  )
);

-- Messages
create policy "view messages" on quote_messages for select using (
  exists (
    select 1 from quotes q where q.id = quote_id and (
      auth.uid() in (select id from profiles where role = 'admin')
      or auth.uid() = q.sales_rep_id
      or auth.uid() = q.customer_id
    )
  )
);
create policy "send messages" on quote_messages for insert with check (
  exists (
    select 1 from quotes q where q.id = quote_id and (
      auth.uid() in (select id from profiles where role = 'admin')
      or auth.uid() = q.sales_rep_id
      or auth.uid() = q.customer_id
    )
  )
);
