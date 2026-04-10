"use server";

import { eq, and } from "drizzle-orm";
import { getDb } from "@/db";
import { tiers } from "@/db/schema";

export async function createTier(data: {
  creatorId: string;
  name: string;
  price: number;
  description?: string;
  benefits?: string[];
  sortOrder?: number;
}) {
  const db = getDb();
  return db
    .insert(tiers)
    .values({
      creatorId: data.creatorId,
      name: data.name,
      price: data.price,
      description: data.description,
      benefits: data.benefits ?? [],
      sortOrder: data.sortOrder ?? 0,
    })
    .returning();
}

export async function updateTier(
  tierId: string,
  data: Partial<{
    name: string;
    price: number;
    description: string;
    benefits: string[];
    sortOrder: number;
    isActive: boolean;
    stripePriceId: string;
  }>
) {
  const db = getDb();
  return db
    .update(tiers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tiers.id, tierId))
    .returning();
}

export async function deleteTier(tierId: string) {
  const db = getDb();
  // ソフトデリート
  return db
    .update(tiers)
    .set({ isActive: false, updatedAt: new Date() })
    .where(eq(tiers.id, tierId));
}
