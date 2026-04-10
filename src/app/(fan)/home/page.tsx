import Link from "next/link";
import { PostCard } from "@/components/post/post-card";

// ダミーフィードデータ
const feedPosts = [
  {
    creatorName: "Mizuki",
    creatorSlug: "mizuki_style",
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
    creatorName: "Yuto Fitness",
    creatorSlug: "yuto_fit",
    title: "今週のトレーニングメニュー",
    body: "胸・三頭の日。ベンチプレス5セットからスタート。フォームの動画は会員限定で公開しています。",
    type: "text" as const,
    likeCount: 78,
    commentCount: 12,
    publishedAt: "5時間前",
    isLocked: false,
    mediaUrls: [],
  },
  {
    creatorName: "Mizuki",
    creatorSlug: "mizuki_style",
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
];

export default function FanHomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">ホーム</h1>

      <div className="space-y-4">
        {feedPosts.map((post, i) => (
          <div key={i}>
            {/* クリエイター情報 */}
            <Link
              href={`/${post.creatorSlug}`}
              className="flex items-center gap-3 mb-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {post.creatorName.charAt(0)}
              </div>
              <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                {post.creatorName}
              </span>
            </Link>
            <PostCard {...post} />
          </div>
        ))}
      </div>
    </div>
  );
}
