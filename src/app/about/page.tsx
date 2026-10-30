import Link from "next/link";
import { meta, ld, crumbLd } from "@/lib/seo";
import PageHead from "@/components/PageHead";
import Timeline from "@/components/Timeline";
import Counter from "@/components/Counter";

export const metadata = meta({ title: "About Us — Our Story Since 1998", description: "From a ₹5,000 food cart on C.G. Road, Ahmedabad in 1998 to 195+ outlets across India, USA, Canada and Australia — the Jay Bhavani Vadapav story, vision, mission and values.", path: "/about/", image: "/img/about.webp" });

const VMV = [
  { icon: "/img/jb-icon/vision.webp", t: "Vision", d: "“Constantly innovate to build and operate Vadapav brand that is relevant to local consumers with minimum capital investment and maximum return on investment.”" },
  { icon: "/img/jb-icon/mission.webp", t: "Mission", d: "“To be the Best FAST-FOOD place which offer wide range of delicious & high-quality Vadapav in vibrant dishes in a fun-filled environment.”" },
  { icon: "/img/jb-icon/core-value.webp", t: "Core Values", d: "Quality · Service · Responsiveness" },
];

export default function About() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(crumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about/" }]))} />
      <PageHead eyebrow="About Us" title="Our" accent="Story" ghost="1998" crumbs={[{ name: "About" }]}>
        One of the fastest-growing Indian fast food chains in the world.
      </PageHead>

      <section className="sec">
        <div className="wrap grid2">
          <div className="frame" data-reveal="clip" style={{ aspectRatio: "1 / 1" }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/img/jbv-4.webp" alt="A guest enjoying Jay Bhavani" loading="lazy" /></div>
          <div>
            <div className="eyebrow">About Us</div>
            <h2 className="serif h2" data-split style={{ margin: "16px 0 24px" }}>Jay Bhavani Vadapav is one of the <span className="gold">fastest-growing</span> Indian fast food chains</h2>
            <p className="lead" data-reveal>Jay Bhavani Vadapav was co-founded in 1998, driven by the emerging craze for Vadapav in Ahmedabad. Our journey began on the pavements of CG Road, with little in hand—just four wheels, a mouthwatering recipe of Ambavadi Vadapav, and a vision to take it to unprecedented heights.</p>
            <p className="lead" data-reveal style={{ marginTop: 14 }}>Over the years, we have continuously added value to our products and strengthened our menu, never compromising on taste. Our goal has always been to create flavors that generations can savor and cherish.</p>
            <p className="lead" data-reveal style={{ marginTop: 14 }}>We have also strategically built strong entry barriers for competitors while becoming a volume player with tight control over pricing. This approach ensures that our franchise partners achieve faster returns on investment and seamlessly expand into multiple locations.</p>
            <div className="stat-row"><div className="stat"><b className="serif gold"><Counter to={1998} /></b><span>Founded</span></div><div className="stat"><b className="serif gold"><Counter to={195} suffix="+" /></b><span>Outlets</span></div><div className="stat"><b className="serif gold"><Counter to={50} suffix="+" /></b><span>Reefer containers exported</span></div></div>
          </div>
        </div>
      </section>

      <Timeline />

      <section className="sec">
        <div className="wrap">
          <div className="eyebrow">Here is how it works</div>
          <h2 className="serif h2" data-split style={{ margin: "16px 0 0" }}>Vision, Mission <span className="gold">&amp; Values</span></h2>
          <div className="usp c3" data-stagger>
            {VMV.map((v) => (
              <article className="usp-c" key={v.t} data-tilt><span className="shine" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.icon} alt="" loading="lazy" width={130} height={130} />
                <h3>{v.t}</h3><p>{v.d}</p>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 60, display: "flex", gap: 14, flexWrap: "wrap" }}><Link className="btn" href="/franchise/">Own a Franchise</Link><Link className="btn ghost" href="/store-locator/">Find a Store</Link></div>
        </div>
      </section>
    </>
  );
}
