import { Badge } from "@/components/ui/badge";
import { Bell, Heart, MessageCircle, UserPlus, Wallet } from "lucide-react";

const iconMap = {
  new_post: Bell,
  new_dm: MessageCircle,
  new_subscriber: UserPlus,
  payment: Wallet,
  system: Bell,
};

const notificationsList = [
  { type: "new_post" as const, title: "Mizukiが新しい投稿を公開", body: "「今日のコーデ」", time: "2時間前", isRead: false },
  { type: "new_dm" as const, title: "Mizukiからの返信", body: "ありがとうございます!", time: "5時間前", isRead: false },
  { type: "payment" as const, title: "お支払い完了", body: "スタンダードプラン 1,000円", time: "1日前", isRead: true },
  { type: "new_post" as const, title: "Yuto Fitnessが新しい投稿を公開", body: "今週のトレーニングメニュー", time: "2日前", isRead: true },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">通知</h1>
      <div className="space-y-1">
        {notificationsList.map((n, i) => {
          const Icon = iconMap[n.type];
          return (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                n.isRead ? "hover:bg-surface-hover" : "bg-primary/5 hover:bg-primary/10"
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{n.title}</p>
                <p className="text-xs text-text-muted">{n.body}</p>
              </div>
              <span className="text-xs text-text-muted shrink-0">{n.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
