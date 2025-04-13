import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
  },
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