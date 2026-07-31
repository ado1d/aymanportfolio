import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ayman · Computer Science Student & Competitive Programmer",
  description:
    "Portfolio of Ayman — a final-year CS undergraduate, competitive programmer, hackathon winner, and full-stack builder. Explore my projects, contests, certificates, and achievements.",
  keywords: [
    "Ayman",
    "portfolio",
    "competitive programming",
    "Codeforces",
    "hackathon",
    "computer science",
    "full-stack developer",
    "Bangladesh",
  ],
  authors: [{ name: "Ayman" }],
  openGraph: {
    title: "Ayman · CS Student & Competitive Programmer",
    description:
      "Final-year CS undergraduate · Competitive programmer · Hackathon winner · Full-stack builder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayman · Portfolio",
    description: "Final-year CS undergraduate · Competitive programmer · Hackathon winner",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
