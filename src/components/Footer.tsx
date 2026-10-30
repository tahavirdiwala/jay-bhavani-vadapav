import Link from "next/link";
import { SITE } from "@/lib/data";

const Fb = () => <svg viewBox="0 0 24 24"><path d="M13.5 22v-8.2h2.8l.5-3.4h-3.3V8.2c0-1 .4-1.7 1.8-1.7h1.6V3.4C16.6 3.3 15.600 3.200 14.500 3.200c-2.400 0-4 1.500-4 4.100v2.500H7.700v3.400h2.800V22h3z" /></svg>;
const Ig = () => <svg viewBox="0 0 24 24"><path d="M7.500 2h9A5.500 5.500 0 0 1 22 7.500v9a5.500 5.500 0 0 1-5.500 5.500h-9A5.500 5.500 0 0 1 2 16.500v-9A5.500 5.500 0 0 1 7.500 2zm0 2A3.500 3.500 0 0 0 4 7.500v9A3.500 3.500 0 0 0 7.500 20h9a3.500 3.500 0 0 0 3.500-3.500v-9A3.500 3.500 0 0 0 16.500 4h-9zM12 7.200a4.800 4.800 0 1 1 0 9.600 4.800 4.800 0 0 1 0-9.600zm0 2a2.800 2.800 0 1 0 0 5.600 2.800 2.800 0 0 0 0-5.600zM17.300 5.800a1.100 1.100 0 1 1 0 2.200 1.100 1.100 0 0 1 0-2.200z" /></svg>;

export default function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr-grid">
          <div>
            <div className="serif h3" style={{ marginBottom: 14 }}>Connect <span className="gold">With Us Today</span></div>
            <p>Stay in the loop by following us on our social media channels and subscribing to our newsletter for exciting updates, offers, and more. Let’s stay connected!</p>
            <p>Driven by a passion for flavors and customer satisfaction, Jay Bhavani brings the authentic taste of India to every corner of the world, crafting memorable food experiences that keep customers coming back for more.</p>
            <div className="soc">
              <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Jay Bhavani on Facebook"><Fb /></a>
              <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Jay Bhavani on Instagram"><Ig /></a>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link href="/about/">About</Link></li>
              <li><Link href="/menu/">Menu</Link></li>
              <li><Link href="/gallery/">Gallery</Link></li>
              <li><Link href="/store-locator/">Store Locator</Link></li>
              <li><Link href="/career/">Career</Link></li>
              <li><Link href="/franchise/">Franchise</Link></li>
              <li><Link href="/catering/">Catering</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact Info</h4>
            <ul>
              <li style={{ color: "var(--mute)" }}>{SITE.address}</li>
              <li><a href={SITE.phoneHref}>{SITE.phone}</a></li>
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="ftr-big serif" aria-hidden>Jay Bhavani</div>
      </div>
      <div className="ftr-base">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <span>© Jay Bhavani Vadapav. All rights reserved.</span>
          <span>Vadapav Bole To Jay Bhavani</span>
        </div>
      </div>
    </footer>
  );
}
