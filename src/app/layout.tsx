import type { Metadata } from "next";
import { Archivo, Newsreader, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReceiptsBar } from "@/components/receipts/ReceiptsToggle";
import "./globals.css";
import "./lab.css";

// Receipts mode, restored before first paint so the tags never pop in. A
// ?receipts=on or ?receipts=off link sets the mode for the visitor too.
const RECEIPTS_SCRIPT = `(function(){try{var d=document.documentElement,k="pf-receipts",q=new URLSearchParams(location.search).get("receipts");if(q==="on"||q==="1")localStorage.setItem(k,"on");else if(q==="off"||q==="0")localStorage.removeItem(k);if(localStorage.getItem(k)==="on")d.dataset.receipts="on"}catch(e){}})();`;

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
  jobTitle: "Distinguished Forward Deployed Engineer",
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
      // The home page's intro script and the receipts script set data
      // attributes on this element before hydration.
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: RECEIPTS_SCRIPT }} />
        {children}
        <ReceiptsBar />
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
