"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  ChartLine,
  MessageCircle,
  Settings,
  ArrowLeft,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/creator/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/creator/posts", label: "投稿 (Posts)", icon: FileText },
  { href: "/creator/tiers", label: "プラン管理 (Tiers)", icon: Layers },
  { href: "/creator/subscribers", label: "サブスクライバー", icon: Users },
  { href: "/creator/revenue", label: "売上レポート", icon: ChartLine },
];

const commItems = [
  { href: "/dm", label: "メッセージ (DM)", icon: MessageCircle, badge: true },
  { href: "/creator/settings", label: "設定 (Settings)", icon: Settings },
];

export function CreatorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-[240px] bg-[#1C1917] text-stone-400 h-screen sticky top-0 border-r border-stone-800/60 select-none">
      {/* ロゴ */}
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-stone-800/60 mb-4">
        <Ticket className="w-5 h-5 text-violet-500" />
        <span className="font-display font-bold text-stone-100 tracking-wide text-base">FANPASS</span>
      </div>

      {/* メインナビ */}
      <nav className="flex-1 px-3 space-y-1 text-[13.5px]">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-colors relative",
                isActive
                  ? "bg-violet-500/10 text-stone-50"
                  : "hover:bg-stone-800 hover:text-stone-100"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-violet-600 rounded-r-full" />
              )}
              <item.icon className={cn("w-[18px] h-[18px] mr-3", isActive ? "text-violet-400" : "group-hover:text-stone-300")} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 pb-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-stone-500 uppercase">Communication</p>
        </div>

        {commItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-colors relative",
                isActive
                  ? "bg-violet-500/10 text-stone-50"
                  : "hover:bg-stone-800 hover:text-stone-100"
              )}
            >
              <item.icon className="w-[18px] h-[18px] mr-3" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-orange-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  !
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 下部 */}
      <div className="p-4 border-t border-stone-800">
        <Link
          href="/home"
          className="flex items-center px-3 py-2 text-stone-400 hover:text-stone-200 transition-colors text-[13px]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ファン画面に戻る
        </Link>
      </div>
    </aside>
  );
}
