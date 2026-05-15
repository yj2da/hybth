/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/hybth',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
