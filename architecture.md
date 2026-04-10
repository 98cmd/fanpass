# システム設計書: FANPASS — インフルエンサー向けファンクラブプラットフォーム

## 1. 概要

### サービス名: FANPASS（ファンパス）
「ファンへのパスポート」= クリエイターの世界への入場券

### ビジネス目的
Instagram/X/Threads系インフルエンサーが、フォロワーをファンクラブ会員に転換し、月額サブスク+単発課金で安定収益を得るためのプラットフォーム。

### ターゲット
- **クリエイター**: フォロワー1万-50万のミドルインフルエンサー（Instagram/X/Threads中心）
- **ファン**: 推しのインフルエンサーと近い距離で繋がりたいユーザー

### ビジネスモデル
- プラットフォーム手数料: **15%**（クリエイター還元率85%）
- Stripe Connect destination charges で実装
- PWAファーストでApple税30%を回避

### 競合優位
| 項目 | FANPASS | Fanicon | FANME | Passes |
|------|---------|---------|-------|--------|
| 手数料 | **15%** | 50% | 10% | 10-20% |
| 有料DM | あり | なし | なし | あり |
| 1on1通話 | あり | なし | なし | あり |
| ガチャ | あり | なし | あり | なし |
| 日本語/日本決済 | ネイティブ | ネイティブ | ネイティブ | 英語のみ |
| PWA | あり | なし | なし | なし |

---

## 2. 機能要件

### Must（MVP: 初期リリース必須）

| ID | 機能 | 概要 |
|----|------|------|
| FR-001 | クリエイター登録・プロフィール | SNS連携認証、プロフィールページ作成、カスタムURL（fanpass.jp/username） |
| FR-002 | ティア制月額サブスク | 最大5ティア設定、ティア別コンテンツ出し分け、自動課金（Stripe Subscriptions） |
| FR-003 | 限定コンテンツ投稿 | 画像/動画/テキスト投稿、ティア別公開制限、いいね・コメント |
| FR-004 | 有料DM | ファン→クリエイターへの1通課金メッセージ、クリエイターが1通の価格を設定（100-10,000円） |
| FR-005 | PPVコンテンツ | 単品販売（写真セット、動画）、購入者のみ閲覧可能 |
| FR-006 | ファン認証・決済 | メール+パスワード認証、Stripe決済（クレカ）、購入履歴 |
| FR-007 | クリエイターダッシュボード | 売上サマリー、ファン数推移、コンテンツ分析、振込管理 |
| FR-008 | ファンのホーム画面 | 登録中クリエイター一覧、新着コンテンツフィード、通知 |
| FR-009 | 通知システム | 新規投稿、DM受信、課金通知（Web Push / メール） |

### Should（v1.1: 運用安定後）

| ID | 機能 | 概要 |
|----|------|------|
| FR-010 | 投げ銭/チップ | コンテンツ・ライブ配信への任意額課金（100-50,000円） |
| FR-011 | 1on1ビデオ通話 | 時間予約制、分単価課金（WebRTC） |
| FR-012 | ライブ配信 | ティア限定ライブ、投げ銭対応 |
| FR-013 | ガチャ/コレクション | デジタルカード、限定ボイス等のランダム販売 |

### Could（v2.0: グロース期）

| ID | 機能 | 概要 |
|----|------|------|
| FR-014 | EC/物販 | オリジナルグッズ販売、配送管理 |
| FR-015 | イベント/チケット | オンライン/オフラインイベントのチケット販売 |
| FR-016 | AI返信アシスト | DM返信のAI下書き生成、クリエイターの口調学習 |
| FR-017 | 複数SNSダッシュボード | Instagram/X/TikTokフォロワー分析統合 |
| FR-018 | クリエイターディスカバリー | カテゴリ別・人気順のクリエイター発見機能 |

### Won't（スコープ外）

- ネイティブアプリ（PWAで十分。ストア税回避が前提）
- アダルトコンテンツ対応（ブランドイメージ保護）
- 多言語対応（日本市場特化がまず優先）
- ライブコマース（EC連携で代替）

---

## 3. 非機能要件

### NFR-001: 可用性
- 稼働時間: 24/7
- 目標稼働率: 99.9%（月間ダウンタイム43分以下）

### NFR-002: パフォーマンス
- API応答時間: p95 < 300ms
- 画面表示: LCP < 2.0秒
- 画像配信: CDN経由、WebP自動変換
- 同時接続数: 初期1,000、スケール目標10,000

