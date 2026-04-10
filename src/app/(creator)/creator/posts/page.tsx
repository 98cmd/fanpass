import Link from "next/link";
import { Plus, Image as ImageIcon, Video, FileText, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const typeIcons = {
  text: FileText,
  image: ImageIcon,
  video: Video,
  audio: Music,
};

// ダミーデータ
const postsData = [
  { id: "1", title: "今日のコーデ", type: "image" as const, visibility: "public", likeCount: 42, commentCount: 8, publishedAt: "2025-04-10 14:30" },
  { id: "2", title: "購入品紹介", type: "image" as const, visibility: "tier", likeCount: 89, commentCount: 23, publishedAt: "2025-04-09 10:00" },
  { id: "3", title: "来週のテーマ投票", type: "text" as const, visibility: "subscribers", likeCount: 31, commentCount: 15, publishedAt: "2025-04-07 18:00" },
  { id: "4", title: "コスメレビュー動画", type: "video" as const, visibility: "tier", isPpv: true, ppvPrice: 800, likeCount: 156, commentCount: 44, publishedAt: "2025-04-05 12:00" },
];

const visibilityLabel: Record<string, string> = {
  public: "公開",
  subscribers: "会員限定",
  tier: "ティア限定",
};

export default function PostsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">投稿管理</h1>
        <Button asChild>
          <Link href="/creator/posts/new">
            <Plus className="w-4 h-4" />
            新規投稿
          </Link>
        </Button>
      </div>

      <div className="space-y-3">
        {postsData.map((post) => {
          const Icon = typeIcons[post.type];
          return (
            <Card key={post.id} className="hover:border-primary/20 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{visibilityLabel[post.visibility]}</Badge>
                    {post.isPpv && <Badge variant="secondary">{post.ppvPrice}円</Badge>}
                    <span className="text-xs text-text-muted">{post.publishedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted shrink-0">
                  <span>{post.likeCount} likes</span>
                  <span>{post.commentCount} comments</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
