import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Bolão da Copa 2026",
  description: "Faça palpites da Copa do Mundo 2026 e acompanhe sua pontuação.",
  metadataBase: new URL("https://bolao-copa-rouge.vercel.app"),
  openGraph: {
    title: "Bolão da Copa 2026",
    description: "Participe do bolão, preencha palpites e veja o ranking.",
    url: "https://bolao-copa-rouge.vercel.app",
    siteName: "Bolão 2026",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bolão da Copa 2026",
    description: "Participe do bolão, preencha palpites e veja o ranking.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
