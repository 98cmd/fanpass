import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/db";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: { message: "未認証" } }, { status: 401 });
  }

  const body = await request.json();
  const sb = getSupabaseAdmin();

  const { error } = await sb
    .from("users")
    .update({
      display_name: body.displayName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return Response.json({ error: { message: "更新に失敗" } }, { status: 500 });
  }

  return Response.json({ data: { success: true } });
}
