"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

/** The globe's WebGL context is only created when the section is about to scroll into view. */
export default function GlobeLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "700px 0px" });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  return <div ref={ref}>{on ? <Globe /> : <div className="globe-box" />}</div>;
}
