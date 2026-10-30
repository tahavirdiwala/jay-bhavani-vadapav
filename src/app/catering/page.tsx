import { meta, ld, crumbLd } from "@/lib/seo";
import PageHead from "@/components/PageHead";
import LeadForm from "@/components/LeadForm";

export const metadata = meta({ title: "Catering — Street Food for Weddings, Parties & Corporate Events", description: "Jay Bhavani catering brings authentic Indian street food to baby showers, weddings, receptions and corporate events. Request a catering quote.", path: "/catering/", image: "/img/jbv-catring.webp" });

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(crumbLd([{ name: "Home", path: "/" }, { name: "Catering", path: "/catering/" }]))} />
      <PageHead eyebrow="Our Catering" title="Bringing the flavor to" accent="your event" ghost="Catering" crumbs={[{ name: "Catering" }]} />
      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap grid2" style={{ alignItems: "start" }}>
          <div style={{ position: "sticky", top: 110 }}>
            <div className="frame" data-reveal="clip" style={{ aspectRatio: "4 / 3" }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/img/jbv-catring.webp" alt="Jay Bhavani catering live counter" loading="lazy" /></div>
            <div className="chips" style={{ marginTop: 26 }}>{["Baby Shower", "Marriage", "Reception", "Corporate Event", "Other"].map((e) => <span className="chip" key={e}>{e}</span>)}</div>
          </div>
          <div className="fcard"><h2 className="serif h3" style={{ margin: "0 0 24px" }}>Plan your <span className="gold">menu</span></h2><LeadForm kind="catering" /></div>
        </div>
      </section>
    </>
  );
}
