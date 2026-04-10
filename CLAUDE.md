# FANPASS — インフルエンサー向けファンクラブプラットフォーム

## 概要
Instagram/X/Threads系インフルエンサーがファン向けに月額サブスク+単発課金で収益化するPWAプラットフォーム。手数料15%。

## 技術スタック
- **フレームワーク**: Next.js 16 (App Router)
- **スタイリング**: Tailwind CSS v4
- **UIコンポーネント**: Radix UI + カスタム
- **アニメーション**: GSAP（LP・マーケ用）
- **DB**: Supabase PostgreSQL
- **ORM**: Drizzle ORM
- **認証**: Supabase Auth（メール/Google/Apple）
- **リアルタイム**: Supabase Realtime（DM、通知）
- **ストレージ**: Supabase Storage
- **決済**: Stripe Connect（destination charges, Subscriptions）
- **ジョブキュー**: Inngest
- **デプロイ**: Vercel（Node.js 20.x）
- **監視**: Sentry + Vercel Analytics
- **アイコン**: Lucide React
- **PWA**: Serwist

## ディレクトリ構成
```
src/
├── app/          # ページ（App Router）
│   ├── (auth)/   # 認証関連ページ
│   ├── (fan)/    # ファン向けページ
│   ├── (creator)/ # クリエイター管理画面
│   ├── [slug]/   # クリエイターページ（動的ルート）
│   └── api/      # APIルート
├── components/   # コンポーネント
│   ├── ui/       # 共通UI
│   ├── creator/  # クリエイター関連
│   ├── fan/      # ファン関連
│   ├── post/     # 投稿関連
│   └── dm/       # DM関連
├── lib/          # ライブラリ初期化・ユーティリティ
│   ├── supabase/ # Supabaseクライアント
│   ├── stripe/   # Stripe関連
│   └── inngest/  # Inngestジョブ定義
├── db/           # DBスキーマ・マイグレーション
├── hooks/        # カスタムフック
└── types/        # 型定義
```

## 開発コマンド
- `npm run dev` — 開発サーバー起動（ポート: 3100）
- `npm run build` — ビルド
- `npm run test` — テスト実行
- `npx drizzle-kit push` — DBマイグレーション
- `npx inngest-cli dev` — Inngest開発サーバー

## 環境変数（.env.local）
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3100
```

## コーディング規約
- TypeScript strict mode
- Server Component デフォルト（'use client' は必要な箇所のみ）
- 全APIにZodバリデーション
- Drizzle ORMでDB操作（生SQL禁止）
- RLSポリシーは全テーブルに必須
- コメントは日本語OK
- エラーハンドリングは統一フォーマット: `{ error: { message: string, code?: string } }`

## デザイン
- 詳細は DESIGN.md を参照
- カラー: ディープバイオレット(#6D28D9) + ウォームゴールド(#D97706)
- フォント: Noto Sans JP
- AIスロップ禁止（紫-青グラデ、過剰なグラスモーフィズム等）

## 決済モデル
- プラットフォーム手数料: **15%**
- Stripe Connect destination charges
- application_fee_amount = 金額 * 0.15
- クリエイター還元率: 85%

## 注意事項
- Vercel Node.js 20.x（24はNG）
- PWAファースト。ネイティブアプリは作らない
- Apple税回避のためApp Store経由の課金は一切なし
- 画像差し替え後は .next キャッシュ削除必須
