const fs = require("fs");
const path = require("path");

const ROUTES = require("../src/shared/config/seo-routes.json");
const LOCALES = ["uk", "en"];
const siteUrl =
  (process.env.SITE_URL ||
    process.env.VITE_APP_URL ||
    "https://qa.css-zone.com").replace(/\/$/, "");

const today = new Date().toISOString();
const entries = [];

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    const normalizedRoute = route === "/" ? "" : route;
    const fullPath = `/${locale}${normalizedRoute}`;
    entries.push(
      `<url><loc>${siteUrl}${fullPath}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
    );
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

fs.writeFileSync(path.resolve(__dirname, "../public/sitemap.xml"), xml);
console.log("Sitemap generated at public/sitemap.xml");
