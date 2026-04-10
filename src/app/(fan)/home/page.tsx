import Link from "next/link";
import { PostCard } from "@/components/post/post-card";
import { getUser } from "@/lib/auth/session";
import { getUserSubscriptions } from "@/db/queries/subscriptions";
import { getSupabaseAdmin } from "@/db";

export default async function FanHomePage() {
  const user = await getUser();
  let feedPosts: any[] = [];

  if (user) {
    const subs = await getUserSubscriptions(user.id);
    if (subs.length > 0) {
      const sb = getSupabaseAdmin();
      const { data } = await sb
        .from("posts")
        .select("*, creator_profiles!posts_creator_id_fkey(slug, user_id, users!creator_profiles_user_id_fkey(display_name, avatar_url))")
        .order("published_at", { ascending: false })
        .limit(20);

      feedPosts = (data ?? []).map((p: any) => ({
        ...p,
        creatorSlug: p.creator_profiles?.slug,
        creatorName: p.creator_profiles?.users?.display_name,
        creatorAvatar: p.creator_profiles?.users?.avatar_url,
      }));
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
            <Link href="/login" className="text-primary font-medium hover:underline">ログイン</Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {feedPosts.map((post: any) => (
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
                mediaUrls={post.media_urls ?? []}
                type={post.type}
                likeCount={post.like_count}
                commentCount={post.comment_count}
                publishedAt={post.published_at ? new Date(post.published_at).toLocaleDateString("ja-JP") : ""}
                isLocked={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
