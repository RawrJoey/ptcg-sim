/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html'
      }
    ]
  }
}

module.exports = nextConfig
