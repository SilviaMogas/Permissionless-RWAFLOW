/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  // Skip static optimization for pages that require runtime environment variables
  skipTrailingSlashRedirect: true,
  trailingSlash: false,
}

export default nextConfig
