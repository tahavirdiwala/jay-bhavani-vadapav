import Link from "next/link";
import { notFound } from "next/navigation";
import { MENU, catBySlug } from "@/lib/data";
import { meta, ld, crumbLd } from "@/lib/seo";
import PageHead from "@/components/PageHead";

export const dynamicParams = false;
export const generateStaticParams = () => MENU.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = catBySlug((await params).slug); if (!c) return {};
  const names = c.items.slice(0, 6).map((i) => i.name).join(", ");
  return meta({ title: `${c.label} Menu`, description: `${c.label} at Jay Bhavani Vadapav — ${c.items.length} items including ${names}. Fresh, crispy and hot, since 1998.`, path: `/menu/${c.slug}/`, image: c.items[0].img });
}

export default async function Cat({ params }: { params: Promise<{ slug: string }> }) {
  const c = catBySlug((await params).slug); if (!c) notFound();
  const i = MENU.indexOf(c), prev = MENU[(i - 1 + MENU.length) % MENU.length], next = MENU[(i + 1) % MENU.length];
  const menu = { "@context": "https://schema.org", "@type": "Menu", name: `${c.label} — Jay Bhavani Vadapav`, hasMenuSection: { "@type": "MenuSection", name: c.label, hasMenuItem: c.items.map((x) => ({ "@type": "MenuItem", name: x.name, image: "https://jaybhavanivadapav.com" + x.img, suitableForDiet: "https://schema.org/VegetarianDiet" })) } };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld([crumbLd([{ name: "Home", path: "/" }, { name: "Menu", path: "/menu/" }, { name: c.label, path: `/menu/${c.slug}/` }]), menu])} />
      <PageHead eyebrow={`Menu · ${c.items.length} items`} title={c.label} ghost={c.label.split(" ")[0]} crumbs={[{ name: "Menu", href: "/menu/" }, { name: c.label }]} />
      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="items" data-stagger>
            {c.items.map((x) => (
              <article className="item" key={x.name} data-tilt>
                <div className="im">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={x.img} alt={`${x.name} — Jay Bhavani Vadapav`} loading="lazy" width={400} height={400} /></div>
                <h3>{x.name}</h3><div className="jb">Jay Bhavani</div>
              </article>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginTop: 70 }}>
            <Link className="btn ghost" href={`/menu/${prev.slug}/`}>← {prev.label}</Link>
            <Link className="btn" href={`/menu/${next.slug}/`}>{next.label} →</Link>
          </div>
          <div style={{ marginTop: 70 }}>
            <div className="eyebrow" style={{ marginBottom: 20 }}>More from the menu</div>
            <div className="chips">{MENU.map((m) => <Link key={m.slug} href={`/menu/${m.slug}/`} className={`chip ${m.slug === c.slug ? "on" : ""}`}>{m.label}</Link>)}</div>
          </div>
        </div>
      </section>
    </>
  );
}
