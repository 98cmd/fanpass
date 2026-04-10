import { Bell, Heart, MessageCircle, UserPlus, Wallet } from "lucide-react";
import { requireAuth } from "@/lib/auth/session";
import { getUserNotifications, markAllNotificationsRead } from "@/db/queries/users";

const iconMap: Record<string, typeof Bell> = {
  new_post: Bell,
  new_dm: MessageCircle,
  new_subscriber: UserPlus,
  payment: Wallet,
  system: Bell,
};

export default async function NotificationsPage() {
  const user = await requireAuth();
  const notificationsList = await getUserNotifications(user.id);

  // 全て既読にする
  await markAllNotificationsRead(user.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">通知</h1>

      {notificationsList.length === 0 ? (
        <p className="text-text-muted text-center py-16">通知はありません</p>
      ) : (
        <div className="space-y-1">
          {notificationsList.map((n) => {
            const Icon = iconMap[n.type] ?? Bell;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  n.isRead ? "hover:bg-surface-hover" : "bg-primary/5"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary">{n.title}</p>
                  {n.body && <p className="text-xs text-text-muted">{n.body}</p>}
                </div>
                <span className="text-xs text-text-muted shrink-0">
                  {new Date(n.createdAt).toLocaleDateString("ja-JP")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
