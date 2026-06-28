export type SiteRoute = {
  fileName: string;
  pathname: string;
  priority: number;
};

export const siteRoutes: SiteRoute[] = [
  { fileName: "index.html", pathname: "/", priority: 1.0 },
  { fileName: "about.html", pathname: "/about", priority: 0.9 },
  { fileName: "our-story.html", pathname: "/our-story", priority: 0.9 },
  { fileName: "leadership-team.html", pathname: "/leadership-team", priority: 0.9 },
  { fileName: "our-mines.html", pathname: "/our-mines", priority: 0.9 },
  { fileName: "mining-operations.html", pathname: "/mining-operations", priority: 0.8 },
  { fileName: "exploration-projects.html", pathname: "/exploration-projects", priority: 0.8 },
  { fileName: "equipment-machinery.html", pathname: "/equipment-machinery", priority: 0.8 },
  { fileName: "processing-plant.html", pathname: "/processing-plant", priority: 0.8 },
  { fileName: "refinery.html", pathname: "/refinery", priority: 0.8 },
  { fileName: "diamond-gemstone-cutting.html", pathname: "/diamond-gemstone-cutting", priority: 0.8 },
  { fileName: "jewelry-manufacturing.html", pathname: "/jewelry-manufacturing", priority: 0.8 },
  { fileName: "products.html", pathname: "/products", priority: 0.9 },
  { fileName: "jewelry-collections.html", pathname: "/jewelry-collections", priority: 0.9 },
  { fileName: "gemstones.html", pathname: "/gemstones", priority: 0.9 },
  { fileName: "diamond-catalog.html", pathname: "/diamond-catalog", priority: 0.9 },
  { fileName: "auctions.html", pathname: "/auctions", priority: 0.8 },
  { fileName: "sustainability-esg.html", pathname: "/sustainability", priority: 0.9 },
  { fileName: "traceability.html", pathname: "/traceability", priority: 0.9 },
  { fileName: "certifications.html", pathname: "/certifications", priority: 0.9 },
  { fileName: "investors.html", pathname: "/investors", priority: 0.9 },
  { fileName: "news-media.html", pathname: "/news-media", priority: 0.9 },
  { fileName: "careers.html", pathname: "/careers", priority: 0.9 },
  { fileName: "contact.html", pathname: "/contact", priority: 0.9 },
];

export const siteRouteMap = new Map(
  siteRoutes.map((route) => [route.pathname, route.fileName])
);

