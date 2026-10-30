import type { Metadata, Viewport } from "next";
import { DM_Sans, Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";
import { SITE, STORES } from "@/lib/data";
import { ld } from "@/lib/seo";

/* Exactly two families, same pairing as the Aviaura storefront: Libre Baskerville (display) + DM Sans (UI/body) */
const serif = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "Jay Bhavani Vadapav — Indian Street Food, Global Destinations | Since 1998", template: "%s | Jay Bhavani Vadapav" },
  description: "Jay Bhavani Vadapav — Vadapav Bole To Jay Bhavani. 195+ outlets across India, USA, Canada and Australia. Authentic Indian street food since 1998, franchise & catering available.",
  keywords: ["Jay Bhavani Vadapav", "vadapav franchise", "Indian street food", "vada pav near me", "dabeli", "pav bhaji", "Ahmedabad vadapav", "food franchise India"],
  applicationName: SITE.name,
  icons: { icon: "/img/favicon.png", apple: "/img/favicon.png" },
  openGraph: { type: "website", siteName: SITE.name, locale: "en_IN", url: SITE.url, images: [{ url: "/img/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: "#030818", width: "device-width", initialScale: 1 };

const org = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": SITE.url + "/#org", name: SITE.name, url: SITE.url, logo: SITE.url + "/img/logo.png", foundingDate: "1998",
      slogan: SITE.tagline, email: SITE.email, telephone: SITE.phone, sameAs: [SITE.social.facebook, SITE.social.instagram],
      address: { "@type": "PostalAddress", streetAddress: "808, 809, The Capital 2, Science City Road, Sola", addressLocality: "Ahmedabad", postalCode: "380060", addressCountry: "IN" },
      founder: { "@type": "Person", name: "Kishan Singh Rajput", jobTitle: "Managing Director" },
      numberOfEmployees: undefined,
    },
    { "@type": "WebSite", "@id": SITE.url + "/#site", url: SITE.url, name: SITE.name, publisher: { "@id": SITE.url + "/#org" }, inLanguage: "en" },
    ...STORES.slice(0, 0),
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a href="#main" className="sr">Skip to content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={ld(org)} />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
