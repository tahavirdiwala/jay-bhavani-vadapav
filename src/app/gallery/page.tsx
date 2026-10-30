import { GALLERY } from "@/lib/data";
import { meta, ld, crumbLd } from "@/lib/seo";
import PageHead from "@/components/PageHead";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata = meta({ title: "Gallery — Street Food, Stores & Moments", description: "Photos of Jay Bhavani Vadapav's food, outlets and moments — crispy vadapav, sandwiches, shakes and more.", path: "/gallery/", image: GALLERY[12] });

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(crumbLd([{ name: "Home", path: "/" }, { name: "Gallery", path: "/gallery/" }]))} />
      <PageHead eyebrow="Gallery" title="Moments of" accent="deliciousness" ghost="Gallery" crumbs={[{ name: "Gallery" }]} />
      <section className="sec" style={{ paddingTop: 40 }}><div className="wrap"><GalleryGrid photos={GALLERY} /></div></section>
    </>
  );
}
