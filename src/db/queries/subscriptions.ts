"use server";

import { getSupabaseAdmin } from "@/db";

export async function getActiveSubscription(fanId: string, creatorId: string) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("subscriptions")
    .select("*")
    .eq("fan_id", fanId)
    .eq("creator_id", creatorId)
    .eq("status", "active")
    .single();
  return data;
}

export async function getUserSubscriptions(fanId: string) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("subscriptions")
    .select(`
      *,
      tiers(name, price),
      creator_profiles!subscriptions_creator_id_fkey(slug, category, user_id,
        users!creator_profiles_user_id_fkey(display_name, avatar_url)
      )
    `)
    .eq("fan_id", fanId);

  return (data ?? []).map((s: any) => ({
    id: s.id,
    tierId: s.tier_id,
    status: s.status,
    currentPeriodEnd: s.current_period_end,
    tierName: s.tiers?.name,
    tierPrice: s.tiers?.price,
    creatorSlug: s.creator_profiles?.slug,
    creatorCategory: s.creator_profiles?.category,
    creatorName: s.creator_profiles?.users?.display_name,
    creatorAvatar: s.creator_profiles?.users?.avatar_url,
  })) as any[];
}

export async function getCreatorSubscribers(creatorId: string) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("subscriptions")
    .select(`
      *,
      tiers(name, price),
      users!subscriptions_fan_id_fkey(display_name, email, avatar_url)
    `)
    .eq("creator_id", creatorId)
    .eq("status", "active");

  return (data ?? []).map((s: any) => ({
    id: s.id,
    fanId: s.fan_id,
    tierId: s.tier_id,
    status: s.status,
    createdAt: s.created_at,
    tierName: s.tiers?.name,
    tierPrice: s.tiers?.price,
    fanName: s.users?.display_name,
    fanEmail: s.users?.email,
    fanAvatar: s.users?.avatar_url,
  })) as any[];
}

export async function getCreatorSubscriberCount(creatorId: string) {
  const sb = getSupabaseAdmin();
  const { count } = await sb
    .from("subscriptions")
    .select("*", { count: "exact", head: true })
    .eq("creator_id", creatorId)
    .eq("status", "active");
  return count ?? 0;
}
