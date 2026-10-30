"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { FEATURED } from "@/lib/data";
import { useAutoScroll } from "./useAutoScroll";

/** Dish cards in a horizontal row. Never pins or hijacks the page: vertical scroll always scrolls the page;
 *  the row moves by drag / swipe / trackpad / arrows, with a light parallax on each dish as it passes. */
export default function MenuRail() {
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  useAutoScroll(rail, 48);
  const drag = useRef({ on: false, x: 0, l: 0, moved: 0 });

  useEffect(() => {
    const el = rail.current!;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = el.scrollWidth - el.clientWidth;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.max(0.04, max > 0 ? el.scrollLeft / max : 0)})`;
      const box = el.getBoundingClientRect(), mid = box.left + box.width / 2, dishes = Array.from(el.children) as HTMLElement[];
      const os = dishes.map((d) => { const r = d.getBoundingClientRect(); return r.right < box.left - 200 || r.left > box.right + 200 ? null : Math.max(-1.4, Math.min(1.4, (r.left + r.width / 2 - mid) / (box.width / 2))); });   // read…
      dishes.forEach((d, i) => { if (os[i] !== null) d.style.setProperty("--o", (os[i] as number).toFixed(3)); });                                                                                       // …then write
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { el.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);

  const by = (d: number) => rail.current!.scrollBy({ left: d * Math.min(520, rail.current!.clientWidth * 0.7), behavior: "smooth" });
  const down = (e: React.PointerEvent) => { if (e.pointerType !== "mouse") return; const t = rail.current!; drag.current = { on: true, x: e.clientX, l: t.scrollLeft, moved: 0 }; };
  const move = (e: React.PointerEvent) => {
    const d = drag.current; if (!d.on) return;
    d.moved = Math.abs(e.clientX - d.x);
    if (d.moved > 6) rail.current!.classList.add("grab");
    rail.current!.scrollLeft = d.l - (e.clientX - d.x);
  };
  const up = () => { drag.current.on = false; rail.current?.classList.remove("grab"); };

  return (
    <section className="rail-sec" aria-labelledby="rail-h">
      <div className="wrap rail-head">
        <div className="eyebrow">The Menu</div>
        <h2 id="rail-h" className="serif h2" data-split style={{ margin: "18px 0 18px", maxWidth: "24ch" }}>A Flavorful Variety That’s <span className="gold">Impossible to Resist!</span></h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
          <p className="lead" data-reveal style={{ margin: 0 }}>From crispy classics to cheesy and fiery variations, we offer a flavor-packed adventure. Every bite is a new experience, with the perfect variety of delicious options to keep you coming back for more!</p>
          <div style={{ display: "flex", gap: 10 }}><button className="rnd" aria-label="Previous dishes" onClick={() => by(-1)}>←</button><button className="rnd" aria-label="Next dishes" onClick={() => by(1)}>→</button></div>
        </div>
      </div>
      <div className="rail" ref={rail} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} data-cursor="Drag" role="list">
        {FEATURED.map((f, i) => (
          <Link key={f.slug} href={`/menu/${f.slug}/`} className="dish" role="listitem" draggable={false}
            onClick={(e) => { if (drag.current.moved > 6) e.preventDefault(); }} aria-label={`${f.label} — view menu`}>
            <span className="big-no" aria-hidden>{String(i + 1).padStart(2, "0")}</span>
            <span className="no">{String(i + 1).padStart(2, "0")} / 12</span>
            <div className="pic">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={f.img} alt={f.label} loading="lazy" width={400} height={400} draggable={false} /></div>
            <div><h3>{f.label}</h3><div className="go"><span>View menu</span><i>→</i></div></div>
          </Link>
        ))}
        <Link href="/menu/" className="dish all" draggable={false} onClick={(e) => { if (drag.current.moved > 6) e.preventDefault(); }}>
          <span className="serif h3 gold">Explore<br />the full menu</span>
          <span className="btn">32 categories →</span>
        </Link>
      </div>
      <div className="wrap"><div className="rail-bar" aria-hidden><i ref={bar} style={{ transform: "scaleX(0.04)" }} /></div></div>
    </section>
  );
}
