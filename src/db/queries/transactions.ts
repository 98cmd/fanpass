"use server";

import { getSupabaseAdmin } from "@/db";

export async function recordTransaction(data: {
  creatorId: string;
  fanId?: string;
  type: string;
  amount: number;
  platformFee: number;
  creatorRevenue: number;
  stripeId?: string;
  status: string;
}) {
  const sb = getSupabaseAdmin();
  return sb.from("transactions").insert({
    creator_id: data.creatorId,
    fan_id: data.fanId,
    type: data.type,
    amount: data.amount,
    platform_fee: data.platformFee,
    creator_revenue: data.creatorRevenue,
    stripe_id: data.stripeId,
    status: data.status,
  });
}

export async function getCreatorTransactions(creatorId: string, limit = 50) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("transactions")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as any[];
}

export async function getCreatorMonthlyRevenue(creatorId: string) {
  const sb = getSupabaseAdmin();
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const { data } = await sb
    .from("transactions")
    .select("amount, platform_fee, creator_revenue")
    .eq("creator_id", creatorId)
    .eq("status", "completed")
    .gte("created_at", startOfMonth);

  const rows = (data ?? []) as any[];
  return {
    totalAmount: rows.reduce((s: number, r: any) => s + (r.amount ?? 0), 0),
    totalFee: rows.reduce((s: number, r: any) => s + (r.platform_fee ?? 0), 0),
    totalRevenue: rows.reduce((s: number, r: any) => s + (r.creator_revenue ?? 0), 0),
  };
}

export async function getCreatorRevenueByType(creatorId: string) {
  const sb = getSupabaseAdmin();
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const { data } = await sb
    .from("transactions")
    .select("type, amount")
    .eq("creator_id", creatorId)
    .eq("status", "completed")
    .gte("created_at", startOfMonth);

  const byType: Record<string, number> = {};
  ((data ?? []) as any[]).forEach((r: any) => {
    byType[r.type] = (byType[r.type] ?? 0) + (r.amount ?? 0);
  });

  return Object.entries(byType).map(([type, total]) => ({ type, total }));
}
