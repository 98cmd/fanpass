import { NextRequest } from "next/server";
import { constructEvent } from "@/lib/stripe/webhooks";
import { calculatePlatformFee } from "@/lib/stripe/client";
import { getDb } from "@/db";
import { subscriptions, transactions } from "@/db/schema";
import { eq } from "drizzle-orm";

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

    const db = getDb();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        if (session.mode === "subscription" && session.metadata) {
          const { fanpass_fan_id, fanpass_creator_id, fanpass_tier_id } = session.metadata;
          if (fanpass_fan_id && fanpass_creator_id && fanpass_tier_id) {
            await db.insert(subscriptions).values({
              fanId: fanpass_fan_id,
              creatorId: fanpass_creator_id,
              tierId: fanpass_tier_id,
              stripeSubscriptionId: session.subscription,
              status: "active",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            }).onConflictDoUpdate({
              target: [subscriptions.fanId, subscriptions.creatorId],
              set: {
                tierId: fanpass_tier_id,
                stripeSubscriptionId: session.subscription,
                status: "active",
                updatedAt: new Date(),
              },
            });
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

          // トランザクション記録（冪等性: stripe_idのUNIQUE制約）
          try {
            await db.insert(transactions).values({
              creatorId: meta.fanpass_creator_id,
              fanId: meta.fanpass_fan_id,
              type: "subscription",
              amount,
              platformFee: fee,
              creatorRevenue: amount - fee,
              stripeId: invoice.id,
              status: "completed",
            });
          } catch (e: any) {
            // UNIQUE制約違反 = 既に処理済み
            if (e?.code !== "23505") throw e;
          }
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any;
        if (invoice.subscription) {
          await db
            .update(subscriptions)
            .set({ status: "past_due", updatedAt: new Date() })
            .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as any;
        await db
          .update(subscriptions)
          .set({
            status: "canceled",
            canceledAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as any;
        const updates: any = { updatedAt: new Date() };
        if (sub.current_period_start) {
          updates.currentPeriodStart = new Date(sub.current_period_start * 1000);
        }
        if (sub.current_period_end) {
          updates.currentPeriodEnd = new Date(sub.current_period_end * 1000);
        }
        if (sub.status === "active" || sub.status === "past_due") {
          updates.status = sub.status;
        }
        await db
          .update(subscriptions)
          .set(updates)
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
        break;
      }

      case "payment_intent.succeeded": {
        const pi = event.data.object as any;
        const meta = pi.metadata;
        if (meta?.fanpass_type === "ppv" || meta?.fanpass_type === "dm") {
          const amount = pi.amount;
          const fee = calculatePlatformFee(amount);
          try {
            await db.insert(transactions).values({
              creatorId: meta.fanpass_creator_id,
              fanId: meta.fanpass_fan_id,
              type: meta.fanpass_type,
              amount,
              platformFee: fee,
              creatorRevenue: amount - fee,
              stripeId: pi.id,
              status: "completed",
            });
          } catch (e: any) {
            if (e?.code !== "23505") throw e;
          }

          // PPVの場合、購入記録を作成
          if (meta.fanpass_type === "ppv" && meta.fanpass_post_id) {
            const { ppvPurchases } = await import("@/db/schema");
            try {
              await db.insert(ppvPurchases).values({
                postId: meta.fanpass_post_id,
                fanId: meta.fanpass_fan_id,
                price: amount,
                stripePaymentIntentId: pi.id,
              });
            } catch (e: any) {
              if (e?.code !== "23505") throw e;
            }
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
