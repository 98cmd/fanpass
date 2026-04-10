"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { creatorProfiles, users, tiers } from "@/db/schema";

export async function getCreatorBySlug(slug: string) {
  const db = getDb();
  const result = await db
    .select({
      id: creatorProfiles.id,
      userId: creatorProfiles.userId,
      slug: creatorProfiles.slug,
      bio: creatorProfiles.bio,
      coverImageUrl: creatorProfiles.coverImageUrl,
      snsInstagram: creatorProfiles.snsInstagram,
      snsX: creatorProfiles.snsX,
      snsThreads: creatorProfiles.snsThreads,
      snsTiktok: creatorProfiles.snsTiktok,
      dmPrice: creatorProfiles.dmPrice,
      isPublished: creatorProfiles.isPublished,
      category: creatorProfiles.category,
      stripeAccountId: creatorProfiles.stripeAccountId,
      stripeOnboarded: creatorProfiles.stripeOnboarded,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(creatorProfiles)
    .innerJoin(users, eq(creatorProfiles.userId, users.id))
    .where(eq(creatorProfiles.slug, slug))
    .limit(1);

  return result[0] ?? null;
}

export async function getCreatorByUserId(userId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(creatorProfiles)
    .where(eq(creatorProfiles.userId, userId))
    .limit(1);

  return result[0] ?? null;
}

export async function getCreatorTiers(creatorId: string) {
  const db = getDb();
  return db
    .select()
    .from(tiers)
    .where(eq(tiers.creatorId, creatorId))
    .orderBy(tiers.sortOrder);
}

export async function createCreatorProfile(data: {
  userId: string;
  slug: string;
  category: string;
}) {
  const db = getDb();
  const result = await db
    .insert(creatorProfiles)
    .values({
      userId: data.userId,
      slug: data.slug,
      category: data.category,
      isPublished: true,
    })
    .returning();

  // ユーザーロールをcreatorに更新
  await db
    .update(users)
    .set({ role: "creator" })
    .where(eq(users.id, data.userId));

  return result[0];
}

export async function updateCreatorProfile(
  creatorId: string,
  data: Partial<{
    slug: string;
    bio: string;
    coverImageUrl: string;
    snsInstagram: string;
    snsX: string;
    snsThreads: string;
    snsTiktok: string;
    dmPrice: number;
    category: string;
    stripeAccountId: string;
    stripeOnboarded: boolean;
  }>
) {
  const db = getDb();
  return db
    .update(creatorProfiles)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(creatorProfiles.id, creatorId))
    .returning();
}
