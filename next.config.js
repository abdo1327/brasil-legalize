/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Don't disable outputFileTracing - it breaks Railway/container deployments
};

module.exports = nextConfig;
