import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Weather & News Bento Dashboard",
  description:
    "Premium Apple-inspired weather and news dashboard built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
