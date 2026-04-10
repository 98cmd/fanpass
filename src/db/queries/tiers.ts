"use server";

import { getSupabaseAdmin } from "@/db";

export async function createTier(data: {
  creatorId: string;
  name: string;
  price: number;
  description?: string;
  benefits?: string[];
  sortOrder?: number;
}) {
  const sb = getSupabaseAdmin();
  const { data: tier, error } = await sb
    .from("tiers")
    .insert({
      creator_id: data.creatorId,
      name: data.name,
      price: data.price,
      description: data.description,
      benefits: data.benefits ?? [],
      sort_order: data.sortOrder ?? 0,
    })
    .select()
    .single();
  if (error) throw error;
  return tier;
}

export async function updateTier(tierId: string, data: Record<string, unknown>) {
  const sb = getSupabaseAdmin();
  const { data: tier, error } = await sb
    .from("tiers")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", tierId)
    .select()
    .single();
  if (error) throw error;
  return tier;
}

export async function deleteTier(tierId: string) {
  const sb = getSupabaseAdmin();
  await sb.from("tiers").update({ is_active: false }).eq("id", tierId);
}
