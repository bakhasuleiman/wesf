/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    NODE_ENV: process.env.NODE_ENV || 'production'
  }
}

export default nextConfig 