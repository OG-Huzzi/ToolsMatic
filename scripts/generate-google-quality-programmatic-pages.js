const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'tools');
const INDEX_PATH = path.join(ROOT, 'index.html');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const SITE = 'https://toolsmatic.me';
const TODAY = '2026-05-07';
const INDEX_PSEO_VARIANTS = process.env.INDEX_PSEO_VARIANTS === 'true';

const intents = [
  {
    suffix: 'with-examples',
    label: 'With Examples',
    short: 'example-led workflow',
    article: 'an',
    audience: 'users who want to see practical examples before using the tool on real work',
    promise: 'clear sample inputs, realistic output expectations, and a direct path from example to finished result',
  },
  {
    suffix: 'for-beginners',
    label: 'For Beginners',
    short: 'beginner workflow',
    article: 'a',
    audience: 'new users who want a simple explanation, fewer decisions, and confidence that they are using the right settings',
    promise: 'plain-language guidance, safe defaults, and a step-by-step workflow that avoids jargon',
  },
  {
    suffix: 'for-developers',
    label: 'For Developers',
    short: 'developer workflow',
    article: 'a',
    audience: 'developers, technical founders, students, and builders who need fast browser-based utilities while coding',
    promise: 'copy-ready output, local processing, keyboard-friendly usage, and practical quality checks',
  },
  {
    suffix: 'mobile',
    label: 'Mobile Friendly',
    short: 'mobile workflow',
    article: 'a',
    audience: 'people using phones, tablets, and small screens who need the same tool without fighting the interface',
    promise: 'thumb-friendly usage, responsive controls, and a cleaner path to the most important action',
  },
  {
    suffix: 'privacy-first',
    label: 'Privacy First',
    short: 'private browser workflow',
    article: 'a',
    audience: 'users handling sensitive text, data, passwords, tokens, URLs, files, or drafts that should not be uploaded',
    promise: 'local-first processing, no account requirement, and a transparent workflow that keeps the task in the browser',
  },
];

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeJson(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractCards() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const re = /<a class="card" href="tools\/([^"]+\.html)">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/a>/g;
  const cards = [];
  let match;
  while ((match = re.exec(html))) {
    cards.push({
      file: match[1],
      slug: match[1].replace(/\.html$/, ''),
      name: decodeHtml(match[2].replace(/<[^>]*>/g, '').trim()),
      summary: decodeHtml(match[3].replace(/<[^>]*>/g, '').trim()),
    });
  }
  return cards;
}

function compactTitle(tool, intent) {
  const title = `${tool.name} ${intent.label} | ToolsMatic`;
  if (title.length <= 62) return title;
  return `${tool.name} ${intent.label}`;
}

function metaDescription(tool, intent) {
  const base = `${tool.name} ${intent.label}: use a fast ToolsMatic ${intent.short} with local processing, clear steps, and no sign-up.`;
  return base.length <= 156 ? base : `${tool.name} ${intent.label}: fast local browser tool with clear steps, focused guidance, and no sign-up.`;
}

function replaceOrInsertHead(html, pattern, replacement, before = '</head>') {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace(before, `  ${replacement}\n${before}`);
}

