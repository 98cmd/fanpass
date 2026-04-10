"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";
import {
  createCreatorProfile,
  updateCreatorProfile,
  getCreatorByUserId,
} from "@/db/queries/creators";
import { createTier, updateTier, deleteTier } from "@/db/queries/tiers";
import { getOrCreateUser } from "@/db/queries/users";

// クリエイター登録
const registerSchema = z.object({
  slug: z.string().min(3).max(50).regex(/^[a-z0-9_-]+$/),
  category: z.string().min(1),
});

export async function registerCreator(formData: FormData) {
  const user = await requireAuth();
  const parsed = registerSchema.safeParse({
    slug: formData.get("slug"),
    category: formData.get("category"),
  });

  if (!parsed.success) {
    return { error: "入力内容を確認してください" };
  }

  // usersテーブルにレコードがなければ作成
  await getOrCreateUser({
    id: user.id,
    email: user.email ?? "",
    user_metadata: user.user_metadata,
  });

  try {
    await createCreatorProfile({
      userId: user.id,
      slug: parsed.data.slug,
      category: parsed.data.category,
    });
  } catch (e: any) {
    if (e?.code === "23505") {
      return { error: "このURLは既に使用されています" };
    }
    return { error: "登録に失敗しました" };
  }

  redirect("/creator/dashboard");
}

// プロフィール更新
const updateProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  snsInstagram: z.string().max(255).optional(),
  snsX: z.string().max(255).optional(),
  snsThreads: z.string().max(255).optional(),
  dmPrice: z.coerce.number().min(100).max(10000).optional(),
});

export async function updateProfile(formData: FormData) {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) return { error: "クリエイター登録が必要です" };

  const parsed = updateProfileSchema.safeParse({
    bio: formData.get("bio") || undefined,
    snsInstagram: formData.get("snsInstagram") || undefined,
    snsX: formData.get("snsX") || undefined,
    snsThreads: formData.get("snsThreads") || undefined,
    dmPrice: formData.get("dmPrice") || undefined,
  });

  if (!parsed.success) {
    return { error: "入力内容を確認してください" };
  }

  await updateCreatorProfile(creator.id, parsed.data);
  revalidatePath("/creator/settings");
  revalidatePath(`/${creator.slug}`);
  return { success: true };
}

// ティア作成
const createTierSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.coerce.number().min(100).max(100000),
  benefits: z.string().optional(),
});

export async function createTierAction(formData: FormData) {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) return { error: "クリエイター登録が必要です" };

  const parsed = createTierSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    benefits: formData.get("benefits"),
  });

  if (!parsed.success) {
    return { error: "入力内容を確認してください" };
  }

  const benefitsList = parsed.data.benefits
    ? parsed.data.benefits.split("\n").filter((b) => b.trim())
    : [];

  await createTier({
    creatorId: creator.id,
    name: parsed.data.name,
    price: parsed.data.price,
    benefits: benefitsList,
  });

  revalidatePath("/creator/tiers");
  revalidatePath(`/${creator.slug}`);
  return { success: true };
}

// ティア更新
export async function updateTierAction(tierId: string, formData: FormData) {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) return { error: "クリエイター登録が必要です" };

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const benefits = (formData.get("benefits") as string)
    ?.split("\n")
    .filter((b) => b.trim()) ?? [];

  await updateTier(tierId, { name, price, benefits });
  revalidatePath("/creator/tiers");
  return { success: true };
}

// ティア削除（ソフトデリート）
export async function deleteTierAction(tierId: string) {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) return { error: "クリエイター登録が必要です" };

  await deleteTier(tierId);
  revalidatePath("/creator/tiers");
  return { success: true };
}
