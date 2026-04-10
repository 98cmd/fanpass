"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles, Users, Wallet, MessageCircle } from "lucide-react";

const benefits = [
  { icon: Wallet, text: "手数料15%（業界最安水準）" },
  { icon: Users, text: "ファンとの直接つながり" },
  { icon: MessageCircle, text: "有料DM・限定コンテンツ" },
  { icon: Sparkles, text: "PWAでApple税0%" },
];

export default function CreatorRegisterPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: API呼び出し
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/creator/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-text-primary mb-2">
            クリエイターとして始めよう
          </h1>
          <p className="text-text-secondary">
            あなたのファンクラブを今すぐ開設
          </p>
        </div>

        {/* メリット */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {benefits.map((b) => (
            <Card key={b.text}>
              <CardContent className="p-4 flex items-start gap-3">
                <b.icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary">{b.text}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="slug"
            label="カスタムURL"
            placeholder="your-name"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))}
            required
          />
          {slug && (
            <p className="text-xs text-text-muted -mt-2">fanpass.jp/{slug}</p>
          )}

          <div>
            <label className="text-sm font-medium text-text-primary mb-1.5 block">カテゴリ</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            >
              <option value="">選択してください</option>
              <option value="fashion">ファッション</option>
              <option value="beauty">美容・コスメ</option>
              <option value="fitness">フィットネス</option>
              <option value="food">グルメ・料理</option>
              <option value="travel">旅行</option>
              <option value="lifestyle">ライフスタイル</option>
              <option value="entertainment">エンタメ</option>
              <option value="education">教育・学び</option>
              <option value="other">その他</option>
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "作成中..." : "ファンクラブを開設する"}
          </Button>
        </form>
      </div>
    </div>
  );
}
