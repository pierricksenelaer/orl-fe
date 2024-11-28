/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**/**/2.jpg",
      },
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
        port: "",
        pathname: "/video/**",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
