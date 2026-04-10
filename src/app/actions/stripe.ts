"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/session";
import { getStripe, calculatePlatformFee, PLATFORM_FEE_PERCENT } from "@/lib/stripe/client";
import { getCreatorByUserId, updateCreatorProfile } from "@/db/queries/creators";
import { getCreatorTiers } from "@/db/queries/creators";

// S2: Stripe Connect オンボーディング
export async function createStripeConnectAccount() {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator) return { error: "クリエイター登録が必要です" };

  const stripe = getStripe();

  // 既にアカウントがあればオンボーディングリンクを返す
  if (creator.stripeAccountId) {
    const accountLink = await stripe.accountLinks.create({
      account: creator.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings?stripe=success`,
      type: "account_onboarding",
    });
    redirect(accountLink.url);
  }

  // 新規Connect Expressアカウント作成
  const account = await stripe.accounts.create({
    type: "express",
    country: "JP",
    email: user.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: "individual",
    metadata: {
      fanpass_creator_id: creator.id,
      fanpass_user_id: user.id,
    },
  });

  // DB保存
  await updateCreatorProfile(creator.id, {
    stripeAccountId: account.id,
  });

  // オンボーディングリンク
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/creator/settings?stripe=success`,
    type: "account_onboarding",
  });

  redirect(accountLink.url);
}

// Stripe Connect ダッシュボードリンク
export async function getStripeDashboardLink() {
  const user = await requireAuth();
  const creator = await getCreatorByUserId(user.id);
  if (!creator?.stripeAccountId) return { error: "Stripe未連携" };

  const stripe = getStripe();
  const loginLink = await stripe.accounts.createLoginLink(creator.stripeAccountId);
  return { url: loginLink.url };
}

// S3: サブスクリプション Checkout Session 作成
export async function createSubscriptionCheckout(tierId: string, creatorSlug: string) {
  const user = await requireAuth();
  const stripe = getStripe();

  // ティア情報取得（creatorIdからティア一覧を取得してtierId一致を探す）
  const { getCreatorBySlug } = await import("@/db/queries/creators");
  const creator = await getCreatorBySlug(creatorSlug);
  if (!creator || !creator.stripeAccountId) {
    return { error: "このクリエイターは決済を受け付けていません" };
  }

  const allTiers = await getCreatorTiers(creator.id);
  const tier = allTiers.find((t) => t.id === tierId);
  if (!tier) return { error: "ティアが見つかりません" };

  // Stripe Price が未作成の場合は作成
  let stripePriceId = tier.stripePriceId;
  if (!stripePriceId) {
    const product = await stripe.products.create(
      {
        name: `${creator.displayName} - ${tier.name}`,
        metadata: { fanpass_tier_id: tier.id, fanpass_creator_id: creator.id },
      },
      { stripeAccount: creator.stripeAccountId }
    );

    const price = await stripe.prices.create(
      {
        product: product.id,
        unit_amount: tier.price,
        currency: "jpy",
        recurring: { interval: "month" },
      },
      { stripeAccount: creator.stripeAccountId }
    );

    stripePriceId = price.id;

    // DB更新
    const { updateTier } = await import("@/db/queries/tiers");
    await updateTier(tier.id, { stripePriceId });
  }

  // Checkout Session作成（destination charges）
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: stripePriceId, quantity: 1 }],
    subscription_data: {
      application_fee_percent: PLATFORM_FEE_PERCENT,
      transfer_data: { destination: creator.stripeAccountId },
      metadata: {
        fanpass_fan_id: user.id,
        fanpass_creator_id: creator.id,
        fanpass_tier_id: tier.id,
      },
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${creatorSlug}?subscribed=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${creatorSlug}`,
    metadata: {
      fanpass_fan_id: user.id,
      fanpass_creator_id: creator.id,
      fanpass_tier_id: tier.id,
    },
  });

  if (!session.url) return { error: "Checkout Session の作成に失敗" };
  redirect(session.url);
}

// 単発決済（PPV / 有料DM）
export async function createOneTimePayment(data: {
  amount: number;
  creatorStripeAccountId: string;
  description: string;
  metadata: Record<string, string>;
}) {
  const stripe = getStripe();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amount,
    currency: "jpy",
    application_fee_amount: calculatePlatformFee(data.amount),
    transfer_data: { destination: data.creatorStripeAccountId },
    metadata: data.metadata,
    description: data.description,
    automatic_payment_methods: { enabled: true },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}
