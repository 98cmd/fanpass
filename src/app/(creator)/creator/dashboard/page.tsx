import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Users, MessageCircle, TrendingUp, ArrowUpRight } from "lucide-react";
import { requireAuth } from "@/lib/auth/session";
import { getCreatorByUserId } from "@/db/queries/creators";
import { getCreatorSubscriberCount, getCreatorSubscribers } from "@/db/queries/subscriptions";
import { getCreatorMonthlyRevenue, getCreatorRevenueByType } from "@/db/queries/transactions";

export default async function CreatorDashboardPage() {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) redirect("/creator/register");

  const [subscriberCount, monthlyRevenue, revenueByType, subscribers] = await Promise.all([
    getCreatorSubscriberCount(creator.id),
    getCreatorMonthlyRevenue(creator.id),
    getCreatorRevenueByType(creator.id),
    getCreatorSubscribers(creator.id),
  ]);

  const recentSubs = subscribers.slice(0, 5);
  const totalRevenue = Number(monthlyRevenue.totalAmount);
  const totalCreatorRev = Number(monthlyRevenue.totalRevenue);

  // 収益内訳
  const breakdown = revenueByType.map((r) => ({
    label: r.type === "subscription" ? "サブスク" : r.type === "ppv" ? "PPV" : r.type === "dm" ? "有料DM" : r.type,
    amount: Number(r.total),
  }));
  const breakdownTotal = breakdown.reduce((s, b) => s + b.amount, 0) || 1;

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">ダッシュボード</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <Wallet className="w-5 h-5 text-text-muted mb-3" />
            <p className="text-2xl font-bold font-display text-text-primary">{totalRevenue.toLocaleString()}円</p>
            <p className="text-xs text-text-muted mt-1">月間売上</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <Users className="w-5 h-5 text-text-muted mb-3" />
            <p className="text-2xl font-bold font-display text-text-primary">{subscriberCount}</p>
            <p className="text-xs text-text-muted mt-1">ファン数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <TrendingUp className="w-5 h-5 text-text-muted mb-3" />
            <p className="text-2xl font-bold font-display text-primary">{totalCreatorRev.toLocaleString()}円</p>
            <p className="text-xs text-text-muted mt-1">手取り（85%）</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 lg:p-6">
            <MessageCircle className="w-5 h-5 text-text-muted mb-3" />
            <p className="text-2xl font-bold font-display text-text-primary">-</p>
            <p className="text-xs text-text-muted mt-1">未読DM</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>収益内訳</CardTitle></CardHeader>
          <CardContent>
            {breakdown.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">まだ収益がありません</p>
            ) : (
              <div className="space-y-4">
                {breakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-text-secondary">{item.label}</span>
                      <span className="text-sm font-medium text-text-primary">{item.amount.toLocaleString()}円</span>
                    </div>
                    <div className="w-full bg-border/50 rounded-full h-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: `${(item.amount / breakdownTotal) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>最新のファン</CardTitle></CardHeader>
          <CardContent>
            {recentSubs.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">まだファンがいません。SNSでファンクラブを宣伝しましょう!</p>
            ) : (
              <div className="space-y-3">
                {recentSubs.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {sub.fanName?.charAt(0) ?? "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">{sub.fanName}</p>
                        <p className="text-xs text-text-muted">{new Date(sub.createdAt).toLocaleDateString("ja-JP")}</p>
                      </div>
                    </div>
                    <Badge variant={sub.tierPrice >= 3000 ? "secondary" : "default"}>{sub.tierName}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