function updateUrlFields(html, url, canonicalUrl, title, description) {
  let out = html;
  out = replaceOrInsertHead(out, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  out = replaceOrInsertHead(out, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${escapeHtml(description)}">`);
  out = replaceOrInsertHead(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}">`);
  if (!INDEX_PSEO_VARIANTS) {
    out = replaceOrInsertHead(out, /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i, '<meta name="robots" content="noindex,follow">');
  }
  out = replaceOrInsertHead(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${url}">`);
  out = replaceOrInsertHead(out, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${escapeHtml(title)}">`);
  out = replaceOrInsertHead(out, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${escapeHtml(description)}">`);
  out = replaceOrInsertHead(out, /<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${url}">`);
  out = replaceOrInsertHead(out, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${escapeHtml(title)}">`);
  out = replaceOrInsertHead(out, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${escapeHtml(description)}">`);
  out = out.replace(/"url"\s*:\s*"https:\/\/toolsmatic\.me\/tools\/[^"]+\.html"/g, `"url": "${url}"`);
  out = out.replace(/"mainEntityOfPage"\s*:\s*"https:\/\/toolsmatic\.me\/tools\/[^"]+\.html"/g, `"mainEntityOfPage": "${url}"`);
  out = out.replace(/"downloadUrl"\s*:\s*"https:\/\/toolsmatic\.me\/tools\/[^"]+\.html"/g, `"downloadUrl": "${url}"`);
  return out;
}

function updateFirstH1(html, heading) {
  return html.replace(/<h1\b([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${escapeHtml(heading)}</h1>`);
}

function makeSeoBlock(tool, intent, url, baseUrl) {
  const id = `${tool.slug}-${intent.suffix}`;
  const h1 = `${tool.name} ${intent.label}`;
  const faq = [
    {
      q: `What is ${h1}?`,
      a: `${h1} is a focused ToolsMatic page built for ${intent.audience}. It keeps the same working tool available while adding intent-specific guidance, examples, and checks.`,
    },
    {
      q: `Is ${h1} private?`,
      a: `Yes. ToolsMatic tools are designed for browser-based usage, so the workflow is fast and privacy-conscious without forcing sign-up before you can use the page.`,
    },
    {
      q: `When should I use this page instead of the main ${tool.name}?`,
      a: `Use this page when you specifically want ${intent.article} ${intent.short}. Use the main ${tool.name} page when you want the broadest general overview of the tool.`,
    },
    {
      q: `Does this page work on mobile?`,
      a: `Yes. The page keeps the same responsive ToolsMatic interface and is meant to be usable on desktop, tablet, and mobile screens.`,
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: h1,
        url,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        description: metaDescription(tool, intent),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE}/#tools` },
          { '@type': 'ListItem', position: 3, name: h1, item: url },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  };

  return `
    <section class="section programmatic-intent-section google-quality-page" aria-labelledby="${id}-title">
      <nav class="breadcrumbs" aria-label="Breadcrumb" style="margin-bottom:16px;">
        <a href="/">Home</a> / <a href="/#tools">Tools</a> / <span>${escapeHtml(h1)}</span>
      </nav>
      <p class="eyebrow">Focused ToolsMatic Workflow</p>
      <h2 id="${id}-title">${escapeHtml(h1)} built for a ${escapeHtml(intent.short)}</h2>
      <p><strong>${escapeHtml(h1)}</strong> is a dedicated page for ${escapeHtml(intent.audience)}. The core tool remains available above, but this page adds a clearer search-focused path: ${escapeHtml(intent.promise)}.</p>
      <p>${escapeHtml(tool.summary)} This focused version helps users understand the exact job before they start, so they can move from question to result without scanning a broad utility page or guessing which option matters.</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:22px 0;">
        <div style="padding:16px;border:1px solid var(--border);border-radius:14px;background:var(--surface);"><strong>Best use case</strong><p style="margin:8px 0 0;color:var(--muted);">Use this page when your search intent is specifically "${escapeHtml(h1)}" and you want the matching workflow immediately.</p></div>
        <div style="padding:16px;border:1px solid var(--border);border-radius:14px;background:var(--surface);"><strong>Quality check</strong><p style="margin:8px 0 0;color:var(--muted);">Review the result, copy or export only after checking the output, and repeat with small changes when precision matters.</p></div>
        <div style="padding:16px;border:1px solid var(--border);border-radius:14px;background:var(--surface);"><strong>Privacy model</strong><p style="margin:8px 0 0;color:var(--muted);">The workflow is designed for fast browser use without account friction, which is ideal for quick utility tasks and sensitive drafts.</p></div>
      </div>

      <h2>How to use ${escapeHtml(h1)}</h2>
      <ol>
        <li>Open the tool area above and paste or enter the content you want to work with.</li>
        <li>Use the default settings first; they are selected to fit the most common version of this task.</li>
        <li>Adjust the visible controls only if your result needs a stricter format, a different output, or a more specialized workflow.</li>
        <li>Check the output carefully, then copy, download, or reuse the result in your project.</li>
      </ol>

      <h2>Why this page is not a duplicate of the main tool</h2>
      <p>The main <a href="${baseUrl}">${escapeHtml(tool.name)}</a> page covers the complete utility. This page is intentionally narrower: it answers a specific query, describes the exact scenario, and gives searchers a landing page that matches the words they used. That makes it more useful for people and cleaner for search engines than forcing every intent onto one overloaded page.</p>

      <h2>${escapeHtml(h1)} FAQ</h2>
      <div class="faq-grid">
        ${faq.map((item) => `<details><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`).join('\n        ')}
      </div>

      <h2>Comparison</h2>
      <table class="comparison-table">
        <thead><tr><th>Feature</th><th>ToolsMatic</th><th>Generic Tool Pages</th><th>Installable Apps</th></tr></thead>
        <tbody>
          <tr><td>Focused ${escapeHtml(intent.short)}</td><td>✓</td><td>✕</td><td>✕</td></tr>
          <tr><td>No sign-up for basic usage</td><td>✓</td><td>✓</td><td>✕</td></tr>
          <tr><td>Works in the browser</td><td>✓</td><td>✓</td><td>✕</td></tr>
          <tr><td>Tool plus guidance on one page</td><td>✓</td><td>✕</td><td>✕</td></tr>
        </tbody>
      </table>
    </section>
    <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
`;
}

function insertSeoBlock(html, block) {
  const marker = '</main>';
  const idx = html.lastIndexOf(marker);
  if (idx === -1) return html + block;
  return html.slice(0, idx) + block + html.slice(idx);
}

function ensureSingleH1(html) {
  const matches = [...html.matchAll(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/gi)];
  if (matches.length <= 1) return html;
  let out = html;
  for (let i = matches.length - 1; i >= 1; i -= 1) {
    const m = matches[i];
    out = out.slice(0, m.index) + `<h2${m[1]}>${m[2]}</h2>` + out.slice(m.index + m[0].length);
  }
  return out;
}

function updateSitemap(urls) {
  if (!INDEX_PSEO_VARIANTS) return 0;
  let sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const existing = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const additions = urls
    .filter((url) => !existing.has(url))
    .map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`)
    .join('\n');
  if (!additions) return 0;
  sitemap = sitemap.replace('</urlset>', `  <!-- Google-quality programmatic SEO pages -->\n${additions}\n</urlset>`);
  fs.writeFileSync(SITEMAP_PATH, sitemap, 'utf8');
  return additions ? additions.split('<url>').length - 1 : 0;
}

const cards = extractCards();
const createdUrls = [];
let created = 0;
let skipped = 0;

for (const tool of cards) {
  const basePath = path.join(TOOLS_DIR, tool.file);
  if (!fs.existsSync(basePath)) {
    console.warn(`Missing base tool: ${tool.file}`);
    continue;
  }
  const baseHtml = fs.readFileSync(basePath, 'utf8');
  for (const intent of intents) {
    const newSlug = `${tool.slug}-${intent.suffix}`;
    const newPath = path.join(TOOLS_DIR, `${newSlug}.html`);
    const url = `${SITE}/tools/${newSlug}.html`;
    const title = compactTitle(tool, intent);
    const description = metaDescription(tool, intent);
    const heading = `${tool.name} ${intent.label}`;
    const baseUrl = `${SITE}/tools/${tool.file}`;

    if (fs.existsSync(newPath)) {
      skipped += 1;
      createdUrls.push(url);
      continue;
    }

    let html = baseHtml;
    html = updateUrlFields(html, url, INDEX_PSEO_VARIANTS ? url : baseUrl, title, description);
    html = updateFirstH1(html, heading);
    html = ensureSingleH1(html);
    html = insertSeoBlock(html, makeSeoBlock(tool, intent, url, baseUrl));
    fs.writeFileSync(newPath, html, 'utf8');
    created += 1;
    createdUrls.push(url);
  }
}

const sitemapAdds = updateSitemap(createdUrls);

console.log(`Core tools found: ${cards.length}`);
console.log(`Programmatic pages created: ${created}`);
console.log(`Existing pages skipped: ${skipped}`);
console.log(`Sitemap URLs added: ${sitemapAdds}`);
