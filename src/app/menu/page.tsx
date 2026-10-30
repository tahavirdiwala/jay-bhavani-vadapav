import Link from "next/link";
import { MENU, MENU_COUNT } from "@/lib/data";
import { meta, ld, crumbLd } from "@/lib/seo";
import PageHead from "@/components/PageHead";

export const metadata = meta({ title: "Menu — Vadapav, Dabeli, Pav Bhaji, Sandwiches & More", description: `Explore the full Jay Bhavani menu: ${MENU.length} categories and ${MENU_COUNT}+ items — vadapav, dabeli, pav bhaji, pulav, Chinese, South Indian, sandwiches, shakes, juices, coffee and desserts.`, path: "/menu/", image: "/img/food-menu/vadapav.webp" });

export default function MenuPage() {
  const list = { "@context": "https://schema.org", "@type": "ItemList", name: "Jay Bhavani Vadapav menu categories", itemListElement: MENU.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, url: `https://jaybhavanivadapav.com/menu/${c.slug}/` })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld([crumbLd([{ name: "Home", path: "/" }, { name: "Menu", path: "/menu/" }]), list])} />
      <PageHead eyebrow="Our Menu" title="Taste the" accent="Variety" ghost="Menu" crumbs={[{ name: "Menu" }]}>{MENU.length} categories. {MENU_COUNT}+ crispy, spicy, fresh ways to fall in love.</PageHead>
      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="cats" data-stagger>
            {MENU.map((c) => (
              <Link key={c.slug} href={`/menu/${c.slug}/`} className="cat" data-cursor="Open" data-tilt>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.items[0].img} alt={`${c.label} at Jay Bhavani`} loading="lazy" width={300} height={300} />
                <h3>{c.label}</h3><span>{c.items.length} items</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
