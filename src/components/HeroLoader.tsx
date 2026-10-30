"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Hero = dynamic(() => import("./HeroScene"), { ssr: false });

/** Hero text paints first; the 3D scene (three.js chunk + textures) starts a beat later so it never blocks first paint. */
export default function HeroLoader() {
  const [on, setOn] = useState(false);
  useEffect(() => { const id = setTimeout(() => setOn(true), 80); return () => clearTimeout(id); }, []);
  return on ? <Hero /> : null;
}
