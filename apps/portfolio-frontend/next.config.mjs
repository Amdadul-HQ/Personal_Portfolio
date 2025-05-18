/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui","locomotive-scroll"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

export default nextConfig
