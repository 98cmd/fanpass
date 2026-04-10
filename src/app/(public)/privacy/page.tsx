import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "プライバシーポリシー" };

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />戻る
      </Link>

      <h1 className="text-2xl font-bold text-text-primary mb-6">プライバシーポリシー</h1>

      <div className="prose prose-sm text-text-secondary space-y-6">
        <section>
          <h2 className="text-lg font-bold text-text-primary">収集する情報</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>メールアドレス、表示名（アカウント登録時）</li>
            <li>決済情報（Stripe社が安全に管理。当社は直接保持しません）</li>
            <li>投稿コンテンツ、メッセージ（サービス提供に必要）</li>
            <li>アクセスログ、利用統計（サービス改善のため）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary">情報の利用目的</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>サービスの提供・運営</li>
            <li>決済処理・収益の送金</li>
            <li>お問い合わせへの対応</li>
            <li>サービス改善のための分析</li>
            <li>利用規約違反の調査・対応</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary">第三者への提供</h2>
          <p>以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>決済処理のためStripe社に提供する場合</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary">データの保管</h2>
          <p>データはSupabase（AWS東京リージョン）に保管されます。通信はTLS 1.3で暗号化されます。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary">お問い合わせ</h2>
          <p>個人情報に関するお問い合わせは、サービス内の問い合わせフォームよりご連絡ください。</p>
        </section>

        <p className="text-xs text-text-muted mt-8">最終更新日: 2026年4月11日</p>
      </div>
    </div>
  );
}
