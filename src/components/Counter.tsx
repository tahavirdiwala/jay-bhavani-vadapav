export default function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  /* server-rendered with the final value (SEO / no-JS); motion.ts animates it from 0 */
  return <span data-count={to} data-suffix={suffix}>{to}{suffix}</span>;
}