### NFR-003: セキュリティ
- 認証: Supabase Auth（メール+パスワード / Google OAuth / Apple ID）
- データ暗号化: TLS 1.3（転送時）、AES-256（保存時 - DM内容）
- RLS: 全テーブルでテナント/ユーザー分離
- コンテンツ保護: 画像の右クリック防止、スクリーンショット抑止（CSS）、動画のDRM検討（v2）
- 決済: PCI DSS準拠（Stripe側で担保）
- 監査ログ: 決済・認証イベントを全記録

### NFR-004: 運用
- バックアップ: Supabase自動（日次PITR）
- 監視: Sentry（エラー）、Vercel Analytics（パフォーマンス）
- ログ: 構造化ログ、90日保持

---

## 4. アーキテクチャ

### 4.1 選定パターン: C（Webアプリ + ジョブキュー）

```
理由:
- UI必要 → Webアプリ
- 重い処理あり（動画トランスコード、決済Webhook処理、通知配信）→ ジョブキュー
- 独立スケールは初期不要 → マルチサービスまではいかない
```

### 4.2 構成図

```
┌─ クライアント（PWA）─────────────────────────────────┐
│  Next.js App Router (SSR + Client Components)        │
│  Service Worker（オフライン、Push通知）                │
└──────────────┬───────────────────────────────────────┘
               │ HTTPS
┌──────────────▼───────────────────────────────────────┐
│  Vercel Edge Network                                  │
│  ┌─────────────────┐  ┌──────────────────────┐       │
│  │ Next.js Server  │  │ API Routes           │       │
│  │ (SSR/RSC)       │  │ /api/*               │       │
│  └────────┬────────┘  └──────────┬───────────┘       │
└───────────┼──────────────────────┼───────────────────┘
            │                      │
┌───────────▼──────────────────────▼───────────────────┐
│  Supabase                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │PostgreSQL│ │ Auth     │ │ Storage  │ │Realtime │ │
│  │(+ RLS)   │ │          │ │(R2/S3)   │ │(WS)     │ │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘ │
└──────────────────────────────────────────────────────┘
            │                      │
┌───────────▼──────────┐  ┌───────▼────────────────────┐
│  Stripe Connect      │  │  Inngest                    │
│  - Subscriptions     │  │  - Webhook処理              │
│  - PaymentIntents    │  │  - 通知配信                 │
│  - Connect Accounts  │  │  - 定期集計                 │
│  - Payouts           │  │  - 画像/動画処理            │
└──────────────────────┘  └────────────────────────────┘
```

### 4.3 技術スタック

| レイヤー | 技術 | 選定理由 |
|---------|------|---------|
| フレームワーク | **Next.js 16** (App Router) | RSC、Server Actions、ISR、PWA対応 |
| UI | **Tailwind CSS v4 + Radix UI** | デザインシステム構築、アクセシビリティ |
| アニメーション | **GSAP** | LP・マーケページ用 |
| DB | **Supabase PostgreSQL** | RLS、Realtime、Auth統合 |
| ORM | **Drizzle ORM** | 型安全、軽量、マイグレーション管理 |
| 認証 | **Supabase Auth** | メール、Google OAuth、Apple ID |
| リアルタイム | **Supabase Realtime** | DM、通知、オンライン状態 |
| ストレージ | **Supabase Storage** | 画像/動画アップロード、CDN配信 |
| 決済 | **Stripe Connect** | destination charges、Subscriptions、日本対応 |
| ジョブキュー | **Inngest** | Webhook処理、通知、バッチジョブ |
| デプロイ | **Vercel** | Edge Network、自動スケール |
| 監視 | **Sentry + Vercel Analytics** | エラー追跡、パフォーマンス |
| アイコン | **Lucide React** | 統一アイコンセット |
| PWA | **next-pwa / Serwist** | Service Worker、Push通知 |
| ビデオ通話（v1.1） | **LiveKit** or **Daily.co** | WebRTC SFU |
| ライブ配信（v1.1） | **Mux** or **Cloudflare Stream** | HLS配信 |

### 4.4 決済フロー詳細

