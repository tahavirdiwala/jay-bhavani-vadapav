"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

/* 3D perspective ring (same technique as the Kraheja Homes carousel): cards sit on a cylinder, camera at its centre. */
const R = 891, CULL = 56, SPEED = 1.6, CW = 1172, CH = 700;
type It = { img: string; title: string; sub: string; href?: string; contain?: boolean };

export default function RingCarousel({ items, autoplay = true }: { items: It[]; autoplay?: boolean }) {
  const N = Math.max(items.length, 10), STEP = 360 / N;
  const list = Array.from({ length: N }, (_, i) => items[i % items.length]);
  const wrap = useRef<HTMLDivElement>(null), canvas = useRef<HTMLDivElement>(null), cards = useRef<(HTMLElement | null)[]>([]);
  const [front, setFront] = useState(0);
  const st = useRef({ moved: 0, phase: 0, paused: false, drag: false, front: 0, x0: 0, p0: 0 });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fit = () => { if (!wrap.current || !canvas.current) return; const w = wrap.current.clientWidth, k = Math.min(1.02, w / CW * (w < 700 ? 1.9 : 1)); canvas.current.style.transform = `translateX(-50%) scale(${k})`; wrap.current.style.height = CH * k + "px"; };
    fit(); const ro = new ResizeObserver(fit); ro.observe(wrap.current!);
    let raf = 0, last = performance.now(), vis = true;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(wrap.current!);
    const place = () => {
      const s = st.current; let best = 0, bA = 999;
      for (let i = 0; i < N; i++) {
        const el = cards.current[i]; if (!el) continue;
        const a = (((i * STEP + s.phase) % 360) + 540) % 360 - 180;
        if (Math.abs(a) > CULL) { el.style.visibility = "hidden"; continue; }
        el.style.visibility = "visible";
        const r = (a * Math.PI) / 180, c = Math.cos(r);
        el.style.transform = `translate3d(${R * Math.sin(r)}px,0,${R * (1 - c)}px) rotateY(${-a}deg)`;
        el.style.opacity = String(Math.max(0.35, 1 - (1 - c) * 2.6));
        if (Math.abs(a) < bA) { bA = Math.abs(a); best = i; }
      }
      if (best !== s.front) { s.front = best; setFront(best); }
    };
    const tick = (t: number) => { raf = requestAnimationFrame(tick); const dt = Math.min((t - last) / 1000, 0.1); last = t; if (!vis) return; const s = st.current; if (autoplay && !reduce && !s.paused && !s.drag) s.phase -= SPEED * dt; place(); };
    place(); raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [N, STEP, autoplay]);

  const snap = (to: number, d = 0.9) => { st.current.drag = true; gsap.to(st.current, { phase: to, duration: d, ease: "power3.out", onComplete: () => { st.current.drag = false; } }); };
  const near = (p: number) => Math.round(p / STEP) * STEP;
  const step = (d: number) => { gsap.killTweensOf(st.current); snap(near(st.current.phase) - d * STEP, 0.8); };
  const down = (e: React.PointerEvent) => {
    const s = st.current; gsap.killTweensOf(s); s.drag = true; s.x0 = e.clientX; s.p0 = s.phase; s.moved = 0;
    let lx = e.clientX, lt = performance.now(), vel = 0;
    const mv = (ev: PointerEvent) => { const n = performance.now(); s.moved = Math.max(s.moved, Math.abs(ev.clientX - s.x0)); s.phase = s.p0 + (ev.clientX - s.x0) * 0.14; vel = ((ev.clientX - lx) / Math.max(1, n - lt)) * 1000; lx = ev.clientX; lt = n; };
    const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); snap(near(s.phase + vel * 0.045), 1.1); setTimeout(() => { s.moved = 0; }, 0); };
    window.addEventListener("pointermove", mv); window.addEventListener("pointerup", up);
  };
  const cur = list[front];
  return (
    <div>
      <div ref={wrap} className="rg-wrap" onPointerEnter={() => (st.current.paused = true)} onPointerLeave={() => (st.current.paused = false)} onPointerDown={down} data-cursor="Drag" role="region" aria-label="Photo carousel — drag to rotate">
        <div ref={canvas} className="rg-canvas"><div className="rg-ring" style={{ ["--cw" as string]: `${Math.round(2 * R * Math.sin((STEP * Math.PI) / 360) * 0.86)}px` }}>
          {list.map((it, i) => (
            <Card key={i} it={it} cls={it.contain ? "rg-card contain" : "rg-card"} refCb={(el) => { cards.current[i] = el; }} moved={() => st.current.moved} />
          ))}
        </div></div>
      </div>
      <div className="rg-ctl wrap">
        <div><div className="eyebrow">{cur.sub}</div><div className="serif h3" style={{ marginTop: 8 }}>{cur.title}</div></div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>{cur.href && <Link className="btn sm" href={cur.href}>Open {cur.title}</Link>}<button className="rnd" aria-label="Previous photo" onClick={() => step(-1)}>←</button><button className="rnd" aria-label="Next photo" onClick={() => step(1)}>→</button></div>
      </div>
    </div>
  );
}

function Card({ it, cls, refCb, moved }: { it: It; cls: string; refCb: (el: HTMLElement | null) => void; moved: () => number }) {
  const inner = (<>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={it.img} alt={`${it.title} — ${it.sub}`} draggable={false} loading="lazy" />
    <div className="rg-cap">{it.title}<i>{it.sub}</i></div>
  </>);
  return it.href
    ? <Link href={it.href} ref={refCb as never} className={cls} draggable={false} onClick={(e) => { if (moved() > 6) e.preventDefault(); }} data-cursor="Open">{inner}</Link>
    : <div ref={refCb as never} className={cls}>{inner}</div>;
}
