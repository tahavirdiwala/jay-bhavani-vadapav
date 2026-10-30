import { meta, ld, crumbLd } from "@/lib/seo";
import { SITE } from "@/lib/data";
import PageHead from "@/components/PageHead";
import LeadForm from "@/components/LeadForm";

export const metadata = meta({ title: "Vadapav Franchise — Own a Jay Bhavani Outlet", description: "Own a Jay Bhavani Vadapav franchise: 195+ outlets, faster returns on investment and a proven menu. Apply for India, USA, Australia, Canada or UK.", path: "/franchise/", image: "/img/franchise.webp" });

const WHY = [["25+ years", "of trust & taste since 1998"], ["195+ outlets", "across India, USA, Canada & Australia"], ["Faster ROI", "volume-led model with tight price control"], ["Multi-unit growth", "systems built to expand into many locations"]];

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(crumbLd([{ name: "Home", path: "/" }, { name: "Franchise", path: "/franchise/" }]))} />
      <PageHead eyebrow="Own a Franchise" title="Serve up a slice of" accent="success" ghost="Franchise" crumbs={[{ name: "Franchise" }]}>Build a business that brings smiles, success and a whole lot of love.</PageHead>
      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap grid2" style={{ alignItems: "start" }}>
          <div>
            <h2 className="serif h3" data-split style={{ margin: "0 0 20px" }}>Owning a franchise with us means more than just serving delicious food</h2>
            <p className="lead" data-reveal>It’s about creating experiences, sparking happiness, and building connections with foodies who can’t get enough of that perfect bite. We have built strong entry barriers for competitors while becoming a volume player with tight control over pricing — so our partners achieve faster returns on investment and seamlessly expand into multiple locations.</p>
            <div className="usp c2" style={{ marginTop: 40 }} data-stagger>
              {WHY.map(([a, b]) => <div className="usp-c" key={a} data-tilt style={{ padding: 22 }}><h3 className="gold" style={{ margin: 0 }}>{a}</h3><p>{b}</p></div>)}
            </div>
            <div className="cc" style={{ marginTop: 30 }}>
              <a href={`mailto:${SITE.franchiseEmail}`}><small>Franchise enquiry</small><b>{SITE.franchiseEmail}</b></a>
              <a href={SITE.phoneHref}><small>Call</small><b>{SITE.phone}</b></a>
              <a href={SITE.franchiseLogin} target="_blank" rel="noopener noreferrer"><small>Existing partner?</small><b>Franchise Login ↗</b></a>
            </div>
          </div>
          <div className="fcard"><h2 className="serif h3" style={{ margin: "0 0 24px" }}>Franchise <span className="gold">Enquiry</span></h2><LeadForm kind="franchise" /></div>
        </div>
      </section>
    </>
  );
}
