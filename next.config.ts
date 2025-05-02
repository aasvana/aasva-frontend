import type { NextConfig } from "next";
import reroutes from "./src/resources/router/reroute.json";

const nextConfig: NextConfig = {
  async rewrites() {
    return reroutes;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
