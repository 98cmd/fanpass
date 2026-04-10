import Link from "next/link";
import {
  Globe,
  Link2,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TierCard } from "@/components/creator/tier-card";
import { PostCard } from "@/components/post/post-card";

// ダミーデータ（後でDB連携に置き換え）
const creatorData = {
  slug: "mizuki_style",
  displayName: "Mizuki",
  bio: "ファッション / ライフスタイル / 美容\n東京を拠点に活動するインフルエンサー。日々のコーデやお気に入りアイテムを限定公開中。",
  avatarUrl: null,
  coverImageUrl: null,
  category: "ファッション",
  snsInstagram: "mizuki_style",
  snsX: "mizuki_style",
  snsThreads: "mizuki_style",
  subscriberCount: 247,
  postCount: 89,
};

const tiersData = [
  {
    name: "ライト",
    price: 500,
    benefits: ["限定テキスト投稿", "コメント投稿"],
    variant: "light" as const,
  },
  {
    name: "スタンダード",
    price: 1000,
    benefits: ["全投稿閲覧", "コメント投稿", "限定写真・動画", "月1回Q&A参加"],
    variant: "standard" as const,
  },
  {
    name: "VIP",
    price: 3000,
    benefits: [
      "全投稿閲覧",
      "コメント投稿",
      "限定写真・動画",
      "月1回Q&A参加",
      "DM優先返信",
      "限定オフ会招待",
    ],
    variant: "vip" as const,
  },
];

const postsData = [
  {
    title: "今日のコーデ",
    body: "春の新作アウター、やっと届いた! 色味がすごく良くて即お気に入り。",
    type: "image" as const,
    likeCount: 42,
    commentCount: 8,
    publishedAt: "2時間前",
    isLocked: false,
    mediaUrls: [],
  },
  {
    title: "限定: 購入品紹介",
    body: "",
    type: "image" as const,
    likeCount: 89,
    commentCount: 23,
    publishedAt: "1日前",
    isLocked: true,
    requiredTier: "スタンダード",
    mediaUrls: [],
  },
  {
    title: undefined,
    body: "来週のライブ配信、テーマ何がいいかな? コメントで教えて!",
    type: "text" as const,
    likeCount: 31,
    commentCount: 15,
    publishedAt: "3日前",
    isLocked: false,
    mediaUrls: [],
  },
  {
    title: "限定: 最新コスメレビュー",
    body: "",
    type: "video" as const,
    likeCount: 156,
    commentCount: 44,
    publishedAt: "5日前",
    isLocked: true,
    isPpv: true,
    ppvPrice: 800,
    mediaUrls: [],
  },
];

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const creator = creatorData; // 後でDB取得に置き換え

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-text-primary">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">戻る</span>
        </Link>
        <Link href="/" className="text-lg font-bold font-display text-primary">
          FANPASS
        </Link>
        <div className="w-16" />
      </header>

      {/* カバー + プロフィール */}
      <div className="relative">
        <div className="h-40 md:h-56 bg-gradient-to-br from-primary/20 to-secondary/10" />
        <div className="max-w-3xl mx-auto px-4 -mt-12">
          <div className="flex items-end gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-surface bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary shrink-0">
              {creator.displayName.charAt(0)}
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-bold text-text-primary">{creator.displayName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge>{creator.category}</Badge>
                <span className="text-xs text-text-muted">
                  {creator.subscriberCount}人のファン
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* 自己紹介 */}
        <p className="text-sm text-text-secondary whitespace-pre-line mb-4">
          {creator.bio}
        </p>

        {/* SNSリンク */}
        <div className="flex items-center gap-4 mb-8">
          {creator.snsInstagram && (
            <a
              href={`https://instagram.com/${creator.snsInstagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <Globe className="w-4 h-4" />
              @{creator.snsInstagram}
            </a>
          )}
          {creator.snsX && (
            <a
              href={`https://x.com/${creator.snsX}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              <Link2 className="w-4 h-4" />
              @{creator.snsX}
            </a>
          )}
        </div>

        {/* ティア選択 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-text-primary mb-4">プランを選ぶ</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {tiersData.map((tier) => (
              <TierCard key={tier.name} {...tier} />
            ))}
          </div>
        </section>

        {/* 有料DM */}
        <section className="mb-10 p-5 rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                メッセージを送る
              </h2>
              <p className="text-sm text-text-muted mt-1">1通 500円で直接メッセージを送れます</p>
            </div>
            <Button>DMを送る</Button>
          </div>
        </section>

        {/* 投稿一覧 */}
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">投稿</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {postsData.map((post, i) => (
              <PostCard key={i} {...post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
