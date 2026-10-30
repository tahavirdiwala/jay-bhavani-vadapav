import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Splits text nodes of an element into masked words so they can slide up. Text stays in the DOM for SEO / a11y. */
function splitWords(el: HTMLElement) {
  if (el.dataset.done) return Array.from(el.querySelectorAll<HTMLElement>(".sp > i"));
  el.dataset.done = "1";
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (n.textContent || "").split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(" ")); return; }
          const o = document.createElement("span"); o.className = "sp";
          const i = document.createElement("i"); i.textContent = w; o.appendChild(i); frag.appendChild(o);
        });
        n.parentNode!.replaceChild(frag, n);
      } else if (n.nodeType === 1 && !(n as HTMLElement).classList.contains("sp")) walk(n);
    });
  };
  walk(el);
  return Array.from(el.querySelectorAll<HTMLElement>(".sp > i"));
}

/** Suspend CSS transitions while GSAP drives opacity/transform, then hand the element back to its stylesheet (hover states keep working). */
function free(els: HTMLElement[]): gsap.TweenVars {
  return {
    onStart: () => els.forEach((e) => (e.style.transition = "none")),
    onComplete: () => els.forEach((e) => { e.style.transition = ""; gsap.set(e, { clearProps: "transform,opacity,clipPath,scale" }); }),
  };
}

export function initMotion() {
  return gsap.context(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
      const words = splitWords(el);
      if (reduce) return;
      gsap.fromTo(words, { yPercent: 115, rotate: 4 }, {
        yPercent: 0, rotate: 0, duration: 1.15, ease: "power4.out", stagger: 0.045,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        delay: Number(el.dataset.delay || 0),
      });
    });

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (reduce) return;
      const k = el.dataset.reveal;
      const from: gsap.TweenVars = { opacity: 0, duration: 1.2, ease: "power3.out" };
      if (k === "left") from.x = -80; else if (k === "right") from.x = 80;
      else if (k === "scale") from.scale = 0.88;
      else if (k === "clip") { from.clipPath = "inset(0 0 100% 0)"; from.scale = 1.08; from.duration = 1.5; from.ease = "expo.out"; }
      else from.y = 56;
      gsap.from(el, { ...from, delay: Number(el.dataset.delay || 0), scrollTrigger: { trigger: el, start: "top 90%", once: true }, ...free([el]) });
    });

    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((p) => {
      if (reduce) return;
      const kids = Array.from(p.children) as HTMLElement[];
      gsap.from(kids, { opacity: 0, y: 70, duration: 1.1, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: p, start: "top 86%", once: true }, ...free(kids) });
    });

    document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
      if (reduce) return;
      const s = Number(el.dataset.parallax) || 0.15;
      gsap.fromTo(el, { yPercent: -s * 100 }, { yPercent: s * 100, ease: "none", scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true } });
    });

    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const to = Number(el.dataset.count), suf = el.dataset.suffix || "", o = { v: 0 };
      if (reduce) { el.textContent = to + suf; return; }
      gsap.to(o, { v: to, duration: 2.2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 92%", once: true }, onUpdate: () => { el.textContent = Math.round(o.v) + suf; } });
    });
  });
}
