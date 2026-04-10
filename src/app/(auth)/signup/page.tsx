"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 8) {
      setError("パスワードは8文字以上で入力してください");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 bg-background">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-2">メールを確認してください</h1>
          <p className="text-text-secondary mb-6">
            {email} に確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
          </p>
          <Button variant="secondary" asChild>
            <Link href="/login">ログインページへ</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold font-display text-primary">
            FANPASS
          </Link>
          <p className="text-text-secondary mt-2">新しいアカウントを作成</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <Input
            id="displayName"
            label="表示名"
            type="text"
            placeholder="あなたの名前"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <Input
            id="email"
            label="メールアドレス"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            label="パスワード"
            type="password"
            placeholder="8文字以上"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />

          {error && (
            <p className="text-sm text-error bg-error/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "登録中..." : "アカウントを作成"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
