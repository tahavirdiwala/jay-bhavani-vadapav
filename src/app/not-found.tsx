import Link from "next/link";
export default function NF() {
  return <section className="ph-h" style={{ minHeight: "80vh", display: "grid", alignItems: "center" }}><div className="wrap"><div className="eyebrow">404</div><h1 className="serif h1" style={{ margin: "18px 0 24px" }}>This <span className="gold">vadapav</span> got eaten.</h1><p className="lead" style={{ marginBottom: 30 }}>The page you’re looking for isn’t here.</p><Link href="/" className="btn">Back home</Link></div></section>;
}
