import type { Metadata } from "next";
import { Archivo, Newsreader, Geist_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-newsreader",
  axes: ["opsz"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hamidettefagh.com"),
  title: "Hamid Ettefagh | Forward Deployed AI Engineer",
  description:
    "Forward Deployed AI Engineer building production agent systems for the enterprise. Multi-agent platforms, RAG, and AI governance at Fortune 500 scale.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${newsreader.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
