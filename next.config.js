/** @type {import('next').NextConfig} */
require("dotenv").config();

const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_ENDPOINT_BASE: process.env.NEXT_PUBLIC_ENDPOINT_BASE,
  },
  images: {
    domains: ["ipfs.io"], // Allow IPFS images to be used
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${
          process.env.BACKEND_URL ?? "http://backend-service:3500"
        }/v1/:path*`, // Adjust the URL if needed
      },
    ];
  },
};

module.exports = nextConfig;
