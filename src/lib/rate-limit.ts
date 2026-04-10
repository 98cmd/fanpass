// シンプルなインメモリレート制限
// 本番ではRedis/Upstashに置き換え推奨
const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

// メモリリーク防止: 定期的に古いエントリを削除
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of requests.entries()) {
    if (now > entry.resetAt) requests.delete(key);
  }
}, 60000);
