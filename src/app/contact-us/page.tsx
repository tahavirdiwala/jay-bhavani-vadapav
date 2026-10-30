import { SITE } from "@/lib/data";
import { meta, ld, crumbLd } from "@/lib/seo";
import PageHead from "@/components/PageHead";
import LeadForm from "@/components/LeadForm";

export const metadata = meta({ title: "Contact Us — Customer Care & Franchise Enquiry", description: "Contact Jay Bhavani Vadapav: head office in Sola, Ahmedabad, customer care +91 75758 05500, franchise@jbvindia.com.", path: "/contact-us/", image: "/img/contact.webp" });

export default function Page() {
  const cp = { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Jay Bhavani Vadapav", url: SITE.url + "/contact-us/" };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld([crumbLd([{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact-us/" }]), cp])} />
      <PageHead eyebrow="Contact Us" title="Let’s make it" accent="deliciously easy" ghost="Hello" crumbs={[{ name: "Contact Us" }]}>Whether you’re asking about our menu or need some help, we’re here to serve you with a side of joy!</PageHead>
      <section className="sec" style={{ paddingTop: 40 }}>
        <div className="wrap grid2" style={{ alignItems: "start" }}>
          <div className="cc" data-stagger>
            <div className="c"><small>Address</small><b>{SITE.address}</b></div>
            <a href={`mailto:${SITE.franchiseEmail}`}><small>Franchise Enquiry</small><b>{SITE.phone}</b><span className="note">{SITE.franchiseEmail}</span></a>
            <a href={`mailto:${SITE.email}`}><small>Customer Care</small><b>{SITE.phone}</b><span className="note">{SITE.email}</span></a>
            <a href={SITE.phoneHref}><small>Call us</small><b>{SITE.phone}</b></a>
          </div>
          <div className="fcard"><h2 className="serif h3" style={{ margin: "0 0 24px" }}>Get in <span className="gold">Touch</span></h2><LeadForm kind="contact" /></div>
        </div>
      </section>
    </>
  );
}
