"use server";

import { eq, and, desc, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { dmConversations, directMessages, users } from "@/db/schema";

export async function getOrCreateConversation(fanId: string, creatorUserId: string) {
  const db = getDb();
  const existing = await db
    .select()
    .from(dmConversations)
    .where(
      and(
        eq(dmConversations.fanId, fanId),
        eq(dmConversations.creatorId, creatorUserId)
      )
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  const result = await db
    .insert(dmConversations)
    .values({ fanId, creatorId: creatorUserId })
    .returning();
  return result[0];
}

export async function getConversationMessages(conversationId: string, limit = 50) {
  const db = getDb();
  return db
    .select({
      id: directMessages.id,
      senderId: directMessages.senderId,
      body: directMessages.body,
      mediaUrl: directMessages.mediaUrl,
      price: directMessages.price,
      isRead: directMessages.isRead,
      createdAt: directMessages.createdAt,
      senderName: users.displayName,
      senderAvatar: users.avatarUrl,
    })
    .from(directMessages)
    .innerJoin(users, eq(directMessages.senderId, users.id))
    .where(eq(directMessages.conversationId, conversationId))
    .orderBy(desc(directMessages.createdAt))
    .limit(limit);
}

export async function getUserConversations(userId: string) {
  const db = getDb();
  // ファンとしての会話 + クリエイターとしての会話
  return db
    .select({
      id: dmConversations.id,
      fanId: dmConversations.fanId,
      creatorId: dmConversations.creatorId,
      updatedAt: dmConversations.updatedAt,
    })
    .from(dmConversations)
    .where(
      sql`${dmConversations.fanId} = ${userId} OR ${dmConversations.creatorId} = ${userId}`
    )
    .orderBy(desc(dmConversations.updatedAt));
}

export async function sendMessage(data: {
  conversationId: string;
  senderId: string;
  body: string;
  price?: number;
  stripePaymentIntentId?: string;
  mediaUrl?: string;
}) {
  const db = getDb();
  const result = await db
    .insert(directMessages)
    .values({
      conversationId: data.conversationId,
      senderId: data.senderId,
      body: data.body,
      price: data.price ?? 0,
      stripePaymentIntentId: data.stripePaymentIntentId,
      mediaUrl: data.mediaUrl,
    })
    .returning();

  // 会話のupdatedAtを更新
  await db
    .update(dmConversations)
    .set({ updatedAt: new Date() })
    .where(eq(dmConversations.id, data.conversationId));

  return result[0];
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
  const db = getDb();
  return db
    .update(directMessages)
    .set({ isRead: true })
    .where(
      and(
        eq(directMessages.conversationId, conversationId),
        sql`${directMessages.senderId} != ${userId}`,
        eq(directMessages.isRead, false)
      )
    );
}
