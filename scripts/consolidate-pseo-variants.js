const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'tools');
const SITE = 'https://toolsmatic.me';
const VARIANT_SITEMAP = path.join(ROOT, 'sitemap-pseo-variants.xml');
const LEGACY_GENERATOR = path.join(__dirname, 'generate-seo-variants.js');
const apply = process.argv.includes('--apply');

const read = (file) => fs.readFileSync(file, 'utf8');
function write(file, content) {
  let lastError;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      fs.writeFileSync(file, content, 'utf8');
      return;
    } catch (error) {
      lastError = error;
      if (!['EPERM', 'EBUSY'].includes(error.code) || attempt === 5) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 150 * (attempt + 1));
    }
  }
  throw lastError;
}
const urlToFile = (url) => path.join(ROOT, new URL(url).pathname.replace(/^\//, ''));
const urlToSlug = (url) => path.basename(new URL(url).pathname, '.html');
const urlToBase = (file) => `${SITE}/tools/${file}`;

function urlsFromXml(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function listedUrls(file) {
  return urlsFromXml(read(file));
}

function legacyVariantMap() {
  const map = new Map();
  let baseTool = '';
  for (const line of read(LEGACY_GENERATOR).split(/\r?\n/)) {
    const base = line.match(/baseTool:\s*'([^']+)'/);
    if (base) {
      baseTool = base[1];
      continue;
    }
    const slug = line.match(/\bslug:\s*'([^']+)'/);
    if (slug && baseTool) map.set(slug[1], baseTool);
  }
  return map;
}

function baseFromReference(html) {
  const reference = html.match(/Canonical Tool Reference[\s\S]{0,1400}?href="(https:\/\/toolsmatic\.me\/tools\/[^"?#]+\.html)"/i);
  return reference?.[1] || '';
}

function replaceOrInsertHead(html, pattern, replacement) {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace(/<\/head>/i, `  ${replacement}\n</head>`);
}

function consolidatePage(file, canonical) {
  const html = read(file);
  let next = replaceOrInsertHead(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${canonical}">`
  );
  next = replaceOrInsertHead(
    next,
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    '<meta name="robots" content="noindex,follow">'
  );
  return next;
}

function removeUrls(xml, urls) {
  return xml.replace(/\s*<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g, (block, url) => (
    urls.has(url) ? '' : block
  ));
}

const variantUrls = listedUrls(VARIANT_SITEMAP);
const legacyMap = legacyVariantMap();
const targets = new Map();
const missing = [];

for (const url of variantUrls) {
  const file = urlToFile(url);
  if (!fs.existsSync(file)) {
    missing.push(`${url} (missing file)`);
    continue;
  }
  const canonical = baseFromReference(read(file));
  if (!canonical || canonical === url || !fs.existsSync(urlToFile(canonical))) {
    missing.push(`${url} (missing core-tool reference)`);
    continue;
  }
  targets.set(url, canonical);
}

for (const [slug, baseTool] of legacyMap) {
  const url = `${SITE}/tools/${slug}.html`;
  const file = urlToFile(url);
  const canonical = urlToBase(baseTool);
  if (fs.existsSync(file) && fs.existsSync(urlToFile(canonical)) && url !== canonical) {
    targets.set(url, canonical);
  }
}

if (missing.length) {
  console.error(`Refusing to apply: ${missing.length} variant pages could not be mapped safely.`);
  console.error(missing.slice(0, 20).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Mapped ${targets.size} low-value variants to their core tools.`);
  if (!apply) {
    console.log('Dry run only. Re-run with --apply to update canonical tags, robots directives, and sitemaps.');
  } else {
    let changed = 0;
    for (const [url, canonical] of targets) {
      const file = urlToFile(url);
      const next = consolidatePage(file, canonical);
      if (next !== read(file)) {
        write(file, next);
        changed += 1;
      }
    }

    const targetUrls = new Set(targets.keys());
    const sitemapFiles = fs.readdirSync(ROOT)
      .filter((name) => /^sitemap.*\.xml$/i.test(name))
      .map((name) => path.join(ROOT, name));
    const remainingSitemaps = sitemapFiles.filter((file) => file !== VARIANT_SITEMAP);

    for (const file of remainingSitemaps) {
      const current = read(file);
      const next = removeUrls(current, targetUrls);
      if (next !== current) write(file, next);
    }

    const seen = new Set();
    const ordered = remainingSitemaps
      .sort((a, b) => path.basename(a).localeCompare(path.basename(b)))
      .sort((a, b) => path.basename(a) === 'sitemap.xml' ? 1 : path.basename(b) === 'sitemap.xml' ? -1 : 0);
    for (const file of ordered) {
      const current = read(file);
      const next = removeUrls(current, new Set([...seen]));
      for (const url of urlsFromXml(next)) seen.add(url);
      if (next !== current) write(file, next);
    }

    write(VARIANT_SITEMAP, `<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <!-- Deprecated: low-value programmatic variants are intentionally not submitted. -->\n</urlset>\n`);

    const robotsPath = path.join(ROOT, 'robots.txt');
    const robots = read(robotsPath).replace(/^Sitemap:\s*https:\/\/toolsmatic\.me\/sitemap-pseo-variants\.xml\r?\n?/gim, '');
    write(robotsPath, `${robots.trim()}\n`);

    console.log(`Updated ${changed} variant pages; removed them from submitted sitemaps.`);
  }
}