```
【月額サブスク】
1. ファンがティア選択
2. Stripe Checkout Session作成（mode: subscription）
   - application_fee_percent: 15（プラットフォーム手数料）
   - transfer_data.destination: クリエイターのConnect Account
3. Stripe Subscriptions が毎月自動課金
4. Webhook: invoice.paid → サブスク状態更新
5. Webhook: invoice.payment_failed → リトライ/通知

【単発購入（PPV、有料DM、チップ）】
1. ファンが購入アクション
2. PaymentIntent作成
   - application_fee_amount: 金額 × 15%
   - transfer_data.destination: クリエイターのConnect Account
3. Stripe Elements で決済（カード入力はStripe側）
4. Webhook: payment_intent.succeeded → コンテンツ/DMアンロック

【クリエイター出金】
- Stripe Connect Standard/Express Account
- 週次 or 月次の自動Payout（日本の銀行口座へ）
- 最低出金額: 1,000円
```

---

## 5. データモデル

### users（ユーザー共通）
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, default: gen_random_uuid() | Supabase Auth uid と一致 |
| email | varchar(255) | UNIQUE, NOT NULL | |
| display_name | varchar(100) | NOT NULL | 表示名 |
| avatar_url | text | | プロフィール画像URL |
| role | enum('fan','creator','admin') | NOT NULL, default: 'fan' | |
| created_at | timestamptz | NOT NULL, default: now() | |
| updated_at | timestamptz | NOT NULL, default: now() | |

### creator_profiles（クリエイター詳細）
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK, default: gen_random_uuid() | |
| user_id | uuid | FK → users.id, UNIQUE, NOT NULL | |
| slug | varchar(50) | UNIQUE, NOT NULL | カスタムURL（fanpass.jp/slug） |
| bio | text | | 自己紹介 |
| cover_image_url | text | | カバー画像 |
| sns_instagram | varchar(255) | | Instagramユーザー名 |
| sns_x | varchar(255) | | X ユーザー名 |
| sns_threads | varchar(255) | | Threads ユーザー名 |
| sns_tiktok | varchar(255) | | TikTok ユーザー名 |
| stripe_account_id | varchar(255) | | Stripe Connect Account ID |
| stripe_onboarded | boolean | NOT NULL, default: false | Stripe審査完了 |
| dm_price | integer | default: 500 | 有料DM 1通の価格（円） |
| is_published | boolean | NOT NULL, default: false | 公開状態 |
| category | varchar(50) | | カテゴリ（ファッション、美容、フィットネス等） |
| created_at | timestamptz | NOT NULL, default: now() | |
| updated_at | timestamptz | NOT NULL, default: now() | |

Index: creator_profiles_slug_idx (slug), creator_profiles_user_id_idx (user_id)

### tiers（サブスクティア）
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| creator_id | uuid | FK → creator_profiles.id, NOT NULL | |
| name | varchar(100) | NOT NULL | ティア名（例: ライト、スタンダード、VIP） |
| description | text | | ティア説明 |
| price | integer | NOT NULL | 月額価格（円） |
| stripe_price_id | varchar(255) | | Stripe Price ID |
| sort_order | integer | NOT NULL, default: 0 | 表示順 |
| is_active | boolean | NOT NULL, default: true | |
| benefits | jsonb | default: '[]' | 特典リスト |
| created_at | timestamptz | NOT NULL, default: now() | |
| updated_at | timestamptz | NOT NULL, default: now() | |

Index: tiers_creator_id_idx (creator_id)

### subscriptions（サブスク契約）
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| fan_id | uuid | FK → users.id, NOT NULL | |
| creator_id | uuid | FK → creator_profiles.id, NOT NULL | |
| tier_id | uuid | FK → tiers.id, NOT NULL | |
| stripe_subscription_id | varchar(255) | UNIQUE | |
| status | enum('active','past_due','canceled','paused') | NOT NULL | |
| current_period_start | timestamptz | | |
| current_period_end | timestamptz | | |
| canceled_at | timestamptz | | |
| created_at | timestamptz | NOT NULL, default: now() | |
| updated_at | timestamptz | NOT NULL, default: now() | |

Index: subscriptions_fan_creator_idx (fan_id, creator_id) UNIQUE
RLS: fan_id = auth.uid() OR creator_id のuser_id = auth.uid()

