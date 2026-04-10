import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  Users,
  MessageCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// ダミーデータ（後でAPI連携に置き換え）
const stats = [
  {
    label: "月間売上",
    value: "¥128,400",
    change: "+12.5%",
    trend: "up" as const,
    icon: Wallet,
  },
  {
    label: "ファン数",
    value: "247",
    change: "+18",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "未読DM",
    value: "12",
    change: "",
    trend: "down" as const,
    icon: MessageCircle,
  },
  {
    label: "前月比",
    value: "+23%",
    change: "¥24,200増",
    trend: "up" as const,
    icon: TrendingUp,
  },
];

const recentSubscribers = [
  { name: "田中さくら", tier: "VIP", date: "2時間前" },
  { name: "佐藤太郎", tier: "スタンダード", date: "5時間前" },
  { name: "鈴木花子", tier: "ライト", date: "1日前" },
  { name: "高橋一郎", tier: "スタンダード", date: "2日前" },
  { name: "渡辺美咲", tier: "VIP", date: "3日前" },
];

const revenueBreakdown = [
  { label: "サブスク", amount: "¥82,400", percent: 64 },
  { label: "PPV", amount: "¥28,000", percent: 22 },
  { label: "有料DM", amount: "¥18,000", percent: 14 },
];

export default function CreatorDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">ダッシュボード</h1>

      {/* KPIカード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-text-muted" />
                {stat.trend === "up" && (
                  <ArrowUpRight className="w-4 h-4 text-success" />
                )}
                {stat.trend === "down" && (
                  <ArrowDownRight className="w-4 h-4 text-error" />
                )}
              </div>
              <p className="text-2xl font-bold font-display text-text-primary">
                {stat.value}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-text-muted">{stat.label}</p>
                {stat.change && (
                  <span className="text-xs text-success font-medium">{stat.change}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 収益内訳 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>収益内訳</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-text-secondary">{item.label}</span>
                    <span className="text-sm font-medium text-text-primary">{item.amount}</span>
                  </div>
                  <div className="w-full bg-border/50 rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最新ファン */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>最新のファン</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSubscribers.map((sub, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {sub.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{sub.name}</p>
                      <p className="text-xs text-text-muted">{sub.date}</p>
                    </div>
                  </div>
                  <Badge
                    variant={sub.tier === "VIP" ? "secondary" : sub.tier === "スタンダード" ? "default" : "outline"}
                  >
                    {sub.tier}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
