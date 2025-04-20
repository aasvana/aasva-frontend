import type { NextConfig } from "next";
import routes from "./src/resources/router/routes.json";

const nextConfig: NextConfig = {
  async rewrites() {
    return routes;
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
