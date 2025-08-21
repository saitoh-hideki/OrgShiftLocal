-- OrgShift Local 初期データ v2.0（長野県長野市版）

-- 2.1 カテゴリ（8固定）
insert into public.category (slug, name_ja, name_en, sort_order) values
('safety','防災・安心','Safety',1),
('life','生活サポート','Life Support',2),
('health','健康・医療','Health & Medical',3),
('childcare','子育て・教育','Childcare & Education',4),
('procedures','行政手続き','Tax & Procedures',5),
('subsidy','補助金・助成金','Subsidies & Grants',6),
('digital','デジタルサービス','Digital Services',7),
('future','未来・学び','Future & Learning',8)
on conflict (slug) do nothing;

-- 2.2 ロケーション階層
-- 日本
insert into public.location (prefecture, municipality, level, parent_id, jis_code, lat, lon)
values (null, '日本', 'country', null, null, 36.2048, 138.2529)
on conflict do nothing;

-- 取得用
with jp as (
  select id from public.location where level='country' and municipality='日本' limit 1
)
-- 長野県
insert into public.location (prefecture, municipality, level, parent_id, jis_code, lat, lon)
select '長野県','長野県','prefecture', jp.id, '20', 36.6513, 138.1809 from jp
on conflict do nothing;

-- 長野市
with pref as (
  select id from public.location where level='prefecture' and municipality='長野県' limit 1
)
insert into public.location (prefecture, municipality, level, parent_id, jis_code, lat, lon)
select '長野県','長野市','municipality', pref.id, '20201', 36.6485, 138.1943 from pref
on conflict do nothing;

-- 2.3 提供主体（例：まずは長野市）
insert into public.provider (name, dept, url) values
('長野市', null, 'https://www.city.nagano.nagano.jp/'),
('長野県', null, 'https://www.pref.nagano.lg.jp/')
on conflict do nothing;
