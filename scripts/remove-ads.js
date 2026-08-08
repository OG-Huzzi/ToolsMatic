const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dirs = [root, 'tools', 'guides', 'blog', 'alternatives', 'hubs', 'glossary']
  .map((dir) => path.join(root, dir));
const sectionPattern = /\s*<section\b(?=[^>]*\bad-slot\b)[^>]*>.*?<\/section>/gis;
const rawAdPattern = /\s*<script>\s*(?:var\s+)?atOptions\s*=.*?<\/script>\s*<script\s+src=["'][^"']*(?:fixesconsessionconsession|adsbygoogle)[^"']*["'][^>]*>\s*<\/script>/gis;
const adScriptPattern = /\s*<script\b[^>]*src=["'][^"']*(?:fixesconsessionconsession|adsbygoogle)[^"']*["'][^>]*>\s*<\/script>/gis;
const adMetaPattern = /\s*<meta\b[^>]*(?:google-adsense|google-adsense-account)[^>]*>/gis;
const hasAdMarker = (html) => /ad-slot|fixesconsessionconsession|adsbygoogle|atOptions|google-adsense/i.test(html);

function publicHtmlFiles() {
  const files = [];
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'SEO_CONTENT_TEMPLATE.html') {
        files.push(path.join(dir, entry.name));
      }
    }
  }
  return files;
}

let checked = 0;
let changed = 0;
const failed = [];
for (const file of publicHtmlFiles()) {
  checked += 1;
  const html = fs.readFileSync(file, 'utf8');
  if (!hasAdMarker(html)) continue;
  const next = html
    .replace(sectionPattern, '')
    .replace(rawAdPattern, '')
    .replace(adScriptPattern, '')
    .replace(adMetaPattern, '');
  if (next === html) continue;
  try {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
  } catch (error) {
    failed.push(`${file}: ${error.code || error.message}`);
  }
}

console.log(JSON.stringify({ checked, changed, failed: failed.length }, null, 2));
if (failed.length) console.log(failed.slice(0, 20).join('\n'));
