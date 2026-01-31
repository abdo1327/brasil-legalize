/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['argon2', 'pg'],
  },
};

module.exports = nextConfig;
