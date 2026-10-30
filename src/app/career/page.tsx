import { meta, ld, crumbLd } from "@/lib/seo";
import PageHead from "@/components/PageHead";
import LeadForm from "@/components/LeadForm";

export const metadata = meta({ title: "Careers — Join the Jay Bhavani Family", description: "Build a career with one of the fastest-growing Indian food chains. Apply to join Jay Bhavani Vadapav.", path: "/career/" });

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(crumbLd([{ name: "Home", path: "/" }, { name: "Career", path: "/career/" }]))} />
      <PageHead eyebrow="Career" title="Join the" accent="family" ghost="Career" crumbs={[{ name: "Career" }]} />
      <section className="sec" style={{ paddingTop: 40 }}><div className="wrap" style={{ maxWidth: 900 }}><div className="fcard"><LeadForm kind="career" /></div></div></section>
    </>
  );
}
