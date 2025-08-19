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

### 4. Supabase Edge Functionsのデプロイ
```bash
npx supabase functions deploy ai_assist
npx supabase functions deploy grant_coupon
npx supabase functions deploy verify_coupon
```

### 5. 依存関係のインストール
```bash
npm install
```

### 6. 開発サーバーの起動
```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 主要機能

1. **行政リンク集** - カテゴリ別の外部リンク
2. **学び** - イベントカレンダーと生活教材
3. **地域UGCクイズ** - 市民・事業者が作成可能
4. **事業者エリア** - クイズ作成とクーポン管理
5. **AIナビ** - 質問応答とクイズ下書き生成

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
