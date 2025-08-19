-- OrgShift Local リンク更新スクリプト
-- このファイルを Supabase Dashboard の SQL Editor で実行してください

-- 既存のリンクデータをクリア
delete from links;

-- 新しいリンクデータを挿入
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

-- 更新完了メッセージ
select 'リンクデータの更新が完了しました。' as message;
