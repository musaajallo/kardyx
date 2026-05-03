import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@kardyx/ui', '@kardyx/tokens', '@kardyx/types'],
  experimental: {
    typedRoutes: true,
  },
};

export default config;
