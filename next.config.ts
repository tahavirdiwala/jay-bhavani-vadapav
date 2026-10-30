import type { NextConfig } from "next";
const nextConfig: NextConfig = { output: "export", trailingSlash: true, images: { unoptimized: true }, devIndicators: false, reactStrictMode: false };
export default nextConfig;
