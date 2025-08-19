-- OrgShift Local シードデータ

-- リンク（行政・イベント）
insert into links (category, title, description, url, type, icon, order_index) values
('waste','ごみ分別早見表','分別ルールと収集日を確認','https://example.city/waste','gov','recycle',1),
('library','図書館予約','資料検索と予約システム','https://example.city/library','gov','book-open',2),
('disaster','防災マップ','避難所と危険箇所の確認','https://example.city/disaster','gov','shield',3),
('health','健康診断予約','市民健診の予約','https://example.city/health','gov','heart',4),
('childcare','子育て支援','子育て支援情報','https://example.city/childcare','gov','baby',5),
('transport','公共交通','バス・電車の時刻表','https://example.city/transport','gov','bus',6),
('tax','税金・手続き','税金の申告と各種手続き','https://example.city/tax','gov','file-text',7),
('facility','施設予約','公共施設の予約','https://example.city/facility','gov','building',8),
('event','公民館講座：防災入門','初めての防災講座','https://example.city/kominkan/bosai','event','calendar',1),
('event','子ども向けプログラミング教室','小学生向けプログラミング体験','https://example.city/programming','event','code',2),
('event','シニア向けスマホ教室','スマートフォンの基本操作','https://example.city/smartphone','event','smartphone',3);

-- 事業者
insert into orgs (name, category, owner_name, district, verified) values
('ベーカリー花', 'bakery', '花田太郎', '中央区', true),
('ナガノ自動車整備', 'auto', '山口次郎', '東区', true),
('さくら薬局', 'pharmacy', '佐藤花子', '西区', true),
('ファミリー食堂', 'restaurant', '田中三郎', '北区', false);

-- クイズ（行政系）
insert into quizzes (author_name, title, description, category, tags, difficulty, district) values
('市役所環境課', 'ごみ分別基礎', '正しいごみの分別方法を学ぼう', 'waste', 
 ARRAY['ごみ', '分別', 'リサイクル'], 'easy', '全域'),
('防災課', '防災準備チェック', '災害に備えて必要な準備を確認', 'disaster', 
 ARRAY['防災', '災害', '準備'], 'medium', '全域'),
('図書館', '図書館利用クイズ', '図書館の便利な使い方', 'library', 
 ARRAY['図書館', '本', '学習'], 'easy', '全域');

-- 事業者クイズ
with org_bakery as (select id from orgs where name='ベーカリー花' limit 1),
     org_auto as (select id from orgs where name='ナガノ自動車整備' limit 1),
     org_pharmacy as (select id from orgs where name='さくら薬局' limit 1)
insert into quizzes (author_name, org_id, title, description, category, tags, source_url, difficulty) values
('花田太郎', (select id from org_bakery), 'パンの保存基礎', 
 '美味しさを保つパンの保存方法', 'bakery', 
 ARRAY['パン', '保存', '食品'], 'https://example.com/bread', 'easy'),
('山口次郎', (select id from org_auto), 'タイヤの基本知識', 
 '安全運転のためのタイヤ管理', 'auto', 
 ARRAY['車', '安全', 'メンテナンス'], 'https://example.com/tires', 'medium'),
('佐藤花子', (select id from org_pharmacy), '薬の正しい飲み方', 
 '薬を安全に服用するための基礎知識', 'pharmacy', 
 ARRAY['薬', '健康', '安全'], 'https://example.com/medicine', 'easy');

-- クイズの質問（ごみ分別基礎）
with quiz_waste as (select id from quizzes where title='ごみ分別基礎' limit 1)
insert into quiz_questions (quiz_id, order_index, type, prompt, choices, answer, explanation) values
((select id from quiz_waste), 1, 'single', 
 'ペットボトルはどのごみに分類されますか？',
 '["可燃ごみ", "不燃ごみ", "資源ごみ", "粗大ごみ"]'::jsonb,
 '2'::jsonb,
 'ペットボトルは資源ごみとして回収され、リサイクルされます。キャップとラベルは外してください。'),
((select id from quiz_waste), 2, 'boolean',
 '電池は可燃ごみとして出してよい',
 null,
 'false'::jsonb,
 '電池は有害ごみとして別途回収されます。火災の原因になるため、可燃ごみには絶対に入れないでください。'),
((select id from quiz_waste), 3, 'multi',
 '資源ごみとして出せるものをすべて選んでください',
 '["新聞紙", "ガラスびん", "陶器", "アルミ缶"]'::jsonb,
 '[0, 1, 3]'::jsonb,
 '新聞紙、ガラスびん、アルミ缶は資源ごみです。陶器は不燃ごみになります。');

-- クイズの質問（パンの保存基礎）
with quiz_bread as (select id from quizzes where title='パンの保存基礎' limit 1)
insert into quiz_questions (quiz_id, order_index, type, prompt, choices, answer, explanation) values
((select id from quiz_bread), 1, 'single',
 '食パンを最も長く保存できる方法は？',
 '["常温保存", "冷蔵保存", "冷凍保存", "真空パック"]'::jsonb,
 '2'::jsonb,
 '冷凍保存が最も長く保存できます。冷蔵は逆にパンの老化を早めてしまうので避けましょう。'),
((select id from quiz_bread), 2, 'boolean',
 '冷蔵庫での保存はパンの劣化を遅らせる',
 null,
 'false'::jsonb,
 '冷蔵庫の温度（0-5℃）はパンのでんぷんの老化を最も進めやすい温度帯です。'),
((select id from quiz_bread), 3, 'single',
 'フランスパンの正しい保存方法は？',
 '["ビニール袋に入れて密閉", "紙袋に入れて常温", "アルミホイルで包む", "そのまま冷蔵庫"]'::jsonb,
 '1'::jsonb,
 'フランスパンは紙袋に入れて常温保存が基本。表面のパリッと感を保てます。');

-- クーポン
with org_bakery as (select id from orgs where name='ベーカリー花' limit 1),
     quiz_bread as (select id from quizzes where title='パンの保存基礎' limit 1)
insert into coupons (org_id, name, description, reward_type, conditions, stock) values
((select id from org_bakery), 
 'パン10%割引クーポン',
 'クイズで80点以上獲得した方限定',
 'coupon',
 jsonb_build_object('min_score', 80, 'quiz_ids', array[(select id from quiz_bread)]::text[]),
 100);

-- プロフィール（サンプル）
insert into profiles (display_name, role, district) values
('テストユーザー', 'viewer', '中央区'),
('管理者', 'admin', '全域'),
('事業者A', 'creator', '東区');