"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users, notifications } from "@/db/schema";

export async function getOrCreateUser(authUser: { id: string; email: string; user_metadata?: { display_name?: string } }) {
  const db = getDb();
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.id, authUser.id))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const result = await db
    .insert(users)
    .values({
      id: authUser.id,
      email: authUser.email ?? "",
      displayName: authUser.user_metadata?.display_name ?? "ユーザー",
    })
    .returning();

  return result[0];
}

export async function updateUser(
  userId: string,
  data: Partial<{ displayName: string; avatarUrl: string }>
) {
  const db = getDb();
  return db
    .update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();
}

export async function getUserNotifications(userId: string, limit = 30) {
  const db = getDb();
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(notifications.createdAt)
    .limit(limit);
}

export async function createNotification(data: {
  userId: string;
  type: "new_post" | "new_dm" | "new_subscriber" | "payment" | "system";
  title: string;
  body?: string;
  link?: string;
}) {
  const db = getDb();
  return db.insert(notifications).values(data).returning();
}

export async function markAllNotificationsRead(userId: string) {
  const db = getDb();
  return db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, userId));
}
