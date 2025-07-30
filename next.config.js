/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // For Electron static build
  trailingSlash: true,
  images: {
    unoptimized: true // For Electron
  },
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig
