-- OrgShift Local シードデータ

-- 既存のリンクデータをクリア
delete from links;

-- リンク（行政・イベント）
insert into links (category, title, description, url, type, icon, order_index) values
-- ごみ・リサイクル関連
('waste','ごみ分別早見表','分別ルールと収集日を確認','https://www.env.go.jp/recycle/waste/','gov','recycle',1),
('waste','リサイクル情報','資源物の出し方とリサイクル方法','https://www.env.go.jp/recycle/','gov','recycle',2),
('waste','粗大ごみ処理','粗大ごみの出し方と料金','https://www.env.go.jp/recycle/waste/dai/','gov','recycle',3),
('waste','小型家電リサイクル','小型家電の回収方法','https://www.env.go.jp/recycle/kaden/','gov','recycle',4),

-- 図書館・学習関連
('library','図書館予約','資料検索と予約システム','https://www.jla.or.jp/','gov','book-open',5),
('library','電子図書館','電子書籍・雑誌の閲覧','https://elibrary.mext.go.jp/','gov','book-open',6),
('library','国立国会図書館','国会図書館の利用案内','https://www.ndl.go.jp/','gov','book-open',7),

-- 防災・安全関連
('disaster','防災マップ','避難所と危険箇所の確認','https://www.bousai.go.jp/','gov','shield',8),
('disaster','緊急地震速報','地震情報と避難方法','https://www.jma.go.jp/jma/kishou/know/bosai/','gov','shield',9),
('disaster','気象警報','天気予報と警報情報','https://www.jma.go.jp/','gov','shield',10),
('disaster','津波情報','津波警報・注意報','https://www.jma.go.jp/tsunami/','gov','shield',11),

-- 健康・医療関連
('health','健康診断予約','市民健診の予約','https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kenkounippon21/index.html','gov','heart',12),
('health','予防接種','予防接種のスケジュール','https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/yobou/','gov','heart',13),
('health','感染症情報','感染症の予防と対策','https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kenkou_iryou/kenkou/kansenshou/','gov','heart',14),

-- 子育て・教育関連
('childcare','子育て支援','子育て支援情報','https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kodomo/kodomo_kosodate/','gov','baby',15),
('childcare','保育園・幼稚園','入園案内と空き状況','https://www.mext.go.jp/a_menu/shotou/youchien/','gov','baby',16),
('childcare','児童手当','児童手当の申請手続き','https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/kodomo/kodomo_kosodate/jidouteate/','gov','baby',17),

-- 交通・移動関連
('transport','公共交通','バス・電車の時刻表','https://www.jr.odekake.net/','gov','bus',18),
('transport','高速道路','渋滞情報と料金','https://www.e-nexco.co.jp/','gov','bus',19),
('transport','空港情報','空港の運行状況','https://www.mlit.go.jp/koku/','gov','bus',20),

-- 税金・手続き関連
('tax','税金・手続き','税金の申告と各種手続き','https://www.nta.go.jp/','gov','file-text',21),
('tax','マイナンバー','マイナンバーカードの申請','https://www.kojinbango.go.jp/','gov','file-text',22),
('tax','確定申告','確定申告の手続き','https://www.nta.go.jp/taxes/shinkoku/','gov','file-text',23),

-- 施設・予約関連
('facility','施設予約','公共施設の予約','https://www.kantei.go.jp/jp/singi/tiiki/kokusentoc/','gov','building',24),
('facility','公民館','講座・イベント情報','https://www.mext.go.jp/b_menu/link/kominkan.htm','gov','building',25),
('facility','スポーツ施設','体育館・プールの予約','https://www.mext.go.jp/sports/','gov','building',26),

-- イベント・講座関連
('event','公民館講座：防災入門','初めての防災講座','https://www.bousai.go.jp/kyoiku/','event','calendar',27),
('event','子ども向けプログラミング教室','小学生向けプログラミング体験','https://code.org/','event','code',28),
('event','シニア向けスマホ教室','スマートフォンの基本操作','https://www.nttdocomo.co.jp/support/trouble/manual/','event','smartphone',29),
('event','地域ボランティア','地域活動への参加','https://www.saigaivc.com/','event','calendar',30),
('event','文化財見学会','地域の文化財を巡る','https://www.bunka.go.jp/','event','calendar',31);

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