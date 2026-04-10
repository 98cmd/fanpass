import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { getSupabaseAdmin } from "@/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, CreditCard, Bell, Shield, Sparkles } from "lucide-react";
import { SettingsProfileForm } from "./profile-form";

export default async function SettingsPage() {
  const user = await requireAuth();
  const sb = getSupabaseAdmin();
  const { data: dbUser } = await sb
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: creator } = await sb
    .from("creator_profiles")
    .select("slug")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">設定</h1>

      <div className="space-y-6">
        <SettingsProfileForm
          displayName={dbUser?.display_name ?? user.user_metadata?.display_name ?? ""}
          email={user.email ?? ""}
        />

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" />通知設定</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">メール通知・プッシュ通知の設定は近日対応予定です。</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" />セキュリティ</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary mb-3">パスワードの変更ができます。</p>
            <Button variant="secondary" size="sm" disabled>パスワード変更（準備中）</Button>
          </CardContent>
        </Card>

        {!creator && (
          <Card className="border-primary/20">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-bold text-text-primary">クリエイターとして活動する</p>
                  <p className="text-xs text-text-muted">ファンクラブを開設して収益化を始めましょう</p>
                </div>
              </div>
              <Button asChild size="sm">
                <Link href="/creator/register">始める</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {creator && (
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">クリエイター管理画面</p>
                <p className="text-xs text-text-muted">fanpass-app.vercel.app/{creator.slug}</p>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href="/creator/dashboard">管理画面へ</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
