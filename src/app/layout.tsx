import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FANPASS - 推しの世界への入場券",
    template: "%s | FANPASS",
  },
  description:
    "インフルエンサーとファンを繋ぐファンクラブプラットフォーム。月額サブスク、有料DM、限定コンテンツで推しを応援しよう。",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6D28D9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700&family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
