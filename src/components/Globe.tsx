"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { LAND, LAND_H, LAND_W } from "@/lib/land";

type LL = [number, number];
const HOME: LL = [23.02, 72.57]; // Ahmedabad
const NODES: LL[] = [
  [28.6, 77.2], [24.6, 73.7], [19.07, 72.87],                                  // India
  [43.65, -79.38], [45.5, -73.57], [42.98, -81.25], [42.3, -83.0],             // Canada
  [40.5, -74.4], [34.05, -84.07], [42.0, -88.0], [29.76, -95.37], [27.95, -82.46], [40.2, -77.0], [35.3, -119.0], // USA
  [-35.28, 149.13], [-37.9, 145.1], [-27.47, 153.02], [-34.92, 138.6], [-33.87, 151.2], // Australia
];
const v = (lat: number, lon: number, r: number) => {
  const phi = (90 - lat) * (Math.PI / 180), th = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
};

/** Dotted world globe: land from a real mask, gold store beacons and animated arcs from Ahmedabad. Drag to spin. */
export default function Globe() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    let pr = Math.min(devicePixelRatio, 1.5), accT = 0, accN = 0; const CAP = pr;
    renderer.setPixelRatio(pr); el.appendChild(renderer.domElement);
    const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(32, 1, 0.1, 50); cam.position.z = 6.3;
    const globe = new THREE.Group(); scene.add(globe);
    const R = 1.6;

    globe.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.995, 64, 64), new THREE.MeshBasicMaterial({ color: 0x07163f })));
    // land dots
    const pts: number[] = [];
    for (let y = 0; y < LAND_H; y++) for (let x = 0; x < LAND_W; x++) if (LAND[y * LAND_W + x] === "1") {
      const lat = 90 - (y + 0.5) * (180 / LAND_H), lon = (x + 0.5) * (360 / LAND_W) - 180;
      const p = v(lat, lon, R); pts.push(p.x, p.y, p.z);
    }
    const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    globe.add(new THREE.Points(lg, new THREE.PointsMaterial({ color: 0x8fb0ff, size: 0.032, sizeAttenuation: true, transparent: true, opacity: 0.95 })));
    // atmosphere
    const atm = new THREE.Mesh(new THREE.SphereGeometry(R * 1.1, 48, 48), new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
      vertexShader: "varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader: "varying vec3 n;void main(){float i=pow(.72-dot(n,vec3(0,0,1.)),3.);gl_FragColor=vec4(.35,.52,1.,1.)*i*0.9;}",
    }));
    scene.add(atm);

    // beacons + arcs
    const gold = new THREE.MeshBasicMaterial({ color: 0xf3dc8c });
    const beacons: THREE.Mesh[] = [];
    [HOME, ...NODES].forEach((n, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(i === 0 ? 0.045 : 0.026, 16, 16), gold); m.position.copy(v(n[0], n[1], R * 1.004)); globe.add(m);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.036, 32), new THREE.MeshBasicMaterial({ color: 0xffd60a, transparent: true, side: THREE.DoubleSide }));
      ring.position.copy(m.position); ring.lookAt(0, 0, 0); ring.userData.o = Math.random(); globe.add(ring); beacons.push(ring);
    });
    const arcs: { line: THREE.Line; n: number }[] = [];
    NODES.forEach((n) => {
      const a = v(HOME[0], HOME[1], R), b = v(n[0], n[1], R);
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * (1 + a.distanceTo(b) * 0.16));
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b), p = curve.getPoints(60);
      const geo = new THREE.BufferGeometry().setFromPoints(p); geo.setDrawRange(0, 0);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xf3dc8c, transparent: true, opacity: 0.8 }));
      globe.add(line); arcs.push({ line, n: p.length });
    });

    globe.rotation.set(0.3, -2.84, 0); // start facing India
    let rotY = globe.rotation.y, vel = 0, drag = false, lx = 0, vis = true;
    const size = () => { const w = el.clientWidth; renderer.setSize(w, w); cam.aspect = 1; cam.updateProjectionMatrix(); };
    size(); const ro = new ResizeObserver(size); ro.observe(el);
    const down = (e: PointerEvent) => { drag = true; lx = e.clientX; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (!drag) return; vel = (e.clientX - lx) * 0.006; rotY += vel; lx = e.clientX; };
    const up = () => { drag = false; };
    el.addEventListener("pointerdown", down); el.addEventListener("pointermove", move); el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }); io.observe(el);

    let lastT = performance.now(), el_t = 0; let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop); if (!vis) return;
      const now = performance.now(), dtG = Math.min((now - lastT) / 1000, 0.05); el_t += dtG; lastT = now; const t = el_t;
      if (!drag) { vel *= 0.95; rotY += vel + (reduce ? 0 : 0.0028); }
      globe.rotation.y = rotY;
      arcs.forEach((a, i) => { const k = ((t * 0.22 + i * 0.11) % 1.6); const c = Math.min(a.n, Math.floor(Math.min(k, 1) * a.n)); a.line.geometry.setDrawRange(0, c); (a.line.material as THREE.LineBasicMaterial).opacity = k > 1 ? Math.max(0, 1 - (k - 1) / 0.6) * 0.8 : 0.8; });
      beacons.forEach((b) => { const k = (t * 0.7 + b.userData.o) % 1; b.scale.setScalar(1 + k * 3.2); (b.material as THREE.MeshBasicMaterial).opacity = 1 - k; });
      renderer.render(scene, cam);
      accT += dtG; accN++;
      if (accN === 40) {
        const avg = accT / accN;
        if (avg > 0.024 && pr > 0.55) { pr = Math.max(0.55, pr * 0.82); renderer.setPixelRatio(pr); size(); }
        else if (avg < 0.0135 && pr < CAP) { pr = Math.min(CAP, pr * 1.1); renderer.setPixelRatio(pr); size(); }
        accT = 0; accN = 0;
      }
    };
    loop();
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
      scene.traverse((o) => { const m = o as THREE.Mesh; m.geometry?.dispose?.(); (m.material as THREE.Material)?.dispose?.(); });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div ref={host} className="globe-box" role="img" aria-label="Interactive globe showing Jay Bhavani outlets across India, USA, Canada and Australia" data-cursor="Drag" />;
}
