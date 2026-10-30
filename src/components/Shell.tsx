"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./Header";
import Footer from "./Footer";
import Cursor from "./Cursor";
import Preloader from "./Preloader";
import OrderModal from "./OrderModal";
import { initMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);
if (typeof window !== "undefined") (window as unknown as { __ST: typeof ScrollTrigger }).__ST = ScrollTrigger;

type Ctx = { openOrder: () => void; toast: (m: string) => void; lenis: React.RefObject<Lenis | null> };
const C = createContext<Ctx>(null as never);
export const useShell = () => useContext(C);

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const lenis = useRef<Lenis | null>(null);
  const [order, setOrder] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); l.destroy(); };
  }, []);

  /* magnetic buttons + 3D tilt cards: a single pointer listener, work done at most once per frame */
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let mag: HTMLElement | null = null, tilt: HTMLElement | null = null, ev: PointerEvent | null = null, raf = 0;
    const frame = () => {
      raf = 0; if (!ev) return;
      const t = ev.target as HTMLElement | null;
      const b = t?.closest?.<HTMLElement>(".btn, .rnd") || null;
      if (mag && mag !== b) gsap.to(mag, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,.4)", overwrite: "auto" });
      mag = b;
      if (b) { const r = b.getBoundingClientRect(); gsap.to(b, { x: (ev.clientX - r.left - r.width / 2) * 0.25, y: (ev.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: "power3.out", overwrite: "auto" }); }
      const c = t?.closest?.<HTMLElement>("[data-tilt]") || null;
      if (tilt && tilt !== c) gsap.to(tilt, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
      tilt = c;
      if (c) {
        const r = c.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
        c.style.setProperty("--mx", px * 100 + "%"); c.style.setProperty("--my", py * 100 + "%");
        gsap.to(c, { rotateY: (px - 0.5) * 12, rotateX: -(py - 0.5) * 12, transformPerspective: 900, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      }
    };
    const mv = (e: PointerEvent) => { ev = e; if (!raf) raf = requestAnimationFrame(frame); };
    window.addEventListener("pointermove", mv, { passive: true });
    return () => { window.removeEventListener("pointermove", mv); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true });
    const ctx = initMotion();
    const r = setTimeout(() => ScrollTrigger.refresh(), 500);
    const late = setTimeout(() => ScrollTrigger.refresh(), 2000);
    return () => { clearTimeout(r); clearTimeout(late); ctx.revert(); };
  }, [path]);

  useEffect(() => { if (order) lenis.current?.stop(); else lenis.current?.start(); }, [order]);

  const toast = useCallback((m: string) => {
    setMsg(m); clearTimeout(timer.current); timer.current = setTimeout(() => setMsg(null), 5200);
  }, []);
  const openOrder = useCallback(() => setOrder(true), []);

  return (
    <C.Provider value={{ openOrder, toast, lenis }}>
      <Preloader />
      <Cursor />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <OrderModal open={order} onClose={() => setOrder(false)} />
      <div className="toast" role="status" aria-live="polite" style={{ transform: msg ? "translate(-50%,0)" : undefined, transition: "transform .7s cubic-bezier(.16,1,.3,1)" }}>
        <svg width="24" height="24" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="12" stroke="#f3dc8c" /><path d="M7.5 13.5l4 4 7-8" stroke="#f3dc8c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>{msg}</span>
      </div>
    </C.Provider>
  );
}
