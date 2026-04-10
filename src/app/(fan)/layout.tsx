import Link from "next/link";
import { Home, Search, Bell, User, MessageCircle } from "lucide-react";

export default function FanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* デスクトップヘッダー */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-border bg-surface sticky top-0 z-10">
        <Link href="/" className="text-xl font-bold font-display text-primary">
          FANPASS
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/home" className="text-sm font-medium text-text-secondary hover:text-text-primary">ホーム</Link>
          <Link href="/subscriptions" className="text-sm font-medium text-text-secondary hover:text-text-primary">サブスク</Link>
          <Link href="/dm" className="text-sm font-medium text-text-secondary hover:text-text-primary">DM</Link>
          <Link href="/notifications" className="text-sm font-medium text-text-secondary hover:text-text-primary">通知</Link>
          <Link href="/settings" className="text-sm font-medium text-text-secondary hover:text-text-primary">設定</Link>
        </nav>
      </header>

      {children}

      {/* モバイルタブバー */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface z-20">
        <div className="flex items-center justify-around py-2">
          <Link href="/home" className="flex flex-col items-center gap-1 px-3 py-1 text-text-muted">
            <Home className="w-5 h-5" />
            <span className="text-[10px]">ホーム</span>
          </Link>
          <Link href="/dm" className="flex flex-col items-center gap-1 px-3 py-1 text-text-muted">
            <MessageCircle className="w-5 h-5" />
            <span className="text-[10px]">DM</span>
          </Link>
          <Link href="/notifications" className="flex flex-col items-center gap-1 px-3 py-1 text-text-muted">
            <Bell className="w-5 h-5" />
            <span className="text-[10px]">通知</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center gap-1 px-3 py-1 text-text-muted">
            <User className="w-5 h-5" />
            <span className="text-[10px]">マイページ</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
