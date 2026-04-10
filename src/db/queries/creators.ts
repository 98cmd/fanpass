"use server";

import { getSupabaseAdmin } from "@/db";

export async function getCreatorBySlug(slug: string) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("creator_profiles")
    .select("*, users!creator_profiles_user_id_fkey(display_name, avatar_url)")
    .eq("slug", slug)
    .single();

  if (!data) return null;
  const d = data as any;
  return {
    ...d,
    displayName: d.users?.display_name ?? "Unknown",
    avatarUrl: d.users?.avatar_url ?? null,
  };
}

export async function getCreatorByUserId(userId: string) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("creator_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data as any;
}

export async function getCreatorTiers(creatorId: string) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("tiers")
    .select("*")
    .eq("creator_id", creatorId)
    .order("sort_order");
  return (data ?? []) as any[];
}

export async function createCreatorProfile(data: {
  userId: string;
  slug: string;
  category: string;
}) {
  const sb = getSupabaseAdmin();

  const { data: profile, error } = await sb
    .from("creator_profiles")
    .insert({
      user_id: data.userId,
      slug: data.slug,
      category: data.category,
      is_published: true,
    })
    .select()
    .single();

  if (error) throw error;

  // ユーザーロール更新
  await sb
    .from("users")
    .update({ role: "creator" })
    .eq("id", data.userId);

  return profile;
}

export async function updateCreatorProfile(
  creatorId: string,
  data: Record<string, unknown>
) {
  const sb = getSupabaseAdmin();
  const { data: result, error } = await sb
    .from("creator_profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", creatorId)
    .select()
    .single();

  if (error) throw error;
  return result;
}
