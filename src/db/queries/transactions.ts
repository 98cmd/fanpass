"use server";

import { eq, desc, and, sql, gte } from "drizzle-orm";
import { getDb } from "@/db";
import { transactions } from "@/db/schema";

export async function recordTransaction(data: {
  creatorId: string;
  fanId?: string;
  type: "subscription" | "ppv" | "dm" | "tip" | "payout";
  amount: number;
  platformFee: number;
  creatorRevenue: number;
  stripeId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
}) {
  const db = getDb();
  return db.insert(transactions).values(data).returning();
}

export async function getCreatorTransactions(creatorId: string, limit = 50) {
  const db = getDb();
  return db
    .select()
    .from(transactions)
    .where(eq(transactions.creatorId, creatorId))
    .orderBy(desc(transactions.createdAt))
    .limit(limit);
}

export async function getCreatorMonthlyRevenue(creatorId: string) {
  const db = getDb();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const result = await db
    .select({
      totalAmount: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
      totalFee: sql<number>`COALESCE(SUM(${transactions.platformFee}), 0)`,
      totalRevenue: sql<number>`COALESCE(SUM(${transactions.creatorRevenue}), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.creatorId, creatorId),
        eq(transactions.status, "completed"),
        gte(transactions.createdAt, startOfMonth)
      )
    );

  return result[0] ?? { totalAmount: 0, totalFee: 0, totalRevenue: 0 };
}

export async function getCreatorRevenueByType(creatorId: string) {
  const db = getDb();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return db
    .select({
      type: transactions.type,
      total: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.creatorId, creatorId),
        eq(transactions.status, "completed"),
        gte(transactions.createdAt, startOfMonth)
      )
    )
    .groupBy(transactions.type);
}
