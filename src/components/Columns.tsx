"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

/** Four photo columns shown at their natural aspect (never cropped); alternate columns drift slightly on scroll (desktop only). */
export default function Columns({ photos }: { photos: { src: string; alt: string }[] }) {
  const root = useRef<HTMLDivElement>(null);
  const cols = [0, 1, 2, 3].map((c) => photos.filter((_, i) => i % 4 === c));
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      root.current!.querySelectorAll<HTMLElement>(".col").forEach((c, i) => {
        gsap.fromTo(c, { y: i % 2 ? 36 : -36 }, { y: i % 2 ? -36 : 36, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <div className="cols" ref={root}>
      {cols.map((c, i) => (
        <div className="col" key={i}>
          {c.map((p) => <div className="ph" key={p.src} data-cursor="Yum">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.src} alt={p.alt} loading="lazy" width={800} height={1000} /></div>)}
        </div>
      ))}
    </div>
  );
}
