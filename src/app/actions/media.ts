"use server";

import { requireAuth } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function uploadMedia(formData: FormData) {
  const user = await requireAuth();
  const file = formData.get("file") as File;

  if (!file) return { error: "ファイルが選択されていません" };

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return { error: "対応していないファイル形式です" };
  }

  if (isImage && file.size > MAX_IMAGE_SIZE) {
    return { error: "画像は10MB以下にしてください" };
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE) {
    return { error: "動画は100MB以下にしてください" };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop();
  const path = `${user.id}/${Date.now()}.${ext}`;
  const bucket = isImage ? "post-images" : "post-videos";

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error);
    return { error: "アップロードに失敗しました" };
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl, path: data.path };
}

export async function uploadAvatar(formData: FormData) {
  const user = await requireAuth();
  const file = formData.get("file") as File;

  if (!file) return { error: "ファイルが選択されていません" };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { error: "JPG、PNG、WebPのみ対応しています" };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "5MB以下にしてください" };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop();
  const path = `${user.id}/avatar.${ext}`;

  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      contentType: file.type,
      upsert: true,
    });

  if (error) return { error: "アップロードに失敗しました" };

  const { data: urlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(data.path);

  return { url: urlData.publicUrl };
}
