import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dpdrrpowyffhrqwjtsoq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/**',
        search: '',
      },
    ],
  },
};

export default nextConfig;
