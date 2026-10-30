"use client";
import { useRef } from "react";
import { TIMELINE } from "@/lib/data";
import { useAutoScroll } from "./useAutoScroll";

/** Horizontal story scroller: drag, swipe, arrow buttons or trackpad — never hijacks page scroll. */
export default function Timeline() {
  const tr = useRef<HTMLDivElement>(null);
  useAutoScroll(tr, 44);
  const drag = useRef({ on: false, x: 0, l: 0, moved: 0 });
  const by = (d: number) => tr.current!.scrollBy({ left: d * Math.min(560, tr.current!.clientWidth * 0.8), behavior: "smooth" });
  const down = (e: React.PointerEvent) => { if (e.pointerType !== "mouse") return; const t = tr.current!; drag.current = { on: true, x: e.clientX, l: t.scrollLeft, moved: 0 }; t.classList.add("grab"); };
  const move = (e: React.PointerEvent) => { const d = drag.current; if (!d.on) return; d.moved = Math.abs(e.clientX - d.x); tr.current!.scrollLeft = d.l - (e.clientX - d.x); };
  const up = () => { drag.current.on = false; tr.current?.classList.remove("grab"); };
  return (
    <section className="tl-pin" aria-labelledby="story-h">
      <div className="wrap" style={{ paddingBlock: "clamp(60px,8vw,110px) 30px", display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div className="eyebrow">1994 → 2024</div>
          <h2 id="story-h" className="serif h2" data-split style={{ margin: "16px 0 0" }}>Our <span className="gold">Story</span></h2>
        </div>
        <div style={{ display: "flex", gap: 10 }}><button className="rnd" aria-label="Earlier" onClick={() => by(-1)}>←</button><button className="rnd" aria-label="Later" onClick={() => by(1)}>→</button></div>
      </div>
      <div className="tl-track" ref={tr} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} data-cursor="Drag">
        {TIMELINE.map((t) => (
          <article className="tl-c" key={t.year} data-tilt>
            <div className="im">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={t.img} alt={`Jay Bhavani Vadapav in ${t.year}`} loading="lazy" draggable={false} /></div>
            <div className="tx"><div className="yr serif gold">{t.year}</div><p>{t.text}</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
