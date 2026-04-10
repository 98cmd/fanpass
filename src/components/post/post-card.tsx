import Image from "next/image";
import { Heart, MessageCircle, Lock } from "lucide-react";
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
  return (
    <article className="border border-border rounded-xl bg-surface overflow-hidden">
      {/* メディア部分 */}
      {type === "image" && mediaUrls.length > 0 && (
        <div className="relative aspect-[4/3] bg-border/30">
          {isLocked ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-text-primary/5 backdrop-blur-xl">
              <Lock className="w-8 h-8 text-text-muted mb-3" />
              {isPpv ? (
                <Button size="sm">
                  {ppvPrice?.toLocaleString()}円で購入
                </Button>
              ) : (
                <p className="text-sm text-text-secondary text-center px-4">
                  {requiredTier}プラン以上で閲覧可能
                </p>
              )}
            </div>
          ) : (
            <Image
              src={mediaUrls[0]}
              alt={title || "投稿画像"}
              fill
              className="object-cover"
            />
          )}
        </div>
      )}

      {/* テキスト部分 */}
      <div className="p-4">
        {title && (
          <h3 className="font-bold text-text-primary mb-1">{title}</h3>
        )}

        {isLocked && type === "text" ? (
          <div className="flex items-center gap-2 py-4 text-text-muted">
            <Lock className="w-4 h-4" />
            <span className="text-sm">
              {isPpv
                ? `${ppvPrice?.toLocaleString()}円で閲覧`
                : `${requiredTier}プラン以上で閲覧可能`}
            </span>
          </div>
        ) : (
          body && (
            <p className="text-sm text-text-secondary line-clamp-3">{body}</p>
          )
        )}

        {/* フッター */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-text-muted hover:text-error transition-colors">
              <Heart className="w-4 h-4" />
              <span className="text-xs">{likeCount}</span>
            </button>
            <button className="flex items-center gap-1.5 text-text-muted hover:text-primary transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{commentCount}</span>
            </button>
          </div>
          <time className="text-xs text-text-muted">{publishedAt}</time>
        </div>
      </div>
    </article>
  );
}
