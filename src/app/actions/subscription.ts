"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth/session";
import { getStripe } from "@/lib/stripe/client";
import { getSupabaseAdmin } from "@/db";

export async function cancelSubscriptionAction(subscriptionId: string) {
  const user = await requireAuth();
  const sb = getSupabaseAdmin();

  // 本人のサブスクか確認
  const { data: sub } = await sb
    .from("subscriptions")
    .select("*")
    .eq("id", subscriptionId)
    .eq("fan_id", user.id)
    .single();

  if (!sub) return { error: "サブスクリプションが見つかりません" };
  if (sub.status === "canceled") return { error: "既に解約されています" };

  try {
    // Stripeサブスク解約（期間末で終了）
    if (sub.stripe_subscription_id) {
      const stripe = getStripe();
      await stripe.subscriptions.update(sub.stripe_subscription_id, {
        cancel_at_period_end: true,
      });
    }

    await sb
      .from("subscriptions")
      .update({ status: "canceled", canceled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", subscriptionId);

    revalidatePath("/subscriptions");
    return { success: true };
  } catch (e) {
    console.error("cancelSubscription failed:", e);
    return { error: "解約処理に失敗しました" };
  }
}
