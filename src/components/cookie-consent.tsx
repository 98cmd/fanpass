"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("fanpass-cookie-consent");
    if (!consent) setShow(true);
  }, []);

  function accept() {
    localStorage.setItem("fanpass-cookie-consent", "accepted");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto bg-surface border border-border rounded-xl shadow-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-text-secondary flex-1">
          当サイトではサービス提供のためにCookieを使用しています。詳細は
          <Link href="/privacy" className="text-primary hover:underline mx-1">プライバシーポリシー</Link>
          をご覧ください。
        </p>
        <Button size="sm" onClick={accept} className="shrink-0">
          同意する
        </Button>
      </div>
    </div>
  );
}
