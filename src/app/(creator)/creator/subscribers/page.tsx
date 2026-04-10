import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { requireAuth } from "@/lib/auth/session";
import { getCreatorByUserId } from "@/db/queries/creators";
import { getCreatorSubscribers } from "@/db/queries/subscriptions";

export default async function SubscribersPage() {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) redirect("/creator/register");

  const subscribers = await getCreatorSubscribers(creator.id);

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">ファン管理</h1>
          <p className="text-sm text-text-muted mt-1">{subscribers.length}人のファン</p>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <p className="text-text-muted text-center py-16">まだファンがいません。SNSでファンクラブのリンクを共有しましょう!</p>
      ) : (
        <div className="space-y-2">
          {subscribers.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {sub.fanName?.charAt(0) ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary">{sub.fanName}</p>
                  <p className="text-xs text-text-muted">{sub.fanEmail}</p>
                </div>
                <Badge variant={sub.tierPrice >= 3000 ? "secondary" : "default"}>{sub.tierName}</Badge>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-text-primary">{sub.tierPrice.toLocaleString()}円/月</p>
                  <p className="text-xs text-text-muted">{new Date(sub.createdAt).toLocaleDateString("ja-JP")}〜</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
