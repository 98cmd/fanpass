"use server";

import { getSupabaseAdmin } from "@/db";

export async function getOrCreateConversation(fanId: string, creatorUserId: string) {
  const sb = getSupabaseAdmin();
  const { data: existing } = await sb
    .from("dm_conversations")
    .select("*")
    .eq("fan_id", fanId)
    .eq("creator_id", creatorUserId)
    .single();

  if (existing) return existing;

  const { data, error } = await sb
    .from("dm_conversations")
    .insert({ fan_id: fanId, creator_id: creatorUserId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getConversationMessages(conversationId: string, limit = 50) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("direct_messages")
    .select("*, users!direct_messages_sender_id_fkey(display_name, avatar_url)")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((m: any) => ({
    ...m,
    senderName: m.users?.display_name,
    senderAvatar: m.users?.avatar_url,
  }));
}

export async function getUserConversations(userId: string) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("dm_conversations")
    .select("*")
    .or(`fan_id.eq.${userId},creator_id.eq.${userId}`)
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function sendMessage(data: {
  conversationId: string;
  senderId: string;
  body: string;
  price?: number;
  stripePaymentIntentId?: string;
  mediaUrl?: string;
}) {
  const sb = getSupabaseAdmin();
  const { data: msg, error } = await sb
    .from("direct_messages")
    .insert({
      conversation_id: data.conversationId,
      sender_id: data.senderId,
      body: data.body,
      price: data.price ?? 0,
      stripe_payment_intent_id: data.stripePaymentIntentId,
      media_url: data.mediaUrl,
    })
    .select()
    .single();

  if (error) throw error;

  await sb
    .from("dm_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", data.conversationId);

  return msg;
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  const sb = getSupabaseAdmin();
  return sb
    .from("direct_messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("is_read", false);
}
