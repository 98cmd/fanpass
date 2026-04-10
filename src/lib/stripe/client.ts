import Stripe from "stripe";

// 遅延初期化（ビルド時にAPIキーが無くてもエラーにしない）
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-03-25.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// プラットフォーム手数料（15%）
export const PLATFORM_FEE_PERCENT = 15;

// 手数料計算（円）
export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * (PLATFORM_FEE_PERCENT / 100));
}
