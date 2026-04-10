import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, FileText, Image as ImageIcon, Video, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAuth } from "@/lib/auth/session";
import { getCreatorByUserId } from "@/db/queries/creators";
import { getCreatorPosts } from "@/db/queries/posts";

const typeIcons = { text: FileText, image: ImageIcon, video: Video, audio: Music };
const visibilityLabel: Record<string, string> = { public: "公開", subscribers: "会員限定", tier: "ティア限定" };

export default async function PostsPage() {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) redirect("/creator/register");

  const postsList = await getCreatorPosts(creator.id, 50);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">投稿管理</h1>
        <Button asChild>
          <Link href="/creator/posts/new"><Plus className="w-4 h-4" />新規投稿</Link>
        </Button>
      </div>

      {postsList.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted mb-4">まだ投稿がありません</p>
          <Button asChild><Link href="/creator/posts/new">最初の投稿を作成</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {postsList.map((post) => {
            const Icon = typeIcons[post.type as keyof typeof typeIcons] ?? FileText;
            return (
              <Card key={post.id} className="hover:border-primary/20 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">{post.title || "無題"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{visibilityLabel[post.visibility] ?? post.visibility}</Badge>
                      {post.is_ppv && <Badge variant="secondary">{post.ppv_price}円</Badge>}
                      <span className="text-xs text-text-muted">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString("ja-JP") : "下書き"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-text-muted shrink-0">
                    <span>{post.like_count} likes</span>
                    <span>{post.comment_count} comments</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
