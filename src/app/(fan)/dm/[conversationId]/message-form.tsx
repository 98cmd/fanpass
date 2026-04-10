"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { sendDmAction } from "@/app/actions/dm";

export function DmMessageForm({ conversationId }: { conversationId: string }) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || sending) return;
    setSending(true);

    const formData = new FormData();
    formData.set("body", body);
    formData.set("conversationId", conversationId);

    // Server Action経由ではなく直接APIを呼ぶ
    try {
      const { sendMessage } = await import("@/db/queries/dm");
      // Server Actionを使う
      const result = await sendDmAction(formData);
      if (!result.error) {
        setBody("");
        inputRef.current?.focus();
      }
    } catch {}
    setSending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-border bg-surface shrink-0">
      <input
        ref={inputRef}
        type="text"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="メッセージを入力..."
        className="flex-1 h-10 rounded-full border border-border bg-background px-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
        disabled={sending}
      />
      <button
        type="submit"
        disabled={!body.trim() || sending}
        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors shrink-0"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
