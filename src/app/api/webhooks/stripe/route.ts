import { NextRequest } from "next/server";
import { constructEvent } from "@/lib/stripe/webhooks";
import { calculatePlatformFee } from "@/lib/stripe/client";
import { getSupabaseAdmin } from "@/db";

const processedEvents = new Set<string>();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: { message: "署名がありません" } }, { status: 400 });
  }

  try {
    const event = constructEvent(body, signature);

    if (processedEvents.has(event.id)) {
      return Response.json({ received: true, duplicate: true });
    }
    processedEvents.add(event.id);
    if (processedEvents.size > 1000) {
      const first = processedEvents.values().next().value;
      if (first) processedEvents.delete(first);
    }

    const sb = getSupabaseAdmin();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        if (session.mode === "subscription" && session.metadata) {
          const { fanpass_fan_id, fanpass_creator_id, fanpass_tier_id } = session.metadata;
          if (fanpass_fan_id && fanpass_creator_id && fanpass_tier_id) {
            await sb.from("subscriptions").upsert({
              fan_id: fanpass_fan_id,
              creator_id: fanpass_creator_id,
              tier_id: fanpass_tier_id,
              stripe_subscription_id: session.subscription,
              status: "active",
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            }, { onConflict: "fan_id,creator_id" });
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as any;
        if (invoice.subscription_details?.metadata) {
          const meta = invoice.subscription_details.metadata;
          const amount = invoice.amount_paid;
          const fee = calculatePlatformFee(amount);
          await sb.from("transactions").upsert({
            creator_id: meta.fanpass_creator_id,
            fan_id: meta.fanpass_fan_id,
            type: "subscription",
            amount,
            platform_fee: fee,
            creator_revenue: amount - fee,
            stripe_id: invoice.id,
            status: "completed",
          }, { onConflict: "stripe_id", ignoreDuplicates: true });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          await sb.from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", invoice.subscription);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        await sb.from("subscriptions")
          .update({ status: "canceled", canceled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const updates: any = { updated_at: new Date().toISOString() };
        if (sub.current_period_start) updates.current_period_start = new Date(sub.current_period_start * 1000).toISOString();
        if (sub.current_period_end) updates.current_period_end = new Date(sub.current_period_end * 1000).toISOString();
        if (sub.status === "active" || sub.status === "past_due") updates.status = sub.status;
        await sb.from("subscriptions").update(updates).eq("stripe_subscription_id", sub.id);
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as any;
        const meta = pi.metadata;
        if (meta?.fanpass_type === "ppv" || meta?.fanpass_type === "dm") {
          const amount = pi.amount;
          const fee = calculatePlatformFee(amount);
          await sb.from("transactions").upsert({
            creator_id: meta.fanpass_creator_id,
            fan_id: meta.fanpass_fan_id,
            type: meta.fanpass_type,
            amount,
            platform_fee: fee,
            creator_revenue: amount - fee,
            stripe_id: pi.id,
            status: "completed",
          }, { onConflict: "stripe_id", ignoreDuplicates: true });

          if (meta.fanpass_type === "ppv" && meta.fanpass_post_id) {
            await sb.from("ppv_purchases").upsert({
              post_id: meta.fanpass_post_id,
              fan_id: meta.fanpass_fan_id,
              price: amount,
              stripe_payment_intent_id: pi.id,
            }, { ignoreDuplicates: true });
          }
        }
        break;
      }

      default:
        break;
    }

    return Response.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook処理に失敗";
    console.error("Stripe Webhook error:", message);
    return Response.json({ error: { message } }, { status: 400 });
  }
}
