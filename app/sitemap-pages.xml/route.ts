import { buildPageSitemapXml } from "../../lib/sitemap-xml";

export const revalidate = 86400;

export async function GET() {
  return new Response(await buildPageSitemapXml(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

