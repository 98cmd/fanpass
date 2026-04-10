import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ダミーデータ
const subscriptionsList = [
  { creatorName: "Mizuki", tier: "スタンダード", price: 1000, nextBilling: "2026-05-10", status: "active" },
  { creatorName: "Yuto Fitness", tier: "VIP", price: 3000, nextBilling: "2026-05-15", status: "active" },
];

export default function SubscriptionsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">サブスクリプション</h1>
      <div className="space-y-3">
        {subscriptionsList.map((sub, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {sub.creatorName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-text-primary">{sub.creatorName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="default">{sub.tier}</Badge>
                    <span className="text-xs text-text-muted">{sub.price.toLocaleString()}円/月</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="success">有効</Badge>
                <p className="text-xs text-text-muted mt-1">次回: {sub.nextBilling}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
