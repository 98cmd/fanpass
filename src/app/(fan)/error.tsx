"use client";

import { Button } from "@/components/ui/button";

export default function FanError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="text-4xl font-black font-display text-error mb-4">エラー</p>
        <h2 className="text-lg font-bold text-text-primary mb-2">問題が発生しました</h2>
        <p className="text-sm text-text-muted mb-6">{error.message}</p>
        <Button onClick={reset}>再試行</Button>
      </div>
    </div>
  );
}
