"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURED } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

const SIZE = 3.0, GRID = 64;   // relief grid baked at build time (_tools/bake-dishes.mjs) → no image processing at runtime

/** Height-field (baked, base64) → displaced plane. seg must divide GRID. */
function reliefGeometry(b64: string, seg: number) {
  const bin = atob(b64), grid = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) grid[i] = bin.charCodeAt(i);
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, seg, seg), pos = geo.attributes.position as THREE.BufferAttribute, step = GRID / seg;
  for (let j = 0; j <= seg; j++) for (let i = 0; i <= seg; i++) pos.setZ(j * (seg + 1) + i, (grid[j * step * (GRID + 1) + i * step] / 255) * SIZE * 0.2);
  geo.computeVertexNormals();
  return geo;
}

/** Hero: 12 dishes orbit a golden halo in real 3D; pointer parallax; tap a dish to open its menu. */
export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const el = host.current!;
    let disposed = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    let pr = Math.min(window.devicePixelRatio, 1.5), accT = 0, accN = 0;
    const CAP = pr;
    renderer.setPixelRatio(pr);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.opacity = "0";
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0.6, 11);
    const world = new THREE.Group(); scene.add(world);
    const ring = new THREE.Group(); world.add(ring);

    /* lights: bright base (emissive photo) + warm key + blue rim give the relief its shading */
    scene.add(new THREE.AmbientLight(0xb8c6ff, 0.7));
    const key = new THREE.DirectionalLight(0xfff0d0, 1.9); key.position.set(-4, 5, 8); scene.add(key);
    const rim = new THREE.DirectionalLight(0x4f7bff, 1.5); rim.position.set(6, 1, -4); scene.add(rim);

    const MOB0 = window.innerWidth < 900;
    const N = FEATURED.length, R = MOB0 ? 3.1 : 5.0, SEG = window.innerWidth < 700 ? 32 : 64;
    const dishes: THREE.Mesh[] = [];
    let revealAt = 0;
    const reveal = () => { revealAt = performance.now(); renderer.domElement.style.transition = "opacity .6s ease"; renderer.domElement.style.opacity = "1"; };

    /* load everything in parallel, upload to the GPU, THEN show all dishes together */
    (async () => {
      const tl = new THREE.TextureLoader();
      const keyOf = (src: string) => src.split("/").pop()!.replace(".webp", "");
      const [heights, ...tex] = await Promise.all([
        fetch("/3d/heights.json").then((r) => r.json() as Promise<Record<string, string>>),
        ...FEATURED.flatMap((f) => [tl.loadAsync(f.img), tl.loadAsync(`/3d/${keyOf(f.img)}-n.png`)]),
      ]);
      if (disposed) { (tex as THREE.Texture[]).forEach((t) => t.dispose()); return; }
      FEATURED.forEach((f, i) => {
        const map = tex[i * 2] as THREE.Texture, normalMap = tex[i * 2 + 1] as THREE.Texture;
        map.colorSpace = THREE.SRGBColorSpace; map.anisotropy = 4;
        const mat = new THREE.MeshPhongMaterial({
          map, normalMap, normalScale: new THREE.Vector2(0.7, 0.7), emissive: 0xffffff, emissiveMap: map, emissiveIntensity: 0.5,
          alphaTest: 0.82, alphaToCoverage: true, shininess: 28, specular: 0x7a6630, side: THREE.DoubleSide,
        });
        const m = new THREE.Mesh(reliefGeometry(heights[keyOf(f.img)], SEG), mat);
        const a = (i / N) * Math.PI * 2;
        m.position.set(Math.sin(a) * R, Math.sin(i * 1.7) * 0.45, Math.cos(a) * R);
        m.userData = { a, slug: f.slug, label: f.label, base: m.position.y, s: 0.001 };
        m.scale.setScalar(0.001);
        const sph = new THREE.Sphere(), tmp = new THREE.Vector3();
        m.raycast = (rc, out) => {                                           // sphere proxy: O(1) instead of every triangle
          m.getWorldPosition(sph.center); sph.radius = 1.05 * m.scale.x * world.scale.x;
          const hit = rc.ray.intersectSphere(sph, tmp);
          if (hit) out.push({ distance: rc.ray.origin.distanceTo(hit), point: hit.clone(), object: m });
        };
        renderer.initTexture(map); renderer.initTexture(normalMap);          // pre-upload so the first frame doesn't hitch
        ring.add(m); dishes.push(m);
      });
      requestAnimationFrame(() => requestAnimationFrame(() => {             // one warm-up frame, then reveal
        if (disposed) return;
        renderer.render(scene, camera);
        if ((window as unknown as { __jbReady?: boolean }).__jbReady) reveal(); else window.addEventListener("jb:ready", reveal, { once: true });
      }));
    })();

    /* halo rings + wireframe orb */
    const halo = new THREE.Mesh(new THREE.TorusGeometry(R, 0.045, 12, 180), new THREE.MeshBasicMaterial({ color: 0xffed00 })); halo.rotation.x = Math.PI / 2; ring.add(halo);
    const halo2 = new THREE.Mesh(new THREE.TorusGeometry(R * 0.72, 0.03, 12, 160), new THREE.MeshBasicMaterial({ color: 0x5b86ff })); halo2.rotation.x = Math.PI / 2; ring.add(halo2);
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15, 2), new THREE.MeshBasicMaterial({ color: 0xffd45c, wireframe: true, transparent: true, opacity: 0.85 })); ring.add(orb);

    /* layout: ring is centred in the right half of the viewport */
    const mouse = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, scroll = { p: 0 };
    let tilt = 0.16;
    const layout = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix();
      const mob = w < 900;
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 11, halfW = halfH * camera.aspect;
      tilt = mob ? 0.62 : 0.34; world.rotation.z = mob ? -0.1 : -0.09;                       // phones/tablets: view the ring from above + a slight slant so every dish is visible
      if (mob) { world.position.set(0, halfH * 0.46, 0); world.scale.setScalar(Math.min(0.62, (halfW * 0.9) / (R + 1.7))); }
      else { world.position.set(halfW * 0.5, -0.05, 0); world.scale.setScalar(Math.min(0.9, (halfW * 0.56 * 0.9) / 7.0, (halfH * 0.95) / 3.8)); }
    };
    layout();
    const ro = new ResizeObserver(layout); ro.observe(el);

    /* interaction (hit-testing throttled to once per frame) */
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    let hover: THREE.Mesh | null = null, lastE: PointerEvent | null = null, pickRaf = 0;
    const toNdc = (e: PointerEvent) => { const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); };
    const pick = () => { ray.setFromCamera(ndc, camera); const hit = ray.intersectObjects(dishes)[0]; return (hit?.object as THREE.Mesh) || null; };
    const curEl = document.querySelector<HTMLElement>(".cursor"), curLab = document.querySelector<HTMLElement>(".cursor span");
    const doPick = () => {
      pickRaf = 0; if (!lastE) return;
      toNdc(lastE); const h = pick();
      if (h !== hover) { hover = h; renderer.domElement.style.cursor = h ? "pointer" : ""; curEl?.classList.toggle("big", !!h); if (curLab) curLab.textContent = h ? h.userData.label : ""; }
    };
    const onMove = (e: PointerEvent) => { mouse.x = (e.clientX / window.innerWidth - 0.5) * 2; mouse.y = (e.clientY / window.innerHeight - 0.5) * 2; lastE = e; if (!pickRaf) pickRaf = requestAnimationFrame(doPick); };
    const onDown = (e: PointerEvent) => {
      toNdc(e); const h = pick(); if (!h) return;
      gsap.timeline().to(h.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.18, ease: "power2.out" }).to(h.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: "elastic.out(1,.35)" });
      gsap.to(h.rotation, { y: h.rotation.y + Math.PI * 2, duration: 0.9, ease: "power3.inOut", onComplete: () => router.push(`/menu/${h.userData.slug}/`) });
    };
    el.addEventListener("pointermove", onMove, { passive: true }); el.addEventListener("pointerdown", onDown);

    const st = ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom top", scrub: true, onUpdate: (s) => { scroll.p = s.progress; } });
    let vis = true;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0 }); io.observe(el);

    let lastT = performance.now(), elT = 0, raf = 0, spin = 0;
    const wp = new THREE.Vector3();
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = performance.now(), dt = Math.min((now - lastT) / 1000, 0.05); lastT = now;
      if (!vis || document.hidden) return;
      elT += dt; const t = elT;
      cur.x += (mouse.x - cur.x) * 0.05; cur.y += (mouse.y - cur.y) * 0.05;
      if (!reduce) spin += dt * (hover ? 0.05 : 0.22);
      ring.rotation.y = spin + scroll.p * 2.4 + cur.x * 0.35;
      ring.rotation.x = tilt + cur.y * 0.1 + scroll.p * 0.3;
      orb.rotation.y -= dt * 0.3; orb.rotation.x += dt * 0.2;
      camera.position.z = 11 + scroll.p * 3; camera.lookAt(0, 0, 0);
      dishes.forEach((d, idx) => {
        d.getWorldPosition(wp);
        d.lookAt(camera.position);
        d.rotateY(Math.sin(t * 0.7 + d.userData.a * 2) * 0.32 + cur.x * 0.35);
        d.rotateX(Math.sin(t * 0.55 + idx) * 0.12 - cur.y * 0.22 - 0.08);
        d.position.y = d.userData.base + Math.sin(t * 1.1 + d.userData.a * 3) * 0.12;
        const front = THREE.MathUtils.clamp((wp.z - world.position.z + R) / (2 * R), 0, 1);
        const born = revealAt ? Math.min(1, (now - revealAt - idx * 70) / 800) : 0, pop = born <= 0 ? 0 : 1 - Math.pow(1 - born, 3);
        const target = (d === hover ? 1.12 : (MOB0 ? 0.62 : 0.6) + front * (MOB0 ? 0.3 : 0.3)) * pop;
        d.userData.s += (target - d.userData.s) * 0.14;
        if (!gsap.isTweening(d.scale)) d.scale.setScalar(Math.max(0.001, d.userData.s));
        (d.material as THREE.MeshPhongMaterial).color.setScalar(0.62 + front * 0.38);
        d.renderOrder = Math.round(front * 10);
      });
      renderer.render(scene, camera);
      accT += dt; accN++;                                                    // adaptive resolution
      if (accN === 40) {
        const avg = accT / accN;
        if (avg > 0.024 && pr > 0.55) { pr = Math.max(0.55, pr * 0.82); renderer.setPixelRatio(pr); layout(); }
        else if (avg < 0.0135 && pr < CAP) { pr = Math.min(CAP, pr * 1.1); renderer.setPixelRatio(pr); layout(); }
        accT = 0; accN = 0;
      }
    };
    loop();

    return () => {
      disposed = true; cancelAnimationFrame(raf); cancelAnimationFrame(pickRaf); ro.disconnect(); io.disconnect(); st.kill();
      window.removeEventListener("jb:ready", reveal);
      el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerdown", onDown);
      dishes.forEach((d) => { const m = d.material as THREE.MeshPhongMaterial; m.map?.dispose(); m.normalMap?.dispose(); d.geometry.dispose(); m.dispose(); });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, [router]);

  return <div ref={host} style={{ position: "absolute", inset: 0 }} aria-hidden="true" />;
}
