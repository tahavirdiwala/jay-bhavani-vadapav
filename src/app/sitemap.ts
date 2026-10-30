import type { MetadataRoute } from "next";
import { MENU, SITE } from "@/lib/data";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "about", "menu", "store-locator", "franchise", "catering", "gallery", "career", "contact-us"];
  return [
    ...pages.map((p) => ({ url: `${SITE.url}/${p ? p + "/" : ""}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...MENU.map((c) => ({ url: `${SITE.url}/menu/${c.slug}/`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
