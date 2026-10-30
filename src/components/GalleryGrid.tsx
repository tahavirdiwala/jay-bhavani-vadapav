"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function GalleryGrid({ photos }: { photos: string[] }) {
  const [i, setI] = useState<number | null>(null);
  const lb = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = lb.current!;
    if (i !== null) { gsap.set(el, { visibility: "visible" }); gsap.to(el, { opacity: 1, duration: 0.35 }); gsap.fromTo(el.querySelector("img"), { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "expo.out" }); }
    else gsap.to(el, { opacity: 0, duration: 0.25, onComplete: () => { gsap.set(el, { visibility: "hidden" }); } });
  }, [i]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (i === null) return; if (e.key === "Escape") setI(null); if (e.key === "ArrowRight") setI((i + 1) % photos.length); if (e.key === "ArrowLeft") setI((i - 1 + photos.length) % photos.length); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [i, photos.length]);
  return (
    <>
      <div className="mason" data-stagger>
        {photos.map((p, k) => (
          <button key={p} onClick={() => setI(k)} aria-label={`Open photo ${k + 1}`} data-cursor="Open">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={p.replace("/gallery/", "/gallery/t/")} alt={`Jay Bhavani Vadapav gallery photo ${k + 1}`} loading="lazy" width={800} height={600} /></button>
        ))}
      </div>
      <div className="lb" ref={lb} role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={(e) => e.target === e.currentTarget && setI(null)}>
        {i !== null && /* eslint-disable-next-line @next/next/no-img-element */ <img src={photos[i]} alt={`Gallery photo ${i + 1}`} />}
        <button className="rnd x" aria-label="Close" onClick={() => setI(null)}>✕</button>
        <button className="rnd p" aria-label="Previous" onClick={() => setI(((i ?? 0) - 1 + photos.length) % photos.length)}>←</button>
        <button className="rnd n" aria-label="Next" onClick={() => setI(((i ?? 0) + 1) % photos.length)}>→</button>
        <div className="lb-c">{(i ?? 0) + 1} / {photos.length}</div>
      </div>
    </>
  );
}
