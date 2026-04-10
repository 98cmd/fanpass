import Image from "next/image";
import { Heart, MessageCircle, Lock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  title?: string;
  body?: string;
  mediaUrls?: string[];
  type: "text" | "image" | "video" | "audio";
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  isLocked: boolean;
  requiredTier?: string;
  isPpv?: boolean;
  ppvPrice?: number;
}

export function PostCard({
  title,
  body,
  mediaUrls = [],
  type,
  likeCount,
  commentCount,
  publishedAt,
  isLocked,
  requiredTier,
  isPpv,
  ppvPrice,
}: PostCardProps) {
  const hasMedia = (type === "image" || type === "video") && mediaUrls.length > 0;

  return (
    <article className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* メディア部分 */}
      {(type === "image" || type === "video") && (
        <div className="relative aspect-[4/3] bg-border/30 overflow-hidden">
          {isLocked ? (
            <>
              {/* ブラー背景 */}
              {hasMedia ? (
                <Image src={mediaUrls[0]} alt="" fill className="object-cover scale-110 blur-xl opacity-60" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-stone-200 to-stone-300" />
              )}
              {/* ロックオーバーレイ */}
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 border border-white/30">
                  {isPpv ? (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  ) : (
                    <Lock className="w-5 h-5 text-white" />
                  )}
                </div>
                {isPpv ? (
                  <Button size="sm" className="bg-white text-text-primary hover:bg-white/90 shadow-xl">
                    {ppvPrice?.toLocaleString()}円で購入
                  </Button>
                ) : (
                  <>
                    <p className="text-white font-bold text-sm mb-1">この投稿はロックされています</p>
                    <p className="text-stone-300 text-xs mb-4">{requiredTier}プラン以上で閲覧可能</p>
                    <Button size="sm" className="shadow-lg">プランを確認する</Button>
                  </>
                )}
              </div>
            </>
          ) : hasMedia ? (
            <Image src={mediaUrls[0]} alt={title || "投稿画像"} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
              {type === "video" && <Play className="w-10 h-10 text-text-muted" />}
            </div>
          )}
        </div>
      )}

      {/* テキスト部分 */}
      <div className="p-4">
        {title && <h3 className="font-bold text-text-primary mb-1">{title}</h3>}

        {isLocked && type === "text" ? (
          <div className="flex items-center gap-2 py-6 text-text-muted justify-center">
            <Lock className="w-4 h-4" />
            <span className="text-sm">
              {isPpv
                ? `${ppvPrice?.toLocaleString()}円で閲覧`
                : `${requiredTier}プラン以上で閲覧可能`}
            </span>
          </div>
        ) : (
          body && <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">{body}</p>
        )}

        {/* フッター */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-text-muted hover:text-error transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs font-bold font-display">{likeCount.toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-bold font-display">{commentCount.toLocaleString()}</span>
            </button>
          </div>
          <time className="text-xs text-text-muted">{publishedAt}</time>
        </div>
      </div>
    </article>
  );
}
