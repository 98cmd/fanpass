# DESIGN.md — FANPASS

## Design Philosophy
- 「推しの世界への入場券」がコンセプト
- Instagramのプロフィールページのように直感的で、かつプレミアム感がある
- AIっぽさを排除。テンプレート感のない独自性
- ファンの「課金体験」を気持ちよくする（マイクロインタラクション重視）

## カラーパレット

| ロール | 色名 | HEX | 用途 |
|--------|------|-----|------|
| primary | ディープバイオレット | #6D28D9 | CTA、ブランド、ナビ |
| primary-hover | | #5B21B6 | |
| secondary | ウォームゴールド | #D97706 | アクセント、プレミアム要素、VIPティア |
| background | ストーンホワイト | #FAFAF9 | ページ背景 |
| surface | ホワイト | #FFFFFF | カード、パネル |
| surface-hover | | #F5F5F4 | |
| text-primary | ほぼ黒 | #1C1917 | メインテキスト |
| text-secondary | | #57534E | 補助テキスト |
| text-muted | | #A8A29E | 最淡テキスト |
| border | | #E7E5E4 | |
| success | | #16A34A | 購入完了、サブスク有効 |
| error | | #DC2626 | エラー、解約 |
| warning | | #D97706 | |
| info | | #2563EB | |

### ダークモード
| ロール | HEX |
|--------|-----|
| background | #0C0A09 |
| surface | #1C1917 |
| surface-hover | #292524 |
| text-primary | #FAFAF9 |
| text-secondary | #A8A29E |
| text-muted | #78716C |
| border | #292524 |

**注意**: primaryとsecondaryはダーク/ライトで共通。背景とのコントラストは4.5:1以上を確保。

## フォント
- **見出し**: Noto Sans JP 700/900
- **本文**: Noto Sans JP 400/500
- **英数字アクセント**: Inter 600/700（数値表示、ブランド名のみ）
- **読み込み**: next/font で最適化。使用ウェイトのみ

## 独自デザイン要素

### ティアカード
- 「パスカード」モチーフ: aspect-ratio 3:4、角丸16px
- ティアごとに異なる光沢グラデーション（CSS shimmer effect）
  - ライト: シルバー系
  - スタンダード: primaryバイオレット系
  - VIP: ゴールド系（secondary使用）
- ホバーで微かに3D回転（perspective + rotateY）

### 課金モーメント
- 購入ボタン押下 → パーティクルエフェクト（GSAP）
- サブスク完了 → 「パスカード」がフリップするアニメーション
- DM送信 → 送信アニメーション（メッセージが飛んでいく）

### 限定コンテンツのぼかし
- 未購入コンテンツはブラー(20px) + グラデーションオーバーレイ
- 「この投稿を見るには○○プラン以上」のCTAをオーバーレイ中央に

## コンポーネント固有スタイル

### ボタン
| バリアント | 背景 | テキスト | 用途 |
|-----------|------|---------|------|
| primary | #6D28D9 | white | サブスク参加、購入 |
| secondary | transparent, border: #6D28D9 | #6D28D9 | キャンセル、戻る |
| gold | #D97706 | white | VIP専用CTA |
| ghost | transparent | text-secondary | 低優先度アクション |
| danger | #DC2626 | white | 解約、削除 |

### 角丸
- ボタン: 8px (radius-md)
- カード: 12px (radius-lg)
- ティアカード: 16px (radius-xl)
- アバター: 9999px (radius-full)
- モーダル: 16px (radius-xl)

## レスポンシブ
- モバイルファースト
- ブレークポイント: sm(640) md(768) lg(1024) xl(1280)
- コンテナ最大幅: 1200px
- クリエイターページ: モバイルで1カラム、デスクトップで投稿2カラムグリッド
- ダッシュボード: モバイルはスタック、デスクトップはサイドバー+メイン

## アニメーション
- GSAP使用箇所: LP、ティアカード、課金モーメント
- 基本easing: power2.out
- Duration: 入り 0.4-0.6s、出 0.2-0.3s
- prefers-reduced-motion 対応必須
