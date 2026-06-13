import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VibeScapes — Create Atmospheric Visual Stories",
  description:
    "VibeScapes is a visual storytelling platform that enables anyone to create atmospheric, vibe-heavy comic books and graphic novels using intuitive AI-assisted tools and aesthetic templates.",
  keywords: [
    "comic book creator",
    "graphic novel maker",
    "AI illustration",
    "visual storytelling",
    "comic maker",
  ],
  openGraph: {
    title: "VibeScapes — Create Atmospheric Visual Stories",
    description:
      "Create vibe-heavy comic books and graphic novels with AI-assisted tools. No illustration skills needed.",
    type: "website",
    siteName: "VibeScapes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="min-h-dvh bg-black font-sans text-white">
        {children}
      </body>
    </html>
  );
}