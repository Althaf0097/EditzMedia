import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thdsfipfnojdxzwelbri.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
