"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export type Voice = { quote: string; who: string; role: string; img: string; icon?: boolean };

/** Testimonial-style slider (Kraheja pattern): arched portrait + big italic quote, crossfaded with GSAP, autoplay + dots. */
export default function Voices({ voices }: { voices: Voice[] }) {
  const [i, setI] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    const s = root.current!.querySelectorAll<HTMLElement>(".vq-s");
    s.forEach((el, k) => {
      if (k === i) {
        el.classList.add("on");
        if (first.current) return;
        gsap.fromTo(el.querySelector(".vq-pic"), { clipPath: "inset(100% 0 0 0)", scale: 1.1 }, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: 1.2, ease: "expo.out" });
        gsap.fromTo(el.querySelectorAll(".vq-t, .vq-who, .vq-mark"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", stagger: 0.1, delay: 0.15 });
      } else { el.classList.remove("on"); }
    });
    first.current = false;
  }, [i]);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % voices.length), 8000); return () => clearInterval(t); }, [voices.length, i]);
  const go = (d: number) => setI((x) => (x + d + voices.length) % voices.length);
  return (
    <div ref={root}>
      <div className="vq" aria-live="polite">
        {voices.map((v, k) => (
          <figure key={k} className={`vq-s ${k === 0 ? "on" : ""}`} style={{ margin: 0 }} aria-hidden={k !== i}>
            <div className={`vq-pic ${v.icon ? "ic" : ""}`}>{/* eslint-disable-next-line @next/next/no-img-element */}<img src={v.img} alt={v.who} loading="lazy" /></div>
            <div>
              <div className="vq-mark" aria-hidden>“</div>
              <blockquote className="vq-t" style={{ margin: 0 }}>{v.quote}</blockquote>
              <figcaption className="vq-who"><div><b>{v.who}</b><span>{v.role}</span></div></figcaption>
            </div>
          </figure>
        ))}
      </div>
      <div className="vq-nav">
        <button className="rnd" aria-label="Previous" onClick={() => go(-1)}>←</button>
        <div className="vq-dots">{voices.map((_, k) => <i key={k} className={k === i ? "on" : ""} onClick={() => setI(k)} />)}</div>
        <button className="rnd" aria-label="Next" onClick={() => go(1)}>→</button>
      </div>
    </div>
  );
}
