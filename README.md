# OrgShift Local

地域情報ワンストップポータル（プロトタイプ版）

## セットアップ

### 1. リポジトリのクローン
```bash
git clone https://github.com/saitoh-hideki/OrgShiftLocal.git
cd OrgShiftLocal
```

### 2. 環境変数の設定
`.env.local` ファイルを作成し、以下を設定：
```bash
cp .env.example .env.local
```

`.env.local` ファイルを編集して以下を設定：
- `NEXT_PUBLIC_SUPABASE_URL` - SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabaseの匿名キー
- `AI_BASE_URL` - Supabase Edge FunctionsのベースURL

### 3. Supabase データベースのセットアップ

1. [Supabase Dashboard](https://txobkcjegztcrbrbenjn.supabase.co) にアクセス
2. SQL Editor を開く
3. 以下のファイルを順番に実行：
   - `supabase/schema.sql` - テーブル作成
   - `supabase/seed.sql` - 初期データ投入

**重要**: 新しいリンクデータを適用するには、既存のデータをクリアしてから新しいデータを挿入します。

### 4. データベース更新（新しいリンクを適用する場合）

既存のデータベースに新しいリンクを適用する場合：

```sql
-- 既存のリンクデータをクリア
delete from links;

-- 新しいシードデータを実行
-- supabase/seed.sql の内容を実行
```

または、Supabase Dashboard の SQL Editor で `supabase/seed.sql` を実行してください。

### 5. Supabase Edge Functionsのデプロイ
```bash
npx supabase functions deploy ai_assist
npx supabase functions deploy grant_coupon
npx supabase functions deploy verify_coupon
```

### 6. 依存関係のインストール
```bash
npm install
```

### 7. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 主要機能

1. **行政リンク集** - カテゴリ別の外部リンク（実際に動作するURL）
2. **学び** - イベントカレンダーと生活教材
3. **地域UGCクイズ** - 市民・事業者が作成可能
4. **事業者エリア** - クイズ作成とクーポン管理
5. **AIナビ** - 質問応答とクイズ下書き生成

## 実装済みの行政サービスリンク

### ごみ・リサイクル関連
- ごみ分別早見表（環境省）
- リサイクル情報
- 粗大ごみ処理
- 小型家電リサイクル

### 図書館・学習関連
- 図書館予約（日本図書館協会）
- 電子図書館（文部科学省）
- 国立国会図書館

### 防災・安全関連
- 防災マップ（内閣府）
- 緊急地震速報（気象庁）
- 気象警報
- 津波情報

### 健康・医療関連
- 健康診断予約（厚生労働省）
- 予防接種
- 感染症情報

### 子育て・教育関連
- 子育て支援（厚生労働省）
- 保育園・幼稚園（文部科学省）
- 児童手当

### 交通・移動関連
- 公共交通（JR）
- 高速道路（NEXCO）
- 空港情報（国土交通省）

### 税金・手続き関連
- 税金・手続き（国税庁）
- マイナンバー
- 確定申告

### 施設・予約関連
- 公共施設予約
- 公民館
- スポーツ施設

## 技術スタック

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: Supabase Edge Functions

## 注意事項

⚠️ **プロトタイプ版のため、セキュリティ機能は実装していません**
- RLS（Row Level Security）無効
- 認証・認可なし
- すべてのAPIが公開アクセス可能

本番環境では必ずセキュリティ機能を有効化してください。

## トラブルシューティング

### リンクが動作しない場合
1. データベースが正しく更新されているか確認
2. `supabase/seed.sql` を再実行
3. ブラウザのキャッシュをクリア
4. 開発サーバーを再起動
