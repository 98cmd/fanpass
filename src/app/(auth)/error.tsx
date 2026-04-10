"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-background">
      <div className="text-center">
        <p className="text-4xl font-black font-display text-error mb-4">エラー</p>
        <h2 className="text-lg font-bold text-text-primary mb-2">認証エラーが発生しました</h2>
        <p className="text-sm text-text-muted mb-6">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>再試行</Button>
          <Button variant="secondary" asChild>
            <Link href="/login">ログインに戻る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
