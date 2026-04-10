"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createTierAction } from "@/app/actions/creator";

export function TierCreateForm() {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const result = await createTierAction(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setShowForm(false);
    }
    setLoading(false);
  }

  return (
    <div className="mb-6">
      {!showForm && (
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" />ティア追加
        </Button>
      )}

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-bold text-text-primary mb-4">新しいティアを作成</h3>
            <form action={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="name" name="name" label="ティア名" placeholder="例: スタンダード" required />
                <Input id="price" name="price" label="月額価格（円）" type="number" placeholder="1000" min={100} required />
              </div>
              <div>
                <label className="text-sm font-medium text-text-primary mb-1.5 block">特典（1行に1つ）</label>
                <textarea
                  name="benefits"
                  rows={4}
                  placeholder={"限定投稿閲覧\nコメント投稿\n月1回ライブ参加"}
                  className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
              {error && <p className="text-sm text-error">{error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>{loading ? "作成中..." : "作成"}</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>キャンセル</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
