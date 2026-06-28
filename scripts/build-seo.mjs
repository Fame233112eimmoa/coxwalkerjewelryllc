import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://www.coxwalkerjewelryllc.com";
const companyName = "Cox Walker Jewelry LLC";
const companyEmail = "info@coxwalkerjewelryllc.com";
const companyPhone = "+1-416-555-0184";
const today = new Date().toISOString().slice(0, 10);

const noIndexPages = new Set(["404.html"]);
const jewelryStorePages = new Set(["index.html", "contact.html", "our-stores.html"]);
const productSchemaPages = new Set([
  "products.html",
  "jewelry-collections.html",
  "gemstones.html",
  "diamond-catalog.html",
]);
const faqSchemaPages = new Set(["faq.html"]);

const pageOverrides = {
  "404.html": {
    label: "Page Not Found",
    robots: "noindex, nofollow, noarchive",
  },
};

const policyPages = [
  "privacy-policy.html",
  "terms-conditions.html",
  "cookie-policy.html",
  "faq.html",
];

const decodeEntities = (value = "") =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");

const stripTags = (value = "") =>
  decodeEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();

const xmlEscape = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const pageUrl = (file) => (file === "index.html" ? `${siteUrl}/` : `${siteUrl}/${file}`);
const assetUrl = (assetPath) => `${siteUrl}/${assetPath.replace(/^\.?\//, "")}`;

const buildOrganizationSchema = (heroImage) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: companyName,
  url: `${siteUrl}/`,
  logo: assetUrl("assets/logo-mark.png"),
  image: assetUrl(heroImage),
  email: `mailto:${companyEmail}`,
  telephone: companyPhone,
  foundingDate: "1996",
  founder: {
    "@type": "Person",
    name: "Kenneth Cox Walker",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "New York",
    addressRegion: "NY",
    addressCountry: "US",
  },
  areaServed: ["United States", "Canada"],
});

const buildWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: companyName,
  url: `${siteUrl}/`,
  publisher: {
    "@type": "Organization",
    name: companyName,
  },
});

const buildJewelryStoreSchema = (heroImage) => ({
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  name: `${companyName} Toronto Flagship`,
  url: `${siteUrl}/our-stores.html`,
  image: assetUrl(heroImage),
  brand: {
    "@type": "Brand",
    name: companyName,
  },
  email: `mailto:${companyEmail}`,
  telephone: companyPhone,
  priceRange: "$$$$",
  description:
    "Appointment-led gemstone, diamond, and fine jewelry presentations for private clients and trade enquiries across North America.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "118 Bloor West Crescent",
    addressLocality: "Toronto",
    addressRegion: "ON",
    postalCode: "M5S 1T8",
    addressCountry: "CA",
  },
  areaServed: ["United States", "Canada"],
});

const buildBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const categoryForPage = (file) => {
  if (file === "products.html") return "Fine Jewelry and Gemstones";
  if (file === "jewelry-collections.html") return "Jewelry Collections";
  if (file === "gemstones.html") return "Loose Gemstones";
  if (file === "diamond-catalog.html") return "Certified Diamonds";
  return "Fine Jewelry";
};

const extractEntries = (html) => {
  const entries = [];
  const articleRegex = /<article class="([^"]*)">([\s\S]*?)<\/article>/g;
  let match;

  while ((match = articleRegex.exec(html))) {
    const classes = match[1];
    if (!/(^|\s)(card|gallery-card)(\s|$)/.test(classes)) {
      continue;
    }

    const fragment = match[2];
    const titleMatch = fragment.match(/<h3>([\s\S]*?)<\/h3>/);
    const imageMatch = fragment.match(/<img[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]+)"/);

    if (!titleMatch || !imageMatch) {
      continue;
    }

    const paragraphs = [...fragment.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(([, value]) =>
      stripTags(value)
    );
    const metaProperties = [...fragment.matchAll(/<li><span>([\s\S]*?)<\/span><strong>([\s\S]*?)<\/strong><\/li>/g)].map(
      ([, name, value]) => ({
        "@type": "PropertyValue",
        name: stripTags(name),
        value: stripTags(value),
      })
    );

    entries.push({
      name: stripTags(titleMatch[1]),
      image: imageMatch[1],
      description: paragraphs.join(" ").trim(),
      additionalProperty: metaProperties,
    });
  }

  return entries;
};

const buildProductSchema = (file, html, title) => {
  const entries = extractEntries(html).slice(0, 10);
  if (!entries.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    itemListElement: entries.map((entry, index) => {
      const product = {
        "@type": "Product",
        name: entry.name,
        description: entry.description,
        image: assetUrl(entry.image),
        brand: {
          "@type": "Brand",
          name: companyName,
        },
        category: categoryForPage(file),
      };

      if (entry.additionalProperty.length) {
        product.additionalProperty = entry.additionalProperty;
      }

      return {
        "@type": "ListItem",
        position: index + 1,
        item: product,
      };
    }),
  };
};

