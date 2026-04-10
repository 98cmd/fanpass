"use server";

import { eq, desc, and, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { posts, postLikes, comments, ppvPurchases } from "@/db/schema";

export async function getCreatorPosts(creatorId: string, limit = 20, offset = 0) {
  const db = getDb();
  return db
    .select()
    .from(posts)
    .where(eq(posts.creatorId, creatorId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getPostById(postId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);
  return result[0] ?? null;
}

export async function createPost(data: {
  creatorId: string;
  type: "text" | "image" | "video" | "audio";
  title?: string;
  body?: string;
  mediaUrls?: string[];
  visibility: "public" | "subscribers" | "tier";
  minTierId?: string;
  isPpv?: boolean;
  ppvPrice?: number;
}) {
  const db = getDb();
  return db
    .insert(posts)
    .values({
      ...data,
      mediaUrls: data.mediaUrls ?? [],
      publishedAt: new Date(),
    })
    .returning();
}

export async function updatePost(
  postId: string,
  data: Partial<{
    title: string;
    body: string;
    mediaUrls: string[];
    visibility: "public" | "subscribers" | "tier";
    minTierId: string;
    isPpv: boolean;
    ppvPrice: number;
  }>
) {
  const db = getDb();
  return db
    .update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, postId))
    .returning();
}

export async function deletePost(postId: string) {
  const db = getDb();
  return db.delete(posts).where(eq(posts.id, postId));
}

export async function toggleLike(postId: string, userId: string) {
  const db = getDb();
  const existing = await db
    .select()
    .from(postLikes)
    .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
    await db
      .update(posts)
      .set({ likeCount: sql`${posts.likeCount} - 1` })
      .where(eq(posts.id, postId));
    return { liked: false };
  } else {
    await db.insert(postLikes).values({ postId, userId });
    await db
      .update(posts)
      .set({ likeCount: sql`${posts.likeCount} + 1` })
      .where(eq(posts.id, postId));
    return { liked: true };
  }
}

export async function addComment(postId: string, userId: string, body: string) {
  const db = getDb();
  const result = await db
    .insert(comments)
    .values({ postId, userId, body })
    .returning();

  await db
    .update(posts)
    .set({ commentCount: sql`${posts.commentCount} + 1` })
    .where(eq(posts.id, postId));

  return result[0];
}

export async function hasPurchasedPpv(postId: string, fanId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(ppvPurchases)
    .where(and(eq(ppvPurchases.postId, postId), eq(ppvPurchases.fanId, fanId)))
    .limit(1);
  return result.length > 0;
}
