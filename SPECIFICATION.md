# OrgShift Local 完成版仕様書 v1.3（Prototype）

## 0. 基本情報

### Git Repository
- **URL**: `https://github.com/saitoh-hideki/OrgShiftLocal.git`

### Supabase 設定
- **Project URL**: `https://txobkcjegztcrbrbenjn.supabase.co`
- **Anonymous Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4b2JrY2plZ3p0Y3JicmJlbmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzIyMDEsImV4cCI6MjA3MTE0ODIwMX0.c9D2Ro0XZTKaVwUVsMbYOCLnLEwFFi0Di61eH9IxB84`

### ⚠️ プロトタイプ版の注意事項
**本プロトタイプはセキュリティ機能を実装していません**:
- RLS（Row Level Security）無効
- 認証・認可なし
- すべてのAPIが公開アクセス可能
- Edge Functions への認証なし

**本番環境では必ずセキュリティ機能を有効化してください。**

---

## 1. プロダクト概要

### 目的
行政・商店・団体・市民の情報をワンストップ化し、「便利」と「学び」を同時提供する地域情報ポータル。

### 主要機能
1. **行政リンク集** - カテゴリショートカットで外部サービスへ
2. **学び** - イベントカレンダー・生活教材
3. **地域UGCクイズ** - 市民・事業者が作成・即時公開
4. **事業者エリア** - クイズ作成・クーポン管理
5. **AIナビ** - 質問応答・クイズ下書き生成
6. **通報機能** - 記録のみ（停止・権限チェックなし）

---

## 2. 技術スタック

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Noto Sans JP + Inter

### Backend
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Functions**: Supabase Edge Functions
- **Authentication**: なし（プロトタイプ）

### AI Integration
- **Platform**: Supabase Edge Functions
- **Provider**: OpenAI (設定可能)
- **Functions**: ai_assist, grant_coupon, verify_coupon

### Deployment
- **Frontend**: Vercel
- **Backend**: Supabase Cloud

---

## 3. サイトマップ・主要ルート

```
/ (ホーム)
├── /learn (学び)
├── /quizzes (クイズ一覧)
├── /quiz/[id] (クイズ受験)
├── /partner/ (事業者ダッシュボード)
│   ├── /partner/quizzes (クイズ管理)
│   ├── /partner/quizzes/new (新規作成)
│   ├── /partner/coupons (クーポン管理)
│   ├── /partner/coupons/new (クーポン作成)
│   └── /partner/profile (プロフィール)
└── /moderation (モデレーション・デモ用)
```

---

## 4. デザインシステム

### カラーパレット
```css
/* Primary Colors */
--primary: #2E5D50        /* 深緑 */
--accent: #3A9BDC         /* 空色 */
--secondary: #4A4A4A      /* グレー */

/* Semantic Colors */
--success: #16A34A
--warning: #F59E0B
--danger: #DC2626

/* Surface Colors */
--background: #FFFFFF
--surface: #F5F7F8
--border: #E6EBEE
```

### タイポグラフィ
- **Primary**: Noto Sans JP (400, 700)
- **Secondary**: Inter (400, 600, 700)

### コンポーネント
- **Card**: `rounded-2xl shadow-md p-6 hover:shadow-lg`
- **Button**: `btn btn-primary/secondary/accent/outline`
- **Input**: `input`（フォーカス時 primary ring）

---

## 5. データベーススキーマ

### 主要テーブル
```sql
-- プロフィール（表示用）
profiles (id, display_name, role, district, created_at)

-- 事業者
orgs (id, owner_name, name, category, district, website, phone, verified, created_at)

-- リンク（行政・イベント）
links (id, category, title, description, url, type, icon, order_index, is_active, created_at)

-- クイズ
quizzes (id, author_name, org_id, title, description, tags[], category, difficulty, locale, district, source_url, status, trust_score, version, created_at, updated_at)

-- クイズ質問
quiz_questions (id, quiz_id, order_index, type, prompt, choices, answer, explanation, media, created_at)

-- 受験記録
quiz_attempts (id, quiz_id, user_name, score, max_score, started_at, finished_at, detail)

-- 通報
reports (id, quiz_id, reporter_name, reason, status, created_at)

-- クーポン
coupons (id, org_id, name, description, reward_type, starts_at, ends_at, conditions, stock, created_at)

