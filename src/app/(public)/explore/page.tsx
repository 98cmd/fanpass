import Link from "next/link";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseAdmin } from "@/db";

export const metadata = { title: "クリエイターを探す" };

const categories = [
  "ファッション", "美容・コスメ", "フィットネス", "グルメ・料理",
  "旅行", "ライフスタイル", "エンタメ", "教育・学び",
];

export default async function ExplorePage() {
  const sb = getSupabaseAdmin();
  const { data: creators } = await sb
    .from("creator_profiles")
    .select("*, users!creator_profiles_user_id_fkey(display_name, avatar_url)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const list = (creators ?? []).map((c: any) => ({
    slug: c.slug,
    displayName: c.users?.display_name ?? "クリエイター",
    avatarUrl: c.users?.avatar_url,
    bio: c.bio,
    category: c.category,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="text-xl font-bold font-display text-primary">FANPASS</Link>
      </div>

      <h1 className="text-3xl font-black text-text-primary mb-2">クリエイターを探す</h1>
      <p className="text-text-secondary mb-8">お気に入りのクリエイターを見つけよう</p>

      {/* カテゴリタグ */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Badge key={cat} variant="outline" className="cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-colors px-3 py-1.5">
            {cat}
          </Badge>
        ))}
      </div>

      {/* クリエイター一覧 */}
      {list.length === 0 ? (
        <p className="text-text-muted text-center py-16">まだクリエイターが登録されていません</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((creator: any) => (
            <Link key={creator.slug} href={`/${creator.slug}`}>
              <Card className="hover:border-primary/20 hover:-translate-y-1 transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {creator.avatarUrl ? (
                      <img src={creator.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                        {creator.displayName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-text-primary">{creator.displayName}</p>
                      {creator.category && <Badge variant="default" className="mt-1">{creator.category}</Badge>}
                    </div>
                  </div>
                  {creator.bio && (
                    <p className="text-sm text-text-secondary line-clamp-2">{creator.bio}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
