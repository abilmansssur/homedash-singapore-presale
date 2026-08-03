import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-homedash",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "homedash.ai";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");

  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "HomeDash Singapore | AI Listing Studio Presale",
    description: "Turn property photos into listing videos, agent-avatar tours and approved social campaigns. Join the HomeDash Singapore market pilot.",
    openGraph: {
      title: "HomeDash Singapore | AI Listing Studio Presale",
      description: "One listing. Three ways to win attention.",
      type: "website",
      images: [{ url: "/og.png", width: 1792, height: 896, alt: "HomeDash Singapore AI Listing Studio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "HomeDash Singapore | AI Listing Studio Presale",
      description: "One listing. Three ways to win attention.",
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-SG">
      <body className={`${inter.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
