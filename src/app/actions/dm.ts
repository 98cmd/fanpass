"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { getOrCreateConversation, sendMessage, markMessagesAsRead } from "@/db/queries/dm";
import { getCreatorBySlug } from "@/db/queries/creators";

export async function sendDmAction(formData: FormData) {
  const user = await requireAuth();
  const creatorSlug = formData.get("creatorSlug") as string;
  const body = formData.get("body") as string;

  if (!body?.trim()) return { error: "メッセージを入力してください" };
  if (!creatorSlug) return { error: "送信先が不明です" };

  const creator = await getCreatorBySlug(creatorSlug);
  if (!creator) return { error: "クリエイターが見つかりません" };

  try {
    const conversation = await getOrCreateConversation(user.id, creator.user_id);
    const msg = await sendMessage({
      conversationId: conversation.id,
      senderId: user.id,
      body: body.trim(),
      price: 0, // 無料DM（有料DMは別フローで決済後に呼ぶ）
    });

    revalidatePath("/dm");
    return { success: true, messageId: msg.id };
  } catch (e) {
    console.error("sendDm failed:", e);
    return { error: "送信に失敗しました" };
  }
}

export async function markReadAction(conversationId: string) {
  const user = await requireAuth();
  await markMessagesAsRead(conversationId, user.id);
  revalidatePath("/dm");
}