### posts（コンテンツ投稿）
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| creator_id | uuid | FK → creator_profiles.id, NOT NULL | |
| type | enum('text','image','video','audio') | NOT NULL | |
| title | varchar(255) | | |
| body | text | | テキスト本文 |
| media_urls | jsonb | default: '[]' | メディアファイルURL配列 |
| visibility | enum('public','subscribers','tier') | NOT NULL, default: 'subscribers' | |
| min_tier_id | uuid | FK → tiers.id, nullable | tier指定時の最低ティア |
| is_ppv | boolean | NOT NULL, default: false | 単品販売かどうか |
| ppv_price | integer | | PPV価格（円） |
| like_count | integer | NOT NULL, default: 0 | |
| comment_count | integer | NOT NULL, default: 0 | |
| published_at | timestamptz | | |
| created_at | timestamptz | NOT NULL, default: now() | |
| updated_at | timestamptz | NOT NULL, default: now() | |

Index: posts_creator_published_idx (creator_id, published_at DESC)
RLS: 公開判定ロジック（visibility + subscription状態による）

### post_likes
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| post_id | uuid | FK → posts.id, NOT NULL | |
| user_id | uuid | FK → users.id, NOT NULL | |
| created_at | timestamptz | NOT NULL, default: now() | |

Index: post_likes_post_user_idx (post_id, user_id) UNIQUE

### comments
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| post_id | uuid | FK → posts.id, NOT NULL | |
| user_id | uuid | FK → users.id, NOT NULL | |
| body | text | NOT NULL | |
| created_at | timestamptz | NOT NULL, default: now() | |

Index: comments_post_idx (post_id, created_at)

### direct_messages（有料DM）
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| sender_id | uuid | FK → users.id, NOT NULL | ファン（送信者） |
| receiver_id | uuid | FK → users.id, NOT NULL | クリエイター（受信者） |
| body | text | NOT NULL | メッセージ本文（暗号化） |
| media_url | text | | 添付メディア |
| price | integer | NOT NULL | 支払い額（円） |
| stripe_payment_intent_id | varchar(255) | | |
| is_read | boolean | NOT NULL, default: false | |
| replied_at | timestamptz | | クリエイターが返信した日時 |
| reply_body | text | | クリエイターの返信 |
| created_at | timestamptz | NOT NULL, default: now() | |

Index: dm_receiver_idx (receiver_id, is_read, created_at DESC)
RLS: sender_id = auth.uid() OR receiver_id = auth.uid()

### ppv_purchases（PPV購入履歴）
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| post_id | uuid | FK → posts.id, NOT NULL | |
| fan_id | uuid | FK → users.id, NOT NULL | |
| price | integer | NOT NULL | |
| stripe_payment_intent_id | varchar(255) | | |
| created_at | timestamptz | NOT NULL, default: now() | |

Index: ppv_purchases_post_fan_idx (post_id, fan_id) UNIQUE

### tips（投げ銭 - v1.1）
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| sender_id | uuid | FK → users.id, NOT NULL | |
| creator_id | uuid | FK → creator_profiles.id, NOT NULL | |
| post_id | uuid | FK → posts.id, nullable | 投稿への投げ銭の場合 |
| amount | integer | NOT NULL | 金額（円） |
| message | varchar(200) | | 添えるメッセージ |
| stripe_payment_intent_id | varchar(255) | | |
| created_at | timestamptz | NOT NULL, default: now() | |

### transactions（全取引ログ）
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| creator_id | uuid | FK → creator_profiles.id, NOT NULL | |
| fan_id | uuid | FK → users.id | |
| type | enum('subscription','ppv','dm','tip','payout') | NOT NULL | |
| amount | integer | NOT NULL | 総額（円） |
| platform_fee | integer | NOT NULL | プラットフォーム手数料（15%） |
| creator_revenue | integer | NOT NULL | クリエイター収益（85%） |
| stripe_id | varchar(255) | | Stripe上のID |
| status | enum('pending','completed','failed','refunded') | NOT NULL | |
| created_at | timestamptz | NOT NULL, default: now() | |

Index: transactions_creator_idx (creator_id, created_at DESC)
Index: transactions_type_idx (type, created_at DESC)

### notifications
| カラム | 型 | 制約 | 説明 |
|--------|-----|------|------|
| id | uuid | PK | |
| user_id | uuid | FK → users.id, NOT NULL | |
| type | enum('new_post','new_dm','new_subscriber','payment','system') | NOT NULL | |
| title | varchar(255) | NOT NULL | |
| body | text | | |
| link | text | | 遷移先URL |
| is_read | boolean | NOT NULL, default: false | |
| created_at | timestamptz | NOT NULL, default: now() | |

