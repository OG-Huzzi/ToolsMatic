const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOOLS = path.join(ROOT, 'tools');
const SITE = 'https://toolsmatic.me';
const TODAY = '2026-05-15';
const MAIN_SLUG = 'pro-image-editor';
const MAIN_URL = `${SITE}/tools/${MAIN_SLUG}.html`;

const escapeAttr = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const faq = [
  ['Is ToolsMatic Pro Image Editor free?', 'Yes. The editor is free to use in the browser with no account, signup, or required upload step.'],
  ['Does the Pro Image Editor upload my images?', 'No. Images are loaded into your browser and edited locally with client-side canvas tools.'],
  ['Can I crop, resize, rotate, draw, and add text?', 'Yes. The editor supports crop, resize, rotation, flip, drawing, shapes, text, icons, filters, undo, redo, and export controls.'],
  ['Which image formats can I export?', 'You can export common browser-supported formats including PNG, JPG, and WebP where supported by your browser.'],
  ['Is this better for private screenshots than cloud editors?', 'For private screenshots, local browser editing is safer because the file does not need to leave your device just to make quick changes.'],
  ['Does the editor work on mobile?', 'Yes. The page is responsive and the editor is wrapped for phone and tablet screens, although larger edits are still easier on desktop.'],
  ['Can I use it for product photos and social posts?', 'Yes. It is useful for product screenshots, listing photos, social images, thumbnails, annotations, and quick marketing visuals.'],
  ['Why is the editor heavier than simple image tools?', 'A full editor needs canvas, history, filters, object editing, crop tools, and export logic. The heavy bundle is loaded only on this dedicated page, not across the whole site.']
];

const comparisonRows = [
  ['Runs without required upload', '&#10003;', '&#10007;', '&#10007;', '&#10003;', '&#10007;', '&#10007;'],
  ['Crop, resize, rotate, flip', '&#10003;', '&#10003;', '&#10003;', '&#10003;', '&#10003;', '&#10003;'],
  ['Text, shapes, drawing, icons', '&#10003;', '&#10003;', '&#10003;', '&#10003;', '&#10003;', '&#10007;'],
  ['Fast no-login start', '&#10003;', '&#10007;', '&#10003;', '&#10003;', '&#10007;', '&#10003;'],
  ['Private screenshot workflow', '&#10003;', '&#10007;', '&#10007;', '&#10003;', '&#10007;', '&#10007;'],
  ['Lightweight page around editor', '&#10003;', '&#10007;', '&#10007;', '&#10007;', '&#10007;', '&#10003;']
];

const internalLinks = [
  ['Image Compressor', '/tools/image-compressor.html', 'Reduce final image file size after editing.'],
  ['Image Resizer', '/tools/image-resizer.html', 'Resize images quickly when you only need dimensions.'],
  ['Image Cropper', '/tools/image-cropper.html', 'Use a focused crop tool for exact x/y crops.'],
  ['Color Picker', '/tools/color-picker.html', 'Pick and inspect colors for designs and screenshots.']
];

