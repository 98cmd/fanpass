import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, TrendingUp, ArrowUpRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const monthlyRevenue = [
  { month: "2026年4月", total: 128400, subscriptions: 82400, ppv: 28000, dm: 18000, payout: 109140 },
  { month: "2026年3月", total: 104200, subscriptions: 68200, ppv: 22000, dm: 14000, payout: 88570 },
  { month: "2026年2月", total: 86000, subscriptions: 58000, ppv: 18000, dm: 10000, payout: 73100 },
];

const recentTransactions = [
  { type: "subscription", description: "田中さくら - VIPプラン", amount: 3000, date: "2026-04-10" },
  { type: "dm", description: "佐藤太郎 - 有料DM", amount: 500, date: "2026-04-10" },
  { type: "ppv", description: "購入品紹介 - PPV購入", amount: 800, date: "2026-04-09" },
  { type: "subscription", description: "鈴木花子 - ライトプラン", amount: 500, date: "2026-04-09" },
  { type: "payout", description: "3月分振込", amount: -88570, date: "2026-04-05" },
];

const typeLabel: Record<string, string> = {
  subscription: "サブスク",
  ppv: "PPV",
  dm: "DM",
  payout: "振込",
};

export default function RevenuePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">収益管理</h1>
        <Button variant="secondary" size="sm">
          <Download className="w-4 h-4" />
          CSV出力
        </Button>
      </div>

      {/* 今月のサマリ */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-text-muted mb-1">今月の売上</p>
            <p className="text-2xl font-bold font-display text-text-primary">128,400円</p>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3 text-success" />
              <span className="text-xs text-success font-medium">+23.2%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-text-muted mb-1">手数料（15%）</p>
            <p className="text-2xl font-bold font-display text-text-primary">19,260円</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-text-muted mb-1">振込予定額</p>
            <p className="text-2xl font-bold font-display text-primary">109,140円</p>
          </CardContent>
        </Card>
      </div>

      {/* 月次推移 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>月次推移</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm font-medium text-text-primary">{m.month}</span>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-text-secondary">{m.total.toLocaleString()}円</span>
                  <span className="text-primary font-medium">{m.payout.toLocaleString()}円振込</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 最近の取引 */}
      <Card>
        <CardHeader>
          <CardTitle>最近の取引</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Badge variant={tx.type === "payout" ? "outline" : "default"}>
                    {typeLabel[tx.type]}
                  </Badge>
                  <span className="text-sm text-text-primary">{tx.description}</span>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${tx.amount < 0 ? "text-text-secondary" : "text-success"}`}>
                    {tx.amount < 0 ? "" : "+"}{tx.amount.toLocaleString()}円
                  </p>
                  <p className="text-xs text-text-muted">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
