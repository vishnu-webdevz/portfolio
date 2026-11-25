import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { site } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...getAllPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.date, priority: 0.7 })),
  ];
}
