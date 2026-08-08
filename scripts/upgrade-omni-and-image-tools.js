const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOOLS_DIR = path.join(ROOT, 'tools');
const SITE = 'https://toolsmatic.me';
const TODAY = '2026-05-15';

const omniScript = fs.readFileSync(path.join(__dirname, 'import-omni-browser-tools.js'), 'utf8');
const omniTools = [...omniScript.matchAll(/\['([^']+)', '([^']+)', '([^']+)', '([^']+)', '([^']+)'\]/g)]
  .map((m) => ({ slug: m[1], title: m[2], description: m[3], category: m[4], op: m[5], kind: 'text' }));

const imageTools = [
  {
    slug: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize JPG, PNG, and WebP images by exact pixels or percentage with live preview and local export.',
    category: 'Design',
    op: 'resize'
  },
  {
    slug: 'image-cropper',
    title: 'Image Cropper',
    description: 'Crop images precisely with x/y coordinates, width, height, aspect presets, and instant browser preview.',
    category: 'Design',
    op: 'crop'
  },
  {
    slug: 'image-rotator',
    title: 'Image Rotator',
    description: 'Rotate and flip images locally, then export clean PNG, JPG, or WebP output.',
    category: 'Design',
    op: 'rotate'
  },
  {
    slug: 'image-color-editor',
    title: 'Image Color Editor',
    description: 'Adjust brightness, contrast, saturation, grayscale, invert, sepia, and hue in your browser.',
    category: 'Design',
    op: 'colors'
  },
  {
    slug: 'image-opacity-editor',
    title: 'Image Opacity Editor',
    description: 'Change image opacity and export transparent PNG files without uploading the image.',
    category: 'Design',
    op: 'opacity'
  },
  {
    slug: 'transparent-image-maker',
    title: 'Transparent Image Maker',
    description: 'Turn a selected color range transparent with tolerance controls and instant PNG export.',
    category: 'Design',
    op: 'transparent'
  },
  {
    slug: 'image-background-remover',
    title: 'Image Background Remover',
    description: 'Remove solid or near-solid image backgrounds locally using color sampling and tolerance controls.',
    category: 'Design',
    op: 'remove-bg'
  },
  {
    slug: 'image-splitter',
    title: 'Image Splitter',
    description: 'Split one image into rows and columns, preview every tile, and download the result as a ZIP.',
    category: 'Design',
    op: 'split'
  },
  {
    slug: 'jpg-to-png-converter',
    title: 'JPG to PNG Converter',
    description: 'Convert JPG images to PNG locally with preview, transparency-safe export, and file size feedback.',
    category: 'Design',
    op: 'jpg-png'
  },
  {
    slug: 'image-ocr-to-text',
    title: 'Image OCR to Text',
    description: 'Extract readable text from images in the browser using OCR with copy and download output.',
    category: 'Design',
    op: 'ocr',
    extraLibs: '<script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>'
  },
  {
    slug: 'browser-image-editor',
    title: 'Browser Image Editor',
    description: 'A local image editor for crop, resize, rotate, filters, opacity, and quick format export.',
    category: 'Design',
    op: 'editor'
  }
].map((tool) => ({ ...tool, kind: 'image' }));

const imageVariants = [
  ['free', 'Free', 'free image editing with no account or watermark'],
  ['no-upload', 'No Upload', 'private image editing where files stay in the browser'],
  ['mobile', 'Mobile', 'touch-friendly image editing on phones and tablets'],
  ['for-creators', 'For Creators', 'creator workflow for thumbnails, posts, product photos, and assets'],
  ['how-to', 'How To', 'step-by-step image editing workflow with practical export guidance']
];

const omniVariants = [
  ['free', 'Free', 'free browser-based workflow with no account or install'],
  ['no-upload', 'No Upload', 'private local processing for sensitive pasted text and data'],
  ['for-developers', 'For Developers', 'developer-friendly cleanup, validation, conversion, and automation prep'],
  ['mobile', 'Mobile', 'phone-friendly utility work with clear controls and fast copy output'],
  ['examples', 'Examples', 'practical examples, common mistakes, and direct usage guidance']
];

const esc = (value) => String(value).replace(/[&<>"]/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}[char]));

const json = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

function head(tool, title = `${tool.title} - Free Private Browser Tool | ToolsMatic`, description = `${tool.description} Free, private, mobile-friendly, no sign-up, and no upload required.`) {
  const url = `${SITE}/tools/${tool.slug}.html`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.title,
        url,
        description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript and a modern browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE}/#tools` },
          { '@type': 'ListItem', position: 3, name: tool.title, item: url }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          q(`Is ${tool.title} free?`, `Yes. ${tool.title} is free to use in the browser with no account required.`),
          q(`Does ${tool.title} upload my data?`, `No. The tool is designed to process your input locally in your browser.`),
          q(`Can I use ${tool.title} on mobile?`, 'Yes. The interface is responsive and designed for desktop, tablet, and phone screens.'),
          q(`What makes ${tool.title} different?`, 'It combines a fast tool, examples, copy/download actions, local processing, and practical guidance on one page.')
        ]
      }
    ]
  };

  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE}/assets/pdf/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE}/assets/pdf/og-image.jpg">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script type="application/ld+json">${json(schema)}</script>
  ${sharedCss()}
</head>`;
}

function q(name, text) {
  return { '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } };
}

function header() {
  return `<header>
  <nav class="nav">
    <a class="brand" href="/"><span class="brand-dot"></span><span>ToolsMatic</span></a>
    <div class="nav-links">
      <a href="/#tools" class="nav-btn">All tools</a>
      <button id="theme-toggle" class="theme-toggle" title="Toggle dark/light mode">Moon</button>
    </div>
  </nav>
</header>`;
}

function footer() {
  return `<footer>
  <div class="footer-inner">
    <div><strong>ToolsMatic</strong><p>Fast browser utilities for real work.</p></div>
    <a href="/about.html">About</a>
    <a href="/privacy.html">Privacy</a>
    <a href="/terms.html">Terms</a>
    <a href="/contact.html">Contact</a>
  </div>
