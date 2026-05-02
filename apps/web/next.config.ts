import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@radar/ui', '@radar/api-contracts', '@radar/shared'],
  experimental: {
    typedRoutes: true,
  },
};

export default config;
