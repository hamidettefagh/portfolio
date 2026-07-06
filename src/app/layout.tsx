import type { Metadata } from "next";
import { Archivo, Newsreader, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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

const SITE_TITLE = "Hamid Ettefagh | Forward Deployed AI Engineer";
const SITE_DESCRIPTION =
  "Forward Deployed AI Engineer building production agent systems for the enterprise. Multi-agent platforms, RAG, and AI governance at Fortune 500 scale.";

export const metadata: Metadata = {
  metadataBase: new URL("https://hamidettefagh.com"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Hamid Ettefagh",
    url: "https://hamidettefagh.com",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hamid Ettefagh",
  url: "https://hamidettefagh.com",
  jobTitle: "Senior Forward Deployed Engineer, AI",
  worksFor: { "@type": "Organization", name: "Salesforce" },
  sameAs: [
    "https://www.linkedin.com/in/hamidettefagh",
    "https://github.com/hamidettefagh",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${newsreader.variable} ${geistMono.variable}`}
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
