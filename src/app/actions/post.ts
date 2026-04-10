"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAuth } from "@/lib/auth/session";
import { getCreatorByUserId } from "@/db/queries/creators";
import { createPost, deletePost, toggleLike, addComment } from "@/db/queries/posts";

const createPostSchema = z.object({
  type: z.enum(["text", "image", "video", "audio"]),
  title: z.string().max(255).optional(),
  body: z.string().max(10000).optional(),
  visibility: z.enum(["public", "subscribers", "tier"]),
  minTierId: z.string().uuid().optional(),
  isPpv: z.coerce.boolean().default(false),
  ppvPrice: z.coerce.number().min(100).max(50000).optional(),
});

export async function createPostAction(formData: FormData) {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) return { error: "クリエイター登録が必要です" };

  const mediaUrlsRaw = formData.get("mediaUrls") as string;
  const mediaUrls = mediaUrlsRaw ? JSON.parse(mediaUrlsRaw) : [];

  const parsed = createPostSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title") || undefined,
    body: formData.get("body") || undefined,
    visibility: formData.get("visibility"),
    minTierId: formData.get("minTierId") || undefined,
    isPpv: formData.get("isPpv") === "true",
    ppvPrice: formData.get("ppvPrice") || undefined,
  });

  if (!parsed.success) {
    return { error: "入力内容を確認してください" };
  }

  await createPost({
    creatorId: creator.id,
    ...parsed.data,
    mediaUrls,
  });

  redirect("/creator/posts");
}

export async function deletePostAction(postId: string) {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) return { error: "クリエイター登録が必要です" };

  await deletePost(postId);
  revalidatePath("/creator/posts");
  return { success: true };
}

export async function toggleLikeAction(postId: string) {
  const user = await requireAuth();
  return toggleLike(postId, user.id);
}

export async function addCommentAction(postId: string, body: string) {
  const user = await requireAuth();
  if (!body.trim()) return { error: "コメントを入力してください" };
  const comment = await addComment(postId, user.id, body);
  revalidatePath(`/posts/${postId}`);
  return { success: true, comment };
}
