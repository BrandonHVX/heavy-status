/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['*.replit.dev', '*.repl.co'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'heavy-status.com',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
    ],
  },
  env: {
    WORDPRESS_GRAPHQL_URL: process.env.WORDPRESS_GRAPHQL_URL || 'https://heavy-status.com/graphql',
  },
};

export default nextConfig;
