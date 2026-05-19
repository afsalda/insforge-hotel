/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.insforge.app',
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy InsForge API requests in production
      {
        source: '/api/database/:path*',
        destination: `${process.env.NEXT_PUBLIC_INSFORGE_URL}/api/database/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
