import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import config from "@/lib/config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "Hokvibe — AI Social Content Engine for Solo Founders",
  description:
    "Hokvibe turns raw ideas into structured social posts for solo founders, creators, and small brands.",
  keywords:
    "AI social content engine, solo founder content, social post generator, answer engine optimization",
  openGraph: {
    title: "Hokvibe — AI Social Content Engine for Solo Founders",
    description:
      "Turn raw ideas into scheduled posts instantly.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  const theme = config?.theme || "slate-indigo";
  const dateModified = new Date().toISOString();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://hokvibe.com/#organization",
        name: "Hokvibe",
        url: "https://hokvibe.com",
        sameAs: [
          "https://github.com/Syedny2022/hokvibe",
          "https://muapi.ai/apps",
          "https://vercel.com",
          "https://www.cloudflare.com",
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://hokvibe.com/#software",
        name: "Hokvibe",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://hokvibe.com",
        description:
          "Hokvibe turns raw ideas into structured social posts for solo founders, creators, and small brands.",
        creator: { "@id": "https://hokvibe.com/#organization" },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        dateModified,
        sameAs: [
          "https://github.com/Syedny2022/hokvibe",
          "https://muapi.ai/apps",
        ],
      },
    ],
  };

  return (
    <html lang="en" className="h-full w-full" data-theme={theme}>
      <head>
        <link
          rel="icon"
          href="https://newoaks.s3.us-west-1.amazonaws.com/AutoDev/11407/5272b774-1dec-479f-9b03-bb7eeb892b80.jpg"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.className} antialiased min-h-screen bg-bg-page text-primary-text flex flex-col`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
