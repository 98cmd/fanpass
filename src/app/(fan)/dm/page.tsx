import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const conversations = [
  { name: "Mizuki", lastMessage: "ありがとうございます! 次のライブ配信もぜひ...", time: "2時間前", unread: true },
  { name: "Yuto Fitness", lastMessage: "トレーニングメニュー送りますね!", time: "1日前", unread: false },
];

export default function DmPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">DM</h1>
      <div className="space-y-2">
        {conversations.map((conv, i) => (
          <Card key={i} className="cursor-pointer hover:border-primary/20 transition-colors">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {conv.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-text-primary">{conv.name}</p>
                  <span className="text-xs text-text-muted">{conv.time}</span>
                </div>
                <p className="text-sm text-text-secondary truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
