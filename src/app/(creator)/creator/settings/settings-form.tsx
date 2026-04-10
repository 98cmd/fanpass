"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updateProfile } from "@/app/actions/creator";
import { createStripeConnectAccount } from "@/app/actions/stripe";

interface Props {
  creator: {
    id: string;
    slug: string;
    bio: string | null;
    snsInstagram: string | null;
    snsX: string | null;
    snsThreads: string | null;
    dmPrice: number | null;
    stripeAccountId: string | null;
    stripeOnboarded: boolean;
  };
}

export function CreatorSettingsForm({ creator }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(formData: FormData) {
    setMessage("");
    setLoading(true);
    const result = await updateProfile(formData);
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage("保存しました");
    }
    setLoading(false);
  }

  return (
    <form action={handleSave} className="space-y-6">
      <Card>
        <CardHeader><CardTitle>プロフィール</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-text-primary mb-1">カスタムURL</p>
            <p className="text-sm text-text-muted">fanpass-app.vercel.app/{creator.slug}</p>
          </div>
          <div>
            <label htmlFor="bio" className="text-sm font-medium text-text-primary mb-1.5 block">自己紹介</label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={creator.bio ?? ""}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>SNS連携</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input id="snsInstagram" name="snsInstagram" label="Instagram" placeholder="@username" defaultValue={creator.snsInstagram ?? ""} />
          <Input id="snsX" name="snsX" label="X (Twitter)" placeholder="@username" defaultValue={creator.snsX ?? ""} />
          <Input id="snsThreads" name="snsThreads" label="Threads" placeholder="@username" defaultValue={creator.snsThreads ?? ""} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>有料DM設定</CardTitle></CardHeader>
        <CardContent>
          <Input id="dmPrice" name="dmPrice" label="1通あたりの価格（円）" type="number" min={100} max={10000} defaultValue={creator.dmPrice ?? 500} />
          <p className="text-xs text-text-muted mt-1">100〜10,000円の範囲で設定できます</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Stripe決済設定</CardTitle></CardHeader>
        <CardContent>
          {creator.stripeOnboarded ? (
            <div className="flex items-center gap-2">
              <Badge variant="success">連携済み</Badge>
              <span className="text-sm text-text-secondary">売上の受け取り準備が完了しています</span>
            </div>
          ) : creator.stripeAccountId ? (
            <div>
              <Badge variant="warning">審査中</Badge>
              <p className="text-sm text-text-secondary mt-2">Stripeの審査が完了するまでお待ちください。</p>
              <Button type="button" variant="secondary" className="mt-3"
                onClick={() => { createStripeConnectAccount(); }}>オンボーディングを続ける</Button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-text-secondary mb-3">売上の受け取りにはStripeアカウントの連携が必要です。</p>
              <Button type="button" variant="secondary"
                onClick={() => { createStripeConnectAccount(); }}>Stripeアカウントを連携する</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {message && (
        <p className={`text-sm px-3 py-2 rounded-lg ${message.includes("エラー") || message.includes("失敗") ? "text-error bg-error/10" : "text-success bg-success/10"}`}>
          {message}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "保存中..." : "設定を保存"}
      </Button>
    </form>
  );
}
