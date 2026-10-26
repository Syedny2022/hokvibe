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
  metadataBase: new URL("https://hokvibe.com"),
  title: { default: "Hokvibe | AI Social Content Studio", template: "%s | Hokvibe" },
  description:
    "Hokvibe turns raw ideas into structured social posts for solo founders, creators, and small brands.",
  verification: {
    google: "g2vEEcvoKa_Rmp7fjKCJa6NofsdQJmqNiQD7e0siw_c",
    other: {
      "msvalidate.01": "19512FA3B41422414D0154AB43D3BA4A",
    },
  },
  openGraph: {
    title: "Hokvibe | AI Social Content Studio",
    description: "Turn ideas into editable social drafts.",
    url: "https://hokvibe.com",
    siteName: "Hokvibe",
    type: "website",
  },
  twitter: { card: "summary", title: "Hokvibe | AI Social Content Studio", description: "Turn ideas into editable social drafts." },
};

export default function RootLayout({ children }) {
  const theme = config?.theme || "slate-indigo";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://hokvibe.com/#organization",
        name: "Hokvibe",
        url: "https://hokvibe.com",
      },
      {
        "@type": "WebSite",
        "@id": "https://hokvibe.com/#website",
        name: "Hokvibe",
        url: "https://hokvibe.com",
        publisher: { "@id": "https://hokvibe.com/#organization" },
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
        mainEntityOfPage: { "@id": "https://hokvibe.com/#website" },
      },
    ],
  };

  return (
    <html lang="en" className="h-full w-full" data-theme={theme}>
      <head>
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
