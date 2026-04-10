"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export function SettingsProfileForm({ displayName, email }: { displayName: string; email: string }) {
  const [name, setName] = useState(displayName);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setLoading(true);
    setMessage("");
    try {
      const { updateUser } = await import("@/db/queries/users");
      // Server Actionとして呼べないのでfetchで代替
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name }),
      });
      if (res.ok) {
        setMessage("保存しました");
      } else {
        setMessage("保存に失敗しました");
      }
    } catch {
      setMessage("保存に失敗しました");
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />プロフィール</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          id="displayName"
          label="表示名"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <label className="text-sm font-medium text-text-primary">メールアドレス</label>
          <p className="text-sm text-text-muted mt-1">{email}</p>
        </div>
        {message && (
          <p className={`text-sm ${message.includes("失敗") ? "text-error" : "text-success"}`}>{message}</p>
        )}
        <Button onClick={handleSave} disabled={loading} size="sm">
          {loading ? "保存中..." : "保存"}
        </Button>
      </CardContent>
    </Card>
  );
}
