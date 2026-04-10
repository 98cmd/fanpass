import { NextRequest } from "next/server";
import { constructEvent } from "@/lib/stripe/webhooks";

// Webhook冪等性: 処理済みイベントIDを短期キャッシュ（プロセス内メモリ）
// 本番ではRedisやDBで管理すべきだが、MVP段階ではインメモリで十分
const processedEvents = new Set<string>();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: { message: "署名がありません" } }, { status: 400 });
  }

  try {
    const event = constructEvent(body, signature);

    // 冪等性チェック: 同一イベントの重複処理を防止
    if (processedEvents.has(event.id)) {
      return Response.json({ received: true, duplicate: true });
    }
    processedEvents.add(event.id);

    // メモリリーク防止: 古いイベントIDを削除（1000件超で先頭を削除）
    if (processedEvents.size > 1000) {
      const first = processedEvents.values().next().value;
      if (first) processedEvents.delete(first);
    }

    switch (event.type) {
      case "checkout.session.completed":
        // TODO: サブスク開始 → subscriptions テーブルに挿入 + transactions 記録
        break;
      case "invoice.paid":
        // TODO: サブスク更新 → current_period_start/end 更新 + transactions 記録
        break;
      case "invoice.payment_failed":
        // TODO: 支払い失敗 → status を past_due に更新 + 通知送信
        break;
      case "payment_intent.succeeded":
        // TODO: 単発決済成功（PPV、DM）→ コンテンツアンロック + transactions 記録
        break;
      case "customer.subscription.deleted":
        // TODO: サブスク解約 → status を canceled に更新 + 通知送信
        break;
      case "customer.subscription.updated":
        // TODO: サブスク変更 → ティア変更の反映
        break;
      default:
        // 未対応のイベントは無視
        break;
    }

    return Response.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook処理に失敗";
    console.error("Stripe Webhook error:", message);
    return Response.json({ error: { message } }, { status: 400 });
  }
}
