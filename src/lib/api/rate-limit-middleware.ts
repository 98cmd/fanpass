import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// API Route用レート制限チェック
export function checkRateLimit(
  request: NextRequest,
  limit = 30,
  windowMs = 60000 // 1分
): NextResponse | null {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const key = `${ip}:${request.nextUrl.pathname}`;
  const result = rateLimit(key, limit, windowMs);

  if (!result.success) {
    return NextResponse.json(
      { error: { message: "リクエスト制限を超えました。しばらく待ってから再試行してください。" } },
      {
        status: 429,
        headers: { "Retry-After": "60" },
      }
    );
  }

  return null; // OK
}
