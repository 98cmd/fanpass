"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  Wallet,
  MessageCircle,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/creator/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/creator/posts", label: "投稿管理", icon: FileText },
  { href: "/creator/tiers", label: "ティア管理", icon: Layers },
  { href: "/creator/subscribers", label: "ファン管理", icon: Users },
  { href: "/creator/revenue", label: "収益管理", icon: Wallet },
  { href: "/dm", label: "DM", icon: MessageCircle },
  { href: "/creator/settings", label: "設定", icon: Settings },
];

export function CreatorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-border bg-surface h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <Link href="/" className="text-xl font-bold font-display text-primary">
          FANPASS
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <Link
          href="/home"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          ファン画面に戻る
        </Link>
      </div>
    </aside>
  );
}
