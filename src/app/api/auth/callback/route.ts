import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateUser } from "@/db/queries/users";

const ALLOWED_REDIRECTS = [
  "/home", "/subscriptions", "/dm", "/notifications", "/settings",
  "/creator/dashboard", "/creator/posts", "/creator/tiers",
  "/creator/subscribers", "/creator/revenue", "/creator/settings",
  "/creator/register",
];

function sanitizeRedirect(redirect: string | null): string {
  if (!redirect) return "/home";
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return "/home";
  const isAllowed = ALLOWED_REDIRECTS.some((path) => redirect.startsWith(path));
  return isAllowed ? redirect : "/home";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = sanitizeRedirect(searchParams.get("redirect"));

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // #2: サインアップ/ログイン時にusersテーブルに自動INSERT
    if (data?.user) {
      try {
        await getOrCreateUser({
          id: data.user.id,
          email: data.user.email ?? "",
          user_metadata: data.user.user_metadata,
        });
      } catch (e) {
        console.error("Failed to create user record:", e);
      }
    }
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}