const buildFaqSchema = (html) => {
  const items = [...html.matchAll(/<details class="faq-item"[\s\S]*?<summary>([\s\S]*?)<\/summary>[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/details>/g)].map(
    ([, question, answer]) => ({
      "@type": "Question",
      name: stripTags(question),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripTags(answer),
      },
    })
  );

  if (!items.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items,
  };
};

const extractTitle = (html) => stripTags(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || companyName);
const extractDescription = (html) =>
  stripTags(html.match(/<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/?>/)?.[1] || "");

const extractHero = (html) => {
  const match = html.match(
    /<img[\s\S]*?class="[^"]*(?:hero__image|page-hero__image)[^"]*"[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]+)"/
  );

  return {
    src: match?.[1] || "assets/logo-full.png",
    alt: stripTags(match?.[2] || `${companyName} image`),
  };
};

const extractBreadcrumbLabel = (html, file, title) => {
  if (file === "index.html") {
    return "Home";
  }

  const navMatch = html.match(/<div class="breadcrumb">[\s\S]*?<span>([^<]+)<\/span>\s*<\/div>/);
  const fallback = title.split("|").pop()?.trim() || "Page";
  return stripTags(pageOverrides[file]?.label || navMatch?.[1] || fallback);
};

const ensureMainAttributes = (html) =>
  html.replace(/<main([^>]*)>/, (_, attrs) => {
    let nextAttrs = attrs || "";

    if (!/\sid=/.test(nextAttrs)) {
      nextAttrs += ' id="main-content"';
    }

    if (!/\stabindex=/.test(nextAttrs)) {
      nextAttrs += ' tabindex="-1"';
    }

    return `<main${nextAttrs}>`;
  });

const ensureSkipLink = (html) => {
  const withoutSkipLink = html.replace(/\s*<a class="skip-link"[^>]*>[\s\S]*?<\/a>/, "");
  return withoutSkipLink.replace(
    /<body([^>]*)>/,
    '<body$1>\n    <a class="skip-link" href="#main-content">Skip to content</a>'
  );
};

const enhanceBreadcrumbs = (html) =>
  html.replace(
    /<(?:div|nav) class="breadcrumb"(?: aria-label="Breadcrumb")?>[\s\S]*?<a href="index\.html">Home<\/a>[\s\S]*?<span>\s*\/\s*<\/span>[\s\S]*?<span(?: aria-current="page")?>([\s\S]*?)<\/span>[\s\S]*?<\/(?:div|nav)>/g,
    (_, currentLabel) => `
            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a href="index.html">Home</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">${stripTags(currentLabel)}</span>
            </nav>`
  );

const enhanceImages = (html) =>
  html.replace(/<img\b[\s\S]*?>/g, (tag) => {
    let next = tag;
    const isHero = /hero__image/.test(tag);

    if (!/\bdecoding=/.test(next)) {
      next = next.replace(/<img/, '<img decoding="async"');
    }

    if (isHero) {
      if (!/\bfetchpriority=/.test(next)) {
        next = next.replace(/<img/, '<img fetchpriority="high"');
      }
      if (!/\bloading=/.test(next)) {
        next = next.replace(/<img/, '<img loading="eager"');
      }
      return next;
    }

    if (!/\bloading=/.test(next)) {
      next = next.replace(/<img/, '<img loading="lazy"');
    }

    return next;
  });

const enhanceContactForm = (html) => {
  if (!html.includes('class="contact-form"')) {
    return html;
  }

  return html
    .replace(
      '<form class="contact-form">',
      '<form class="contact-form" aria-label="Contact form">'
    )
    .replace(
      '<p class="form-note" data-form-note hidden></p>',
      '<p class="form-note" data-form-note hidden role="status" aria-live="polite"></p>'
    )
    .replace(
      /<input type="text" name="name" placeholder="Your name" \/>/,
      '<input type="text" name="name" placeholder="Your name" autocomplete="name" required />'
    )
    .replace(
      /<input type="email" name="email" placeholder="Your email" \/>/,
      '<input type="email" name="email" placeholder="Your email" autocomplete="email" inputmode="email" required />'
    )
    .replace(
      /<input type="text" name="subject" placeholder="How can we help\?" \/>/,
      '<input type="text" name="subject" placeholder="How can we help?" autocomplete="organization-title" required />'
    )
    .replace(
      /<textarea\s+name="message"\s+placeholder="Tell us about your enquiry, partnership, or order\."\s*><\/textarea>/,
      `<textarea
                  name="message"
                  placeholder="Tell us about your enquiry, partnership, or order."
                  required
                ></textarea>`
    );
};

