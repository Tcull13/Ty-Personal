import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boston Bruins Edits | #1 Bruins Edits on TikTok & Instagram",
  description:
    "The #1 Boston Bruins edits page on TikTok and Instagram. Premium hockey edits, highlights, and hype content. Available for brand partnerships, custom edits, and collaborations.",
  keywords: [
    "Boston Bruins",
    "Bruins edits",
    "hockey edits",
    "TikTok",
    "NHL",
    "sports edits",
  ],
  openGraph: {
    title: "Boston Bruins Edits | #1 Bruins Edits on TikTok & Instagram",
    description:
      "Premium hockey edits, highlights, and hype content. Available for brand partnerships and collaborations.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
