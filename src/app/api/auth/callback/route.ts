import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// 許可されたリダイレクト先（オープンリダイレクト防止）
const ALLOWED_REDIRECTS = [
  "/home", "/subscriptions", "/dm", "/notifications", "/settings",
  "/creator/dashboard", "/creator/posts", "/creator/tiers",
  "/creator/subscribers", "/creator/revenue", "/creator/settings",
];

function sanitizeRedirect(redirect: string | null): string {
  if (!redirect) return "/home";
  // 相対パスのみ許可、外部URLをブロック
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return "/home";
  // 許可リストにあるか、そのプレフィックスで始まるか
  const isAllowed = ALLOWED_REDIRECTS.some((path) => redirect.startsWith(path));
  return isAllowed ? redirect : "/home";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = sanitizeRedirect(searchParams.get("redirect"));

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}
