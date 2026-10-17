import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    ["", 1], ["/about", 0.8], ["/services", 0.9], ["/faq", 0.7],
    ["/contact", 0.8], ["/hospital-app", 0.6], ["/privacy-policy", 0.3],
    ["/terms-and-conditions", 0.3], ["/medical-disclaimer", 0.3]
  ] as const;
  return pages.map(([path, priority]) => ({
    url: `https://omololuhospital.com${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority,
  }));
}