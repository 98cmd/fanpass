import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-black font-display text-primary mb-4">404</p>
        <h1 className="text-xl font-bold text-text-primary mb-2">ページが見つかりません</h1>
        <p className="text-text-muted mb-6">お探しのページは存在しないか、移動した可能性があります。</p>
        <Button asChild>
          <Link href="/">トップページに戻る</Link>
        </Button>
      </div>
    </div>
  );
}
