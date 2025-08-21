-- OrgShift Local データベーススキーマ v1.3（プロトタイプ / セキュリティなし）

-- ❶ プロト用：RLS 無効＆権限開放（public スキーマ一括）
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on sequences to anon, authenticated;

-- ❷ テーブル作成（参照制約は極力なし／nullable 多め）

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  role text default 'viewer',     -- viewer|creator|moderator|admin（参照しない）
  district text,
  created_at timestamptz default now()
);

create table if not exists orgs (
  id uuid primary key default gen_random_uuid(),
  owner_name text,                -- 誰でも作れるため文字列で保持
  name text not null,
  category text not null,         -- bakery, auto, pharmacy, ...
  district text,
  website text,
  phone text,
  verified boolean default false, -- 見た目用（機能制御はしない）
  created_at timestamptz default now()
);

create table if not exists org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid,
  member_name text,
  role text default 'editor'      -- 表示用
);

create table if not exists links (
  id uuid primary key default gen_random_uuid(),
  category text not null,         -- waste, disaster, library, ...
  title text not null,
  description text,
  url text not null,
  type text not null default 'gov', -- gov|app|event
  icon text,
  order_index int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 今月の学び（学習コンテンツ）テーブル
create table if not exists learning_contents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,         -- 歴史・文化, 防災・安全, 環境・自然, ...
  target_grade text not null,     -- 対象学年
  duration text not null,         -- 所要時間
  start_date date not null,       -- 開始日
  end_date date,                  -- 終了日（単日イベントの場合はnull）
  max_participants int not null,  -- 定員
  current_participants int default 0, -- 現在の参加者数
  instructor text not null,       -- 講師名
  location text not null,         -- 開催場所
  is_active boolean default true, -- 募集状況
  district text,                  -- 対象地域
  created_by text,                -- 作成者
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 過去の学び動画テーブル（新規追加）
create table if not exists learning_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_seconds int check (duration_seconds >= 0 and duration_seconds <= 28800), -- 0〜8時間
  year int not null check (year >= 2000 and year <= 2100), -- 西暦4桁
  category text not null,         -- 安全, IT, AI, 環境, 文化, 健康, 子育て, その他
  tags text[] default '{}',
  video_url text not null,        -- 埋め込みURL（YouTube/Vimeo/HLS）
  thumbnail_url text,             -- サムネイル画像URL
  materials_url text,             -- 資料URL（任意）
  speaker text,                   -- 講師名（任意）
  is_published boolean not null default false,
  popularity int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  author_name text,               -- 任意
  org_id uuid,                    -- 任意（事業者紐付け）
  title text not null,
  description text,
  tags text[] default '{}',
  category text not null,         -- waste, disaster, bakery, auto, ...
  difficulty text default 'easy', -- easy|medium|hard
  locale text default 'ja-JP',
  district text,
  source_url text,
  status text not null default 'published',  -- 直接公開（モデレーション無し）
  trust_score int default 0,
  version int not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null,
  order_index int not null,
  type text not null,             -- single|multi|boolean|order|shorttext
  prompt text not null,
  choices jsonb,                  -- single/multi 用
  answer jsonb not null,          -- 型に応じる
  explanation text,
  media jsonb,
  created_at timestamptz default now()
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null,
  user_name text,                 -- 任意
  score int not null,
  max_score int not null,
  started_at timestamptz default now(),
  finished_at timestamptz,
  detail jsonb
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null,
  reporter_name text,
  reason text not null,
  status text not null default 'open', -- 表示のみ
  created_at timestamptz default now()
);

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  name text not null,
  description text,
  reward_type text not null default 'coupon', -- coupon|stamp|badge
  starts_at timestamptz,
  ends_at timestamptz,
  conditions jsonb not null,       -- {"min_score":80,"quiz_ids":["..."]}
  stock int,
  created_at timestamptz default now()
);

create table if not exists coupon_grants (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null,
  user_name text,
  granted_at timestamptz default now(),
  code text unique,
  used boolean default false,
  used_at timestamptz
);

-- ❸ インデックス作成（learning_videos用）
create index if not exists idx_learning_videos_year_category_published 
  on learning_videos (year desc, category, is_published, popularity desc, created_at desc);

create index if not exists idx_learning_videos_search 
  on learning_videos using gin (to_tsvector('japanese', title || ' ' || coalesce(description, '')));

-- ❹ 念のため、全テーブルで RLS 無効化（明示）
alter table profiles        disable row level security;
alter table orgs            disable row level security;
alter table org_members     disable row level security;
alter table links           disable row level security;
alter table learning_contents disable row level security;
alter table learning_videos disable row level security;
alter table quizzes         disable row level security;
alter table quiz_questions  disable row level security;
alter table quiz_attempts   disable row level security;
alter table reports         disable row level security;
alter table coupons         disable row level security;
alter table coupon_grants   disable row level security;

-- ❺ 権限付与（誰でもアクセス可能）
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;