"use client";
import { useMemo, useState } from "react";
import { COUNTRIES, STORES, SITE } from "@/lib/data";

const label: Record<string, string> = { INDIA: "India", USA: "USA", CANADA: "Canada", AUSTRALIA: "Australia" };

export default function StoreExplorer({ initial = "INDIA" }: { initial?: string }) {
  const [c, setC] = useState(initial), [q, setQ] = useState(""), [city, setCity] = useState(""), [n, setN] = useState(24);
  const inC = useMemo(() => STORES.filter((s) => s.country === c), [c]);
  const cities = useMemo(() => Array.from(new Set(inC.map((s) => s.city))).sort(), [inC]);
  const list = useMemo(() => inC.filter((s) => (!city || s.city === city) && (!q || (s.address + s.city + s.region).toLowerCase().includes(q.toLowerCase()))), [inC, q, city]);
  return (
    <div>
      <div className="bar">
        <div className="tabs" role="tablist" aria-label="Country">
          {COUNTRIES.map((x) => <button key={x} role="tab" aria-selected={c === x} className={c === x ? "on" : ""} onClick={() => { setC(x); setCity(""); setQ(""); setN(24); }}>{label[x]}<b>{STORES.filter((s) => s.country === x).length}</b></button>)}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: "1 1 360px", justifyContent: "flex-end" }}>
          <select className="fld search" value={city} onChange={(e) => { setCity(e.target.value); setN(24); }} aria-label="Filter by city"><option value="">All cities ({cities.length})</option>{cities.map((x) => <option key={x}>{x}</option>)}</select>
          <input className="fld search" type="search" placeholder="Search area, address…" value={q} onChange={(e) => { setQ(e.target.value); setN(24); }} aria-label="Search stores" />
        </div>
      </div>
      {c !== "INDIA" && c !== "CANADA" && (
        <p className="note" style={{ marginBottom: 22 }}>
          {c === "USA" && <>Order online: <a className="link-u" href={SITE.orderUs} target="_blank" rel="noopener noreferrer">Suwanee ↗</a></>}
          {c === "AUSTRALIA" && <>Order online: {Object.entries(SITE.orderAu).map(([k, u]) => <a key={k} className="link-u" style={{ marginRight: 16 }} href={u} target="_blank" rel="noopener noreferrer">{k} ↗</a>)}</>}
        </p>
      )}
      <p className="note" aria-live="polite" style={{ marginBottom: 18 }}>{list.length} {list.length === 1 ? "store" : "stores"} {city && `in ${city}`}</p>
      <div className="stores">
        {list.slice(0, n).map((s, i) => (
          <article className="store" key={s.address + i} data-tilt>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="mono" src="/img/sticker-monogram.png" alt="" aria-hidden loading="lazy" />
            <div className="rg">{s.region}</div>
            <h3>{s.city}</h3>
            <p>{s.address}</p>
            <div className="hr"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f3dc8c" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{s.hours}</div>
            {s.map && <a className="btn sm ghost" href={s.map} target="_blank" rel="noopener noreferrer">Get Direction ↗</a>}
          </article>
        ))}
      </div>
      {n < list.length && <div style={{ textAlign: "center", marginTop: 44 }}><button className="btn" onClick={() => setN(n + 24)}>Show more ({list.length - n})</button></div>}
    </div>
  );
}
