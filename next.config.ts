import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['unpdf'],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