Index: notifications_user_idx (user_id, is_read, created_at DESC)

---

## 6. API設計

### 認証

| メソッド | パス | 概要 |
|---------|------|------|
| POST | /api/auth/signup | メール+パスワード登録 |
| POST | /api/auth/login | ログイン |
| POST | /api/auth/oauth/[provider] | OAuth認証（Google/Apple） |
| POST | /api/auth/logout | ログアウト |

### クリエイター

| メソッド | パス | 概要 |
|---------|------|------|
| GET | /api/creators | クリエイター一覧（ディスカバリー） |
| GET | /api/creators/[slug] | クリエイタープロフィール |
| POST | /api/creators/register | クリエイター登録申請 |
| PATCH | /api/creators/me | プロフィール更新 |
| POST | /api/creators/me/stripe-onboard | Stripe Connect オンボーディング開始 |
| GET | /api/creators/me/dashboard | ダッシュボード集計データ |
| GET | /api/creators/me/subscribers | ファン一覧 |
| GET | /api/creators/me/revenue | 収益詳細 |

### ティア

| メソッド | パス | 概要 |
|---------|------|------|
| GET | /api/creators/[slug]/tiers | ティア一覧 |
| POST | /api/tiers | ティア作成 |
| PATCH | /api/tiers/[id] | ティア更新 |
| DELETE | /api/tiers/[id] | ティア削除（ソフトデリート） |

### サブスクリプション

| メソッド | パス | 概要 |
|---------|------|------|
| POST | /api/subscriptions/checkout | サブスク開始（Checkout Session作成） |
| POST | /api/subscriptions/[id]/cancel | サブスク解約 |
| GET | /api/subscriptions/me | 自分のサブスク一覧 |

### 投稿

| メソッド | パス | 概要 |
|---------|------|------|
| GET | /api/posts/feed | ファン用フィード |
| GET | /api/creators/[slug]/posts | クリエイターの投稿一覧 |
| POST | /api/posts | 投稿作成 |
| PATCH | /api/posts/[id] | 投稿更新 |
| DELETE | /api/posts/[id] | 投稿削除 |
| POST | /api/posts/[id]/like | いいね |
| DELETE | /api/posts/[id]/like | いいね解除 |
| GET | /api/posts/[id]/comments | コメント一覧 |
| POST | /api/posts/[id]/comments | コメント投稿 |

### PPV

| メソッド | パス | 概要 |
|---------|------|------|
| POST | /api/posts/[id]/purchase | PPVコンテンツ購入 |

### DM

| メソッド | パス | 概要 |
|---------|------|------|
| GET | /api/dm/threads | DM一覧（クリエイター用） |
| GET | /api/dm/threads/[creatorId] | 特定クリエイターとのDM履歴（ファン用） |
| POST | /api/dm/send | 有料DM送信（決済込み） |
| POST | /api/dm/[id]/reply | DM返信（クリエイター→ファン、無料） |
| PATCH | /api/dm/[id]/read | 既読マーク |

### 決済Webhook

| メソッド | パス | 概要 |
|---------|------|------|
| POST | /api/webhooks/stripe | Stripe Webhook受信 |

### メディア

| メソッド | パス | 概要 |
|---------|------|------|
| POST | /api/media/upload | メディアアップロード（署名付きURL取得） |

### 通知

| メソッド | パス | 概要 |
|---------|------|------|
| GET | /api/notifications | 通知一覧 |
| PATCH | /api/notifications/read-all | 全既読 |

---

## 7. 画面設計

### 7.1 画面一覧

| # | パス | 画面名 | 対象 | データ取得 |
|---|------|--------|------|-----------|
| 1 | / | LP（トップページ） | 未登録 | SSG |
| 2 | /login | ログイン | 未認証 | Client |
| 3 | /signup | 新規登録 | 未認証 | Client |
| 4 | /[slug] | クリエイターページ | 全員 | SSR + ISR |
| 5 | /home | ファンホーム（フィード） | ファン | RSC |
| 6 | /subscriptions | 登録中サブスク一覧 | ファン | RSC |
| 7 | /dm | DM一覧・詳細 | ファン/クリエイター | RSC + Realtime |
| 8 | /notifications | 通知一覧 | 全員 | RSC |
| 9 | /creator/dashboard | ダッシュボード | クリエイター | RSC |
| 10 | /creator/posts | 投稿管理 | クリエイター | RSC |
| 11 | /creator/posts/new | 新規投稿作成 | クリエイター | Client |
| 12 | /creator/tiers | ティア管理 | クリエイター | RSC |
| 13 | /creator/subscribers | ファン管理 | クリエイター | RSC |
| 14 | /creator/revenue | 収益・振込管理 | クリエイター | RSC |
| 15 | /creator/settings | クリエイター設定 | クリエイター | RSC |
| 16 | /settings | アカウント設定 | 全員 | RSC |
| 17 | /creator/register | クリエイター登録 | ファン→クリエイター | Client |

