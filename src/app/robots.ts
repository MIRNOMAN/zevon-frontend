import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/account",
          "/account/",
          "/checkout",
          "/cart",
          "/order/",
          "/api/",
          "/$",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

