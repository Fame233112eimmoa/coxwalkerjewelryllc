import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { siteRoutes } from "./site-routes";

const ROOT_DIR = process.cwd();
const SITE_URL = "https://coxwalkerjewelryllc.com";

const xmlEscape = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const assetUrl = (assetPath: string) =>
  `${SITE_URL}/${assetPath.replace(/^\.?\//, "")}`;

const extractImages = (html: string) =>
  [...html.matchAll(/<img[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]*)"/g)]
    .map(([, src, alt]) => ({
      alt: alt.trim(),
      src,
    }))
    .filter((image) => !image.src.startsWith("data:"));

export async function buildPageSitemapXml() {
  const pages = await Promise.all(
    siteRoutes.map(async (route) => {
      const fileStats = await stat(path.join(ROOT_DIR, route.fileName));

      return {
        lastModified: fileStats.mtime.toISOString(),
        pathname: route.pathname,
        priority: route.priority.toFixed(1),
      };
    })
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${xmlEscape(`${SITE_URL}${page.pathname}`)}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

export async function buildImageSitemapXml() {
  const pages = await Promise.all(
    siteRoutes.map(async (route) => {
      const html = await readFile(path.join(ROOT_DIR, route.fileName), "utf8");

      return {
        images: extractImages(html),
        pathname: route.pathname,
      };
    })
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .filter((page) => page.images.length > 0)
  .map((page) => {
    const images = page.images
      .map(
        (image) => `    <image:image>
      <image:loc>${xmlEscape(assetUrl(image.src))}</image:loc>
      <image:caption>${xmlEscape(image.alt || "Cox Walker Jewelry LLC image")}</image:caption>
    </image:image>`
      )
      .join("\n");

    return `  <url>
    <loc>${xmlEscape(`${SITE_URL}${page.pathname}`)}</loc>
${images}
  </url>`;
  })
  .join("\n")}
</urlset>
`;
}
