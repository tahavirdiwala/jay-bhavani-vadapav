"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const el = ref.current!;
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    const mv = (e: MouseEvent) => { x(e.clientX); y(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      if (t) { label.current!.textContent = t.dataset.cursor || ""; el.classList.add("big"); } else el.classList.remove("big");
    };
    /* gold ripple + spark burst on every tap / click (touch included) */
    const tap = (e: PointerEvent) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const r = document.createElement("div"); r.className = "tap"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px";
      document.body.appendChild(r);
      gsap.fromTo(r, { scale: 0.4, opacity: 1 }, { scale: 4.2, opacity: 0, duration: 0.85, ease: "power3.out", onComplete: () => r.remove() });
      for (let i = 0; i < 9; i++) {
        const d = document.createElement("div"); d.className = "tap-dot"; d.style.left = e.clientX + "px"; d.style.top = e.clientY + "px";
        document.body.appendChild(d);
        const a = (i / 9) * Math.PI * 2 + Math.random() * 0.5, dist = 36 + Math.random() * 46;
        gsap.fromTo(d, { x: 0, y: 0, opacity: 1, scale: 1 }, { x: Math.cos(a) * dist, y: Math.sin(a) * dist, opacity: 0, scale: 0.2, duration: 0.7 + Math.random() * 0.3, ease: "power2.out", onComplete: () => d.remove() });
      }
    };
    window.addEventListener("pointerdown", tap);
    if (fine) { window.addEventListener("mousemove", mv); window.addEventListener("mouseover", over); }
    return () => { window.removeEventListener("pointerdown", tap); window.removeEventListener("mousemove", mv); window.removeEventListener("mouseover", over); };
  }, []);
  return <div ref={ref} className="cursor" aria-hidden><span ref={label} /></div>;
}