### 7.2 主要画面ワイヤーフレーム

#### クリエイターページ /[slug]（最重要画面）
```
┌──────────────────────────────────────────────┐
│ [FANPASS logo]              [ログイン/登録]   │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │         カバー画像 (16:9)            │    │
│  │                                      │    │
│  │    ┌─────┐                           │    │
│  │    │avatar│  @username               │    │
│  │    └─────┘  カテゴリタグ             │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  自己紹介テキスト...                          │
│  Instagram: @xxx  X: @xxx  Threads: @xxx     │
│                                              │
│  ┌─ ティア選択 ─────────────────────────┐    │
│  │ ┌────────┐ ┌────────┐ ┌────────┐    │    │
│  │ │ ライト │ │スタンダ│ │  VIP   │    │    │
│  │ │ ¥500/月│ │¥1,000月│ │¥3,000月│    │    │
│  │ │        │ │        │ │        │    │    │
│  │ │・限定  │ │・全投稿│ │・全投稿│    │    │
│  │ │ 投稿   │ │・コメント│ │・DM返信│    │    │
│  │ │        │ │        │ │・優先  │    │    │
│  │ │[参加]  │ │[参加]  │ │[参加]  │    │    │
│  │ └────────┘ └────────┘ └────────┘    │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  ── 有料DM ──────────────────────────────    │
│  [メッセージを送る ¥500/通]                   │
│                                              │
│  ── 投稿一覧 ──────────────────────────────  │
│  ┌──────────────────────────────────┐        │
│  │ [公開投稿]                       │        │
│  │ テキスト + 画像プレビュー         │        │
│  │ ♥ 123  💬 45   2時間前           │        │
│  └──────────────────────────────────┘        │
│  ┌──────────────────────────────────┐        │
│  │ [🔒 会員限定] ぼかし画像          │        │
│  │ この投稿を見るにはスタンダード以上 │        │
│  │ [サブスクに参加して閲覧する]      │        │
│  └──────────────────────────────────┘        │
└──────────────────────────────────────────────┘
```

#### クリエイターダッシュボード /creator/dashboard
```
┌──────────────────────────────────────────────┐
│ [Sidebar]  │  ダッシュボード                  │
│            │                                  │
│ ダッシュボード│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐│
│ 投稿管理    │ │月間  │ │ファン│ │ DM  │ │先月比││
│ ティア管理  │ │売上  │ │ 数  │ │未読 │ │ +%  ││
│ ファン管理  │ │¥XXX  │ │ XXX │ │ XX  │ │     ││
│ 収益管理    │ └─────┘ └─────┘ └─────┘ └─────┘│
│ DM         │                                  │
│ 設定       │ ┌─ 売上推移 ─────────────────┐  │
│            │ │   ラインチャート（月次）     │  │
│            │ └────────────────────────────┘  │
│            │                                  │
│            │ ┌─ 収益内訳 ─┐ ┌─ 最新ファン ─┐ │
│            │ │ 円グラフ    │ │ @user1 ライト│ │
│            │ │ サブスク 60%│ │ @user2 VIP  │ │
│            │ │ PPV    25% │ │ @user3 スタン│ │
│            │ │ DM     15% │ │             │ │
│            │ └────────────┘ └─────────────┘ │
└──────────────────────────────────────────────┘
```

---

## 8. セキュリティ設計

### 認証・認可

| 項目 | 設計 |
|------|------|
| 認証方式 | Supabase Auth（メール+パスワード / Google OAuth / Apple ID） |
| セッション | JWT（Supabase自動管理）、リフレッシュトークンあり |
| 2FA | v1.1で対応（TOTP） |

### ロール設計