-- クーポン発行
coupon_grants (id, coupon_id, user_name, granted_at, code, used, used_at)
```

### 権限設定（プロトタイプ）
```sql
-- RLS無効・全権限開放
alter default privileges in schema public grant all on tables to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
```

---

## 6. API仕様

### Next.js API Routes
- `GET /api/quizzes` - クイズ検索・一覧
- `GET /api/quizzes/[id]` - クイズ詳細・質問取得
- `POST /api/attempts` - 受験記録保存
- `POST /api/reports` - 通報記録

### Supabase Edge Functions
- `POST /functions/v1/ai_assist` - AI応答・クイズ生成
- `POST /functions/v1/grant_coupon` - クーポン自動付与
- `POST /functions/v1/verify_coupon` - クーポン検証・使用

---

## 7. 主要コンポーネント

### レイアウト
- `Header` - ナビゲーション・検索・AIボタン
- `Footer` - フッターリンク
- `EmergencyBanner` - 緊急時表示

### ホーム画面
- `HeroStatus` - 天気・ごみ・防災レベル
- `AiNavigator` - 質問入力・AI応答
- `GovShortcutGrid` - 行政サービスへのショートカット
- `LearningStrip` - イベント横スクロール
- `LocalQuizRail` - 新着クイズ（行政系・事業者系タブ）
- `NoticeSection` - お知らせ（行政・地域）

### クイズ関連
- `QuizCard` - クイズ情報表示
- `AttemptPlayer` - 受験画面（質問表示・回答・結果）

### 事業者関連
- `PartnerDashboard` - 統計・クイックリンク
- `PartnerWizard` - クイズ作成ウィザード
- `CouponsPanel` - クーポン管理

---

## 8. 環境変数

### .env.local（Frontend）
```bash
NEXT_PUBLIC_SUPABASE_URL=https://txobkcjegztcrbrbenjn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Anonymous Key>
AI_BASE_URL=https://txobkcjegztcrbrbenjn.supabase.co/functions/v1
```

### Edge Functions環境変数
```bash
OPENAI_API_KEY=<必要に応じて>
ALLOWED_ORIGINS=* # プロトタイプ用
```

---

## 9. セットアップ手順

### 1. 依存関係インストール
```bash
npm install
```

### 2. Supabaseデータベース設定
1. [Supabase Dashboard](https://txobkcjegztcrbrbenjn.supabase.co) にアクセス
2. SQL Editor を開く
3. `supabase/schema.sql` を実行（テーブル作成）
4. `supabase/seed.sql` を実行（サンプルデータ）

### 3. Edge Functions デプロイ（任意）
```bash
supabase functions deploy ai_assist
supabase functions deploy grant_coupon
supabase functions deploy verify_coupon
```

### 4. 開発サーバー起動
```bash
npm run dev
```

---

## 10. 実装されたページ・機能

### ✅ 完成済み

#### トップページ (/)
- 緊急帯（表示/非表示切り替え）
- ヒーローセクション（天気・ごみ・防災レベル）
- AIナビゲーター（質問応答）
- 行政ショートカット（8カテゴリ）
- 今日の学び（イベント横スクロール）
- 新着クイズ（行政系・事業者系タブ）
- お知らせ（行政・地域）

#### クイズ機能
- **一覧ページ** (`/quizzes`): 検索・フィルター・ソート
- **受験ページ** (`/quiz/[id]`): 1問1画面・即時解説・結果表示
- **結果画面**: スコア表示・各問解説・クーポン獲得表示

#### 事業者エリア
- **ダッシュボード** (`/partner`): KPI表示・クイックリンク
- **クイズ管理** (`/partner/quizzes`): 作成済みクイズ一覧・編集
- **新規作成** (`/partner/quizzes/new`): 業種テンプレ→AI下書き→編集→保存（即時公開）
- **クーポン管理** (`/partner/coupons`): 作成・配布状況・在庫管理
- **クーポン作成** (`/partner/coupons/new`): 条件設定・期間・在庫設定

#### AI・バックエンド機能
- **AI応答**: 地域情報に特化した質問応答
- **クイズ生成**: 業種別テンプレートからAI下書き作成
- **自動クーポン付与**: スコア条件達成時の自動付与
- **クーポン検証**: コード照合・使用済み管理

---

## 11. サンプルデータ

### リンク（行政・イベント）
- ごみ分別早見表、図書館予約、防災マップ等
- 公民館講座、プログラミング教室等のイベント

### 事業者
- ベーカリー花（パン）
- ナガノ自動車整備（自動車）
- さくら薬局（薬局）

### クイズ
- **行政系**: ごみ分別基礎、防災準備チェック、図書館利用
- **事業者系**: パンの保存、タイヤの基本知識、薬の飲み方

### クーポン
- パン10%割引クーポン（80点以上で獲得）

---

## 12. 今後の拡張予定

### セキュリティ実装
- Supabase RLS有効化
- 認証システム導入（auth.users連携）
- Edge Functions認証追加
- API rate limiting

### 機能拡張
- モデレーション機能（承認フロー）
- 通知システム
- マルチテナント対応
- 分析ダッシュボード

### UX改善
- PWA対応
- オフライン機能
- パフォーマンス最適化
- アクセシビリティ向上

---

## 13. 開発・運用

### ログ・監視
- Edge Functions ログ: Supabase Dashboard
- エラートラッキング: ブラウザコンソール
- パフォーマンス: Next.js Analytics

### デプロイ
- **Frontend**: Vercel自動デプロイ（main branchプッシュ時）
- **Backend**: Supabase Cloud（手動デプロイ）

---

## 14. ライセンス・著作権

プロトタイプ版 - 実装参考用
本番利用時は適切なライセンス・セキュリティ設定を行ってください。

---

**実装完了日**: 2025年1月19日
**バージョン**: v1.3 Prototype