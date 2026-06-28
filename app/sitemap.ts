import type { MetadataRoute } from "next";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const SITE_URL = "https://www.coxwalkerjewelryllc.com";
const ROOT_DIR = process.cwd();
const HOME_FILE = "index.html";
const EXCLUDED_FILES = new Set(["404.html"]);

const toUrl = (fileName: string) =>
  fileName === HOME_FILE ? `${SITE_URL}/` : `${SITE_URL}/${fileName}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await readdir(ROOT_DIR, { withFileTypes: true });
  const htmlPages = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".html") &&
        !EXCLUDED_FILES.has(entry.name)
    )
    .sort((left, right) => {
      if (left.name === HOME_FILE) return -1;
      if (right.name === HOME_FILE) return 1;
      return left.name.localeCompare(right.name);
    });

  return Promise.all(
    htmlPages.map(async (entry) => {
      const filePath = path.join(ROOT_DIR, entry.name);
      const fileStats = await stat(filePath);

      return {
        url: toUrl(entry.name),
        lastModified: fileStats.mtime,
      };
    })
  );
}

