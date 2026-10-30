"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Star = () => <svg viewBox="0 0 24 24"><path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" /></svg>;

/** Continuous marquee; scroll velocity nudges its speed. One transform write per frame, no tween creation. */
export default function Marquee({ words }: { words: string[] }) {
  const t = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = t.current!, root = el.parentElement!;
    let x = 0, boost = 0, dir = 1, half = el.scrollWidth / 2, vis = true;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(root);
    const ro = new ResizeObserver(() => { half = el.scrollWidth / 2; }); ro.observe(el);
    const st = ScrollTrigger.create({ onUpdate: (s) => { boost = Math.min(5, Math.abs(s.getVelocity()) / 400); dir = s.direction >= 0 ? 1 : -1; } });
    const tick = (_: number, dt: number) => {
      if (!vis) return;
      boost *= 0.94;
      x -= (60 + boost * 90) * dir * (dt / 1000);
      if (x <= -half) x += half; else if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); st.kill(); io.disconnect(); ro.disconnect(); };
  }, []);
  const row = words.map((w, i) => <span key={i}>{w}<Star /></span>);
  return <div className="mq" aria-hidden="true"><div className="mq-t" ref={t}>{row}{row}</div></div>;
}
