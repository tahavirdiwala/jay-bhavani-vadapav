import Link from "next/link";
export default function PageHead({ eyebrow, title, accent, ghost, crumbs, children }: { eyebrow: string; title: string; accent?: string; ghost?: string; crumbs: { name: string; href?: string }[]; children?: React.ReactNode }) {
  return (
    <section className="ph-h">
      <div className="ghost-t serif" aria-hidden data-parallax="0.08">{ghost || accent || title}</div>
      <div className="wrap" style={{ position: "relative" }}>
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="serif h1" data-split>{title} {accent && <span className="gold">{accent}</span>}</h1>
        {children && <p className="lead" style={{ marginTop: 24 }} data-reveal>{children}</p>}
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((c) => <span key={c.name} style={{ display: "contents" }}><i>/</i>{c.href ? <Link href={c.href}>{c.name}</Link> : <span>{c.name}</span>}</span>)}
        </nav>
      </div>
    </section>
  );
}
