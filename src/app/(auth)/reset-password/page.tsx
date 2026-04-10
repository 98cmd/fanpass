"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/api/auth/callback?redirect=/update-password`,
    });

    if (error) {
      setError("メール送信に失敗しました");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 bg-background">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">メールを確認してください</h1>
          <p className="text-text-secondary text-sm mb-6">
            {email} にパスワードリセット用のリンクを送信しました。
          </p>
          <Button variant="secondary" asChild>
            <Link href="/login">ログインに戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold font-display text-primary">FANPASS</Link>
          <p className="text-text-secondary mt-2">パスワードをリセット</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            label="登録済みメールアドレス"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error && <p className="text-sm text-error bg-error/10 rounded-lg px-3 py-2">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "送信中..." : "リセットリンクを送信"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          <Link href="/login" className="text-primary font-medium hover:underline">ログインに戻る</Link>
        </p>
      </div>
    </div>
  );
}
