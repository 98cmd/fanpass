import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Ticket, LockKeyhole, Check } from "lucide-react";

const feeComparison = [
  { name: "FANPASS", fee: "15%", note: "フラット", highlight: true },
  { name: "Patreon", fee: "10%", note: "+ Apple税 30%", highlight: false },
  { name: "OnlyFans", fee: "20%", note: "", highlight: false },
  { name: "Fanicon", fee: "50%", note: "推定最大", highlight: false },
];

const steps = [
  { num: "01", icon: Search, title: "お気に入りを見つける", desc: "SNSでフォローしているクリエイターを検索。隠された世界への扉を探しましょう。", color: "bg-text-primary text-background" },
  { num: "02", icon: Ticket, title: "プランを選択する", desc: "ライトプランからVIP PASSまで。あなたに合った距離感を選びます。", color: "bg-primary text-white" },
  { num: "03", icon: LockKeyhole, title: "限定コンテンツを解禁", desc: "未公開のオフショット、限定ライブ、シークレットチャット。特別な世界を堪能してください。", color: "bg-secondary text-white" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ナビゲーション */}
      <nav className="fixed w-full top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display font-black tracking-tighter text-xl text-text-primary">FANPASS</span>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <a href="#how" className="hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">ログイン</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">始める</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 min-h-[85vh] flex items-center overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
          {/* 左: コピー */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-full w-max mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-display text-xs font-semibold tracking-wide text-text-muted uppercase">A New Era for Creators</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-text-primary tracking-tight leading-[1.05] mb-6">
              推しの世界への
              <br />
              <span className="text-primary">入場券</span>
            </h1>

            <p className="text-lg text-text-secondary font-medium leading-relaxed max-w-lg mb-10">
              月額サブスク、有料DM、限定コンテンツ。
              インフルエンサーとファンを繋ぐプレミアムプラットフォーム。
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base px-8 py-4 h-auto" asChild>
                <Link href="/signup">
                  ファンとして始める
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="text-base px-8 py-4 h-auto border-2 border-text-primary text-text-primary hover:bg-text-primary hover:text-background" asChild>
                <Link href="/creator/register">クリエイターとして始める</Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-bold text-primary">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium text-text-muted">
                <span className="text-text-primary font-bold">10,000+</span> creators & fans
              </p>
            </div>
          </div>

          {/* 右: フローティングパスカード */}
          <div className="hidden lg:flex relative items-center justify-center h-[500px]">
            <div className="relative w-[340px] h-[460px]">
              {/* シルバーカード */}
              <div className="absolute bottom-0 left-[-30px] w-[240px] aspect-[3/4] bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] border border-white/50 -rotate-12 hover:-rotate-6 transition-transform duration-500 card-shimmer shimmer-delay-1 z-10">
                <div className="flex justify-between items-start">
                  <Ticket className="w-6 h-6 text-slate-400" />
                  <span className="font-display font-bold text-slate-400 text-xs tracking-widest uppercase">Silver</span>
                </div>
                <div>
                  <p className="font-display font-black text-lg text-slate-800">STANDARD PASS</p>
                  <p className="font-display text-[10px] text-slate-500 tracking-widest mt-1">0000 1234 5678 9012</p>
                </div>
              </div>

              {/* ゴールドカード */}
              <div className="absolute bottom-8 right-[-30px] w-[240px] aspect-[3/4] bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 rounded-2xl p-5 flex flex-col justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] border border-amber-300/50 rotate-12 hover:rotate-6 transition-transform duration-500 card-shimmer shimmer-delay-2 z-20">
                <div className="flex justify-between items-start">
                  <Ticket className="w-6 h-6 text-amber-200" />
                  <span className="font-display font-bold text-amber-200 text-xs tracking-widest uppercase">Gold</span>
                </div>
                <div>
                  <p className="font-display font-black text-lg text-white">VIP PASS</p>
                  <p className="font-display text-[10px] text-amber-200 tracking-widest mt-1">0000 9876 5432 1098</p>
                </div>
              </div>

              {/* バイオレットカード（メイン） */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[260px] aspect-[3/4] bg-gradient-to-br from-violet-600 via-violet-700 to-violet-900 rounded-2xl p-5 flex flex-col justify-between shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] border border-violet-500/50 -rotate-2 hover:rotate-0 hover:-translate-y-3 transition-all duration-500 card-shimmer card-shimmer-dark z-30">
                <div className="flex justify-between items-start">
                  <Ticket className="w-6 h-6 text-violet-300" />
                  <span className="font-display font-black text-violet-200 tracking-tighter text-base">FANPASS</span>
                </div>
                <div>
                  <div className="w-12 h-12 rounded-lg bg-violet-600 border border-violet-500 mb-3 flex items-center justify-center text-white font-bold text-lg">Y</div>
                  <p className="font-display font-black text-xl text-white">YUKA HIGASHI</p>
                  <p className="font-display text-[10px] text-violet-300 tracking-widest mt-1">FOUNDING MEMBER</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24 bg-surface border-y border-border">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="font-display text-xs font-bold tracking-[0.2em] text-secondary uppercase mb-3">The Process</p>
            <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight">世界へ入り込む、3つのステップ</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-display text-7xl font-black text-border/50 select-none group-hover:-translate-y-2 transition-transform">{step.num}</span>
                  <div className={`relative z-10 w-16 h-16 ${step.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">{step.title}</h3>
                <p className="text-text-secondary font-medium leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 手数料比較 */}
      <section id="pricing" className="py-24">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary tracking-tight mb-3">クリエイター第一の設計</h2>
            <p className="text-lg text-text-secondary font-medium">圧倒的に低い手数料。ファンからの支援を最大限クリエイターへ還元します。</p>
          </div>

          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-hover">
                  <th className="p-5 font-display text-xs font-bold text-text-muted uppercase tracking-widest">Platform</th>
                  <th className="p-5 font-display text-xs font-bold text-text-muted uppercase tracking-widest">Fee</th>
                </tr>
              </thead>
              <tbody>
                {feeComparison.map((row) => (
                  <tr key={row.name} className={`border-b border-border last:border-0 ${row.highlight ? "bg-primary/5" : "hover:bg-surface-hover"} transition-colors`}>
                    <td className="p-5 relative">
                      {row.highlight && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r" />}
                      <span className={`font-bold text-lg ${row.highlight ? "text-primary" : "text-text-secondary"}`}>{row.name}</span>
                    </td>
                    <td className="p-5">
                      <span className={`font-display font-black text-3xl ${row.highlight ? "text-primary" : "text-text-primary"}`}>{row.fee}</span>
                      {row.note && <span className="text-sm font-medium text-text-muted ml-2">{row.note}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-xs text-text-muted mt-4">* 決済手数料（Stripe）は別途標準レートが適用されます</p>
        </div>
      </section>

      {/* テスティモニアル */}
      <section className="bg-primary py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-white font-bold leading-relaxed mb-6">
            「FANPASSは、最も熱心なフォロワーとの繋がり方を完全に変えてくれました。単なるSNSではなく、私の『世界』そのものです。」
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">Y</div>
            <div className="text-left">
              <p className="text-white font-bold text-sm">Yuka H.</p>
              <p className="text-violet-200 text-xs uppercase tracking-widest">Lifestyle Creator</p>
            </div>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-surface border-t border-border py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <span className="font-display font-black text-3xl text-text-primary block mb-3">FANPASS</span>
              <p className="text-text-muted text-sm max-w-sm leading-relaxed">
                推しの世界への入場券。クリエイターとファンの距離を、もっと近く。
              </p>
            </div>
            <div>
              <h4 className="font-bold text-text-primary mb-3 text-xs uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link href="/signup" className="hover:text-primary transition-colors">ファン向け</Link></li>
                <li><Link href="/creator/register" className="hover:text-primary transition-colors">クリエイター向け</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-text-primary mb-3 text-xs uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2 text-sm text-text-muted">
                <li><Link href="/terms" className="hover:text-primary transition-colors">利用規約</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">プライバシーポリシー</Link></li>
                <li><Link href="/tokusho" className="hover:text-primary transition-colors">特定商取引法</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-border text-center text-xs text-text-muted">
            &copy; 2026 FANPASS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
