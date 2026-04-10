"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Image as ImageIcon, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

const postTypes = [
  { value: "text", label: "テキスト", icon: FileText },
  { value: "image", label: "画像", icon: ImageIcon },
  { value: "video", label: "動画", icon: Video },
] as const;

const visibilityOptions = [
  { value: "public", label: "公開", desc: "誰でも閲覧可能" },
  { value: "subscribers", label: "会員限定", desc: "サブスク会員のみ" },
  { value: "tier", label: "ティア指定", desc: "特定ティア以上" },
] as const;

export default function NewPostPage() {
  const router = useRouter();
  const [type, setType] = useState<"text" | "image" | "video">("text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState("subscribers");
  const [isPpv, setIsPpv] = useState(false);
  const [ppvPrice, setPpvPrice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: API呼び出し
    await new Promise((r) => setTimeout(r, 1000));
    router.push("/creator/posts");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        戻る
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">新規投稿</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 投稿タイプ */}
        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">投稿タイプ</label>
          <div className="grid grid-cols-3 gap-3">
            {postTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors",
                  type === t.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-text-secondary hover:border-primary/30"
                )}
              >
                <t.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Input
          id="title"
          label="タイトル"
          placeholder="投稿のタイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <label htmlFor="body" className="text-sm font-medium text-text-primary mb-1.5 block">
            本文
          </label>
          <textarea
            id="body"
            rows={6}
            placeholder="ファンに伝えたいことを書こう..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          />
        </div>

        {/* メディアアップロード */}
        {type !== "text" && (
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="text-sm font-medium text-text-secondary">
              {type === "image" ? "画像" : "動画"}をドラッグ&ドロップ
            </p>
            <p className="text-xs text-text-muted mt-1">
              {type === "image" ? "JPG, PNG, WebP（最大10MB）" : "MP4, MOV（最大100MB）"}
            </p>
          </div>
        )}

        {/* 公開設定 */}
        <div>
          <label className="text-sm font-medium text-text-primary mb-2 block">公開範囲</label>
          <div className="space-y-2">
            {visibilityOptions.map((opt) => (
              <label
                key={opt.value}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  visibility === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={opt.value}
                  checked={visibility === opt.value}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                    visibility === opt.value ? "border-primary" : "border-border"
                  )}
                >
                  {visibility === opt.value && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">{opt.label}</p>
                  <p className="text-xs text-text-muted">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* PPV設定 */}
        <Card>
          <CardContent className="p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPpv}
                onChange={(e) => setIsPpv(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="text-sm font-medium text-text-primary">単品販売（PPV）にする</p>
                <p className="text-xs text-text-muted">サブスクとは別に、この投稿を単品で購入可能にします</p>
              </div>
            </label>
            {isPpv && (
              <div className="mt-3 pl-7">
                <Input
                  id="ppvPrice"
                  label="販売価格（円）"
                  type="number"
                  placeholder="500"
                  min={100}
                  max={50000}
                  value={ppvPrice}
                  onChange={(e) => setPpvPrice(e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "投稿中..." : "投稿する"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
}
