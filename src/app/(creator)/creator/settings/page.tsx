import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { getCreatorByUserId } from "@/db/queries/creators";
import { CreatorSettingsForm } from "./settings-form";

export default async function CreatorSettingsPage() {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) redirect("/creator/register");

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      <h1 className="text-2xl font-bold text-text-primary mb-6">クリエイター設定</h1>
      <CreatorSettingsForm creator={creator} />
    </div>
  );
}
