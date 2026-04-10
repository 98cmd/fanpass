import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const subscribers = [
  { name: "田中さくら", email: "s.tanaka@example.com", tier: "VIP", since: "2026-01-15", totalSpent: 24000 },
  { name: "佐藤太郎", email: "t.sato@example.com", tier: "スタンダード", since: "2026-02-20", totalSpent: 8000 },
  { name: "鈴木花子", email: "h.suzuki@example.com", tier: "ライト", since: "2026-03-01", totalSpent: 3500 },
  { name: "高橋一郎", email: "i.takahashi@example.com", tier: "スタンダード", since: "2026-03-10", totalSpent: 6000 },
  { name: "渡辺美咲", email: "m.watanabe@example.com", tier: "VIP", since: "2026-03-15", totalSpent: 15000 },
];

export default function SubscribersPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">ファン管理</h1>
          <p className="text-sm text-text-muted mt-1">{subscribers.length}人のファン</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          placeholder="名前やメールで検索..."
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-surface text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="space-y-2">
        {subscribers.map((sub, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {sub.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary">{sub.name}</p>
                <p className="text-xs text-text-muted">{sub.email}</p>
              </div>
              <Badge variant={sub.tier === "VIP" ? "secondary" : sub.tier === "スタンダード" ? "default" : "outline"}>
                {sub.tier}
              </Badge>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-text-primary">{sub.totalSpent.toLocaleString()}円</p>
                <p className="text-xs text-text-muted">{sub.since}〜</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
