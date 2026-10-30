"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { OVERSEAS, SITE } from "@/lib/data";

export default function OrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = root.current!;
    if (open) {
      gsap.set(el, { visibility: "visible" });
      gsap.to(el, { opacity: 1, duration: 0.4 });
      gsap.fromTo(el.querySelector(".mdl-card"), { y: 60, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.9, ease: "expo.out" });
      gsap.fromTo(el.querySelectorAll(".loc-grid > div"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, delay: 0.25, duration: 0.8, ease: "power3.out" });
    } else gsap.to(el, { opacity: 0, duration: 0.3, onComplete: () => { gsap.set(el, { visibility: "hidden" }); } });
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  return (
    <div ref={root} className="mdl" role="dialog" aria-modal="true" aria-label="Select location to order" aria-hidden={!open} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mdl-card">
        <button className="mdl-x" onClick={onClose} aria-label="Close">✕</button>
        <div className="eyebrow">Online Order</div>
        <h2 className="serif h3" style={{ margin: "12px 0 0" }}>Select <span className="gold">Location</span></h2>
        <div className="loc-grid">
          <div>
            <h4>USA</h4>
            <ul>
              {OVERSEAS.USA.map((c) => (
                <li key={c}>{c === "Suwanee"
                  ? <a className="pill" href={SITE.orderUs} target="_blank" rel="noopener noreferrer">{c} ↗</a>
                  : <span className="pill" style={{ opacity: 0.75 }}>{c}</span>}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Canada</h4>
            <ul>{OVERSEAS.Canada.map((c) => <li key={c}><span className="pill" style={{ opacity: 0.75 }}>{c}</span></li>)}</ul>
          </div>
          <div>
            <h4>Australia</h4>
            <ul>
              {OVERSEAS.Australia.map((c) => (
                <li key={c}><a className="pill" href={SITE.orderAu[c]} target="_blank" rel="noopener noreferrer">{c} ↗</a></li>
              ))}
            </ul>
          </div>
        </div>
        <p className="note" style={{ marginTop: 26 }}>In India? <Link className="link-u" href="/store-locator/" onClick={onClose}>Find your nearest store</Link></p>
      </div>
    </div>
  );
}
