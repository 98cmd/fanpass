"use server";

import { getSupabaseAdmin } from "@/db";

export async function getOrCreateUser(authUser: {
  id: string;
  email: string;
  user_metadata?: { display_name?: string };
}) {
  const sb = getSupabaseAdmin();
  const { data: existing } = await sb
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (existing) return existing;

  const { data, error } = await sb
    .from("users")
    .insert({
      id: authUser.id,
      email: authUser.email ?? "",
      display_name: authUser.user_metadata?.display_name ?? "ユーザー",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(userId: string, data: Record<string, unknown>) {
  const sb = getSupabaseAdmin();
  return sb.from("users").update(data).eq("id", userId);
}

export async function getUserNotifications(userId: string, limit = 30) {
  const sb = getSupabaseAdmin();
  const { data } = await sb
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as any[];
}

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}) {
  const sb = getSupabaseAdmin();
  return sb.from("notifications").insert({
    user_id: data.userId,
    type: data.type,
    title: data.title,
    body: data.body,
    link: data.link,
  });
}

export async function markAllNotificationsRead(userId: string) {
  const sb = getSupabaseAdmin();
  return sb
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);
}
