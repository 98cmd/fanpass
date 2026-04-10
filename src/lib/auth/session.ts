import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// 認証済みユーザーを取得（未認証ならリダイレクト）
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }
  return user;
}

// 認証済みユーザーを取得（未認証ならnull）
export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