const buildHead = ({
  file,
  title,
  description,
  hero,
  canonical,
  robots,
  schemas,
}) => {
  const schemaBlock = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas, null, 2);

  return `  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${robots}" />
    <meta name="author" content="${companyName}" />
    <meta name="theme-color" content="#ffffff" />
    <link rel="canonical" href="${canonical}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&amp;family=Manrope:wght@400;500;600;700&amp;display=swap"
      rel="stylesheet"
    />
    <link rel="preload" as="image" href="${hero.src}" />
    <link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="assets/icons/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="assets/icons/apple-touch-icon.png" />
    <link rel="manifest" href="site.webmanifest" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="${companyName}" />
    <meta property="og:type" content="${file === "index.html" ? "website" : "article"}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${assetUrl(hero.src)}" />
    <meta property="og:image:alt" content="${hero.alt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${assetUrl(hero.src)}" />
    <meta name="twitter:image:alt" content="${hero.alt}" />
    <script type="application/ld+json">
${schemaBlock}
    </script>
    <link rel="stylesheet" href="style.css" />
  </head>`;
};

const buildSchemas = (file, html, title, description, hero, breadcrumbItems) => {
  const schemas = [buildOrganizationSchema(hero.src), buildBreadcrumbSchema(breadcrumbItems)];

  if (file === "index.html") {
    schemas.push(buildWebsiteSchema());
  }

  if (jewelryStorePages.has(file)) {
    schemas.push(buildJewelryStoreSchema(hero.src));
  }

  if (productSchemaPages.has(file)) {
    const productSchema = buildProductSchema(file, html, title);
    if (productSchema) {
      schemas.push(productSchema);
    }
  }

  if (faqSchemaPages.has(file)) {
    const faqSchema = buildFaqSchema(html);
    if (faqSchema) {
      schemas.push(faqSchema);
    }
  }

  return schemas;
};

const collectPageImages = (html) =>
  [...html.matchAll(/<img[\s\S]*?src="([^"]+)"[\s\S]*?alt="([^"]*)"/g)].map(([, src, alt]) => ({
    src,
    alt: stripTags(alt),
  }));

const buildPageSitemap = (pages) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${xmlEscape(page.url)}</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const buildImageSitemap = (pages) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map((page) => {
    const images = page.images
      .filter((image) => !image.src.startsWith("data:"))
      .map(
        (image) => `    <image:image>
      <image:loc>${xmlEscape(assetUrl(image.src))}</image:loc>
      <image:caption>${xmlEscape(image.alt || `${companyName} image`)}</image:caption>
    </image:image>`
      )
      .join("\n");

    return `  <url>
    <loc>${xmlEscape(page.url)}</loc>
${images}
  </url>`;
  })
  .join("\n")}
</urlset>
`;

const buildSitemapIndex = () => `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-images.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;

const buildManifest = () =>
  JSON.stringify(
    {
      name: companyName,
      short_name: "Cox Walker",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      icons: [
        {
          src: "assets/icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "assets/icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    null,
    2
  );

const buildRobots = () => `User-agent: *
Allow: /
Disallow: /404.html

Sitemap: ${siteUrl}/sitemap.xml
`;

const htmlFiles = (await fs.readdir(root))
  .filter((file) => file.endsWith(".html"))
  .sort((a, b) => {
    if (a === "index.html") return -1;
    if (b === "index.html") return 1;
    return a.localeCompare(b);
  });

for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  let html = await fs.readFile(filePath, "utf8");
  const title = extractTitle(html);
  const description = extractDescription(html);
  const hero = extractHero(html);
  const canonical = pageUrl(file);
  const label = extractBreadcrumbLabel(html, file, title);
  const breadcrumbItems =
    file === "index.html"
      ? [{ name: "Home", url: `${siteUrl}/` }]
      : [
          { name: "Home", url: `${siteUrl}/` },
          { name: label, url: canonical },
        ];
  const robots = noIndexPages.has(file)
    ? pageOverrides[file]?.robots || "noindex, nofollow"
    : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
  const schemas = buildSchemas(file, html, title, description, hero, breadcrumbItems);

  html = html.replace(/<head>[\s\S]*?<\/head>/, buildHead({
    file,
    title,
    description,
    hero,
    canonical,
    robots,
    schemas,
  }));
  html = enhanceBreadcrumbs(html);
  html = ensureSkipLink(html);
  html = ensureMainAttributes(html);
  html = enhanceContactForm(html);
  html = enhanceImages(html);

  await fs.writeFile(filePath, html);

}

await fs.writeFile(path.join(root, "site.webmanifest"), buildManifest());
await fs.writeFile(path.join(root, "robots.txt"), buildRobots());

console.log(`SEO build complete for ${htmlFiles.length} HTML files.`);
