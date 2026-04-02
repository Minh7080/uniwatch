import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.redditmedia.com",
      },
      {
        protocol: "https",
        hostname: "**.redd.it",
      },
    ],
  },
};

export default nextConfig;
