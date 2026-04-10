import { createClient } from "@supabase/supabase-js";

// Supabase service_role client でDB操作（RLSバイパス）
// 型生成なしで使うため any キャスト
let _client: any = null;

export function getSupabaseAdmin(): any {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  return _client;
}
