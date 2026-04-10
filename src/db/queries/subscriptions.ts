"use server";

import { eq, and, count } from "drizzle-orm";
import { getDb } from "@/db";
import { subscriptions, tiers, creatorProfiles, users } from "@/db/schema";

export async function getActiveSubscription(fanId: string, creatorId: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.fanId, fanId),
        eq(subscriptions.creatorId, creatorId),
        eq(subscriptions.status, "active")
      )
    )
    .limit(1);
  return result[0] ?? null;
}

export async function getUserSubscriptions(fanId: string) {
  const db = getDb();
  return db
    .select({
      id: subscriptions.id,
      tierId: subscriptions.tierId,
      status: subscriptions.status,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
      tierName: tiers.name,
      tierPrice: tiers.price,
      creatorSlug: creatorProfiles.slug,
      creatorCategory: creatorProfiles.category,
      creatorName: users.displayName,
      creatorAvatar: users.avatarUrl,
    })
    .from(subscriptions)
    .innerJoin(tiers, eq(subscriptions.tierId, tiers.id))
    .innerJoin(creatorProfiles, eq(subscriptions.creatorId, creatorProfiles.id))
    .innerJoin(users, eq(creatorProfiles.userId, users.id))
    .where(eq(subscriptions.fanId, fanId));
}

export async function getCreatorSubscribers(creatorId: string) {
  const db = getDb();
  return db
    .select({
      id: subscriptions.id,
      fanId: subscriptions.fanId,
      tierId: subscriptions.tierId,
      status: subscriptions.status,
      createdAt: subscriptions.createdAt,
      tierName: tiers.name,
      tierPrice: tiers.price,
      fanName: users.displayName,
      fanEmail: users.email,
      fanAvatar: users.avatarUrl,
    })
    .from(subscriptions)
    .innerJoin(tiers, eq(subscriptions.tierId, tiers.id))
    .innerJoin(users, eq(subscriptions.fanId, users.id))
    .where(
      and(
        eq(subscriptions.creatorId, creatorId),
        eq(subscriptions.status, "active")
      )
    );
}

export async function getCreatorSubscriberCount(creatorId: string) {
  const db = getDb();
  const result = await db
    .select({ count: count() })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.creatorId, creatorId),
        eq(subscriptions.status, "active")
      )
    );
  return result[0]?.count ?? 0;
}
