import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // 1. Fix Broken Link / Typo ('/$' and encoded '/%24' to root '/')
      {
        source: "/$",
        destination: "/",
        permanent: true,
      },
      {
        source: "/%24",
        destination: "/",
        permanent: true,
      },

      // 2. Discontinued / Deleted Product 301 Permanent Redirects to /shop
      {
        source: "/products/monochrome-heavy-knit-co-ord-set",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/products/vintage-washed-canvas-distressed-dad-cap",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/products/monochrome-ribbed-knit-two-piece-co-ord",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/products/high-waisted-tailored-pleated-trousers",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/products/280-gsm-acid-washed-boxy-tee",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/products/structured-oversized-trench-coat",
        destination: "/shop",
        permanent: true,
      },

      // 3. Fallback for /products itself to /shop (to prevent 404 on product directory)
      {
        source: "/products",
        destination: "/shop",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
