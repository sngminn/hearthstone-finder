import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "하스스톤 카드 리스트",
  description: "하스스톤 카드 리스트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
