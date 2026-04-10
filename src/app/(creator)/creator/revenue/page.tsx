import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { requireAuth } from "@/lib/auth/session";
import { getCreatorByUserId } from "@/db/queries/creators";
import { getCreatorMonthlyRevenue, getCreatorTransactions } from "@/db/queries/transactions";
import { PLATFORM_FEE_PERCENT } from "@/lib/stripe/client";

const typeLabel: Record<string, string> = {
  subscription: "サブスク", ppv: "PPV", dm: "DM", tip: "チップ", payout: "振込",
};

export default async function RevenuePage() {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) redirect("/creator/register");

  const [monthlyRevenue, recentTx] = await Promise.all([
    getCreatorMonthlyRevenue(creator.id),
    getCreatorTransactions(creator.id, 20),
  ]);

  const totalAmount = Number(monthlyRevenue.totalAmount);
  const totalFee = Number(monthlyRevenue.totalFee);
  const totalRevenue = Number(monthlyRevenue.totalRevenue);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">収益管理</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-text-muted mb-1">今月の売上</p>
            <p className="text-2xl font-bold font-display text-text-primary">{totalAmount.toLocaleString()}円</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-text-muted mb-1">手数料（{PLATFORM_FEE_PERCENT}%）</p>
            <p className="text-2xl font-bold font-display text-text-primary">{totalFee.toLocaleString()}円</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-text-muted mb-1">手取り額</p>
            <p className="text-2xl font-bold font-display text-primary">{totalRevenue.toLocaleString()}円</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>最近の取引</CardTitle></CardHeader>
        <CardContent>
          {recentTx.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-8">まだ取引がありません</p>
          ) : (
            <div className="space-y-3">
              {recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={tx.type === "payout" ? "outline" : "default"}>
                      {typeLabel[tx.type] ?? tx.type}
                    </Badge>
                    <span className="text-sm text-text-primary">
                      {tx.amount.toLocaleString()}円
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-success">
                      +{tx.creatorRevenue.toLocaleString()}円
                    </p>
                    <p className="text-xs text-text-muted">{new Date(tx.createdAt).toLocaleDateString("ja-JP")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