const pseoPages = [
  {
    slug: 'pro-image-editor-free',
    title: 'Free Pro Image Editor Online - No Sign Up | ToolsMatic',
    h1: 'Free Pro Image Editor Online',
    desc: 'Use a free pro image editor in your browser. Crop, resize, rotate, draw, add text, apply filters, and export images without signing up.',
    angle: 'free online image editing without account friction',
    sections: ['Why a free image editor should still feel professional', 'Best free editing workflows', 'When to use this instead of a heavy design suite']
  },
  {
    slug: 'pro-image-editor-no-upload',
    title: 'No Upload Image Editor - Private Browser Photo Editing | ToolsMatic',
    h1: 'No Upload Image Editor',
    desc: 'Edit images privately in your browser with no required upload. Perfect for screenshots, private photos, product drafts, and quick visual changes.',
    angle: 'privacy-first image editing for files that should stay local',
    sections: ['Why no-upload image editing matters', 'Private screenshot and document workflows', 'How local editing reduces risk']
  },
  {
    slug: 'pro-image-editor-online',
    title: 'Online Image Editor with Crop, Text, Draw and Filters | ToolsMatic',
    h1: 'Online Image Editor for Fast Visual Work',
    desc: 'Open an online image editor that feels fast and practical. Edit in the browser with crop, resize, rotate, text, drawing, shapes, and filters.',
    angle: 'fast browser-based editing for everyday visual tasks',
    sections: ['What an online image editor should include', 'Common tasks this page handles well', 'How to keep edits simple and clean']
  },
  {
    slug: 'pro-image-editor-mobile',
    title: 'Mobile Image Editor Online - Crop, Text, Rotate | ToolsMatic',
    h1: 'Mobile Image Editor Online',
    desc: 'Edit images on phone or tablet with a responsive browser editor for crop, rotate, text, filters, and quick export.',
    angle: 'mobile-friendly editing when desktop software is not available',
    sections: ['Editing images on a phone without installing apps', 'Mobile layout tips', 'When to finish edits on desktop']
  },
  {
    slug: 'pro-image-editor-for-creators',
    title: 'Image Editor for Creators - Thumbnails, Posts and Screenshots | ToolsMatic',
    h1: 'Image Editor for Creators',
    desc: 'A creator-focused browser image editor for thumbnails, social posts, annotations, screenshots, and lightweight visual polish.',
    angle: 'creator workflows for faster publishing',
    sections: ['Creator editing jobs that need speed', 'How to prepare images for posts', 'Why simple edits often perform better']
  },
  {
    slug: 'pro-image-editor-for-product-photos',
    title: 'Product Photo Editor Online - Crop, Text and Export | ToolsMatic',
    h1: 'Product Photo Editor Online',
    desc: 'Prepare product photos and listing visuals with crop, resize, rotate, annotations, filters, and private browser export.',
    angle: 'product photo cleanup for marketplaces and stores',
    sections: ['Product photos need clarity before effects', 'Useful edits for listings', 'Export habits that keep pages fast']
  },
  {
    slug: 'pro-image-editor-for-social-media',
    title: 'Social Media Image Editor - Fast Browser Visuals | ToolsMatic',
    h1: 'Social Media Image Editor',
    desc: 'Create cleaner social images with browser-based crop, text, shapes, drawing, filters, and export controls.',
    angle: 'social media image editing without a full design tool',
    sections: ['Fast edits for social publishing', 'Text and annotation tips', 'How to avoid over-editing']
  },
  {
    slug: 'pro-image-editor-background-and-text',
    title: 'Add Text to Images and Edit Backgrounds Online | ToolsMatic',
    h1: 'Add Text to Images and Edit Backgrounds',
    desc: 'Add readable text, shapes, highlights, and background-friendly edits to images directly in your browser.',
    angle: 'text and background edits for clearer communication',
    sections: ['Readable text matters more than decoration', 'Background-aware editing tips', 'When to use shapes and highlights']
  },
  {
    slug: 'pro-image-editor-crop-resize-rotate',
    title: 'Crop, Resize and Rotate Image Online - Pro Editor | ToolsMatic',
    h1: 'Crop, Resize and Rotate Image Online',
    desc: 'Crop, resize, rotate, flip, and export images in a pro browser editor with no required upload.',
    angle: 'core image edits in one clean workflow',
    sections: ['Crop first, resize second, export last', 'Rotation and flip workflows', 'Keeping quality high after resizing']
  },
  {
    slug: 'pro-image-editor-filters-drawing',
    title: 'Image Filters and Drawing Tool Online | ToolsMatic',
    h1: 'Image Filters and Drawing Tool Online',
    desc: 'Apply filters, draw on images, add shapes, mark screenshots, and export finished visuals from your browser.',
    angle: 'filters and annotation tools for practical image communication',
    sections: ['Filters should support the message', 'Drawing and annotation use cases', 'Exporting clean marked-up images']
  }
];

