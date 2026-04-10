"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  Wallet,
  MessageCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { href: "/creator/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/creator/posts", label: "投稿", icon: FileText },
  { href: "/creator/tiers", label: "ティア", icon: Layers },
  { href: "/creator/subscribers", label: "ファン", icon: Users },
  { href: "/creator/revenue", label: "収益", icon: Wallet },
  { href: "/dm", label: "DM", icon: MessageCircle },
  { href: "/creator/settings", label: "設定", icon: Settings },
];

export function CreatorMobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface sticky top-0 z-30">
        <Link href="/" className="text-lg font-bold font-display text-primary">
          FANPASS
        </Link>
        <button onClick={() => setOpen(!open)} className="p-2 -mr-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-0 top-[53px] z-20 bg-background">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium",
                    isActive ? "bg-primary/10 text-primary" : "text-text-secondary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
