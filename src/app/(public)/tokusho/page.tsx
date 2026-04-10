import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "特定商取引法に基づく表記" };

export default function TokushoPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6">
        <ArrowLeft className="w-4 h-4" />戻る
      </Link>

      <h1 className="text-2xl font-bold text-text-primary mb-6">特定商取引法に基づく表記</h1>

      <div className="space-y-4">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-border">
            <tr><td className="py-3 font-medium text-text-primary w-1/3">販売事業者</td><td className="py-3 text-text-secondary">株式会社COMON CENTER</td></tr>
            <tr><td className="py-3 font-medium text-text-primary">代表者</td><td className="py-3 text-text-secondary">桑原 将一</td></tr>
            <tr><td className="py-3 font-medium text-text-primary">所在地</td><td className="py-3 text-text-secondary">お問い合わせいただいた方に開示いたします</td></tr>
            <tr><td className="py-3 font-medium text-text-primary">連絡先</td><td className="py-3 text-text-secondary">サービス内のお問い合わせフォームよりご連絡ください</td></tr>
            <tr><td className="py-3 font-medium text-text-primary">販売価格</td><td className="py-3 text-text-secondary">各クリエイターが設定する月額料金、単品販売価格に基づきます</td></tr>
            <tr><td className="py-3 font-medium text-text-primary">支払方法</td><td className="py-3 text-text-secondary">クレジットカード（Stripe経由）</td></tr>
            <tr><td className="py-3 font-medium text-text-primary">支払時期</td><td className="py-3 text-text-secondary">サブスクリプション: 申込時に初回課金、以降毎月同日に自動課金<br/>単品購入: 購入時に即時課金</td></tr>
            <tr><td className="py-3 font-medium text-text-primary">商品の引渡し時期</td><td className="py-3 text-text-secondary">決済完了後即時にデジタルコンテンツへのアクセスが可能となります</td></tr>
            <tr><td className="py-3 font-medium text-text-primary">返品・キャンセル</td><td className="py-3 text-text-secondary">デジタルコンテンツの性質上、購入後の返品・返金は原則として承っておりません。サブスクリプションは次回更新日の前日までにキャンセルが可能です。</td></tr>
            <tr><td className="py-3 font-medium text-text-primary">動作環境</td><td className="py-3 text-text-secondary">最新版のChrome、Safari、Firefox、Edgeに対応</td></tr>
          </tbody>
        </table>

        <p className="text-xs text-text-muted mt-8">最終更新日: 2026年4月11日</p>
      </div>
    </div>
  );
}
