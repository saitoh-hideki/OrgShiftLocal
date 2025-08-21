-- OrgShift Local データベーススキーマ v2.0（長野県長野市版）
-- 8カテゴリ + ロケーション階層 + 補助金・デジタルサービス・リンク型サービス

-- 拡張（初回のみ必要な場合）
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- 1) カテゴリ・ロケーション・提供主体・タグ
create table if not exists public.category (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ja text not null,
  name_en text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.location (
  id uuid primary key default gen_random_uuid(),
  prefecture text,          -- 例: 長野県
  municipality text,        -- 例: 長野市
  jis_code text,            -- 例: 20201
  lat double precision,
  lon double precision,
  level text not null default 'municipality',  -- country|prefecture|municipality
  parent_id uuid null,
  created_at timestamptz not null default now(),
  constraint chk_location_level check (level in ('country','prefecture','municipality')),
  constraint fk_location_parent foreign key (parent_id) references public.location(id) on delete set null
);

create table if not exists public.provider (
  id uuid primary key default gen_random_uuid(),
  name text not null,     -- 長野市 / 長野県 / 長野市 危機管理防災課 など
  dept text,
  url text,
  created_at timestamptz not null default now()
);

create table if not exists public.tag (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

-- 2) リンク型サービス（その他カテゴリ用）
create table if not exists public.service (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.category(id) on delete restrict,
  location_id uuid not null references public.location(id) on delete restrict,
  provider_id uuid references public.provider(id) on delete set null,
  slug text unique not null,
  title_ja text not null,
  title_en text,
  summary_ja text,
  summary_en text,
  icon text,
  primary_url text,                -- 汎用URL（なくてもOK）
  popularity int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_link (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.service(id) on delete cascade,
  label text not null,
  url text not null,
  sort_order int not null default 0,
  location_id uuid references public.location(id),
  unique (service_id, url)
);

-- 3) 補助金（DB検索対象）
create table if not exists public.subsidy (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.category(id) on delete restrict,
  location_id uuid not null references public.location(id) on delete restrict,
  provider_id uuid references public.provider(id) on delete set null,
  slug text unique not null,
  title_ja text not null,
  title_en text,
  summary_ja text,
  summary_en text,
  audience text,                    -- 学生/世帯/事業者 等
  eligibility_ja text,
  amount_min numeric,
  amount_max numeric,
  rate numeric,                     -- 0-100
  application_start date,
  application_end date,
  status text default 'open',       -- open|closed|paused|upcoming
  popularity int not null default 0,
  is_published boolean not null default true,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_text tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(title_ja,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(summary_ja,'')), 'B') ||
    setweight(to_tsvector('simple', coalesce(eligibility_ja,'')), 'C')
  ) stored,
  constraint chk_subsidy_period check (
    application_start is null or application_end is null or application_start <= application_end
  ),
  constraint chk_subsidy_amount check (
    (amount_min is null or amount_max is null or amount_min <= amount_max)
    and (rate is null or (rate >= 0 and rate <= 100))
  ),
  constraint chk_subsidy_status check (status in ('open','closed','paused','upcoming'))
);

create table if not exists public.subsidy_link (
  id uuid primary key default gen_random_uuid(),
  subsidy_id uuid not null references public.subsidy(id) on delete cascade,
  label text not null,
  url text not null,
  sort_order int not null default 0,
  location_id uuid references public.location(id),
  unique (subsidy_id, url)
);

-- 4) デジタルサービス（LINE/アプリ/Web：DB検索対象）
create table if not exists public.digital_service (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.category(id) on delete restrict,
  location_id uuid not null references public.location(id) on delete restrict,
  provider_id uuid references public.provider(id) on delete set null,
  slug text unique not null,
  title_ja text not null,
  title_en text,
  summary_ja text,
  summary_en text,
  channel_type text not null,       -- LINE|iOS|Android|Web
  service_url text,
  app_store_url text,
  play_store_url text,
  line_official_id text,
  add_friend_url text,
  login_required boolean default false,
  pricing text,
  privacy_url text,
  terms_url text,
  contact_url text,
  api_webhook text,
  popularity int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_ds_channel check (channel_type in ('LINE','iOS','Android','Web'))
);

create table if not exists public.digital_service_link (
  id uuid primary key default gen_random_uuid(),
  digital_service_id uuid not null references public.digital_service(id) on delete cascade,
  label text not null,
  url text not null,
  sort_order int not null default 0,
  location_id uuid references public.location(id),
  unique (digital_service_id, url)
);

-- 5) よく使うインデックス
create index if not exists idx_subsidy_search on public.subsidy using gin (search_text);
create index if not exists idx_subsidy_filter on public.subsidy (location_id, is_published, status, popularity desc);
create index if not exists idx_ds_filter on public.digital_service (location_id, is_published, channel_type, popularity desc);
create index if not exists idx_service_filter on public.service (category_id, location_id, is_published, popularity desc);

-- 6) RLS（公開・非公開の基本方針）
alter table public.service enable row level security;
alter table public.subsidy enable row level security;
alter table public.subsidy_link enable row level security;
alter table public.digital_service enable row level security;
alter table public.digital_service_link enable row level security;

create policy "service_read_public" on public.service
for select to anon, authenticated using (is_published = true);

create policy "subsidy_read_public" on public.subsidy
for select to anon, authenticated using (is_published = true);

create policy "subsidy_link_read_public" on public.subsidy_link
for select to anon, authenticated using (true);

create policy "ds_read_public" on public.digital_service
for select to anon, authenticated using (is_published = true);

create policy "ds_link_read_public" on public.digital_service_link
for select to anon, authenticated using (true);

-- 管理用（service_role）にはCRUD全許可（プロジェクトのサービスロールキー前提）
create policy "service_crud_admin" on public.service
for all to service_role using (true) with check (true);
create policy "subsidy_crud_admin" on public.subsidy
for all to service_role using (true) with check (true);
create policy "ds_crud_admin" on public.digital_service
for all to service_role using (true) with check (true);
