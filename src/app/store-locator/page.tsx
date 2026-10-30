import { STORES } from "@/lib/data";
import { meta, ld, crumbLd } from "@/lib/seo";
import PageHead from "@/components/PageHead";
import StoreExplorer from "@/components/StoreExplorer";

export const metadata = meta({ title: "Store Locator — Find Jay Bhavani Near You", description: `Find your nearest Jay Bhavani Vadapav among ${STORES.length}+ stores across Gujarat, Rajasthan, Delhi NCR, USA, Canada and Australia. Addresses, timings and directions.`, path: "/store-locator/", image: "/img/jay-bhavani-store-2.webp" });

export default function Page() {
  const list = { "@context": "https://schema.org", "@type": "ItemList", itemListElement: STORES.slice(0, 50).map((s, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "FoodEstablishment", name: `Jay Bhavani Vadapav ${s.city}`, address: s.address, openingHours: "Mo-Su 09:00-21:00", url: "https://jaybhavanivadapav.com/store-locator/" } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld([crumbLd([{ name: "Home", path: "/" }, { name: "Store Locator", path: "/store-locator/" }]), list])} />
      <PageHead eyebrow="Store Locator" title="Find us" accent="near you" ghost="Stores" crumbs={[{ name: "Store Locator" }]}>Craving a delicious bite of Jay Bhavani Vadapav? Search for your nearest store and treat yourself to the crispy goodness today!</PageHead>
      <section className="sec" style={{ paddingTop: 40 }}><div className="wrap"><StoreExplorer /></div></section>
    </>
  );
}
