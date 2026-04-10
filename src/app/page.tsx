import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h1 className="text-xl font-bold font-display text-primary">FANPASS</h1>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">ログイン</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">新規登録</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-medium text-primary mb-4">
            ファンクラブプラットフォーム
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-text-primary leading-tight mb-6">
            推しの世界への
            <br />
            <span className="text-primary">入場券</span>
          </h2>
          <p className="text-lg text-text-secondary mb-8 max-w-lg mx-auto">
            月額サブスク、有料DM、限定コンテンツ。
            インフルエンサーとファンを繋ぐ新しいプラットフォーム。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">ファンとして始める</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/creator/register">クリエイターとして始める</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-text-muted">
        <p>FANPASS - 手数料15%でクリエイターの収益を最大化</p>
      </footer>
    </div>
  );
}
