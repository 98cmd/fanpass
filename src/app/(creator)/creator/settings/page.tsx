"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatorSettingsPage() {
  const [slug, setSlug] = useState("mizuki_style");
  const [bio, setBio] = useState("ファッション / ライフスタイル / 美容");
  const [dmPrice, setDmPrice] = useState("500");
  const [instagram, setInstagram] = useState("mizuki_style");
  const [x, setX] = useState("mizuki_style");

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">クリエイター設定</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              id="slug"
              label="カスタムURL"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-text-muted -mt-2">fanpass.jp/{slug}</p>
            <div>
              <label htmlFor="bio" className="text-sm font-medium text-text-primary mb-1.5 block">
                自己紹介
              </label>
              <textarea
                id="bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SNS連携</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input id="instagram" label="Instagram" placeholder="@username" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            <Input id="x" label="X (Twitter)" placeholder="@username" value={x} onChange={(e) => setX(e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>有料DM設定</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              id="dmPrice"
              label="1通あたりの価格（円）"
              type="number"
              min={100}
              max={10000}
              value={dmPrice}
              onChange={(e) => setDmPrice(e.target.value)}
            />
            <p className="text-xs text-text-muted mt-1">100〜10,000円の範囲で設定できます</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stripe決済設定</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-3">
              売上の受け取りにはStripeアカウントの連携が必要です。
            </p>
            <Button variant="secondary">Stripeアカウントを連携する</Button>
          </CardContent>
        </Card>

        <Button className="w-full">設定を保存</Button>
      </div>
    </div>
  );
}
