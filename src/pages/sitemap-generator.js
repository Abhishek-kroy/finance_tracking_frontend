const { SitemapStream, streamToPromise } = require("sitemap");
const { createWriteStream } = require("fs");

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: "https://financetrackerfroproject.netlify.app" });

  sitemap.write({ url: "/", changefreq: "daily", priority: 1.0 });
  sitemap.write({ url: "/budget", changefreq: "weekly", priority: 0.8 });
  sitemap.write({ url: "/expenses", changefreq: "weekly", priority: 0.8 });
  sitemap.write({ url: "/dashboard", changefreq: "weekly", priority: 0.8 });
  sitemap.write({ url: "/report", changefreq: "monthly", priority: 0.8 });
  sitemap.end();

  const sitemapXML = await streamToPromise(sitemap);
  createWriteStream("./public/sitemap.xml").write(sitemapXML.toString());
}

generateSitemap();