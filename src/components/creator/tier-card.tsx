"use client";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type TierVariant = "light" | "standard" | "vip";

interface TierCardProps {
  name: string;
  price: number;
  benefits: string[];
  variant?: TierVariant;
  onSelect?: () => void;
  isSubscribed?: boolean;
}

const variantStyles: Record<TierVariant, { card: string; shimmer: string; button: string }> = {
  light: {
    card: "border-border",
    shimmer: "from-gray-200/40 via-gray-100/60 to-gray-200/40",
    button: "secondary" as const,
  },
  standard: {
    card: "border-primary/30",
    shimmer: "from-primary/10 via-primary/20 to-primary/10",
    button: "primary" as const,
  },
  vip: {
    card: "border-secondary/40",
    shimmer: "from-secondary/10 via-secondary/25 to-secondary/10",
    button: "gold" as const,
  },
};

export function TierCard({
  name,
  price,
  benefits,
  variant = "standard",
  onSelect,
  isSubscribed,
}: TierCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border-2 bg-surface p-6 transition-transform hover:-translate-y-1",
        "aspect-auto min-h-[280px]",
        styles.card
      )}
    >
      {/* Shimmer背景 */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50 pointer-events-none",
          styles.shimmer
        )}
      />

      <div className="relative z-10 flex flex-col flex-1">
        {/* ティア名 */}
        <p className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">
          {name}
        </p>

        {/* 価格 */}
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-black font-display text-text-primary">
            {price.toLocaleString()}
          </span>
          <span className="text-sm text-text-muted">円/月</span>
        </div>

        {/* 特典リスト */}
        <ul className="flex-1 space-y-2.5 mb-6">
          {benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
              {benefit}
            </li>
          ))}
        </ul>

        {/* CTAボタン */}
        {isSubscribed ? (
          <Button variant="secondary" disabled className="w-full">
            参加中
          </Button>
        ) : (
          <Button
            variant={styles.button as "primary" | "secondary" | "gold"}
            className="w-full"
            onClick={onSelect}
          >
            参加する
          </Button>
        )}
      </div>
    </div>
  );
}
