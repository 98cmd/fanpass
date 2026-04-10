"use server";

import { getSupabaseAdmin } from "@/db";

export async function getCreatorPosts(creatorId: string, limit = 20, offset = 0) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("posts")
    .select("*")
    .eq("creator_id", creatorId)
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);
  return (data ?? []) as any[];
}

export async function getPostById(postId: string) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();
  return data as any;
}

export async function createPost(data: {
  creatorId: string;
  type: string;
  title?: string;
  body?: string;
  mediaUrls?: string[];
  visibility: string;
  minTierId?: string;
  isPpv?: boolean;
  ppvPrice?: number;
}) {
  const sb = getSupabaseAdmin();
  const { data: post, error } = await sb
    .from("posts")
    .insert({
      creator_id: data.creatorId,
      type: data.type,
      title: data.title,
      body: data.body,
      media_urls: data.mediaUrls ?? [],
      visibility: data.visibility,
      min_tier_id: data.minTierId,
      is_ppv: data.isPpv ?? false,
      ppv_price: data.ppvPrice,
      published_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return post;
}

export async function deletePost(postId: string) {
  const sb = getSupabaseAdmin();
  await sb.from("posts").delete().eq("id", postId);
}

export async function toggleLike(postId: string, userId: string) {
  const sb = getSupabaseAdmin();
  const { data: existing } = await sb
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    await sb.from("post_likes").delete().eq("id", existing.id);
    return { liked: false };
  } else {
    await sb.from("post_likes").insert({ post_id: postId, user_id: userId });
    return { liked: true };
  }
}

export async function addComment(postId: string, userId: string, body: string) {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("comments")
    .insert({ post_id: postId, user_id: userId, body })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function hasPurchasedPpv(postId: string, fanId: string) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("ppv_purchases")
    .select("id")
    .eq("post_id", postId)
    .eq("fan_id", fanId)
    .maybeSingle();
  return !!data;
}
