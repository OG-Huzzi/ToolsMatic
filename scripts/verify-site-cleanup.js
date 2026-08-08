const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dirs = [root, 'tools', 'guides', 'blog', 'alternatives', 'hubs', 'glossary']
  .map((dir) => path.join(root, dir));
const files = [];
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'SEO_CONTENT_TEMPLATE.html') {
      files.push(path.join(dir, entry.name));
    }
  }
}

let adPages = 0;
let noindexPages = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  if (/fixesconsessionconsession|adsbygoogle|atOptions|google-adsense|class=["'][^"']*ad-slot/i.test(html)) adPages += 1;
  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) noindexPages += 1;
}

const sitemapFiles = fs.readdirSync(root).filter((name) => /^sitemap.*\.xml$/i.test(name));
const urls = sitemapFiles.flatMap((name) => [...fs.readFileSync(path.join(root, name), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
const uniqueUrls = new Set(urls);

console.log(JSON.stringify({
  htmlPages: files.length,
  pagesWithAdMarkers: adPages,
  noindexVariantPages: noindexPages,
  sitemapEntries: urls.length,
  uniqueSitemapEntries: uniqueUrls.size,
  duplicateSitemapEntries: urls.length - uniqueUrls.size,
  pseoSitemapEntries: [...fs.readFileSync(path.join(root, 'sitemap-pseo-variants.xml'), 'utf8').matchAll(/<loc>/g)].length,
}, null, 2));
