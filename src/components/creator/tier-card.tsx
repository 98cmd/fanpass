"use client";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Check, Ticket } from "lucide-react";

type TierVariant = "light" | "standard" | "vip";

interface TierCardProps {
  name: string;
  price: number;
  benefits: string[];
  variant?: TierVariant;
  onSelect?: () => void;
  isSubscribed?: boolean;
  isPopular?: boolean;
}

const variantStyles: Record<TierVariant, {
  card: string;
  shimmer: string;
  title: string;
  price: string;
  check: string;
  text: string;
  divider: string;
  btn: string;
  btnText: string;
  label: string;
}> = {
  light: {
    card: "bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 border-slate-300",
    shimmer: "card-shimmer shimmer-delay-1",
    title: "text-slate-500",
    price: "text-slate-900",
    check: "text-slate-400",
    text: "text-slate-700",
    divider: "border-slate-300",
    btn: "bg-slate-800 hover:bg-slate-900 text-white",
    btnText: "text-white",
    label: "Light",
  },
  standard: {
    card: "bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900 border-violet-500/50",
    shimmer: "card-shimmer card-shimmer-dark",
    title: "text-violet-200",
    price: "text-white",
    check: "text-violet-300",
    text: "text-violet-50",
    divider: "border-violet-500/40",
    btn: "bg-white hover:bg-slate-50 text-violet-800 shadow-[0_4px_14px_0_rgba(255,255,255,0.25)]",
    btnText: "text-violet-800",
    label: "Standard",
  },
  vip: {
    card: "bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border-amber-300",
    shimmer: "card-shimmer shimmer-delay-2",
    title: "text-amber-900/60",
    price: "text-amber-950",
    check: "text-amber-700",
    text: "text-amber-950",
    divider: "border-amber-500/30",
    btn: "bg-amber-950 hover:bg-black text-amber-400",
    btnText: "text-amber-400",
    label: "VIP",
  },
};

export function TierCard({
  name,
  price,
  benefits,
  variant = "standard",
  onSelect,
  isSubscribed,
  isPopular,
}: TierCardProps) {
  const s = variantStyles[variant];

  return (
    <article
      className={cn(
        "relative w-full aspect-[3/4] min-h-[320px] rounded-3xl border-2 p-6 flex flex-col transition-transform active:scale-[0.98]",
        s.card,
        s.shimmer
      )}
    >
      {/* 人気バッジ */}
      {isPopular && (
        <div className="absolute top-0 right-0 bg-gradient-to-l from-pink-500 to-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl z-20">
          人気プラン
        </div>
      )}

      <div className="relative z-20 flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-1">
          <Ticket className={cn("w-5 h-5", s.check)} />
          <span className={cn("font-display text-xs font-bold tracking-widest uppercase", s.title)}>
            {s.label}
          </span>
        </div>

        {/* ティア名 */}
        <p className={cn("text-xs font-bold uppercase tracking-wider mt-2", s.title)}>{name}</p>

        {/* 価格 */}
        <div className="flex items-baseline gap-1 mt-1">
          <span className={cn("font-display text-3xl font-black", s.price)}>
            {price.toLocaleString()}
          </span>
          <span className={cn("text-xs font-bold", s.title)}>円/月</span>
        </div>

        <hr className={cn("my-4", s.divider)} />

        {/* 特典リスト */}
        <ul className="flex-1 space-y-2.5">
          {benefits.map((benefit, i) => (
            <li key={i} className={cn("flex items-start gap-2 text-sm font-medium leading-tight", s.text)}>
              <Check className={cn("w-4 h-4 shrink-0 mt-0.5", s.check)} />
              {benefit}
            </li>
          ))}
        </ul>

        {/* CTAボタン */}
        {isSubscribed ? (
          <button
            disabled
            className="w-full py-3 rounded-xl bg-white/20 text-white/60 font-bold text-sm cursor-not-allowed mt-4"
          >
            参加中
          </button>
        ) : (
          <button
            onClick={onSelect}
            className={cn("w-full py-3 rounded-xl font-bold text-sm transition-colors mt-4", s.btn)}
          >
            参加する
          </button>
        )}
      </div>
    </article>
  );
}
