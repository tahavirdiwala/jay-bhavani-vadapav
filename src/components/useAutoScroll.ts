import { useEffect } from "react";
import type { RefObject } from "react";

/** Gentle ping-pong autoplay for a horizontally scrollable strip. Pauses on hover/touch/drag/arrow-use, when off-screen
 *  or when the tab is hidden, and resumes by itself. */
export function useAutoScroll(ref: RefObject<HTMLElement | null>, speed = 40) {
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let pos = el.scrollLeft, dir = 1, last = performance.now(), raf = 0, vis = false, hover = false, until = 0;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(el);
    const pause = (ms = 3000) => { until = performance.now() + ms; };
    const enter = () => { hover = true; };
    const leave = () => { hover = false; pause(1800); };
    const sec = el.closest("section") || el;
    el.addEventListener("pointerenter", enter); el.addEventListener("pointerleave", leave);
    el.addEventListener("touchstart", () => pause(4000), { passive: true });
    el.addEventListener("wheel", () => pause(3000), { passive: true });
    sec.addEventListener("pointerdown", () => pause(4000));
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      if (!vis || document.hidden || hover || now < until) { pos = el.scrollLeft; return; }
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      pos += speed * dir * dt;
      if (pos >= max) { pos = max; dir = -1; until = now + 1400; } else if (pos <= 0) { pos = 0; dir = 1; until = now + 1400; }
      el.scrollLeft = pos;
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
  }, [ref, speed]);
}
