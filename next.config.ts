import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /writing moved to /personal-writing; the old technical notes at /writing/<slug> were removed.
  async redirects() {
    return [
      { source: "/writing", destination: "/personal-writing", permanent: true },
      { source: "/writing/personal/:slug", destination: "/personal-writing/:slug", permanent: true },
      { source: "/writing/:slug", destination: "/blogs", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "codescene.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.modern.ai",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "deifkwefumgah.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;