function jsonLd(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function schemaFor(slug, title, description, isMain = false) {
  const url = `${SITE}/tools/${slug}.html`;
  const graph = [
    {
      '@type': 'WebApplication',
      name: title.replace(' | ToolsMatic', ''),
      url,
      description,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript and a modern browser',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE}/#tools` },
        { '@type': 'ListItem', position: 3, name: title.replace(' | ToolsMatic', ''), item: url }
      ]
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(([name, text]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text }
      }))
    }
  ];
  if (!isMain) {
    graph.push({
      '@type': 'Article',
      headline: title.replace(' | ToolsMatic', ''),
      description,
      mainEntityOfPage: url,
      author: { '@type': 'Organization', name: 'ToolsMatic' },
      publisher: { '@type': 'Organization', name: 'ToolsMatic', url: SITE },
      dateModified: TODAY
    });
  }
  return jsonLd({ '@context': 'https://schema.org', '@graph': graph });
}

function head({ title, desc, slug, extra = '', isMain = false }) {
  const url = `${SITE}/tools/${slug}.html`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${SITE}/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${SITE}/assets/og-image.png">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/assets/styles.css">
  <link rel="stylesheet" href="/assets/pro-image-editor.css">
  ${extra}
  <script src="/assets/site.js" defer></script>
  ${schemaFor(slug, title, desc, isMain)}
</head>`;
}

function header() {
  return `<body>
  <header>
    <nav class="nav">
      <a class="brand" href="/"><span class="brand-dot"></span><span>ToolsMatic</span></a>
      <div class="nav-links">
        <a href="/#tools" class="nav-btn">All tools</a>
        <button id="theme-toggle" class="theme-toggle" title="Toggle dark/light mode">&#127769;</button>
      </div>
    </nav>
  </header>`;
}

function footer() {
  return `<footer>
    ToolsMatic &middot; Fast, privacy-first utilities for the web. &middot; <a href="/about.html">About</a> &middot; <a href="/terms.html">Terms</a> &middot; <a href="/privacy.html">Privacy</a> &middot; <a href="/contact.html">Contact</a>
  </footer>
</body>
</html>`;
}

function comparisonTable() {
  return `<div class="pro-editor-table-wrap">
    <table class="pro-editor-comparison">
      <thead><tr><th>Feature</th><th>ToolsMatic</th><th>Canva</th><th>Pixlr</th><th>Photopea</th><th>Fotor</th><th>iLoveIMG</th></tr></thead>
      <tbody>${comparisonRows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
  </div>`;
}

function faqHtml() {
  return `<div class="pro-editor-faq">${faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`;
}

function linksHtml() {
  return `<section class="pro-editor-related" aria-labelledby="related-tools">
    <h2 id="related-tools">Related image tools</h2>
    <div class="pro-editor-links">${internalLinks.map(([name, url, desc]) => `<a class="pro-editor-link-card" href="${url}"><strong>${name}</strong><p>${desc}</p></a>`).join('')}</div>
  </section>`;
}

function mainArticle() {
  return `<article class="pro-editor-seo">
    <h2>Free online image editor for serious browser work</h2>
    <p>ToolsMatic Pro Image Editor is built for the editing jobs that happen between a full design app and a tiny single-purpose converter. A writer may need to blur attention away from part of a screenshot, a founder may need a cleaner product image for a landing page, a student may need to crop a diagram for a report, and a developer may need to annotate a bug screenshot before sending it to a teammate. Those jobs should not require an account, a cloud upload, or a heavy design suite. This page gives you a focused browser image editor with crop, resize, rotate, flip, drawing, shapes, icons, text, filters, undo, redo, and export controls in one private workspace.</p>
    <p>The most important difference is the workflow. Many online editors begin by uploading your image to a server. That can be acceptable for public marketing graphics, but it is not ideal for private screenshots, client previews, internal dashboards, invoices, classroom material, profile photos, or product drafts. ToolsMatic keeps the editing session local in your browser. The file is read by your device, rendered into the editor, adjusted with client-side canvas tools, and exported back to your device. That makes the tool useful for quick edits where privacy and speed matter as much as the final look.</p>

    <h2>What you can edit</h2>
    <div class="pro-editor-preset-grid">
      <div class="pro-editor-tip"><h3>Layout and framing</h3><p>Crop unwanted space, resize the canvas, rotate sideways photos, flip assets, and prepare cleaner dimensions before export.</p></div>
      <div class="pro-editor-tip"><h3>Markup and communication</h3><p>Add text, arrows, shapes, drawings, icons, and highlights when an image needs to explain something quickly.</p></div>
      <div class="pro-editor-tip"><h3>Visual polish</h3><p>Apply practical filters, sharpen soft images, test grayscale or sepia looks, and export in PNG, JPG, or WebP depending on browser support.</p></div>
    </div>

    <h2>How to use the Pro Image Editor</h2>
    <ol>
      <li>Drop an image into the upload area or choose one from your device.</li>
      <li>Use the built-in editor menus for crop, resize, flip, rotate, draw, shape, icon, text, and filter controls.</li>
      <li>Use the quick action buttons for common edits like rotate, flip, draw mode, grayscale, sharpen, undo, and redo.</li>
      <li>Choose PNG, JPG, or WebP and set the export quality when the format supports compression.</li>
      <li>Download the edited image with a filename based on your original file.</li>
    </ol>

    <h2>When this is better than Canva, Pixlr, Photopea, Fotor, or iLoveIMG</h2>
    <p>Canva is excellent for designed layouts and templates, Pixlr and Fotor are strong for creative photo effects, Photopea is powerful for advanced layered editing, and iLoveIMG is useful for quick file utilities. ToolsMatic is different: it is a fast, private editor for common browser editing tasks. If you need a full brand design system or layered PSD-level work, a specialized design tool may be better. If you need to crop a private screenshot, annotate a product photo, add text, rotate an image, test a filter, and export without account friction, ToolsMatic is the simpler route.</p>
    ${comparisonTable()}

    <h2>Privacy-first image editing</h2>
    <p>Private editing is not just a marketing line. Screenshots can reveal email addresses, customer names, admin panels, analytics numbers, API keys, billing details, unpublished product ideas, or personal photos. Uploading those files to a random image editor creates unnecessary exposure when the edit can be done locally. This tool loads the editor bundle in the browser and performs the image work on your device. The page still behaves like a normal website, but the editing operation itself does not need a server round trip for the image.</p>

    <h2>Best workflows for clean results</h2>
    <p>Start with framing. Crop first so the viewer sees only what matters. Resize second so the final output matches the platform where it will be used. Add text or shapes only after the crop is settled, because annotations should align with the final composition. Apply filters near the end and avoid stacking too many effects unless the image is intentionally stylized. Export as PNG when you need crisp screenshots or transparency, JPG when you need smaller photographic files, and WebP when your target platform supports it and you want stronger compression.</p>

    <h2>FAQ</h2>
    ${faqHtml()}
  </article>`;
}

function mainPage() {
  const extra = `<link rel="stylesheet" href="/assets/vendor/pro-image-editor/tui-color-picker.min.css">
  <link rel="stylesheet" href="/assets/vendor/pro-image-editor/tui-image-editor.min.css">`;
  return `${head({
    title: 'Pro Image Editor - Free Online Photo Editor, No Upload | ToolsMatic',
    desc: 'Edit images online with crop, resize, rotate, flip, draw, text, shapes, filters, undo, redo, and private browser export. Free no-upload image editor.',
    slug: MAIN_SLUG,
    extra,
    isMain: true
  })}
${header()}
  <main class="pro-editor-shell">
    <nav class="home-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/#tools">Tools</a><span>/</span><strong>Pro Image Editor</strong></nav>
    <section class="pro-editor-hero">
      <span class="pro-editor-kicker">Design tool</span>
      <h1>Pro Image Editor</h1>
      <p>Crop, resize, rotate, flip, draw, add text, add shapes, apply filters, undo changes, and export polished images directly in your browser. Built for fast visual work without forcing your private image through a server upload.</p>
      <div class="pro-editor-badges"><span class="pro-editor-badge">No required upload</span><span class="pro-editor-badge">Crop, text, draw, filters</span><span class="pro-editor-badge">PNG, JPG, WebP export</span><span class="pro-editor-badge">Mobile responsive</span></div>
    </section>

    <section class="pro-editor-panel" aria-labelledby="editor-title">
      <h2 id="editor-title">Edit your image</h2>
      <div class="pro-editor-actions">
        <label class="pro-editor-drop" id="pro-editor-drop">
          <input id="pro-editor-file" type="file" accept="image/*">
          <span><strong>Drop an image here</strong><small>or click to choose JPG, PNG, WebP, GIF still, or SVG</small></span>
        </label>
        <div class="pro-editor-toolbar" aria-label="Quick editor actions">
          <button class="pro-editor-btn" data-pro-action="undo">Undo</button>
          <button class="pro-editor-btn" data-pro-action="redo">Redo</button>
          <button class="pro-editor-btn" data-pro-action="rotate-left">Rotate left</button>
          <button class="pro-editor-btn" data-pro-action="rotate-right">Rotate right</button>
          <button class="pro-editor-btn" data-pro-action="flip-x">Flip X</button>
          <button class="pro-editor-btn" data-pro-action="flip-y">Flip Y</button>
          <button class="pro-editor-btn" data-pro-action="add-text">Add text</button>
          <button class="pro-editor-btn" data-pro-action="shape">Add shape</button>
          <button class="pro-editor-btn" data-pro-action="draw">Draw mode</button>
          <button class="pro-editor-btn" data-pro-action="stop-draw">Stop draw</button>
          <button class="pro-editor-btn" data-pro-action="grayscale">Grayscale</button>
          <button class="pro-editor-btn" data-pro-action="sepia">Sepia</button>
          <button class="pro-editor-btn" data-pro-action="sharpen">Sharpen</button>
          <button class="pro-editor-btn" data-pro-action="reset">Reset</button>
        </div>
      </div>
      <div class="pro-editor-status"><strong>Status</strong><span id="pro-editor-status">Ready</span></div>
      <div class="pro-editor-editor-frame"><div id="pro-image-editor"></div></div>
      <div class="pro-editor-export-row">
        <select id="pro-export-format" class="pro-editor-select" aria-label="Export format"><option value="png">PNG</option><option value="jpg">JPG</option><option value="webp">WebP</option></select>
        <input id="pro-export-quality" class="pro-editor-field" type="number" min="10" max="100" value="92" aria-label="Export quality">
        <button id="pro-export" class="pro-editor-btn primary">Download edited image</button>
      </div>
      <div class="pro-editor-metrics">
        <div class="pro-editor-metric"><span>Original</span><strong id="pro-metric-original">0 B</strong></div>
        <div class="pro-editor-metric"><span>Output estimate</span><strong id="pro-metric-output">Preview</strong></div>
        <div class="pro-editor-metric"><span>Canvas</span><strong id="pro-metric-size">0 x 0</strong></div>
        <div class="pro-editor-metric"><span>Last action</span><strong id="pro-metric-action">Ready</strong></div>
      </div>
    </section>

    ${mainArticle()}
    ${linksHtml()}
  </main>
  <script src="/assets/vendor/pro-image-editor/tui-color-picker.min.js"></script>
  <script src="/assets/vendor/pro-image-editor/tui-image-editor.min.js"></script>
  <script src="/assets/pro-image-editor.js"></script>
${footer()}`;
}

function pseoArticle(page) {
  return `<article class="pro-editor-seo">
    <h2>${page.sections[0]}</h2>
    <p>This page is focused on ${page.angle}. Many image tools try to cover every possible design task, but most people arrive with one clear job: crop a screenshot, add a note, resize a product photo, rotate a sideways picture, mark an issue, or export a smaller file for publishing. ToolsMatic keeps that workflow direct. Open the editor, load an image, make the change, and download the result. The interface is not trying to replace a full design studio; it is built to make everyday image edits fast, private, and understandable.</p>
    <p>The main advantage is control. Your image is handled in the browser, which is useful when the file contains private visual information or when you simply do not want to create another account for a small edit. You can still use a dedicated design platform for complex layouts, brand kits, and collaborative projects. For quick single-image work, a local browser editor is often faster because it removes upload queues, dashboard clutter, and template decisions that do not matter for the task.</p>

    <h2>${page.sections[1]}</h2>
    <p>A clean workflow usually starts with the structure of the image. Crop the frame, rotate or flip if needed, and resize before adding annotations. Then add text, arrows, shapes, drawings, or filters only where they help the viewer understand the image. This order keeps edits clean and prevents common mistakes like adding text before resizing or applying filters before the crop is final. When you are done, export in the format that matches the use case: PNG for crisp interface screenshots, JPG for photos, and WebP when modern compression is supported.</p>
    <p>Because the editor includes undo and redo, you can test changes without being locked into every decision. That matters for social posts, product photos, tutorial screenshots, bug reports, classroom resources, and documentation images. Small visual improvements can make an image easier to scan, but over-editing can make it harder to trust. The best edits are usually the ones that clarify the point without distracting from it.</p>

    <h2>${page.sections[2]}</h2>
    <p>ToolsMatic is strongest when speed, privacy, and clarity matter. Canva is strong for templates and brand layouts, Pixlr and Fotor are good for creative photo effects, Photopea is powerful for layered editing, and iLoveIMG is useful for simple image utilities. This page gives you a browser-first option for practical editing without required upload friction. Use it when the image is already mostly correct and you need a fast professional pass.</p>
    ${comparisonTable()}
    <h2>How to use this editor</h2>
    <ol><li>Open the main <a href="/tools/pro-image-editor.html">Pro Image Editor</a>.</li><li>Drop your image into the editor area.</li><li>Use crop, resize, rotate, text, drawing, shapes, icons, or filters.</li><li>Choose your export format and quality.</li><li>Download the finished image directly from the browser.</li></ol>
    <h2>FAQ</h2>
    ${faqHtml()}
  </article>`;
}

function pseoPage(page) {
  return `${head({ title: page.title, desc: page.desc, slug: page.slug })}
${header()}
  <main class="pro-editor-shell">
    <nav class="home-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/#tools">Tools</a><span>/</span><strong>${page.h1}</strong></nav>
    <section class="pro-editor-hero">
      <span class="pro-editor-kicker">Image editing guide</span>
      <h1>${page.h1}</h1>
      <p>${page.desc}</p>
      <div class="pro-editor-badges"><span class="pro-editor-badge">Private browser workflow</span><span class="pro-editor-badge">Fast image edits</span><span class="pro-editor-badge">No signup required</span></div>
      <p><a class="pro-editor-btn primary" href="/tools/pro-image-editor.html">Open Pro Image Editor</a></p>
    </section>
    ${pseoArticle(page)}
    ${linksHtml()}
  </main>
${footer()}`;
}

function write(file, content) {
  fs.writeFileSync(file, content.replace(/\r?\n/g, '\r\n'));
}

function updateIndex() {
  const file = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = html
    .replace(/76 Free Online Tools/g, '150 Free Online Tools')
    .replace(/collection of 76 free online tools/g, 'collection of 150 free online tools')
    .replace(/Browse 76 fast browser-based tools/g, 'Browse 150 fast browser-based tools')
    .replace(/with 76 useful browser-based utilities/g, 'with 150 useful browser-based utilities')
    .replace(/collection of 76 browser-based tools/g, 'collection of 150 browser-based tools')
    .replace(/"name":\s*"76 Free Online Tools for Writing, PDF, Data, Design, and Developer Work"/, '"name":  "150 Free Online Tools for Writing, PDF, Data, Design, and Developer Work"')
    .replace(/"description":\s*"ToolsMatic is a fast, privacy-first collection of 76 free online tools([^"]*)"/, '"description":  "ToolsMatic is a fast, privacy-first collection of 150 free online tools$1"')
    .replace(/>149 tools ready</g, '>150 tools ready<');

  const card = `        <a class="card" href="tools/pro-image-editor.html">
          <h3>Pro Image Editor</h3>
          <p>Edit images with crop, resize, rotate, draw, text, filters, and private export.</p>
        </a>`;
  if (!html.includes('tools/pro-image-editor.html')) {
    html = html.replace(
      /(<a class="card" href="tools\/browser-image-editor\.html">\s*<h3>Browser Image Editor<\/h3>\s*<p>A local image editor for crop, resize, rotate, filters, opacity, and quick format export\.<\/p>\s*<\/a>)/,
      `$1${card}`
    );
  }
  write(file, html);
}

function updateSiteJs() {
  const file = path.join(ROOT, 'assets', 'site.js');
  let js = fs.readFileSync(file, 'utf8');
  const entry = `    { url: '/tools/pro-image-editor.html', title: 'Pro Image Editor', description: 'Edit images with crop, resize, rotate, draw, text, filters, undo, redo, and private export.', category: 'Design' },`;
  if (!js.includes("title: 'Pro Image Editor'")) {
    js = js.replace(
      "    { url: '/tools/browser-image-editor.html', title: 'Browser Image Editor', description: 'A local image editor for crop, resize, rotate, filters, opacity, and quick format export.', category: 'Design' },",
      "    { url: '/tools/browser-image-editor.html', title: 'Browser Image Editor', description: 'A local image editor for crop, resize, rotate, filters, opacity, and quick format export.', category: 'Design' },\n" + entry
    );
  }
  js = js.replace('const HOME_TOOL_COUNT = 149;', 'const HOME_TOOL_COUNT = 150;');
  if (!js.includes('pro image editor photo editor online no upload browser image editor crop resize rotate draw text shapes filters private export')) {
    js = js.replace(
      /Design: '([^']*)'/,
      "Design: '$1 pro image editor photo editor online no upload browser image editor crop resize rotate draw text shapes filters private export'"
    );
  }
  if (!js.includes("'Pro Image Editor':")) {
    js = js.replace(
      "    'Image Compressor': 'compress image reduce image size jpg png webp optimize',",
      "    'Image Compressor': 'compress image reduce image size jpg png webp optimize',\n    'Pro Image Editor': 'photo editor image editor crop resize rotate flip draw text shapes icons filters annotate screenshot product photo social media no upload private browser editor',"
    );
  }
  write(file, js);
}

function sitemapUrl(url, priority) {
  return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function updateSitemaps() {
  const urls = [MAIN_URL, ...pseoPages.map((page) => `${SITE}/tools/${page.slug}.html`)];
  const dedicated = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url, index) => sitemapUrl(url, index === 0 ? '0.9' : '0.65')).join('\n')}\n</urlset>\n`;
  write(path.join(ROOT, 'sitemap-pro-image-editor.xml'), dedicated);

  const mainFile = path.join(ROOT, 'sitemap.xml');
  let main = fs.readFileSync(mainFile, 'utf8');
  urls.forEach((url, index) => {
    if (!main.includes(`<loc>${url}</loc>`)) {
      main = main.replace('</urlset>', `${sitemapUrl(url, index === 0 ? '0.9' : '0.65')}\n</urlset>`);
    }
  });
  write(mainFile, main);

  const imageFile = path.join(ROOT, 'sitemap-image-tools.xml');
  let image = fs.readFileSync(imageFile, 'utf8');
  urls.forEach((url, index) => {
    if (!image.includes(`<loc>${url}</loc>`)) {
      image = image.replace('</urlset>', `${sitemapUrl(url, index === 0 ? '0.9' : '0.65')}\n</urlset>`);
    }
  });
  write(imageFile, image);

  const robotsFile = path.join(ROOT, 'robots.txt');
  let robots = fs.readFileSync(robotsFile, 'utf8');
  const sitemapLine = 'Sitemap: https://toolsmatic.me/sitemap-pro-image-editor.xml';
  if (!robots.includes(sitemapLine)) {
    robots = `${robots.trim()}\n${sitemapLine}\n`;
  }
  write(robotsFile, robots);
}

function run() {
  write(path.join(TOOLS, `${MAIN_SLUG}.html`), mainPage());
  pseoPages.forEach((page) => write(path.join(TOOLS, `${page.slug}.html`), pseoPage(page)));
  updateIndex();
  updateSiteJs();
  updateSitemaps();
}

run();
