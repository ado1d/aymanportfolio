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
  title: "Ayman · Software Engineering Student & Competitive Programmer",
  description:
    "Portfolio of Ayman — a final-year Software Engineering undergraduate, competitive programmer, hackathon winner, and full-stack builder. Explore my projects, contests, certificates, and achievements.",
  keywords: [
    "Ayman",
    "portfolio",
    "competitive programming",
    "Codeforces",
    "hackathon",
    "computer science",
    "full-stack developer",
    "Bangladesh",
    "Portfolio Templete"
  ],
  authors: [{ name: "Ayman" }],
  metadataBase: new URL("https://ayman-portfolio-seven.vercel.app"),
  icons: {
    icon: "https://res.cloudinary.com/ne2uunmx/image/upload/v1786283178/portfolio/ok4nr79p7pyqetf6uniw.jpg",
  },
  openGraph: {
    title: "Ayman · Full-stack developer & Competitive Programmer",
    description:
      "Final-year Software Engineering undergraduate · Competitive programmer · Hackathon winner · Full-stack builder",
    type: "website",
    siteName: "Ayman · Portfolio",
    images: [
      {
        url: "https://res.cloudinary.com/ne2uunmx/image/upload/v1786283178/portfolio/ok4nr79p7pyqetf6uniw.jpg",
        width: 1200,
        height: 630,
        alt: "Ayman — Software Engineering Student & Competitive Programmer",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
