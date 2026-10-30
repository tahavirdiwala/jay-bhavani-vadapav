import Link from "next/link";
import { FEATURED, GALLERY, SITE, USPS, STORES, COUNTRIES, MENU } from "@/lib/data";
import { meta, ld } from "@/lib/seo";
import HeroLoader from "@/components/HeroLoader";
import Marquee from "@/components/Marquee";
import MenuRail from "@/components/MenuRail";
import Columns from "@/components/Columns";
import Voices from "@/components/Voices";
import RingCarousel from "@/components/RingCarousel";
import GlobeLoader from "@/components/GlobeLoader";
import Counter from "@/components/Counter";

export const metadata = meta({
  title: "Jay Bhavani Vadapav — Indian Street Food, Global Destinations | Since 1998",
  description: "Vadapav Bole To Jay Bhavani. 195+ outlets across India, USA, Canada & Australia — authentic vadapav, dabeli, pav bhaji and more since 1998. Find a store, view the menu or own a franchise.",
  path: "/",
});

const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
const count = (c: string) => STORES.filter((s) => s.country === c).length;

const VOICES = [
  { quote: "We don’t just cook food; we blend perfection and taste in every bite. On top of that, our fast, organized processes ensure perfection in every bite.", who: "Kishan Singh Rajput", role: "Managing Director", img: "/img/jbv-md.webp" },
  { quote: "Constantly innovate to build and operate Vadapav brand that is relevant to local consumers with minimum capital investment and maximum return on investment.", who: "Our Vision", role: "Jay Bhavani Vadapav", img: "/img/jb-icon/vision.webp", icon: true },
  { quote: "To be the Best FAST-FOOD place which offer wide range of delicious & high-quality Vadapav in vibrant dishes in a fun-filled environment.", who: "Our Mission", role: "Jay Bhavani Vadapav", img: "/img/jb-icon/mission.webp", icon: true },
  { quote: "Quality. Service. Responsiveness. The three values every Jay Bhavani outlet is built on — from Ahmedabad’s streets to the world.", who: "Our Core Values", role: "Jay Bhavani Vadapav", img: "/img/jb-icon/core-value.webp", icon: true },
];

