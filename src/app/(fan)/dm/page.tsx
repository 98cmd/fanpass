import { Card, CardContent } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/session";
import { getUserConversations } from "@/db/queries/dm";
import { getSupabaseAdmin } from "@/db";

export default async function DmPage() {
  const user = await requireAuth();
  const conversations = await getUserConversations(user.id);

  // 各会話の相手情報と最新メッセージを取得
  const sb = getSupabaseAdmin();
  const enriched = await Promise.all(
    conversations.map(async (conv: any) => {
      const otherId = conv.fan_id === user.id ? conv.creator_id : conv.fan_id;
      const { data: otherUser } = await sb
        .from("users")
        .select("display_name, avatar_url")
        .eq("id", otherId)
        .single();

      const { data: lastMsg } = await sb
        .from("direct_messages")
        .select("body, created_at, sender_id, is_read")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const unreadCount = await sb
        .from("direct_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .neq("sender_id", user.id)
        .eq("is_read", false);

      return {
        id: conv.id,
        name: otherUser?.display_name ?? "ユーザー",
        avatar: otherUser?.avatar_url,
        lastMessage: lastMsg?.body ?? "",
        time: lastMsg?.created_at ? new Date(lastMsg.created_at).toLocaleDateString("ja-JP") : "",
        unread: (unreadCount.count ?? 0) > 0,
      };
    })
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">DM</h1>

      {enriched.length === 0 ? (
        <p className="text-text-muted text-center py-16">まだDMはありません</p>
      ) : (
        <div className="space-y-2">
          {enriched.map((conv) => (
            <Card key={conv.id} className="cursor-pointer hover:border-primary/20 transition-colors">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {conv.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-text-primary">{conv.name}</p>
                    <span className="text-xs text-text-muted">{conv.time}</span>
                  </div>
                  <p className="text-sm text-text-secondary truncate">{conv.lastMessage}</p>
                </div>
                {conv.unread && <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
