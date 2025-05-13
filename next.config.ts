import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/auth",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;