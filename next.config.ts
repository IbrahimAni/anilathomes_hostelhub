import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname),
    };
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        '@': path.join(__dirname)
      }
    }
  }
};

export default nextConfig;
