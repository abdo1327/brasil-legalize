/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Standard build for Railway - no standalone due to route group issues
};

module.exports = nextConfig;