| ロール | 権限 |
|--------|------|
| fan | コンテンツ閲覧（サブスク範囲内）、購入、DM送信、いいね・コメント |
| creator | fan権限 + 投稿CRUD、ティア管理、ファン管理、収益閲覧 |
| admin | 全操作 + ユーザー管理、売上管理、コンテンツモデレーション |

### RLSポリシー（主要テーブル）
- **posts**: 公開投稿は全員閲覧可。限定投稿はsubscriptionsテーブルとJOINして該当ティア以上のサブスクがあるかチェック
- **direct_messages**: sender_id OR receiver_id = auth.uid()
- **subscriptions**: fan_id = auth.uid()（ファン側）、creator owner check（クリエイター側）
- **transactions**: creator owner check（クリエイター側）、admin（管理者）

### コンテンツ保護
- 画像: 右クリック防止（CSS pointer-events）、ドラッグ防止、開発者ツール検知
- 動画: HLS暗号化（v2でDRM検討）
- スクリーンショット: CSS防止策（完全防止は不可。抑止レベル）

---

## 9. テーマ・デザイン方針

### テーマ: bold + luxury
Instagram/X系のファン文化 → 活気があり、かつ安っぽくない洗練されたデザイン

### カラーパレット
| ロール | 色 | HEX |
|--------|-----|-----|
| primary | ディープバイオレット | #6D28D9 |
| primary-hover | | #5B21B6 |
| secondary | ウォームゴールド | #D97706 |
| background | ほぼ白 | #FAFAF9 |
| surface | 白 | #FFFFFF |
| surface-hover | | #F5F5F4 |
| text-primary | ほぼ黒 | #1C1917 |
| text-secondary | | #57534E |
| text-muted | | #A8A29E |
| border | | #E7E5E4 |
| success | | #16A34A |
| error | | #DC2626 |
| warning | | #D97706 |
| info | | #2563EB |

**注意**: 紫系だがAIスロップの「紫-青グラデーション」にはしない。ディープバイオレット単色+ゴールドアクセントでラグジュアリー感を出す。

### フォント
- 見出し: **Noto Sans JP** (700/900)
- 本文: **Noto Sans JP** (400/500)
- アクセント英字: **Inter** (ブランドロゴ・数字のみ)

### デザイン独自性
1. クリエイターページはInstagramのプロフィール感覚で直感的に
2. ティアカードは物理的な「パスカード」をモチーフに（角丸 + 光沢エフェクト）
3. 課金アクションにはマイクロアニメーション（GSAP）で達成感を演出
4. ダークモード対応（クリエイターの世界観に合わせて選択可能）

---

## 10. 実装タスクリスト

### Phase A: 基盤（逐次実行）

| # | タスク | 推定 | 成果物 |
|---|-------|------|--------|
| T1 | プロジェクトスキャフォールド | 1h | Next.js + Tailwind + Drizzle + Supabase初期設定 |
| T2 | DBスキーマ + マイグレーション | 3h | 全テーブル定義、RLSポリシー |
| T3 | Supabase Auth セットアップ | 1h | メール/OAuth認証、ミドルウェア |
| T4 | Stripe Connect セットアップ | 2h | Connect Account作成フロー、Webhook受信 |
| T5 | 共通UIコンポーネント | 2h | Button, Card, Input, Modal, Avatar, Badge等 |
| T6 | レイアウト（Header/Sidebar/Footer） | 2h | ファン用レイアウト、クリエイター管理画面レイアウト |

### Phase B: コア機能（並列実行可能）

| # | タスク | 依存 | 推定 | 並列 |
|---|-------|------|------|------|
| T7 | クリエイター登録・プロフィール | T2-T6 | 4h | Yes |
| T8 | ティア管理CRUD | T2-T6 | 3h | Yes |
| T9 | 月額サブスク（Checkout + Webhook） | T4,T8 | 5h | No(T8後) |
| T10 | コンテンツ投稿CRUD + メディアアップロード | T2-T6 | 5h | Yes |
| T11 | コンテンツ表示（ティア別出し分け） | T9,T10 | 4h | No |
| T12 | PPVコンテンツ購入 | T10,T4 | 3h | Yes |
| T13 | 有料DM（送信・受信・返信） | T2-T6 | 5h | Yes |
| T14 | いいね・コメント | T10 | 2h | Yes |

### Phase C: ダッシュボード・管理（並列可能）

