import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['@react-email/render', '@react-email/tailwind']
    },
    images: {
      remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'subdomain',
      },
      {
        protocol: 'https',
        hostname: 'files.stripe.com',
      },
      ],
    },
      reactStrictMode: false,

      async rewrites() {
        return [
          {
            source: '/uploads/:path*',
            destination: '/uploads/:path*',
          },
        ];
      },
};

export default withNextVideo(nextConfig);