export default function Home() {
  const photos = ["jbv-1", "jbv-2", "jbv-3", "jbv-4", "jbv-5", "jbv-6", "jbv-7", "jbv-8"].map((n, i) => ({ src: `/img/${n}.webp`, alt: `Jay Bhavani signature street food ${i + 1}` }));
  const ring = GALLERY.slice(0, 14).map((g, i) => ({ img: g.replace("/gallery/", "/gallery/t/"), title: i % 2 ? "Fresh. Crispy. Hot." : "Taste of India", sub: `Gallery · ${String(i + 1).padStart(2, "0")}` }));
  const schema = {
    "@context": "https://schema.org", "@type": "FoodEstablishment", "@id": SITE.url + "/#brand", name: SITE.name, image: SITE.url + "/img/og.jpg", url: SITE.url, telephone: SITE.phone,
    servesCuisine: ["Indian", "Street Food", "Gujarati"], priceRange: "₹", description: "Indian street food chain — vadapav, dabeli, pav bhaji, sandwiches and more — with 195+ outlets worldwide.",
    hasMenu: SITE.url + "/menu/", address: { "@type": "PostalAddress", streetAddress: "808, 809, The Capital 2, Science City Road, Sola", addressLocality: "Ahmedabad", postalCode: "380060", addressCountry: "IN" },
    openingHours: "Mo-Su 09:00-21:00",
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ld(schema)} />

      {/* HERO */}
      <section className="hero" aria-label="Jay Bhavani Vadapav">
        <div className="hero-fx" aria-hidden><i className="a1" /><i className="a2" /><i className="a3" /></div>
        <HeroLoader />
        <div className="wrap hero-txt">
          <div className="eyebrow" data-reveal>Since 1998 · Ahmedabad to the world</div>
          <h1 className="serif h1" data-split data-delay="0.2">Indian Street Food <span className="gold">Global Destinations</span></h1>
          <p className="lead" data-reveal data-delay="0.5">Vadapav Bole To Jay Bhavani — the crispy, spicy, unforgettable taste of India, now served at 195+ outlets across four countries.</p>
          <div className="hero-cta" data-reveal data-delay="0.7">
            <Link href="/menu/" className="btn">View Menu <Arrow /></Link>
            <Link href="/store-locator/" className="btn ghost">Find a Store</Link>
          </div>
        <div className="hero-stats" data-reveal data-delay="0.9" aria-label="Brand facts">
          <div><b className="gold"><Counter to={195} suffix="+" /></b><span>Outlets</span></div>
          <div><b className="gold"><Counter to={4} /></b><span>Countries</span></div>
          <div><b className="gold"><Counter to={25} suffix="+" /></b><span>Years of taste</span></div>
        </div>
        </div>
        <div className="scroll-cue" aria-hidden />
      </section>

      <Marquee words={["Vadapav", "Dabeli", "Pav Bhaji", "Maska Bun", "Sandwich", "South Indian", "Pulav", "Milkshakes", "Fresh Juice", "French Fries"]} />

      {/* WELCOME */}
      <section className="sec" aria-labelledby="welcome-h" style={{ overflow: "hidden" }}>
        <div className="glow" style={{ width: 520, height: 520, background: "#1a3fb8", left: "-10%", top: "10%" }} />
        <div className="wrap grid2">
          <div style={{ position: "relative" }}>
            <div className="orn" style={{ width: "86%", aspectRatio: 1, left: "-8%", top: "-10%" }} />
            <div className="frame" data-reveal="clip" style={{ aspectRatio: "1 / 1.02" }}><div data-parallax="0.06" style={{ height: "112%" }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/img/about.webp" alt="Inside a Jay Bhavani Vadapav outlet" loading="lazy" width={900} height={900} /></div></div>
          </div>
          <div>
            <div className="eyebrow">Welcome to</div>
            <h2 id="welcome-h" className="serif h2" data-split style={{ margin: "16px 0 24px" }}>Jay Bhavani <span className="gold">Vadapav</span></h2>
            <p className="lead" data-reveal>Jay Bhavani Vadapav, established in 1998, transformed from a humble Ahmedabad street cart to a global fast-food phenomenon. With 195+ franchises spanning India, Canada, and beyond, it’s celebrated for iconic Vadapav, diverse delights, and top-tier quality.</p>
            <div className="stat-row" data-stagger>
              <div className="stat"><b className="serif gold"><Counter to={1998} /></b><span>Established</span></div>
              <div className="stat"><b className="serif gold"><Counter to={195} suffix="+" /></b><span>Franchises</span></div>
              <div className="stat"><b className="serif gold"><Counter to={MENU.reduce((n, c) => n + c.items.length, 0)} /></b><span>Menu items</span></div>
            </div>
            <div style={{ marginTop: 40 }}><Link href="/about/" className="btn">About Us <Arrow /></Link></div>
          </div>
        </div>
      </section>

      <MenuRail />

      {/* STORE LOCATOR */}
      <section className="globe-sec sec" aria-labelledby="loc-h">
        <div className="wrap grid2 g-loc">
          <div>
            <div className="eyebrow">Store Locator</div>
            <h2 id="loc-h" className="serif h2" data-split style={{ margin: "16px 0 22px" }}>Craving a delicious bite of <span className="gold">Jay Bhavani?</span></h2>
            <p className="lead" data-reveal>Find us near you, with multiple locations across various areas, satisfying your vada pav cravings has never been easier. Simply search for your nearest store and treat yourself to the crispy goodness today!</p>
            <div className="ctry" data-stagger>
              {COUNTRIES.map((c) => <Link key={c} href="/store-locator/" data-cursor="Explore"><b>{count(c)}</b><span>{c === "USA" ? "USA" : c[0] + c.slice(1).toLowerCase()}</span></Link>)}
            </div>
            <div style={{ marginTop: 38 }}><Link href="/store-locator/" className="btn">Find Nearest Location <Arrow /></Link></div>
          </div>
          <GlobeLoader />
        </div>
      </section>

      {/* 25 YEARS */}
      <section className="sec" aria-labelledby="y25-h">
        <div className="wrap grid2 g-y25">
          <div>
            <div className="serif" style={{ fontSize: "clamp(7rem,20vw,17rem)", lineHeight: 0.8, letterSpacing: "-0.06em" }}><span className="gold"><Counter to={25} suffix="+" /></span></div>
            <div className="eyebrow" style={{ marginTop: 22 }}>Years of Trust &amp; Taste</div>
          </div>
          <div>
            <h2 id="y25-h" className="serif h2" data-split style={{ margin: "0 0 24px" }}>Mouthwatering Deliciousness from <span className="gold">India Goes Global!</span></h2>
            <p className="lead" data-reveal>195+ outlets spanning India, USA, Canada, and Australia, we’re bringing the mouthwatering magic to food lovers worldwide. From our authentic Indian flavors to global favorites, our journey is all about spreading joy through every bite.</p>
            <p className="lead" data-reveal style={{ marginTop: 14 }}>Wherever you are, indulge in the snacks that have taken the world by storm, winning hearts and creating memories across continents!</p>
            <div style={{ marginTop: 34 }}><Link href="/about/" className="link-u">About Us <Arrow /></Link></div>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: "clamp(40px,6vw,90px)" }}><Columns photos={photos} /></div>
      </section>

      {/* USP */}
      <section className="sec usp-sec" aria-labelledby="usp-h">
        <div className="wrap">
          <div className="eyebrow">Our USP</div>
          <h2 id="usp-h" className="serif h2" data-split style={{ margin: "16px 0 20px", maxWidth: "18ch" }}>From First Bite to <span className="gold">Forever Love!</span></h2>
          <p className="lead" data-reveal>Making You Fall in Love with Every Bite is our Ultimate Special Power (USP), and that’s why we make sure that we don’t just get the praise, but also a special place in the hearts of all the foodies out there.</p>
          <div className="usp" data-stagger>
            {USPS.map((u, i) => (
              <article className="usp-c" key={u.title} data-tilt>
                <span className="n" aria-hidden>0{i + 1}</span><span className="shine" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.icon} alt="" loading="lazy" width={130} height={130} />
                <h3>{u.title}</h3><p>{u.text}</p>
              </article>
            ))}
          </div>
          <div style={{ marginTop: 44 }}><Link href="/about/" className="link-u">Read More <Arrow /></Link></div>
        </div>
      </section>

      {/* CATERING */}
      <section className="band" aria-labelledby="cat-h">
        <div className="band-bg" data-parallax="0.12">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/img/jbv-catring.webp" alt="Jay Bhavani catering spread" loading="lazy" /></div>
        <div className="wrap">
          <div className="eyebrow">Our Catering</div>
          <h2 id="cat-h" className="serif h1" data-split style={{ margin: "18px 0 28px", maxWidth: "12ch" }}>Bringing the Flavor to <span className="gold">Your Event!</span></h2>
          <p className="lead" data-reveal style={{ marginBottom: 34, color: "#d4dbf5" }}>Baby showers, weddings, receptions and corporate events — street-food magic, served your way.</p>
          <Link href="/catering/" className="btn">View More <Arrow /></Link>
        </div>
      </section>

      {/* VOICES */}
      <section className="voices sec" aria-labelledby="v-h">
        <div className="wrap">
          <div className="eyebrow">Managing Director</div>
          <h2 id="v-h" className="serif h2" data-split style={{ margin: "16px 0 clamp(36px,5vw,70px)" }}>Words that <span className="gold">guide us</span></h2>
          <Voices voices={VOICES} />
        </div>
      </section>

      {/* FRANCHISE */}
      <section className="sec" aria-labelledby="fr-h" style={{ overflow: "hidden" }}>
        <div className="wrap grid2">
          <div>
            <div className="eyebrow">Own a Franchise</div>
            <h2 id="fr-h" className="serif h2" data-split style={{ margin: "16px 0 24px" }}>And Serve Up a Delicious <span className="gold">Slice of Success!</span></h2>
            <p className="lead" data-reveal>When a smile of satisfaction lights up someone’s face after enjoying their favorite snack, it makes all the hard work feel so worth it. With us, you can be part of this incredible journey, where every bite is filled with flavor, joy, and memories. Owning a franchise with us means more than just serving delicious food, it’s about creating experiences, sparking happiness, and building connections with foodies who can’t get enough of that perfect bite.</p>
            <p className="lead" data-reveal style={{ marginTop: 14 }}>Ready to turn your passion for great flavors into a business that brings smiles, success, and a whole lot of love? Come join us and make your mark in the world of delicious possibilities!</p>
            <div style={{ marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap" }}><Link href="/franchise/" className="btn">Read More <Arrow /></Link><a className="btn ghost" href={SITE.franchiseLogin} target="_blank" rel="noopener noreferrer">Franchise Login</a></div>
          </div>
          <div className="frame" data-reveal="clip" style={{ aspectRatio: "1 / 1" }}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/img/franchise.webp" alt="A Jay Bhavani franchise storefront" loading="lazy" width={900} height={900} style={{ objectFit: "contain", background: "#f4f1ea" }} /></div>
        </div>
      </section>

      {/* GALLERY RING */}
      <section className="sec" aria-labelledby="g-h" style={{ background: "radial-gradient(70% 70% at 50% 40%, rgba(26,63,184,.28), transparent)", overflow: "hidden" }}>
        <div className="wrap" style={{ marginBottom: 30 }}>
          <div className="eyebrow">Gallery</div>
          <h2 id="g-h" className="serif h2" data-split style={{ margin: "16px 0 0" }}>Crispy, Hot <span className="gold">&amp; Fresh</span></h2>
        </div>
        <RingCarousel items={ring} />
        <div className="wrap" style={{ marginTop: 40 }}><Link href="/gallery/" className="link-u">Open the full gallery <Arrow /></Link></div>
      </section>

      {/* SOCIAL */}
      <section className="sec" aria-labelledby="s-h" style={{ paddingTop: 0 }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="eyebrow" style={{ justifyContent: "center" }}>@jaybhavaniofficial</div>
          <h2 id="s-h" className="serif h2" data-split style={{ margin: "16px auto 22px", maxWidth: "16ch" }}>Connect <span className="gold">With Us Today</span></h2>
          <p className="lead" data-reveal style={{ margin: "0 auto 34px" }}>Stay in the loop by following us on our social media channels and subscribing to our newsletter for exciting updates, offers, and more.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a className="btn" href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="btn ghost" href={SITE.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
      </section>
    </>
  );
}
