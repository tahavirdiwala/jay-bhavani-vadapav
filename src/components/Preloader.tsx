"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("jb-pre") === "1"; sessionStorage.setItem("jb-pre", "1"); } catch {}
    const el = root.current!;
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setGone(true); (window as unknown as { __jbReady?: boolean }).__jbReady = true; window.dispatchEvent(new Event("jb:ready")); return; }
    const tl = gsap.timeline({ onComplete: () => { setGone(true); (window as unknown as { __jbReady?: boolean }).__jbReady = true; window.dispatchEvent(new Event("jb:ready")); } });
    tl.fromTo(el.querySelector("img"), { scale: 0.7, opacity: 0, rotate: -6 }, { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: "back.out(1.6)" })
      .to(el.querySelector(".pre-bar i"), { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0.2)
      .to(el.querySelector(".pre-in"), { y: -30, opacity: 0, duration: 0.5, ease: "power2.in" }, ">0.1")
      .to(el, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "<0.1");
    return () => { tl.kill(); };
  }, []);
  if (gone) return null;
  return (
    <div ref={root} className="pre" aria-hidden style={{ clipPath: "inset(0 0 0% 0)" }}>
      <div className="pre-in">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo.png" alt="" width={240} height={78} />
        <div className="pre-bar"><i /></div>
        <div className="pre-t">Vadapav Bole To Jay Bhavani</div>
      </div>
    </div>
  );
}
