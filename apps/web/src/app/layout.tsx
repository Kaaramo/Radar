import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "RADAR : Veille concurrentielle",
    template: "%s | RADAR",
  },
  description:
    "Vos concurrents bougent. Radar vous le dit avant tout le monde. Outil de veille concurrentielle propulsé par un agent IA autonome (OpenClaw), méthodologie M244 intégrée.",
  applicationName: "RADAR",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#051C2C",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-navy text-bone min-h-dvh font-sans">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
