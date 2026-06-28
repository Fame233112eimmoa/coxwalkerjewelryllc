import type { MetadataRoute } from "next";
import { stat } from "node:fs/promises";
import path from "node:path";
import { siteRoutes } from "../lib/site-routes";

const SITE_URL = "https://coxwalkerjewelryllc.com";
const ROOT_DIR = process.cwd();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return Promise.all(
    siteRoutes.map(async (route) => {
      const filePath = path.join(ROOT_DIR, route.fileName);
      const fileStats = await stat(filePath);

      return {
        url: `${SITE_URL}${route.pathname}`,
        lastModified: fileStats.mtime,
        changeFrequency: "weekly",
        priority: route.priority,
      };
    })
  );
}
