import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrgShift Local - 地域情報ワンストップポータル",
  description: "行政・商店・団体・市民の情報をワンストップで提供",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
