import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
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

const dancingScript = Dancing_Script({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: ["700"],
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
  metadataBase: new URL("https://ayman.dev"),
  openGraph: {
    title: "Ayman · CS Student & Competitive Programmer",
    description:
      "Final-year CS undergraduate · Competitive programmer · Hackathon winner · Full-stack builder",
    type: "website",
    siteName: "Ayman · Portfolio",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Ayman — Computer Science Student & Competitive Programmer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayman · Portfolio",
    description: "Final-year CS undergraduate · Competitive programmer · Hackathon winner",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
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
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