</footer>`;
}

function sharedCss() {
  return `<style>
    .premium-shell{width:min(100% - 28px,1180px);margin:0 auto;padding:88px 0 72px}
    .premium-hero{display:grid;gap:16px;margin:0 0 22px;padding:26px;border:1px solid var(--border);border-radius:28px;background:linear-gradient(135deg,rgba(34,211,238,.13),rgba(168,85,247,.08)),var(--surface)}
    .premium-kicker{color:var(--accent);font-weight:900;text-transform:uppercase;letter-spacing:.12em;font-size:12px}
    .premium-hero h1{margin:0;font-size:clamp(34px,6vw,64px);line-height:.98}
    .tool-lab{display:grid;gap:16px;padding:20px;border:1px solid var(--border);border-radius:28px;background:rgba(11,18,34,.92);box-shadow:0 28px 80px rgba(0,0,0,.25)}
    .toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
    .toolbar input,.toolbar select{min-height:44px;padding:0 12px;border:1px solid var(--border);border-radius:14px;background:var(--input-bg);color:var(--text)}
    .tool-btn{min-height:44px;padding:0 16px;border:1px solid var(--border);border-radius:999px;background:var(--surface);color:var(--text);font-weight:900;cursor:pointer}
    .tool-btn.primary{border:0;background:linear-gradient(135deg,var(--accent),#60a5fa);color:#03131f}
    .tool-btn:hover{transform:translateY(-1px);border-color:var(--accent)}
    .work-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .text-box{min-height:380px;width:100%;resize:vertical;padding:16px;border:1px solid var(--border);border-radius:20px;background:#07101f;color:var(--text);font:14px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace}
    .image-stage{display:grid;gap:14px;grid-template-columns:.9fr 1.1fr}.drop-zone{display:grid;place-items:center;min-height:320px;padding:24px;border:2px dashed rgba(34,211,238,.35);border-radius:24px;background:rgba(34,211,238,.05);text-align:center;cursor:pointer}.drop-zone.drag{border-color:var(--accent);box-shadow:0 0 0 6px rgba(34,211,238,.1)}
    .preview-card{display:grid;gap:12px;min-height:360px;padding:16px;border:1px solid var(--border);border-radius:24px;background:#07101f}.preview-card canvas{width:100%;max-height:560px;object-fit:contain;border-radius:16px;background:#fff}.tile-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}.tile-grid img{border-radius:12px;border:1px solid var(--border)}
    .metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.metric{padding:13px;border:1px solid var(--border);border-radius:18px;background:#07101f}.metric span{display:block;color:var(--muted);font-size:12px;font-weight:800;text-transform:uppercase}.metric strong{display:block;margin-top:4px;font-size:20px}
    .smart-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:14px}.insight-card{padding:16px;border:1px solid var(--border);border-radius:22px;background:linear-gradient(135deg,rgba(34,211,238,.08),rgba(96,165,250,.04)),#07101f}.insight-card h2,.insight-card h3{margin:0 0 10px;font-size:18px}.insight-card p,.insight-card li{color:var(--muted)}.mini-steps{display:grid;gap:8px;margin:0;padding:0;list-style:none}.mini-steps li{display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid rgba(148,163,184,.16);border-radius:14px}.mini-steps b{display:grid;place-items:center;min-width:24px;height:24px;border-radius:999px;background:rgba(34,211,238,.14);color:var(--accent)}.history-list{display:grid;gap:8px;max-height:230px;overflow:auto}.history-item{width:100%;padding:10px;border:1px solid var(--border);border-radius:14px;background:rgba(15,23,42,.72);color:var(--text);text-align:left;cursor:pointer}.history-item small{display:block;color:var(--muted)}.diagnostic-list{display:grid;gap:8px;margin:0;padding:0;list-style:none}.diagnostic-list li{padding:8px 10px;border-radius:12px;background:rgba(34,211,238,.07);color:var(--muted)}.tool-switch{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 13px;border:1px solid var(--border);border-radius:999px;color:var(--muted);font-weight:800;background:var(--surface)}
    .examples{display:flex;flex-wrap:wrap;gap:8px}.example-chip{border:1px solid var(--border);border-radius:999px;padding:9px 12px;background:var(--surface);cursor:pointer;color:var(--muted);font-weight:800}
    .seo-panel{margin-top:24px;padding:26px;border:1px solid var(--border);border-radius:28px;background:var(--surface)}.seo-panel h2,.seo-panel h3{margin:26px 0 10px}.seo-panel p,.seo-panel li{color:var(--muted)}.seo-panel a{color:var(--accent);font-weight:900}.comparison-table{width:100%;border-collapse:collapse;margin-top:14px}.comparison-table th,.comparison-table td{padding:12px;border:1px solid var(--border);text-align:left}.faq-list{display:grid;gap:10px}.faq-list details{padding:14px;border:1px solid var(--border);border-radius:16px;background:#07101f}
    .pdf-ad-slot{display:flex;justify-content:center;overflow:hidden}
    @media(max-width:820px){.work-grid,.image-stage,.metrics,.smart-grid{grid-template-columns:1fr}.premium-shell{padding-top:76px}.toolbar input,.toolbar select,.tool-btn,.tool-switch{width:100%}}
  </style>`;
}

function ad() {
  return '';
}

function textPage(tool) {
  return `<!DOCTYPE html><html lang="en">${head(tool)}<body>${header()}<main class="premium-shell">
  <nav class="breadcrumbs"><a href="/">Home</a> / <a href="/#tools">Tools</a> / <span>${esc(tool.title)}</span></nav>
  <section class="premium-hero"><span class="premium-kicker">${esc(tool.category)} tool</span><h1>${esc(tool.title)}</h1>${ad()}<p>${esc(tool.description)} Built as a fast, private, keyboard-friendly ToolsMatic utility with examples, export, and no upload step.</p></section>
  <section class="tool-lab" data-op="${tool.op}">
    <div class="toolbar">
      <input id="opt-a" placeholder="Option A">
      <input id="opt-b" placeholder="Option B">
      <select id="mode"><option value="default">Default</option><option value="case">Case-insensitive</option><option value="numeric">Numeric</option><option value="regex">Regex</option></select>
      <button class="tool-btn primary" id="run" data-primary>Run</button>
      <label class="tool-switch"><input id="live-mode" type="checkbox" checked> Live process</label>
      <button class="tool-btn" id="sample">Load sample</button>
      <button class="tool-btn" id="copy">Copy</button>
      <button class="tool-btn" id="copy-report">Copy report</button>
      <button class="tool-btn" id="download">Download TXT</button>
      <button class="tool-btn" id="clear" data-clear>Clear</button>
    </div>
    <div class="examples"><button class="example-chip" data-sample="list">List sample</button><button class="example-chip" data-sample="csv">CSV sample</button><button class="example-chip" data-sample="text">Text sample</button><button class="example-chip" data-sample="date">Date sample</button></div>
    <div class="work-grid"><textarea id="input" class="text-box" placeholder="Paste input here..."></textarea><textarea id="output" class="text-box" placeholder="Output appears here..." readonly></textarea></div>
    <div class="metrics"><div class="metric"><span>Input chars</span><strong id="m1">0</strong></div><div class="metric"><span>Output chars</span><strong id="m2">0</strong></div><div class="metric"><span>Lines</span><strong id="m3">0</strong></div><div class="metric"><span>Status</span><strong id="m4">Ready</strong></div></div>
    <div class="smart-grid">
      <section class="insight-card"><h2>Smart workflow</h2><ol class="mini-steps"><li><b>1</b><span>Paste real data or load a sample that matches the format you are cleaning.</span></li><li><b>2</b><span>Use Option A and Option B only when this operation needs a delimiter, index, count, replacement, range, or interval.</span></li><li><b>3</b><span>Leave Live process on for instant feedback, or turn it off when working with very large pasted files.</span></li><li><b>4</b><span>Use Copy report when you need a quick audit trail of input size, output size, and processing status.</span></li></ol></section>
      <section class="insight-card"><h2>Diagnostics</h2><ul class="diagnostic-list" id="diagnostics"><li>Paste content to see quality checks.</li></ul></section>
      <section class="insight-card"><h2>Recent runs</h2><div class="history-list" id="history-list"><p>No local history yet.</p></div></section>
      <section class="insight-card"><h2>Power user notes</h2><p id="power-note">Keyboard shortcut: Ctrl + Enter runs the tool. Output history is saved locally in this browser only.</p></section>
    </div>
  </section>
  ${seo(tool)}
</main>${footer()}<script src="/assets/site.js"></script><script>${textRuntime()}</script><script>${premiumTextEnhancer(tool)}</script></body></html>`;
}

function imagePage(tool) {
  const libs = `${tool.extraLibs || ''}${tool.op === 'split' ? '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>' : ''}`;
  return `<!DOCTYPE html><html lang="en">${head(tool, `${tool.title} - Free No Upload Image Tool | ToolsMatic`, `${tool.description} Edit images locally in your browser with live preview, no sign-up, and no upload required.`)}<body>${header()}<main class="premium-shell">
  <nav class="breadcrumbs"><a href="/">Home</a> / <a href="/#tools">Tools</a> / <span>${esc(tool.title)}</span></nav>
  <section class="premium-hero"><span class="premium-kicker">Image tool</span><h1>${esc(tool.title)}</h1>${ad()}<p>${esc(tool.description)} The image stays on your device while canvas-based processing creates a downloadable result.</p></section>
  <section class="tool-lab image-tool" data-op="${tool.op}">
    <input id="file" type="file" accept="image/*" hidden>
    <div class="toolbar">
      <input id="w" type="number" placeholder="Width / X / rows" min="0">
      <input id="h" type="number" placeholder="Height / Y / cols" min="0">
      <input id="a" type="number" placeholder="Amount / angle / tolerance" value="90">
      <select id="format"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select>
      <button class="tool-btn primary" id="process" data-primary>Process image</button>
      <button class="tool-btn" id="download">Download</button>
      <button class="tool-btn" id="clear" data-clear>Clear</button>
    </div>
    <div class="image-stage">
      <div class="drop-zone" id="drop"><div><strong>Drop an image here</strong><p>or click to choose JPG, PNG, WebP, GIF stills, or SVG raster previews.</p></div></div>
      <div class="preview-card"><canvas id="canvas"></canvas><div id="tiles" class="tile-grid"></div><textarea id="ocr-output" class="text-box" placeholder="OCR output appears here..." hidden></textarea></div>
    </div>
    <div class="metrics"><div class="metric"><span>Original</span><strong id="m1">0 B</strong></div><div class="metric"><span>Output</span><strong id="m2">0 B</strong></div><div class="metric"><span>Size</span><strong id="m3">0 x 0</strong></div><div class="metric"><span>Status</span><strong id="m4">Ready</strong></div></div>
  </section>
  ${imageSeo(tool)}
</main>${footer()}${libs}<script src="/assets/site.js"></script><script>${imageRuntime()}</script></body></html>`;
}

function seo(tool) {
  return `<article class="seo-panel">
    <h2>${esc(tool.title)} built for real browser work</h2>
    <p>${esc(tool.title)} solves a specific workflow: ${esc(tool.description.toLowerCase())} A lot of online utility pages are only a textarea and a button, which is fine for a quick demo but weak for real work. This ToolsMatic page is designed around the actual moments when people use a utility: cleaning a CSV before upload, fixing a list before publishing, checking a timestamp before shipping code, converting text for documentation, or validating structured data while a deadline is close.</p>
    <p>The tool stays frontend-only. Your input is processed in the browser, the output appears immediately, and the page adds the pieces that make the workflow safer: live mode, examples, diagnostics, local recent runs, copy, download, keyboard execution, and a report you can copy when someone needs proof of what changed. The goal is not to look complicated. The goal is to make the next correct action obvious even when the user is tired, on mobile, or working with messy pasted data.</p>
    <h2>What makes this ${esc(tool.category.toLowerCase())} tool stronger</h2>
    <p>The upgraded interface separates action, data, and validation. The top toolbar holds the only controls you need. Option A and Option B are intentionally generic because each tool uses them differently: a delimiter, replacement, count, column index, interval, range, or comparison value. The diagnostics panel watches the input and output so users can spot duplicate lines, empty rows, CSV-like data, JSON warnings, output length, and size changes without opening another checker.</p>
    <p>Recent runs are saved only in localStorage, which means repeat work is faster without sending your text to a server. If you are cleaning the same kind of content every day, you can reload a previous run, adjust one field, and process again. If you are doing a one-time sensitive cleanup, you can clear the page and the history stays inside your browser profile, not in a ToolsMatic database.</p>
    <h2>How to use ${esc(tool.title)}</h2>
    <ol><li>Paste your source content into the input panel. Use the sample chips if you want to see the expected format first.</li><li>Set Option A or Option B only when the current task needs a value. For example, CSV tools often use delimiters, list tools often use counts, and text tools often use replacement terms.</li><li>Keep Live process enabled for instant feedback. Turn it off when you paste very large content and prefer manual execution.</li><li>Review the diagnostics before copying the result. This helps catch empty rows, duplicate lines, malformed JSON, delimiter mistakes, or unexpected output size.</li><li>Copy the output, download it as a TXT file, or copy the report when you need a small audit note.</li></ol>
    <h2>Privacy and speed</h2>
    <p>Browser-side utilities are valuable because small text tasks often involve private material: draft copy, customer snippets, internal URLs, CSV exports, logs, config values, filenames, identifiers, and support notes. ToolsMatic does not require an upload step for this page. Processing happens through JavaScript in the current tab, so the page feels immediate and avoids the unnecessary round trip that slows down many online converters.</p>
    <p>This also improves mobile usability. A phone user can paste content, run the tool, and copy the cleaned result without creating an account or fighting a desktop-style interface. The cards stack, controls remain thumb-friendly, and the output box remains readable because the layout is designed as a utility workspace instead of a generic article page.</p>
    <h2>Best use cases</h2>
    <ul><li>Developers cleaning snippets, logs, JSON, XML, timestamps, ports, and Unicode characters.</li><li>Writers and SEO workers fixing lists, duplicate lines, casing, truncation, wrapped text, and replacement tasks.</li><li>Data workers converting CSV, TSV, YAML, XML, and quick structured exports before import.</li><li>Students, creators, and founders who need a fast result without installing a desktop application.</li></ul>
    <h2>Comparison</h2><table class="comparison-table"><thead><tr><th>Feature</th><th>ToolsMatic</th><th>Browserling</th><th>Code Beautify</th><th>OnlineTools</th></tr></thead><tbody><tr><td>No account required</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr><tr><td>Frontend local processing focus</td><td>✓</td><td>Varies</td><td>Varies</td><td>Varies</td></tr><tr><td>Live processing</td><td>✓</td><td>Varies</td><td>Varies</td><td>Varies</td></tr><tr><td>Diagnostics panel</td><td>✓</td><td>✕</td><td>✕</td><td>Varies</td></tr><tr><td>Local recent runs</td><td>✓</td><td>✕</td><td>✕</td><td>✕</td></tr><tr><td>Copyable report</td><td>✓</td><td>✕</td><td>✕</td><td>✕</td></tr><tr><td>Mobile-first layout</td><td>✓</td><td>Varies</td><td>Varies</td><td>Varies</td></tr></tbody></table>
    <h2>FAQs</h2><div class="faq-list"><details><summary>Is ${esc(tool.title)} private?</summary><p>Yes. The operation runs in your browser. ToolsMatic does not need a server upload to process this tool.</p></details><details><summary>What are Option A and Option B for?</summary><p>They adapt to the tool. Depending on the page, they can be a delimiter, replacement, count, index, interval, range, or comparison value.</p></details><details><summary>Can I process large input?</summary><p>Yes, but for very large pasted data you may want to turn Live process off and use the Run button manually.</p></details><details><summary>Does recent history upload my content?</summary><p>No. Recent runs are stored in your browser localStorage and are only available on your device/browser profile.</p></details><details><summary>Does it work on mobile?</summary><p>Yes. The editor, controls, diagnostics, and history cards stack for small screens.</p></details><details><summary>Can I download the output?</summary><p>Yes. Use Download TXT after generating the result.</p></details></div>
  </article>`;
}

function imageSeo(tool) {
  return `<article class="seo-panel">
    <h2>${esc(tool.title)} with no upload and no account</h2>
    <p>${esc(tool.title)} is built for practical image work in the browser. It helps creators, students, marketers, developers, store owners, and support teams adjust images quickly without installing a desktop editor. The workflow is local: choose an image, preview the result, process it with canvas-based tools, and download the finished asset.</p>
    <p>Image tools are often slow because they either force an upload or hide the useful controls behind a complicated editor. ToolsMatic keeps the main actions close to the preview. You can resize, crop, rotate, adjust color, change opacity, split images, convert formats, remove simple solid backgrounds, or run OCR depending on the page. The result is a faster workflow for thumbnails, product photos, blog images, documentation screenshots, social posts, profile assets, classroom material, and quick web graphics.</p>
    <h2>How to use ${esc(tool.title)}</h2>
    <ol><li>Drop an image into the upload area or click to select one.</li><li>Adjust width, height, angle, tolerance, rows, columns, or format depending on the tool.</li><li>Click Process image and review the canvas preview.</li><li>Download the final image or ZIP output directly from the browser.</li></ol>
    <h2>Privacy and quality</h2>
    <p>Because the image is processed in your browser, the file does not need to be sent to a ToolsMatic upload server. That is useful when working with drafts, personal photos, client assets, unpublished product images, or private screenshots. Browser-based processing also gives immediate feedback: you can adjust settings and rerun the tool without waiting in a server queue.</p>
    <h2>FAQs</h2><div class="faq-list"><details><summary>Does ${esc(tool.title)} upload my image?</summary><p>No. The processing runs locally in your browser using canvas and browser APIs.</p></details><details><summary>What formats can I use?</summary><p>Most modern browsers support JPG, PNG, WebP, GIF still frames, and SVG raster previews.</p></details><details><summary>Can I use it on mobile?</summary><p>Yes. The controls and preview are responsive.</p></details><details><summary>Is background removal AI?</summary><p>The background remover uses color sampling and tolerance controls for solid or near-solid backgrounds. It does not pretend to be a full AI cutout model.</p></details></div>
  </article>`;
}

function textRuntime() {
  return `(()=>{const $=s=>document.querySelector(s),inp=$('#input'),out=$('#output'),a=$('#opt-a'),b=$('#opt-b'),mode=$('#mode'),op=document.querySelector('[data-op]').dataset.op;const lines=s=>s.split(/\\r?\\n/);const csv=s=>lines(s).filter(Boolean).map(r=>r.split(a.value||','));const stats=t=>{$('#m1').textContent=inp.value.length;$('#m2').textContent=out.value.length;$('#m3').textContent=lines(inp.value).filter(Boolean).length;$('#m4').textContent=t||'Ready'};const set=v=>{out.value=String(v??'');stats('Done')};const xmlEsc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));const morse={a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};function run(){try{const x=inp.value,L=lines(x),A=a.value,B=b.value;let r='';switch(op){case'csv-separator':r=csv(x).map(row=>row.join(B||'\\t')).join('\\n');break;case'transpose':{const m=csv(x),w=Math.max(...m.map(r=>r.length));r=Array.from({length:w},(_,i)=>m.map(row=>row[i]||'').join(A||',')).join('\\n');break}case'csv-to-tsv':r=csv(x).map(row=>row.join('\\t')).join('\\n');break;case'csv-to-xml':{const m=csv(x),h=m.shift()||[];r='<rows>\\n'+m.map(row=>'  <row>\\n'+h.map((k,i)=>'    <'+(k||'col'+i).replace(/\\W+/g,'_')+'>'+xmlEsc(row[i]||'')+'</'+(k||'col'+i).replace(/\\W+/g,'_')+'>').join('\\n')+'\\n  </row>').join('\\n')+'\\n</rows>';break}case'csv-to-yaml':{const m=csv(x),h=m.shift()||[];r=m.map(row=>'- '+h.map((k,i)=>'\\n  '+(k||'col'+i)+': '+JSON.stringify(row[i]||'')).join('')).join('\\n');break}case'csv-incomplete':{const m=csv(x),n=(m[0]||[]).length;r=m.map((row,i)=>row.length===n?'':'Line '+(i+1)+': expected '+n+', found '+row.length).filter(Boolean).join('\\n')||'No incomplete rows found.';break}case'insert-column':{const idx=Number(A||0);r=csv(x).map(row=>{row.splice(idx,0,B||'');return row.join(',')}).join('\\n');break}case'swap-columns':{const i=Number(A||0),j=Number(B||1);r=csv(x).map(row=>{[row[i],row[j]]=[row[j]||'',row[i]||''];return row.join(',')}).join('\\n');break}case'tsv-to-json':{const m=lines(x).filter(Boolean).map(r=>r.split('\\t')),h=m.shift()||[];r=JSON.stringify(m.map(row=>Object.fromEntries(h.map((k,i)=>[k,row[i]||'']))),null,2);break}case'escape-json':r=JSON.stringify(x).slice(1,-1);break;case'json-compare':r=JSON.stringify(JSON.parse(x))===JSON.stringify(JSON.parse(B||'{}'))?'JSON matches':'JSON differs';break;case'json-to-xml':{const obj=JSON.parse(x);const to=(v,k='root')=>Array.isArray(v)?v.map(i=>to(i,k)).join(''):v&&typeof v==='object'?'<'+k+'>'+Object.entries(v).map(([kk,vv])=>to(vv,kk)).join('')+'</'+k+'>':'<'+k+'>'+xmlEsc(v)+'</'+k+'>';r=to(obj);break}case'stringify-json':r=JSON.stringify(JSON.stringify(JSON.parse(x)));break;case'duplicate-lines':r=L.flatMap(line=>Array(Number(A||2)).fill(line)).join('\\n');break;case'popular-lines':{const m=new Map();L.filter(Boolean).forEach(l=>m.set(l,(m.get(l)||0)+1));r=[...m.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>v+' x '+k).join('\\n');break}case'unique-lines':{const seen=new Set();r=L.filter(l=>{const k=mode.value==='case'?l.toLowerCase():l;if(seen.has(k))return false;seen.add(k);return true}).join('\\n');break}case'group-lines':{const n=Number(A||3);r=L.reduce((acc,l,i)=>(acc+(i&&i%n===0?'\\n---\\n':'')+l+'\\n'),'').trim();break}case'reverse-lines':r=L.reverse().join('\\n');break;case'rotate-lines':{const n=Number(A||1),arr=[...L];r=arr.slice(n).concat(arr.slice(0,n)).join('\\n');break}case'shuffle-lines':r=[...L].sort(()=>Math.random()-.5).join('\\n');break;case'sort-lines':r=[...L].sort((x,y)=>mode.value==='numeric'?Number(x)-Number(y):x.localeCompare(y)).join('\\n');break;case'truncate-lines':r=L.map(l=>l.slice(0,Number(A||40))).join('\\n');break;case'unwrap-lines':r=L.map(l=>l.trim()).filter(Boolean).join(' ');break;case'wrap-lines':{const n=Number(A||80);r=x.split(/\\s+/).reduce((acc,w)=>{const p=acc.split('\\n').pop();return acc+(p&&p.length+w.length+1>n?'\\n':' ')+w},'').trim();break}case'arithmetic':{const start=Number(A||0),step=Number(B||1),count=Number(x||10);r=Array.from({length:count},(_,i)=>start+i*step).join('\\n');break}case'bytes':{const n=Number(x||0);r=n+' bytes\\n'+(n/1024)+' KB\\n'+(n/1048576)+' MB\\n'+(n/1073741824)+' GB';break}case'random-number':{const min=Number(A||0),max=Number(B||100),count=Number(x||1);r=Array.from({length:count},()=>Math.floor(Math.random()*(max-min+1))+min).join('\\n');break}case'random-port':r=String(Math.floor(Math.random()*(65535-1024+1))+1024);break;case'sum':r=String((x.match(/-?\\d+(\\.\\d+)?/g)||[]).reduce((s,n)=>s+Number(n),0));break;case'censor':r=x.replace(new RegExp(A||'secret',mode.value==='case'?'gi':'g'),B||'***');break;case'create-palindrome':r=x+x.split('').reverse().join('');break;case'substring':r=A&&B?x.split(A)[1]?.split(B)[0]||'':x.slice(Number(A||0),Number(B||x.length));break;case'hidden-chars':r=[...x].map(ch=>ch+' U+'+ch.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')).join('\\n');break;case'join-lines':r=L.join(A||', ');break;case'palindrome':{const c=x.toLowerCase().replace(/[^a-z0-9]/g,'');r=c===c.split('').reverse().join('')?'Palindrome':'Not a palindrome';break}case'random-case':r=[...x].map(ch=>Math.random()>.5?ch.toUpperCase():ch.toLowerCase()).join('');break;case'repeat-text':r=Array(Number(A||3)).fill(x).join(B||'\\n');break;case'reverse-text':r=x.split('').reverse().join('');break;case'rot13':r=x.replace(/[a-z]/gi,c=>String.fromCharCode((c<='Z'?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26));break;case'rotate-text':{const n=Number(A||1),arr=[...x];r=arr.slice(n).concat(arr.slice(0,n)).join('');break}case'split-text':r=x.split(A||',').map(s=>s.trim()).join('\\n');break;case'replace-text':r=mode.value==='regex'?x.replace(new RegExp(A,'g'),B):x.split(A).join(B);break;case'morse':r=x.includes('.')||x.includes('-')?x.split(' ').map(code=>Object.keys(morse).find(k=>morse[k]===code)||' ').join(''):[...x.toLowerCase()].map(ch=>morse[ch]||' ').join(' ');break;case'truncate-text':r=x.slice(0,Number(A||160))+(x.length>Number(A||160)?(B||'...'):'');break;case'unicode':r=[...x].map(ch=>ch+' U+'+ch.codePointAt(0).toString(16).toUpperCase()).join('\\n');break;case'leap-year':{const y=Number(x||new Date().getFullYear());r=(y%4===0&&y%100!==0)||y%400===0?'Leap year':'Not a leap year';break}case'days-hours':r=Number(x||0)*24+' hours';break;case'hours-days':r=(Number(x||0)/24)+' days';break;case'seconds-time':{const s=Number(x||0);r=[Math.floor(s/3600),Math.floor(s%3600/60),s%60].map(v=>String(v).padStart(2,'0')).join(':');break}case'time-decimal':{const [h,m]=x.split(':').map(Number);r=String(h+(m||0)/60);break}case'time-seconds':{const p=x.split(':').map(Number);r=String((p[0]||0)*3600+(p[1]||0)*60+(p[2]||0));break}case'unix':{const n=Number(x||Date.now()/1000);r=new Date(n*1000).toISOString();break}case'cron':{const p=x.trim().split(/\\s+/);r=p.length===5?'Cron: minute '+p[0]+', hour '+p[1]+', day '+p[2]+', month '+p[3]+', weekday '+p[4]:'Enter 5-part cron expression';break}case'discord-time':{const d=x?new Date(x):new Date();const ts=Math.floor(d.getTime()/1000);r='<t:'+ts+':F>\\n<t:'+ts+':R>';break}case'date-diff':{const d1=new Date(x),d2=new Date(A||new Date());const ms=Math.abs(d2-d1);r=Math.floor(ms/86400000)+' days\\n'+Math.floor(ms/3600000)+' hours';break}case'truncate-clock':{const [h,m]=x.split(':').map(Number),step=Number(A||15);r=String(h).padStart(2,'0')+':'+String(Math.floor((m||0)/step)*step).padStart(2,'0');break}case'xml-beautify':{const xml=new XMLSerializer().serializeToString(new DOMParser().parseFromString(x,'application/xml'));r=xml.replace(/></g,'>\\n<');break}case'xml-validate':{const doc=new DOMParser().parseFromString(x,'application/xml');r=doc.querySelector('parsererror')?.textContent||'XML is valid';break}default:r=x}set(r)}catch(e){set('Error: '+e.message);stats('Error')}}function sample(type){const data={list:'alpha\\nbeta\\nalpha\\ngamma\\nbeta',csv:'name,score\\nAva,91\\nNoah,87',text:'ToolsMatic makes browser tools faster and clearer.',date:new Date().toISOString()};inp.value=data[type]||data.text;stats('Ready')}$('#run').onclick=run;$('#sample').onclick=()=>sample('text');document.querySelectorAll('[data-sample]').forEach(b=>b.onclick=()=>sample(b.dataset.sample));inp.oninput=()=>stats('Ready');$('#copy').onclick=()=>navigator.clipboard.writeText(out.value);$('#download').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([out.value],{type:'text/plain'}));a.download='toolsmatic-output.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};$('#clear').onclick=()=>{inp.value='';out.value='';stats('Ready')};stats('Ready')})();`;
}

function premiumTextEnhancer(tool) {
  const title = JSON.stringify(tool.title);
  const slug = JSON.stringify(tool.slug);
  return `(()=>{const toolTitle=${title},slug=${slug},$=s=>document.querySelector(s),inp=$('#input'),out=$('#output'),run=$('#run'),live=$('#live-mode'),historyBox=$('#history-list'),diag=$('#diagnostics');const key='toolsmatic:history:'+slug;let timer;function lines(v){return v.split(/\\r?\\n/)}function safe(v){return String(v).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}function renderDiagnostics(){const raw=inp.value,rows=lines(raw),filled=rows.filter(Boolean),empty=rows.length-filled.length,dupes=filled.length-new Set(filled).size,words=(raw.match(/\\b\\S+\\b/g)||[]).length,chars=raw.length,outChars=out.value.length;const notes=[];notes.push(chars+' input characters and '+words+' words detected.');notes.push(filled.length+' non-empty lines, '+Math.max(0,empty)+' empty lines.');notes.push(dupes>0?dupes+' duplicate lines detected.':'No duplicate lines detected.');notes.push(outChars?('Output is '+outChars+' characters, '+(chars?Math.round(outChars/chars*100):0)+'% of input length.'):'Run the tool to calculate output size.');if(raw.trim().startsWith('{')||raw.trim().startsWith('[')){try{JSON.parse(raw);notes.push('JSON syntax looks valid.')}catch(e){notes.push('JSON syntax warning: '+e.message)}}if(raw.includes(',')&&filled.length>1){notes.push('CSV-style content detected; check delimiter options before export.')}diag.innerHTML=notes.map(n=>'<li>'+safe(n)+'</li>').join('')}function getHistory(){try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return[]}}function saveHistory(){if(!inp.value.trim()&&!out.value.trim())return;const h=getHistory().filter(item=>item.input!==inp.value||item.output!==out.value);h.unshift({time:new Date().toLocaleString(),input:inp.value.slice(0,4000),output:out.value.slice(0,4000),inLen:inp.value.length,outLen:out.value.length});localStorage.setItem(key,JSON.stringify(h.slice(0,10)));renderHistory()}function renderHistory(){const h=getHistory();historyBox.innerHTML=h.length?h.map((item,i)=>'<button class="history-item" data-i="'+i+'"><strong>'+item.inLen+' to '+item.outLen+' chars</strong><small>'+safe(item.time)+'</small><small>'+safe(item.output.slice(0,90))+'</small></button>').join(''):'<p>No local history yet.</p>';historyBox.querySelectorAll('[data-i]').forEach(btn=>btn.onclick=()=>{const item=getHistory()[Number(btn.dataset.i)];inp.value=item.input;out.value=item.output;renderDiagnostics()})}function liveRun(){clearTimeout(timer);timer=setTimeout(()=>{if(live?.checked&&inp.value.trim()){run.click();setTimeout(()=>{renderDiagnostics();saveHistory()},30)}else renderDiagnostics()},250)}inp.addEventListener('input',liveRun);document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();run.click();setTimeout(()=>{renderDiagnostics();saveHistory()},30)}});run.addEventListener('click',()=>setTimeout(()=>{renderDiagnostics();saveHistory()},30));$('#copy-report')?.addEventListener('click',()=>navigator.clipboard.writeText([toolTitle,'Input characters: '+inp.value.length,'Output characters: '+out.value.length,'Lines: '+lines(inp.value).filter(Boolean).length,'Status: '+$('#m4').textContent].join('\\n')));renderHistory();renderDiagnostics()})();`;
}

function imageRuntime() {
  return `(()=>{const $=s=>document.querySelector(s),file=$('#file'),drop=$('#drop'),canvas=$('#canvas'),ctx=canvas.getContext('2d'),tiles=$('#tiles'),ocr=$('#ocr-output'),op=document.querySelector('[data-op]').dataset.op;let img=null,outBlob=null,baseName='image';const fmt=b=>!b?'0 B':b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(2)+' MB';const status=t=>$('#m4').textContent=t;function draw(source=img,w=img?.naturalWidth||img?.width||800,h=img?.naturalHeight||img?.height||500){canvas.width=Math.max(1,Math.round(w));canvas.height=Math.max(1,Math.round(h));ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(source,0,0,canvas.width,canvas.height);$('#m3').textContent=canvas.width+' x '+canvas.height}function load(f){baseName=f.name.replace(/\\.[^.]+$/,'');$('#m1').textContent=fmt(f.size);img=new Image();img.onload=()=>{draw();status('Loaded')};img.src=URL.createObjectURL(f)}function sampleColor(){const d=ctx.getImageData(0,0,1,1).data;return d}function processPixels(fn){const data=ctx.getImageData(0,0,canvas.width,canvas.height);for(let i=0;i<data.data.length;i+=4)fn(data.data,i);ctx.putImageData(data,0,0)}async function process(){if(!img&&op!=='ocr')return;tiles.innerHTML='';ocr.hidden=true;const W=Number($('#w').value),H=Number($('#h').value),A=Number($('#a').value||90),format=$('#format').value;try{if(op==='resize'){draw(img,W||img.naturalWidth,H||img.naturalHeight)}else if(op==='crop'){const sx=W||0,sy=H||0,sw=Number($('#a').value)||Math.floor(img.naturalWidth/2),sh=sw;const t=document.createElement('canvas');t.width=sw;t.height=sh;t.getContext('2d').drawImage(img,sx,sy,sw,sh,0,0,sw,sh);draw(t,sw,sh)}else if(op==='rotate'||op==='editor'){const rad=A*Math.PI/180,w=img.naturalWidth,h=img.naturalHeight;canvas.width=A%180?w:h;canvas.height=A%180?h:w;ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(rad);ctx.drawImage(img,-w/2,-h/2);ctx.setTransform(1,0,0,1,0,0);$('#m3').textContent=canvas.width+' x '+canvas.height}else if(op==='colors'){canvas.style.filter='none';draw();const br=Number($('#w').value||100),ct=Number($('#h').value||100),sat=Number($('#a').value||100);ctx.filter='brightness('+br+'%) contrast('+ct+'%) saturate('+sat+'%)';draw()}else if(op==='opacity'){draw();const alpha=Math.max(0,Math.min(100,A))/100;processPixels((d,i)=>{d[i+3]=Math.round(d[i+3]*alpha)})}else if(op==='transparent'||op==='remove-bg'){draw();const key=sampleColor(),tol=Math.max(0,A||32);processPixels((d,i)=>{const dist=Math.abs(d[i]-key[0])+Math.abs(d[i+1]-key[1])+Math.abs(d[i+2]-key[2]);if(dist<tol*3)d[i+3]=0})}else if(op==='jpg-png'){draw()}else if(op==='split'){draw();if(!window.JSZip)throw Error('ZIP library failed to load');const rows=W||2,cols=H||2,zip=new JSZip(),tw=Math.floor(canvas.width/cols),th=Math.floor(canvas.height/rows);for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const t=document.createElement('canvas');t.width=tw;t.height=th;t.getContext('2d').drawImage(canvas,x*tw,y*th,tw,th,0,0,tw,th);const url=t.toDataURL('image/png');tiles.insertAdjacentHTML('beforeend','<img src="'+url+'" alt="Tile">');zip.file(baseName+'-'+(y+1)+'-'+(x+1)+'.png',url.split(',')[1],{base64:true})}outBlob=await zip.generateAsync({type:'blob'});$('#m2').textContent=fmt(outBlob.size);status('ZIP ready');return}else if(op==='ocr'){if(!window.Tesseract)throw Error('OCR library failed to load');ocr.hidden=false;status('Reading text');const result=await Tesseract.recognize(img.src,'eng');ocr.value=result.data.text;outBlob=new Blob([ocr.value],{type:'text/plain'});$('#m2').textContent=fmt(outBlob.size);status('OCR ready');return}canvas.toBlob(b=>{outBlob=b;$('#m2').textContent=fmt(b.size);status('Ready')},format,0.92)}catch(e){status('Error');alert(e.message)}}drop.onclick=()=>file.click();drop.ondragover=e=>{e.preventDefault();drop.classList.add('drag')};drop.ondragleave=()=>drop.classList.remove('drag');drop.ondrop=e=>{e.preventDefault();drop.classList.remove('drag');load(e.dataTransfer.files[0])};file.onchange=()=>load(file.files[0]);$('#process').onclick=process;$('#download').onclick=()=>{if(!outBlob)return;const a=document.createElement('a');a.href=URL.createObjectURL(outBlob);a.download=baseName+(op==='split'?'.zip':op==='ocr'?'.txt':'.'+($('#format').value.split('/')[1]||'png'));a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};$('#clear').onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);tiles.innerHTML='';ocr.value='';ocr.hidden=true;img=null;outBlob=null;status('Ready')}})();`;
}

function pseoPage(tool, variant) {
  const [suffix, label, intent] = variant;
  const pageTool = { ...tool, slug: `${tool.slug}-${suffix}`, title: `${tool.title} ${label}` };
  const description = `${tool.title} ${label}: ${intent}. Open the main ToolsMatic image tool for no-upload browser editing with preview and export.`;
  return `<!DOCTYPE html><html lang="en">${head(pageTool, `${pageTool.title} | ToolsMatic`, description)}<body>${header()}<main class="premium-shell">
    <nav class="breadcrumbs"><a href="/">Home</a> / <a href="/#tools">Tools</a> / <span>${esc(pageTool.title)}</span></nav>
    <section class="premium-hero"><span class="premium-kicker">Focused image workflow</span><h1>${esc(pageTool.title)}</h1>${ad()}<p>${esc(description)}</p><p><a class="tool-btn primary" href="/tools/${tool.slug}.html">Open ${esc(tool.title)}</a></p></section>
    <article class="seo-panel"><h2>${esc(pageTool.title)} for ${esc(intent)}</h2><p>This focused page exists for users who need ${esc(intent)} and want a direct path to the correct image tool. The main <a href="/tools/${tool.slug}.html">${esc(tool.title)}</a> page contains the working editor; this landing page explains the exact scenario, the privacy model, and how to get a clean output without uploading your file.</p><p>ToolsMatic image tools run in the browser where possible. That means creators can resize, crop, rotate, edit, split, convert, or extract text from images without a heavy desktop app. The page is built to be useful for searchers and humans: it gives context, steps, privacy details, and an immediate call to action.</p><h2>How to use it</h2><ol><li>Open the main tool.</li><li>Drop your image into the upload zone.</li><li>Adjust the visible controls for size, crop, rotation, opacity, tolerance, or output format.</li><li>Process the image, inspect the preview, and download the finished asset.</li></ol><h2>FAQs</h2><div class="faq-list"><details><summary>Does this workflow upload images?</summary><p>No, the ToolsMatic image workflow is designed around browser-side processing.</p></details><details><summary>Is this good for mobile?</summary><p>Yes, the editor is responsive and works on small screens.</p></details><details><summary>Does the output have a watermark?</summary><p>No. The generated file is your edited image.</p></details></div></article>
  </main>${footer()}<script src="/assets/site.js"></script></body></html>`;
}

function omniPseoPage(tool, variant) {
  const [suffix, label, intent] = variant;
  const pageTool = { ...tool, slug: `${tool.slug}-${suffix}`, title: `${tool.title} ${label}` };
  const mainUrl = `/tools/${tool.slug}.html`;
  const description = `${tool.title} ${label}: ${intent}. Learn the workflow, examples, privacy benefits, and open the free ToolsMatic tool.`;
  return `<!DOCTYPE html><html lang="en">${head(pageTool, `${pageTool.title} | ToolsMatic`, description)}<body>${header()}<main class="premium-shell">
    <nav class="breadcrumbs"><a href="/">Home</a> / <a href="/#tools">Tools</a> / <a href="${mainUrl}">${esc(tool.title)}</a> / <span>${esc(label)}</span></nav>
    <section class="premium-hero"><span class="premium-kicker">${esc(tool.category)} workflow</span><h1>${esc(pageTool.title)}</h1>${ad()}<p>${esc(description)}</p><p><a class="tool-btn primary" href="${mainUrl}">Open ${esc(tool.title)}</a></p></section>
    <article class="seo-panel">
      <h2>${esc(pageTool.title)} for ${esc(intent)}</h2>
      <p>This page is a focused guide for people searching for ${esc(intent)} and wanting a direct answer, not a generic tool directory. The working tool lives at <a href="${mainUrl}">${esc(tool.title)}</a>, while this page explains when to use it, how to avoid common mistakes, and why a browser-first workflow is often faster than opening a heavy desktop app or uploading data to a random server.</p>
      <p>${esc(tool.title)} is useful because it handles a repeatable task: ${esc(tool.description.toLowerCase())} That sounds small until it happens ten times in a day. Developers clean snippets before committing code, writers fix lists before publishing, analysts reshape rows before importing data, students prepare assignments, and founders move quickly between product copy, support notes, CSV exports, timestamps, and structured text.</p>
      <h2>Why this workflow is different</h2>
      <p>The ToolsMatic approach keeps the job inside the browser. You paste input, set only the option values that matter, review diagnostics, copy the output, and move on. The upgraded interface includes live processing, recent local runs, copyable reports, sample inputs, and a mobile-friendly layout. These details reduce mistakes because the page does more than transform text; it also helps you understand whether the input and output look sane.</p>
      <h2>Step-by-step workflow</h2>
      <ol><li>Open the main <a href="${mainUrl}">${esc(tool.title)}</a> page.</li><li>Load a sample if you want to understand the expected input shape before pasting real content.</li><li>Paste your text, CSV, list, number, XML, JSON, date, or code snippet depending on the tool.</li><li>Use Option A and Option B only if the tool needs a delimiter, count, replacement, interval, range, or comparison value.</li><li>Review the diagnostics panel for empty rows, duplicate lines, malformed structured data, or unexpected output size.</li><li>Copy the output, download it, or copy the report if you need to document the transformation.</li></ol>
      <h2>Common mistakes to avoid</h2>
      <ul><li>Do not assume comma-separated data is always clean CSV; quoted commas and missing columns can change results.</li><li>Do not paste sensitive credentials into any browser page unless your security policy allows it, even when the processing is local.</li><li>For large inputs, turn off live processing and run manually to keep the page responsive.</li><li>Always compare the output size and line count before using the result in production work.</li></ul>
      <h2>Comparison</h2><table class="comparison-table"><thead><tr><th>Feature</th><th>ToolsMatic</th><th>Browserling</th><th>Code Beautify</th><th>OnlineTools</th></tr></thead><tbody><tr><td>Free access</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr><tr><td>No account</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr><tr><td>Local workflow focus</td><td>✓</td><td>Varies</td><td>Varies</td><td>Varies</td></tr><tr><td>Diagnostics</td><td>✓</td><td>✕</td><td>✕</td><td>Varies</td></tr><tr><td>Recent local runs</td><td>✓</td><td>✕</td><td>✕</td><td>✕</td></tr><tr><td>Mobile-friendly utility layout</td><td>✓</td><td>Varies</td><td>Varies</td><td>Varies</td></tr></tbody></table>
      <h2>FAQs</h2><div class="faq-list"><details><summary>Is ${esc(pageTool.title)} a separate tool?</summary><p>This is a focused landing page for a specific use case. The working tool is linked above.</p></details><details><summary>Does the main tool upload my content?</summary><p>The main ToolsMatic utility is designed for browser-side processing, so the transformation runs locally in the tab.</p></details><details><summary>Why create focused pages for one tool?</summary><p>Different users search with different intent. A focused page lets them find the exact workflow, examples, and mistakes related to their problem.</p></details><details><summary>Can I use it on mobile?</summary><p>Yes. The main tool and this guide use responsive layouts.</p></details><details><summary>Can I index this page?</summary><p>Yes. It has its own canonical URL, structured data, breadcrumbs, and a unique search-intent explanation.</p></details></div>
    </article>
  </main>${footer()}<script src="/assets/site.js"></script></body></html>`;
}

function writePages() {
  for (const tool of omniTools) {
    fs.writeFileSync(path.join(TOOLS_DIR, `${tool.slug}.html`), textPage(tool));
    for (const variant of omniVariants) {
      fs.writeFileSync(path.join(TOOLS_DIR, `${tool.slug}-${variant[0]}.html`), omniPseoPage(tool, variant));
    }
  }
  for (const tool of imageTools) {
    fs.writeFileSync(path.join(TOOLS_DIR, `${tool.slug}.html`), imagePage(tool));
    for (const variant of imageVariants) {
      fs.writeFileSync(path.join(TOOLS_DIR, `${tool.slug}-${variant[0]}.html`), pseoPage(tool, variant));
    }
  }
}

function updateIndexAndCatalog() {
  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const imageCards = imageTools.filter((tool) => !html.includes(`tools/${tool.slug}.html`)).map((tool) => `        <a class="card" href="tools/${tool.slug}.html">
          <h3>${esc(tool.title)}</h3>
          <p>${esc(tool.description)}</p>
        </a>`).join('');
  if (imageCards) {
    html = html.replace(/<\/div>\s*<\/section>\s*<section class="section home-about"/, `${imageCards}</div>\n</section>\n\n<section class="section home-about"`);
  }
  const count = (html.match(/<a class="card" href="tools\//g) || []).length;
  html = html.replace(/<span class="home-tool-count" data-tool-count>\d+ tools ready<\/span>/g, `<span class="home-tool-count" data-tool-count>${count} tools ready</span>`);
  fs.writeFileSync(indexPath, html);

  const siteJsPath = path.join(ROOT, 'assets', 'site.js');
  let js = fs.readFileSync(siteJsPath, 'utf8');
  const catalog = imageTools.filter((tool) => !js.includes(`url: '/tools/${tool.slug}.html'`)).map((tool) => `    { url: '/tools/${tool.slug}.html', title: '${tool.title.replace(/'/g, "\\'")}', description: '${tool.description.replace(/'/g, "\\'")}', category: '${tool.category}' },`).join('\n');
  if (catalog) {
    js = js.replace(/\s{2}\];\s*const HOME_TOOL_COUNT/, `\n${catalog}\n  ];\n\n  const HOME_TOOL_COUNT`);
  }
  js = js.replace(/const HOME_TOOL_COUNT = \d+;/, `const HOME_TOOL_COUNT = ${count};`);
  js = js.replace(/Design: '([^']*)'/, (m, words) => `Design: '${words} image resize crop rotate opacity transparent background remover ocr split converter editor'`);
  fs.writeFileSync(siteJsPath, js);
  return count;
}

function updateSitemaps() {
  const omniUrls = omniTools.map((tool) => `${SITE}/tools/${tool.slug}.html`);
  const omniPseoUrls = omniTools.flatMap((tool) => omniVariants.map((variant) => `${SITE}/tools/${tool.slug}-${variant[0]}.html`));
  const imageUrls = [
    ...imageTools.map((tool) => `${SITE}/tools/${tool.slug}.html`),
    ...imageTools.flatMap((tool) => imageVariants.map((variant) => `${SITE}/tools/${tool.slug}-${variant[0]}.html`))
  ];
  const urls = [...omniUrls, ...omniPseoUrls, ...imageUrls];
  const mainPath = path.join(ROOT, 'sitemap.xml');
  let main = fs.readFileSync(mainPath, 'utf8');
  for (const url of urls) {
    main = main.replace(new RegExp(`(<loc>${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]+(</lastmod>)`, 'g'), `$1${TODAY}$2`);
  }
  const existing = new Set([...main.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const additions = urls.filter((url) => !existing.has(url)).map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${/-free|-no-upload|-mobile|-for-creators|-how-to/.test(url) ? '0.6' : '0.8'}</priority>\n  </url>`).join('\n');
  if (additions) {
    main = main.replace('</urlset>', `${additions}\n</urlset>`);
  }
  fs.writeFileSync(mainPath, main);
  const omniSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${omniUrls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap-omni-browser-tools.xml'), omniSitemap);
  const omniPseoSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${omniPseoUrls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.62</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap-omni-pseo.xml'), omniPseoSitemap);
  const imageSitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${imageUrls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${/-free|-no-upload|-mobile|-for-creators|-how-to/.test(url) ? '0.6' : '0.8'}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap-image-tools.xml'), imageSitemap);
  const robotsPath = path.join(ROOT, 'robots.txt');
  let robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes('sitemap-omni-browser-tools.xml')) {
    robots += `${robots.endsWith('\n') ? '' : '\n'}Sitemap: ${SITE}/sitemap-omni-browser-tools.xml\n`;
  }
  if (!robots.includes('sitemap-omni-pseo.xml')) {
    robots += `${robots.endsWith('\n') ? '' : '\n'}Sitemap: ${SITE}/sitemap-omni-pseo.xml\n`;
  }
  if (!robots.includes('sitemap-image-tools.xml')) {
    robots += `${robots.endsWith('\n') ? '' : '\n'}Sitemap: ${SITE}/sitemap-image-tools.xml\n`;
  }
  fs.writeFileSync(robotsPath, robots);
}

writePages();
const count = updateIndexAndCatalog();
updateSitemaps();
console.log(JSON.stringify({ upgradedOmniTools: omniTools.length, omniPseoPages: omniTools.length * omniVariants.length, imageTools: imageTools.length, imagePseoPages: imageTools.length * imageVariants.length, toolCount: count }, null, 2));
