import type { Metadata } from "next";
import { SITE } from "./data";

export function meta(o: { title: string; description: string; path: string; image?: string }): Metadata {
  const url = SITE.url + o.path;
  const img = SITE.url + (o.image || "/img/og.jpg");
  return {
    title: o.title,
    description: o.description,
    alternates: { canonical: url },
    openGraph: { title: o.title, description: o.description, url, siteName: SITE.name, type: "website", images: [{ url: img, width: 1200, height: 630 }], locale: "en_IN" },
    twitter: { card: "summary_large_image", title: o.title, description: o.description, images: [img] },
  };
}

export const ld = (o: object) => ({ __html: JSON.stringify(o) });

export const crumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: SITE.url + it.path })),
});