| # | タスク | 依存 | 推定 | 並列 |
|---|-------|------|------|------|
| T15 | ファンホーム（フィード） | T11 | 3h | Yes |
| T16 | クリエイターダッシュボード | T9,T13 | 4h | Yes |
| T17 | 収益・振込管理画面 | T9 | 3h | Yes |
| T18 | ファン管理画面 | T9 | 2h | Yes |
| T19 | 通知システム（DB + Web Push） | T9,T13 | 4h | Yes |

### Phase D: 仕上げ（逐次実行）

| # | タスク | 依存 | 推定 |
|---|-------|------|------|
| T20 | LP（トップページ） | T5,T6 | 4h |
| T21 | PWA設定（Service Worker, manifest） | T15 | 2h |
| T22 | レスポンシブ対応・モバイル最適化 | 全画面 | 4h |
| T23 | E2Eテスト（決済フロー、認証フロー） | 全機能 | 4h |
| T24 | デプロイ設定（Vercel + 環境変数） | T23 | 1h |
| T25 | Sentry + Analytics設定 | T24 | 1h |

### 合計見積もり
- 総タスク数: 25
- 総時間: 約73h
- Phase B並列実行（3-4並列）: 実質約45h
- モジュール再利用率: 約40%（認証、CRUD生成、レイアウト）

---

## 11. ディレクトリ構成

```
fanpass/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (fan)/
│   │   │   ├── home/page.tsx
│   │   │   ├── subscriptions/page.tsx
│   │   │   ├── dm/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (creator)/
│   │   │   ├── creator/
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── posts/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── new/page.tsx
│   │   │   │   ├── tiers/page.tsx
│   │   │   │   ├── subscribers/page.tsx
│   │   │   │   ├── revenue/page.tsx
│   │   │   │   ├── settings/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── [slug]/page.tsx              # クリエイターページ
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── creators/
│   │   │   ├── posts/
│   │   │   ├── tiers/
│   │   │   ├── subscriptions/
│   │   │   ├── dm/
│   │   │   ├── media/
│   │   │   ├── notifications/
│   │   │   └── webhooks/stripe/route.ts
│   │   ├── page.tsx                     # LP
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                          # 共通UIコンポーネント
│   │   ├── creator/                     # クリエイター関連コンポーネント
│   │   ├── fan/                         # ファン関連コンポーネント
│   │   ├── post/                        # 投稿関連コンポーネント
│   │   └── dm/                          # DM関連コンポーネント
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # ブラウザ用クライアント
│   │   │   ├── server.ts               # サーバー用クライアント
│   │   │   └── middleware.ts            # 認証ミドルウェア
│   │   ├── stripe/
│   │   │   ├── client.ts               # Stripe初期化
│   │   │   ├── connect.ts              # Connect Account操作
│   │   │   └── webhooks.ts             # Webhook処理
│   │   ├── inngest/
│   │   │   ├── client.ts
│   │   │   └── functions/
│   │   └── utils.ts
│   ├── db/
│   │   ├── schema.ts                   # Drizzle スキーマ定義
│   │   ├── relations.ts                # リレーション定義
│   │   └── migrations/
│   ├── hooks/                           # カスタムフック
│   ├── types/                           # 型定義
│   └── middleware.ts                     # Next.js ミドルウェア
├── public/
│   ├── manifest.json                    # PWA マニフェスト
│   └── sw.js                            # Service Worker
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── CLAUDE.md
├── DESIGN.md
└── .env.local
```

---

## 12. TBD（未確定事項）

| # | 項目 | 仮説 | 確認タイミング |
|---|------|------|--------------|
| 1 | サービス名「FANPASS」の商標 | 使用可能と仮定 | プロジェクト開始前に商標検索 |
| 2 | Stripe Connect Express vs Standard | Express（簡易オンボーディング）を採用 | Stripe日本のConnect対応状況確認 |
| 3 | コンビニ払い対応 | Stripe経由で対応可能（月額は不可、単発のみ） | v1.1で検討 |
| 4 | キャリア決済 | 別決済プロバイダー必要 | v2.0で検討 |
| 5 | 動画のトランスコード | Supabase Storage + Cloudflare Stream | 動画投稿のボリューム次第 |
| 6 | コンテンツモデレーション | AI自動モデレーション + 通報機能 | 運用開始後に方針確定 |
| 7 | 特定商取引法対応 | クリエイターに表記義務あり | 法務確認 |
| 8 | 資金決済法の該当性 | 投げ銭がプリペイド型に該当するか | 法務確認 |
