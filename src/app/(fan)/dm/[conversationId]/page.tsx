import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireAuth } from "@/lib/auth/session";
import { getConversationMessages, markMessagesAsRead } from "@/db/queries/dm";
import { getSupabaseAdmin } from "@/db";
import { DmMessageForm } from "./message-form";

export default async function DmConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const user = await requireAuth();
  const sb = getSupabaseAdmin();

  // 会話の存在確認+相手情報取得
  const { data: conv } = await sb
    .from("dm_conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (!conv) notFound();
  if (conv.fan_id !== user.id && conv.creator_id !== user.id) notFound();

  const otherId = conv.fan_id === user.id ? conv.creator_id : conv.fan_id;
  const { data: otherUser } = await sb
    .from("users")
    .select("display_name, avatar_url")
    .eq("id", otherId)
    .single();

  // メッセージ取得+既読処理
  const messages = await getConversationMessages(conversationId, 100);
  await markMessagesAsRead(conversationId, user.id);

  // 時系列順に反転（新しい→古い を 古い→新しい に）
  const sortedMessages = [...messages].reverse();

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-56px)]">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface shrink-0">
        <Link href="/dm" className="p-1 -ml-1">
          <ArrowLeft className="w-5 h-5 text-text-secondary" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
          {otherUser?.display_name?.charAt(0) ?? "?"}
        </div>
        <p className="font-bold text-text-primary">{otherUser?.display_name ?? "ユーザー"}</p>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {sortedMessages.length === 0 ? (
          <p className="text-text-muted text-center py-12 text-sm">メッセージを送ってみましょう</p>
        ) : (
          sortedMessages.map((msg: any) => {
            const isMine = msg.sender_id === user.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMine
                      ? "bg-primary text-white rounded-br-md"
                      : "bg-surface border border-border text-text-primary rounded-bl-md"
                  }`}
                >
                  <p className="leading-relaxed">{msg.body}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-text-muted"}`}>
                    {new Date(msg.created_at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}
                    {msg.price > 0 && ` / ${msg.price.toLocaleString()}円`}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 送信フォーム */}
      <DmMessageForm conversationId={conversationId} />
    </div>
  );
}
