"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { NAV, SITE } from "@/lib/data";
import { useShell } from "./Shell";

export default function Header() {
  const path = usePathname();
  const { openOrder, lenis } = useShell();
  const [solid, setSolid] = useState(false);
  const [hide, setHide] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let last = 0;
    const on = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHide(y > 500 && y > last + 4 ? true : y < last - 4 ? false : hide);
      last = y;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const m = menu.current!;
    if (open) {
      lenis.current?.stop();
      gsap.set(m, { visibility: "visible" });
      gsap.to(m, { clipPath: "circle(150% at calc(100% - 44px) 36px)", duration: 1.1, ease: "expo.inOut" });
      gsap.fromTo(m.querySelectorAll(".mnu-links a span"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.07, delay: 0.35 });
      gsap.fromTo(m.querySelector(".mnu-foot"), { opacity: 0 }, { opacity: 1, delay: 0.8, duration: 0.8 });
    } else {
      lenis.current?.start();
      gsap.to(m, { clipPath: "circle(0% at calc(100% - 44px) 36px)", duration: 0.8, ease: "expo.inOut", onComplete: () => { gsap.set(m, { visibility: "hidden" }); } });
    }
  }, [open, lenis]);

  return (
    <>
      <header className={`hdr ${solid ? "solid" : ""} ${hide && !open ? "hide" : ""}`}>
        <div className="wrap hdr-in">
          <Link href="/" className="logo" aria-label="Jay Bhavani Vadapav — home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.png" alt="Jay Bhavani Vadapav — Since 1998" width={160} height={52} />
          </Link>
          <nav className="nav" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={path.startsWith(n.href) ? "on" : ""}>{n.label}</Link>
            ))}
          </nav>
          <div className="hdr-r">
            <a className="login" href={SITE.franchiseLogin} target="_blank" rel="noopener noreferrer">Franchise Login</a>
            <button className="btn sm" onClick={() => openOrder()} data-cursor="Order">Order Now</button>
            <button className={`burger ${open ? "on" : ""}`} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}><i /><i /></button>
          </div>
        </div>
      </header>
      <div ref={menu} className="mnu" aria-hidden={!open}>
        <nav className="mnu-links" aria-label="Mobile">
          {[{ href: "/", label: "Home" }, ...NAV].map((n) => (
            <Link key={n.href} href={n.href}><span>{n.label}</span></Link>
          ))}
          <a href={SITE.franchiseLogin} target="_blank" rel="noopener noreferrer"><span>Franchise Login</span></a>
        </nav>
        <div className="mnu-foot">
          <a href={SITE.phoneHref}>{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <Link href="/career/">Career</Link>
          <Link href="/catering/">Catering</Link>
        </div>
      </div>
    </>
  );
}
