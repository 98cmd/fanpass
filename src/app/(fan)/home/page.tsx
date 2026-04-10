import Link from "next/link";
import { PostCard } from "@/components/post/post-card";
import { getUser } from "@/lib/auth/session";
import { getUserSubscriptions } from "@/db/queries/subscriptions";
import { getDb } from "@/db";
import { posts, creatorProfiles, users } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function FanHomePage() {
  const user = await getUser();

  // ログインしていない場合はLPにリダイレクト不要、空フィード表示
  let feedPosts: any[] = [];

  if (user) {
    // サブスクしているクリエイターの投稿をフィード表示
    const subs = await getUserSubscriptions(user.id);
    const creatorIds = subs.map((s) => s.id);

    if (creatorIds.length > 0) {
      const db = getDb();
      feedPosts = await db
        .select({
          id: posts.id,
          title: posts.title,
          body: posts.body,
          type: posts.type,
          mediaUrls: posts.mediaUrls,
          visibility: posts.visibility,
          isPpv: posts.isPpv,
          ppvPrice: posts.ppvPrice,
          likeCount: posts.likeCount,
          commentCount: posts.commentCount,
          publishedAt: posts.publishedAt,
          creatorSlug: creatorProfiles.slug,
          creatorName: users.displayName,
          creatorAvatar: users.avatarUrl,
        })
        .from(posts)
        .innerJoin(creatorProfiles, eq(posts.creatorId, creatorProfiles.id))
        .innerJoin(users, eq(creatorProfiles.userId, users.id))
        .orderBy(desc(posts.publishedAt))
        .limit(20);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">ホーム</h1>

      {feedPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted mb-4">
            {user ? "サブスクしているクリエイターの投稿がここに表示されます" : "ログインしてフィードを見ましょう"}
          </p>
          {!user && (
            <Link href="/login" className="text-primary font-medium hover:underline">
              ログイン
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {feedPosts.map((post) => (
            <div key={post.id}>
              <Link href={`/${post.creatorSlug}`} className="flex items-center gap-3 mb-2 group">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {post.creatorName?.charAt(0) ?? "?"}
                </div>
                <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                  {post.creatorName}
                </span>
              </Link>
              <PostCard
                title={post.title ?? undefined}
                body={post.body ?? undefined}
                mediaUrls={(post.mediaUrls as string[]) ?? []}
                type={post.type}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                publishedAt={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ja-JP") : ""}
                isLocked={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
