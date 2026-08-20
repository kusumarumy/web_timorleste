import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import './globals.css';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Ainaro-Belulik GeoLandscape",
  description: "Land · Water · Agriculture · Terrain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${display.variable}`}>
      <body className="h-screen overflow-hidden bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
