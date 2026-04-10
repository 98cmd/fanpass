import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, CreditCard, Bell, Shield, Palette } from "lucide-react";

const settingsItems = [
  { icon: User, label: "プロフィール", desc: "表示名、アバターの変更", href: "#" },
  { icon: CreditCard, label: "お支払い方法", desc: "クレジットカードの管理", href: "#" },
  { icon: Bell, label: "通知設定", desc: "メール・プッシュ通知の設定", href: "#" },
  { icon: Shield, label: "セキュリティ", desc: "パスワード変更、2段階認証", href: "#" },
];

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">設定</h1>
      <div className="space-y-3">
        {settingsItems.map((item) => (
          <Card key={item.label} className="cursor-pointer hover:border-primary/20 transition-colors">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-text-primary">{item.label}</p>
                <p className="text-xs text-text-muted">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 pt-6 border-t border-border">
        <Button variant="ghost" asChild>
          <Link href="/creator/register">クリエイターとして活動を始める</Link>
        </Button>
      </div>
    </div>
  );
}
