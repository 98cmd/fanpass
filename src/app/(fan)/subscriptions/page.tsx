import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAuth } from "@/lib/auth/session";
import { getUserSubscriptions } from "@/db/queries/subscriptions";

export default async function SubscriptionsPage() {
  const user = await requireAuth();
  const subs = await getUserSubscriptions(user.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">サブスクリプション</h1>

      {subs.length === 0 ? (
        <p className="text-text-muted text-center py-16">まだサブスクしているクリエイターはいません</p>
      ) : (
        <div className="space-y-3">
          {subs.map((sub) => (
            <Link key={sub.id} href={`/${sub.creatorSlug}`}>
              <Card className="hover:border-primary/20 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {sub.creatorName?.charAt(0) ?? "?"}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{sub.creatorName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge>{sub.tierName}</Badge>
                        <span className="text-xs text-text-muted">{sub.tierPrice?.toLocaleString()}円/月</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={sub.status === "active" ? "success" : "warning"}>
                      {sub.status === "active" ? "有効" : sub.status}
                    </Badge>
                    {sub.currentPeriodEnd && (
                      <p className="text-xs text-text-muted mt-1">
                        次回: {new Date(sub.currentPeriodEnd).toLocaleDateString("ja-JP")}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
