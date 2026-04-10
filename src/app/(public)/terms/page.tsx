import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "利用規約" };

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />戻る
      </Link>

      <h1 className="text-2xl font-bold text-text-primary mb-6">利用規約</h1>

      <div className="prose prose-sm text-text-secondary space-y-6">
        <section>
          <h2 className="text-lg font-bold text-text-primary">第1条（適用）</h2>
          <p>本規約は、FANPASS（以下「本サービス」）の利用に関する条件を定めるものです。登録ユーザーは本規約に同意の上、本サービスを利用するものとします。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary">第2条（サービス内容）</h2>
          <p>本サービスは、クリエイターがファン向けに有料コンテンツを配信し、月額サブスクリプション、単品販売、有料メッセージ等を通じて収益化するためのプラットフォームです。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary">第3条（手数料）</h2>
          <p>本サービスは、クリエイターの売上に対して15%のプラットフォーム手数料を徴収します。残りの85%がクリエイターの収益となります。決済手数料はStripe社の規定に従います。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary">第4条（禁止事項）</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>法令または公序良俗に反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>他のユーザーの個人情報を不正に収集する行為</li>
            <li>本サービスのサーバーまたはネットワークに過度な負荷をかける行為</li>
            <li>アダルトコンテンツの配信</li>
            <li>コンテンツの無断転載・再配布</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary">第5条（退会）</h2>
          <p>ユーザーは、設定画面から退会手続きを行うことで、いつでも本サービスの利用を終了できます。退会時に有効なサブスクリプションは、残りの期間が終了するまで有効です。</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary">第6条（免責事項）</h2>
          <p>本サービスは、クリエイターが提供するコンテンツの品質、合法性について責任を負いません。ユーザー間のトラブルについて、本サービスは仲介義務を負わないものとします。</p>
        </section>

        <p className="text-xs text-text-muted mt-8">最終更新日: 2026年4月11日</p>
      </div>
    </div>
  );
}
