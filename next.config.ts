import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["34vzegrc44.ufs.sh", "maroon-quiet-crab-480.mypinata.cloud"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.mypinata.cloud",
      },
      {
        protocol: "https",
        hostname: "34vzegrc44.ufs.sh",
      },
    ],
  },
  trailingSlash: true,
  // Enable standalone output for better Vercel deployment
  output: "standalone",
  // Compress responses
  compress: true,
  // Configure headers for API CORS
  async headers() {
    return [
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
