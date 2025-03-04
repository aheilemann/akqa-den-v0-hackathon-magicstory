import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "eujhdaaodhbravffsyrx.supabase.co",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "replicate.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery",
        pathname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
