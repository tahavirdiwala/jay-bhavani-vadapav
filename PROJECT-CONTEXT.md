# Jay Bhavani Vadapav — premium revamp demo (Next.js + GSAP + Three.js)
Source site: https://jaybhavanivadapav.com (mirrored to `_scrape/mirror`, parsed into `src/lib/data.json` via `_tools/extract.py`; images → webp via `_tools/optimize.mjs`, 94MB → 9MB).
Brand direction from client (WhatsApp 30/10/2026): royal blue + gold, "a bit of yellow".
Fonts: ONLY Libre Baskerville (display) + DM Sans (body) — same pairing as Aviaura. Never add a third.
Stack: Next 16 static export (`output: export`, trailingSlash), Lenis, GSAP ScrollTrigger, three. Dev port 3418 (`npm run dev`).
Pages: / /about /menu /menu/[32 categories] /store-locator (203 stores) /franchise /catering /gallery /career /contact-us + sitemap/robots/_redirects (old .html → clean URLs; excotic→exotic).
3D/motion: HeroScene (orbiting dishes, click → menu), Globe (land mask + arcs), MenuRail (pinned h-scroll, snap-swipe on mobile), RingCarousel (from Kraheja), Voices (testimonial-style slider using MD/vision/mission — NO fake reviews), Timeline, tap ripple, tilt cards, magnetic buttons, cursor.
Forms are demo-only (LeadForm validates + toast); pass `action` URL to wire a backend.
Not done / ideas: real testimonials (client has none), Instagram feed, OG per page, deploy (Cloudflare), Lighthouse pass. Uncommitted, no git repo yet.
Gotchas: never put inline gridTemplateColumns on responsive grids; `.stat > span` scoping; GSAP vs CSS transition (motion.ts `free()`); don't `pkill -f "next dev"` (other projects) — kill by port pid.
