"use server";

import { getUser } from "@/lib/auth/session";
import { getOrCreateUser } from "@/db/queries/users";

// ログイン後にusersテーブルにレコードを同期
export async function syncUser() {
  const user = await getUser();
  if (!user) return null;

  try {
    return await getOrCreateUser({
      id: user.id,
      email: user.email ?? "",
      user_metadata: user.user_metadata,
    });
  } catch (e) {
    console.error("syncUser failed:", e);
    return null;
  }
}
