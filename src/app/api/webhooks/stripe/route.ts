import { NextRequest } from "next/server";
import { constructEvent } from "@/lib/stripe/webhooks";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "署名がありません" }, { status: 400 });
  }

  try {
    const event = constructEvent(body, signature);

    switch (event.type) {
      case "checkout.session.completed":
        // サブスク開始処理
        break;
      case "invoice.paid":
        // サブスク更新処理
        break;
      case "invoice.payment_failed":
        // 支払い失敗処理
        break;
      case "payment_intent.succeeded":
        // 単発決済成功（PPV、DM）
        break;
      case "customer.subscription.deleted":
        // サブスク解約処理
        break;
      default:
        break;
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return Response.json({ error: "Webhook処理に失敗" }, { status: 400 });
  }
}
