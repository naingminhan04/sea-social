import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "famlinkapi.onrender.com",
        pathname: "/**",
      },
    ],
  },
  experimental : {
    turbopackFileSystemCacheForDev: true,
    serverActions: {
      bodySizeLimit: '10mb',
    }
  },
  reactCompiler: true,
  cacheComponents: true,
};

export default nextConfig;