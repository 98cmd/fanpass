"use client";

import { useState } from "react";
import { Plus, Pencil, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TierCard } from "@/components/creator/tier-card";

// ダミーデータ
const initialTiers = [
  {
    id: "1",
    name: "ライト",
    price: 500,
    benefits: ["限定テキスト投稿", "コメント投稿"],
    subscriberCount: 120,
    isActive: true,
  },
  {
    id: "2",
    name: "スタンダード",
    price: 1000,
    benefits: ["全投稿閲覧", "コメント投稿", "限定写真・動画", "月1回Q&A参加"],
    subscriberCount: 89,
    isActive: true,
  },
  {
    id: "3",
    name: "VIP",
    price: 3000,
    benefits: ["全投稿閲覧", "コメント投稿", "限定写真・動画", "月1回Q&A参加", "DM優先返信", "限定オフ会招待"],
    subscriberCount: 38,
    isActive: true,
  },
];

export default function TiersPage() {
  const [tiers] = useState(initialTiers);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newBenefits, setNewBenefits] = useState("");

  const totalRevenue = tiers.reduce((sum, t) => sum + t.price * t.subscriberCount, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">ティア管理</h1>
          <p className="text-sm text-text-muted mt-1">
            月間サブスク収入: <span className="font-medium text-text-primary">{totalRevenue.toLocaleString()}円</span>
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" />
          ティア追加
        </Button>
      </div>

      {/* 新規ティアフォーム */}
      {showForm && (
        <Card className="mb-6 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-bold text-text-primary mb-4">新しいティアを作成</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                id="tierName"
                label="ティア名"
                placeholder="例: プレミアム"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                id="tierPrice"
                label="月額価格（円）"
                type="number"
                placeholder="1000"
                min={100}
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium text-text-primary mb-1.5 block">特典（1行に1つ）</label>
              <textarea
                rows={4}
                placeholder="限定投稿閲覧&#10;コメント投稿&#10;月1回ライブ参加"
                value={newBenefits}
                onChange={(e) => setNewBenefits(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button>作成</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>キャンセル</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* プレビュー */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-text-secondary mb-3">ファンへの表示プレビュー</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {tiers.map((tier, i) => (
            <TierCard
              key={tier.id}
              name={tier.name}
              price={tier.price}
              benefits={tier.benefits}
              variant={i === 0 ? "light" : i === 1 ? "standard" : "vip"}
            />
          ))}
        </div>
      </div>

      {/* 管理一覧 */}
      <h2 className="text-sm font-medium text-text-secondary mb-3">ティア詳細</h2>
      <div className="space-y-3">
        {tiers.map((tier) => (
          <Card key={tier.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <GripVertical className="w-5 h-5 text-text-muted cursor-grab shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-text-primary">{tier.name}</p>
                  <Badge>{tier.price.toLocaleString()}円/月</Badge>
                  {tier.isActive && <Badge variant="success">有効</Badge>}
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {tier.subscriberCount}人が購読中 / 月間{(tier.price * tier.subscriberCount).toLocaleString()}円
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Pencil className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
