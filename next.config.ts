import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["91.99.72.86"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
