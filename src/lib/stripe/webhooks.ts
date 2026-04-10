import Stripe from "stripe";
import { getStripe } from "./client";

// Stripe Webhook署名検証
export function constructEvent(
  body: string,
  signature: string
): Stripe.Event {
  return getStripe().webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
