import { redirect } from "next/navigation";
import { Pencil, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TierCard } from "@/components/creator/tier-card";
import { requireAuth } from "@/lib/auth/session";
import { getCreatorByUserId, getCreatorTiers } from "@/db/queries/creators";
import { getCreatorSubscriberCount } from "@/db/queries/subscriptions";
import { TierCreateForm } from "./tier-create-form";

export default async function TiersPage() {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) redirect("/creator/register");

  const tiersList = await getCreatorTiers(creator.id);
  const activeTiers = tiersList.filter((t) => t.isActive);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">ティア管理</h1>
          <p className="text-sm text-text-muted mt-1">{activeTiers.length}個のティア</p>
        </div>
      </div>

      <TierCreateForm />

      {activeTiers.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-medium text-text-secondary mb-3">ファンへの表示プレビュー</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {activeTiers.map((tier, i) => (
              <TierCard
                key={tier.id}
                name={tier.name}
                price={tier.price}
                benefits={(tier.benefits as string[]) ?? []}
                variant={i === 0 ? "light" : i >= 2 ? "vip" : "standard"}
              />
            ))}
          </div>
        </div>
      )}

      <h2 className="text-sm font-medium text-text-secondary mb-3">ティア詳細</h2>
      {activeTiers.length === 0 ? (
        <p className="text-text-muted text-center py-8">ティアを作成してファンクラブを始めましょう</p>
      ) : (
        <div className="space-y-3">
          {activeTiers.map((tier) => (
            <Card key={tier.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <GripVertical className="w-5 h-5 text-text-muted cursor-grab shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-text-primary">{tier.name}</p>
                    <Badge>{tier.price.toLocaleString()}円/月</Badge>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    特典: {((tier.benefits as string[]) ?? []).join(", ") || "未設定"}
                  </p>
                </div>
                <Button variant="ghost" size="icon"><Pencil className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
