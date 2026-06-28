import { buildImageSitemapXml } from "../../lib/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  return new Response(await buildImageSitemapXml(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

