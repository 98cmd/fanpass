import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, Link2, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TierCard } from "@/components/creator/tier-card";
import { PostCard } from "@/components/post/post-card";
import { getCreatorBySlug, getCreatorTiers } from "@/db/queries/creators";
import { getCreatorPosts } from "@/db/queries/posts";
import { getCreatorSubscriberCount } from "@/db/queries/subscriptions";
import { getActiveSubscription } from "@/db/queries/subscriptions";
import { getUser } from "@/lib/auth/session";

function tierVariant(index: number): "light" | "standard" | "vip" {
  if (index === 0) return "light";
  if (index >= 2) return "vip";
  return "standard";
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const creator = await getCreatorBySlug(slug);
  if (!creator) notFound();

  const [tiersList, postsList, subscriberCount, user] = await Promise.all([
    getCreatorTiers(creator.id),
    getCreatorPosts(creator.id),
    getCreatorSubscriberCount(creator.id),
    getUser(),
  ]);

  // 現在のユーザーのサブスク状態
  let activeSub = null;
  if (user) {
    activeSub = await getActiveSubscription(user.id, creator.id);
  }

  const activeTiers = tiersList.filter((t) => t.isActive);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2 text-text-secondary hover:text-text-primary">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">戻る</span>
        </Link>
        <Link href="/" className="text-lg font-bold font-display text-primary">FANPASS</Link>
        <div className="w-16" />
      </header>

      <div className="relative">
        {creator.coverImageUrl ? (
          <img src={creator.coverImageUrl} alt="" className="h-40 md:h-56 w-full object-cover" />
        ) : (
          <div className="h-40 md:h-56 bg-gradient-to-br from-primary/20 to-secondary/10" />
        )}
        <div className="max-w-3xl mx-auto px-4 -mt-12">
          <div className="flex items-end gap-4">
            {creator.avatarUrl ? (
              <img src={creator.avatarUrl} alt={creator.displayName} className="w-24 h-24 rounded-full border-4 border-surface object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-surface bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary shrink-0">
                {creator.displayName.charAt(0)}
              </div>
            )}
            <div className="pb-1">
              <h1 className="text-xl font-bold text-text-primary">{creator.displayName}</h1>
              <div className="flex items-center gap-2 mt-1">
                {creator.category && <Badge>{creator.category}</Badge>}
                <span className="text-xs text-text-muted">{subscriberCount}人のファン</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {creator.bio && (
          <p className="text-sm text-text-secondary whitespace-pre-line mb-4">{creator.bio}</p>
        )}

        <div className="flex items-center gap-4 mb-8">
          {creator.snsInstagram && (
            <a href={`https://instagram.com/${creator.snsInstagram}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
              <Globe className="w-4 h-4" />@{creator.snsInstagram}
            </a>
          )}
          {creator.snsX && (
            <a href={`https://x.com/${creator.snsX}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
              <Link2 className="w-4 h-4" />@{creator.snsX}
            </a>
          )}
        </div>

        {activeTiers.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-text-primary mb-4">プランを選ぶ</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {activeTiers.map((tier, i) => (
                <TierCard
                  key={tier.id}
                  name={tier.name}
                  price={tier.price}
                  benefits={(tier.benefits as string[]) ?? []}
                  variant={tierVariant(i)}
                  isSubscribed={activeSub?.tierId === tier.id}
                />
              ))}
            </div>
          </section>
        )}

        {creator.dmPrice && (
          <section className="mb-10 p-5 rounded-xl border border-border bg-surface">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  メッセージを送る
                </h2>
                <p className="text-sm text-text-muted mt-1">1通 {creator.dmPrice.toLocaleString()}円で直接メッセージを送れます</p>
              </div>
              <Button asChild>
                <Link href={user ? `/dm?to=${creator.slug}` : "/login"}>DMを送る</Link>
              </Button>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-4">投稿</h2>
          {postsList.length === 0 ? (
            <p className="text-text-muted text-center py-12">まだ投稿がありません</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {postsList.map((post) => {
                const isLocked = post.visibility !== "public" && !activeSub;
                return (
                  <PostCard
                    key={post.id}
                    title={post.title ?? undefined}
                    body={post.body ?? undefined}
                    mediaUrls={(post.mediaUrls as string[]) ?? []}
                    type={post.type}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                    publishedAt={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ja-JP") : ""}
                    isLocked={isLocked}
                    requiredTier={isLocked ? "サブスク" : undefined}
                    isPpv={post.isPpv}
                    ppvPrice={post.ppvPrice ?? undefined}
                  />
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
