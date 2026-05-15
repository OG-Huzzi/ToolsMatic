const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOOLS = path.join(ROOT, 'tools');
const INDEX = path.join(ROOT, 'index.html');
const SITE = 'https://toolsmatic.me';
const TODAY = '2026-05-13';

const adBlock = `    <section class="ad-slot ad-slot-primary pdf-ad-slot" aria-label="Advertisement">
      <script>atOptions={'key':'e61a3745429623f25315f86052a3ab7b','format':'iframe','height':90,'width':728,'params':{}};</script>
      <script src="https://fixesconsessionconsession.com/e61a3745429623f25315f86052a3ab7b/invoke.js"></script>
    </section>`;

const newTools = [
  {
    slug: 'excel-pdf-converter',
    name: 'Excel PDF Converter',
    cardTitle: 'Excel ↔ PDF Converter',
    title: 'Excel to PDF & PDF to Excel Converter – Free, No Upload | ToolsMatic',
    description: 'Convert Excel spreadsheets to PDF or extract PDF tables into Excel free. No uploads, no sign-up, runs entirely in your browser. Private and instant.',
    h1: 'Excel ↔ PDF Converter — Free & Browser-Based',
    badge: 'Private spreadsheet conversion',
    sub: 'Convert XLSX or XLS files into clean PDFs, or extract PDF tables back into Excel workbooks without uploading files.',
    category: 'PDF',
    type: 'excel',
    internal: ['compress-pdf', 'merge-pdf', 'edit-pdf-metadata', 'pdf-text-converter'],
    audiences: 'accountants, students, data analysts, finance teams, operations managers, freelancers, and anyone who needs spreadsheet data in a stable document format',
    topic: 'Excel to PDF and PDF to Excel conversion',
    faqTargets: ['excel to pdf free no upload', 'pdf to excel converter free', 'convert xlsx to pdf online free', 'extract table from pdf to excel', 'pdf to excel without losing formatting', 'free excel pdf converter for students'],
    cardDesc: 'Convert spreadsheets to PDF or extract PDF tables into Excel locally.'
  },
  {
    slug: 'pptx-pdf-converter',
    name: 'PowerPoint PDF Converter',
    cardTitle: 'PowerPoint ↔ PDF Converter',
    title: 'PowerPoint to PDF & PDF to PowerPoint – Free, No Upload | ToolsMatic',
    description: 'Convert PPTX to PDF or PDF to PowerPoint free in your browser. No uploads, no account, 100% private. Instant slide conversion online.',
    h1: 'PowerPoint ↔ PDF Converter — Free & Private',
    badge: 'Private slide conversion',
    sub: 'Turn presentations into PDF pages or rebuild PDFs as editable slide decks with thumbnail previews and quality control.',
    category: 'PDF',
    type: 'ppt',
    internal: ['jpg-to-pdf', 'watermark-pdf', 'compress-pdf', 'annotate-pdf'],
    audiences: 'students, teachers, presenters, designers, trainers, marketers, and teams preparing decks for sharing or review',
    topic: 'PowerPoint to PDF and PDF to PowerPoint conversion',
    faqTargets: ['powerpoint to pdf free no upload', 'pdf to powerpoint converter free', 'convert pptx to pdf online', 'pdf to ppt free without sign up', 'best free powerpoint to pdf converter', 'convert presentation to pdf private'],
    cardDesc: 'Convert presentation slides to PDF or PDF pages back into PPTX.'
  },
  {
    slug: 'pdf-pdfa-converter',
    name: 'PDF PDF/A Converter',
    cardTitle: 'PDF ↔ PDF/A Converter',
    title: 'PDF to PDF/A Converter – Free, Browser-Based, No Upload | ToolsMatic',
    description: 'Convert PDF to PDF/A archival format or PDF/A back to regular PDF free. No uploads, no sign-up, runs in your browser. Instant and private.',
    h1: 'PDF ↔ PDF/A Converter — Free & Private',
    badge: 'Archival metadata workflow',
    sub: 'Add archival PDF/A metadata markers or remove PDF/A-specific metadata from a local PDF without uploading it.',
    category: 'PDF',
    type: 'pdfa',
    internal: ['protect-pdf', 'edit-pdf-metadata', 'remove-pdf-metadata', 'repair-pdf'],
    audiences: 'lawyers, archivists, government workers, compliance teams, records managers, universities, and offices preparing long-term documents',
    topic: 'PDF to PDF/A archival conversion',
    faqTargets: ['what is pdf/a format', 'convert pdf to pdf/a free', 'pdf/a converter online no upload', 'pdf/a-1b compliance tool free', 'difference between pdf and pdf/a', 'how to make a pdf archival compliant'],
    cardDesc: 'Prepare archival PDF/A metadata or convert PDF/A back to standard PDF.'
  },
  {
    slug: 'organize-pdf',
    name: 'Organize PDF',
    cardTitle: 'Organize PDF',
    title: 'Organize PDF Pages – Rearrange, Delete & Rotate Free | ToolsMatic',
    description: 'Organize PDF pages visually in your browser. Drag to reorder, delete, rotate, or merge pages from multiple PDFs. Free, no upload, no sign-up required.',
    h1: 'Organize PDF Pages — Free Visual PDF Editor',
    badge: 'Visual page organizer',
    sub: 'Drag PDF pages into the right order, delete extras, rotate pages, duplicate pages, and rebuild a clean PDF locally.',
    category: 'PDF',
    type: 'organize',
    internal: ['merge-pdf', 'split-pdf', 'remove-pages', 'rotate-pdf', 'reorder-pages'],
    audiences: 'students, office workers, lawyers, publishers, administrators, teachers, and teams cleaning large PDF packets',
    topic: 'visual PDF page organization',
    faqTargets: ['rearrange pdf pages free', 'how to reorganize pdf pages online', 'delete pdf pages free no upload', 'merge and reorder pdf pages', 'rotate pdf pages free', 'best free pdf organizer online'],
    cardDesc: 'Reorder, rotate, duplicate, delete, and merge PDF pages visually.'
  }
];

const pseoBase = [
  {
    slug: 'word-pdf-converter',
    name: 'Word PDF Converter',
    cardTitle: 'Word ↔ PDF Converter',
    topic: 'Word to PDF and PDF to Word conversion',
    audiences: 'students, job applicants, lawyers, HR teams, freelancers, teachers, and business users',
    internal: ['merge-pdf', 'compress-pdf', 'split-pdf', 'protect-pdf']
  },
  ...newTools
];

const variants = [
  ['free', 'Free', 'free browser-based workflow with no account friction'],
  ['no-upload', 'No Upload', 'privacy-first workflow where files stay in the browser'],
  ['online', 'Online', 'instant online workflow that opens in any modern browser'],
  ['private', 'Private', 'sensitive-document workflow for files that should not be sent to a server'],
  ['mobile', 'Mobile', 'phone and tablet friendly workflow for work away from a desk'],
  ['students', 'For Students', 'student workflow for assignments, reports, applications, and class documents'],
  ['business', 'For Business', 'business workflow for teams, reports, forms, contracts, and operations'],
  ['batch', 'Batch Workflow', 'multi-file workflow for people handling several documents at once'],
  ['secure', 'Secure', 'safer local workflow focused on control and reduced upload exposure'],
  ['how-to', 'How To', 'step-by-step guide for completing the conversion or edit correctly']
];

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function slugTitle(slug) {
  return slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function header() {
  return `<header class="header" role="banner">
  <div class="header-inner">
    <a href="/" class="header-logo" aria-label="ToolsMatic Home"><span class="header-logo-text">ToolsMatic</span></a>
    <nav class="header-nav" aria-label="Main navigation">
      <a href="/#tools" class="active">Tools</a>
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
    </nav>
    <a href="/#tools" class="header-cta btn">All Tools</a>
    <button class="hamburger" aria-label="Open menu" aria-expanded="false">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </button>
  </div>
  <div class="mobile-menu" aria-hidden="true">
    <a href="/#tools" class="active">Tools</a>
    <a href="/about.html">About</a>
    <a href="/contact.html">Contact</a>
  </div>
</header>`;
}

function footer(tool) {
  return `<footer class="footer" role="contentinfo">
  <div class="footer-inner">
    <div class="footer-col"><div style="font-family:'Instrument Serif',serif;font-size:20px;color:var(--text-primary);margin-bottom:12px;">ToolsMatic</div><p style="font-family:'Inter',sans-serif;font-size:14px;color:var(--text-muted);line-height:1.7;max-width:220px;">Privacy-first PDF tools. Your files never leave your browser.</p><p style="font-family:'Inter',sans-serif;font-size:13px;color:var(--text-muted);margin-top:16px;">© 2026 ToolsMatic. All rights reserved.</p></div>
    <div class="footer-col"><div class="footer-col-title">PDF Tools</div><a href="/tools/merge-pdf.html" class="footer-link">Merge PDF</a><a href="/tools/split-pdf.html" class="footer-link">Split PDF</a><a href="/tools/compress-pdf.html" class="footer-link">Compress PDF</a><a href="/tools/word-pdf-converter.html" class="footer-link">Word PDF Converter</a><a href="/tools/${tool.slug}.html" class="footer-link">${esc(tool.cardTitle)}</a></div>
    <div class="footer-col"><div class="footer-col-title">Document Tools</div><a href="/tools/excel-pdf-converter.html" class="footer-link">Excel PDF Converter</a><a href="/tools/pptx-pdf-converter.html" class="footer-link">PowerPoint PDF Converter</a><a href="/tools/pdf-pdfa-converter.html" class="footer-link">PDF/A Converter</a><a href="/tools/organize-pdf.html" class="footer-link">Organize PDF</a></div>
    <div class="footer-col"><div class="footer-col-title">Company</div><a href="/about.html" class="footer-link">About</a><a href="/contact.html" class="footer-link">Contact</a><a href="/privacy.html" class="footer-link">Privacy Policy</a><a href="/terms.html" class="footer-link">Terms of Service</a></div>
  </div>
  <div class="footer-bottom"><span>Built for people who value privacy</span><span>No tracking. No uploads. No nonsense.</span></div>
</footer>`;
}

function schema(tool, faqs) {
  return `<script type="application/ld+json">${json({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.cardTitle,
        url: `${SITE}/tools/${tool.slug}.html`,
        description: tool.description,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE}/#tools` },
          { '@type': 'ListItem', position: 3, name: tool.cardTitle, item: `${SITE}/tools/${tool.slug}.html` }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
      }
    ]
  })}</script>`;
}

function sharedCss() {
  return `<style>
    .doc-breadcrumb{max-width:1040px;margin:0 auto;padding:80px 40px 0}
    .doc-hero{max-width:1040px;margin:0 auto;padding:32px 40px 40px}
    .doc-tool{width:min(100% - 2rem,1040px);margin:0 auto;padding:0 0 80px}
    .doc-shell{display:grid;gap:18px;padding:20px;border:1px solid var(--border);border-radius:var(--radius-card);background:linear-gradient(180deg,rgba(255,255,255,.03),transparent 34%),var(--bg-card);box-shadow:0 24px 70px rgba(0,0,0,.28)}
    .doc-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:6px;border:1px solid var(--border);border-radius:999px;background:#070707}
    .doc-tab{min-height:48px;border-radius:999px;color:var(--text-secondary);font-weight:800;cursor:pointer;transition:var(--transition)}
    .doc-tab.active{background:linear-gradient(135deg,var(--accent),#fbbf24);color:#080808;box-shadow:0 10px 26px rgba(245,158,11,.22)}
    .doc-grid{display:grid;grid-template-columns:.95fr 1.05fr;gap:18px;align-items:start}
    .doc-card{border:1px solid var(--border);border-radius:var(--radius-card);background:#090909;padding:18px}
    .upload-zone{min-height:240px;cursor:pointer;text-align:center}
    .toolbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:14px}
    .doc-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 16px;border:1px solid var(--border-hover);border-radius:var(--radius-btn);color:var(--text-primary);font-weight:800;cursor:pointer;transition:var(--transition)}
    .doc-btn.primary{border-color:transparent;background:linear-gradient(135deg,var(--accent),#fbbf24);color:#080808}
    .doc-btn:hover{transform:translateY(-2px);border-color:rgba(245,158,11,.42)}
    .doc-btn:disabled{opacity:.45;cursor:not-allowed;transform:none}
    .doc-select,.doc-input{width:100%;min-height:46px;margin-top:10px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius-btn);background:#050505;color:var(--text-primary)}
    .metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
    .metric{padding:14px;border:1px solid var(--border);border-radius:var(--radius-btn);background:#090909}
    .metric span{display:block;color:var(--text-muted);font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}.metric strong{display:block;margin-top:6px;font-size:20px;color:var(--text-primary)}
    .progress{height:12px;border:1px solid var(--border);border-radius:999px;background:#050505;overflow:hidden}.bar{height:100%;width:0;background:linear-gradient(90deg,var(--accent),#fbbf24);transition:width .25s ease}
    .notice{min-height:46px;display:flex;align-items:center;padding:12px 14px;border:1px solid rgba(245,158,11,.22);border-radius:var(--radius-btn);background:rgba(245,158,11,.08);color:var(--text-secondary)}.notice.error{border-color:rgba(239,68,68,.35);background:rgba(239,68,68,.08);color:#fecaca}
    .preview{min-height:440px;max-height:720px;overflow:auto}.preview table{width:100%;border-collapse:collapse;font-size:13px}.preview th,.preview td{padding:8px 10px;border:1px solid rgba(255,255,255,.1);color:var(--text-secondary);vertical-align:top}.preview th{position:sticky;top:0;background:#121212;color:var(--text-primary)}.preview tr:nth-child(even) td{background:rgba(255,255,255,.025)}
    .thumb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(138px,1fr));gap:14px}.thumb{position:relative;border:1px solid var(--border);border-radius:12px;background:#050505;padding:10px;transition:var(--transition)}.thumb.selected{border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-glow)}.thumb img,.thumb canvas{width:100%;border-radius:8px;background:#fff}.thumb .badge{position:absolute;top:8px;left:8px;padding:4px 8px;border-radius:999px;background:#050505;color:var(--accent);font-size:12px;font-weight:800}.thumb-actions{display:flex;gap:6px;margin-top:8px}.thumb-actions button{flex:1;min-height:30px;border:1px solid var(--border);border-radius:8px;color:var(--text-secondary);cursor:pointer}
    .meta-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.meta-box{padding:14px;border:1px solid var(--border);border-radius:12px;background:#050505}.meta-box h3{font-family:Inter,sans-serif;font-size:14px;font-weight:800;margin-bottom:8px}.meta-box pre{white-space:pre-wrap;color:var(--text-secondary);font-size:12px}
    .seo-section{width:min(100% - 2rem,1040px);margin:0 auto;padding:0 0 80px}.seo-card{padding:32px;border:1px solid var(--border);border-radius:var(--radius-card);background:var(--bg-card)}.seo-card h2,.seo-card h3{font-family:Inter,sans-serif;font-weight:800;line-height:1.2;margin:28px 0 12px}.seo-card h2:first-child{margin-top:0}.seo-card p,.seo-card li{margin-top:12px;color:var(--text-secondary)}.seo-card a{color:var(--accent);font-weight:800}.faq-list{display:grid;gap:12px;margin-top:16px}.faq-list details{padding:14px 16px;border:1px solid var(--border);border-radius:var(--radius-btn);background:#090909}.faq-list summary{font-weight:800;color:var(--text-primary);cursor:pointer}
    @media(max-width:860px){.doc-breadcrumb,.doc-hero{padding-left:20px;padding-right:20px}.doc-grid,.metrics,.meta-grid{grid-template-columns:1fr}.doc-shell,.seo-card{padding:16px}.doc-tabs{border-radius:18px}.doc-tab{border-radius:14px}}
  </style>`;
}

function seo(tool) {
  const links = tool.internal.map((slug) => `<a href="/tools/${slug}.html">${slugTitle(slug)}</a>`).join(', ');
  const faqs = makeFaqs(tool);
  return `<section class="seo-section" aria-label="${esc(tool.cardTitle)} guide">
    <article class="seo-card">
      <h2>${esc(tool.cardTitle)} built for private browser work</h2>
      <p>${esc(tool.h1)} is a focused document utility for ${esc(tool.audiences)}. It handles ${esc(tool.topic)} without forcing the user into an upload queue, account wall, or heavyweight desktop app. The tool is designed for quick conversion, clear previews, visible file-size feedback, and practical error messages when a file is encrypted, damaged, scanned, or not structured in a way the browser can reconstruct perfectly.</p>
      <p>The biggest reason to use a browser-based converter is control. Documents often contain financial data, personal information, application details, contracts, lesson material, client names, or internal notes. Uploading those files to a random server creates unnecessary exposure. ToolsMatic keeps the workflow local wherever the browser libraries allow it: the file is selected, parsed in the browser, previewed on screen, converted, and downloaded back to your device. That privacy-first model is especially useful for repeated office tasks where the document is not public.</p>
      <h2>Both conversion directions explained</h2>
      <p>In the first mode, the tool reads the source file, builds a structured preview, and exports the result into the requested document format. In the reverse mode, it extracts usable page, table, metadata, or slide data from the PDF and rebuilds it into the editable target format. Some document formats are not symmetrical. A spreadsheet has cells and sheets; a PDF has positioned text. A presentation has slides and layers; a PDF has pages. That means the tool uses practical reconstruction: it keeps the output useful, readable, and easy to edit, while showing a preview so you can inspect the result before download.</p>
      <h2>Who uses this tool?</h2>
      <p>${esc(tool.audiences)} use this workflow because document conversion is rarely a one-time novelty. A student may need a submission-ready file. An accountant may need a report version that is stable for email. A teacher may need a printable packet. A lawyer may need an archival copy. A finance team may need tables extracted from a PDF. A designer may need slides converted for review. The shared need is simple: get the document into the right format without losing time or handing the file to an unknown service.</p>
      <h2>Step-by-step guide</h2>
      <ol>
        <li>Choose the conversion direction using the tabs at the top of the tool.</li>
        <li>Drag the file into the upload zone or click the upload area to browse.</li>
        <li>Review the preview, sheet selector, thumbnail grid, metadata summary, or table output depending on the tool.</li>
        <li>Check the row count, column count, slide count, page count, and file-size indicators.</li>
        <li>Click the conversion button, wait for the progress bar, then download the finished file.</li>
      </ol>
      <h2>Related ToolsMatic PDF tools</h2>
      <p>After using this converter, you may also need ${links}. These related tools keep the workflow inside the same privacy-first PDF toolkit instead of forcing you to jump between unrelated sites.</p>
      <h2>Frequently asked questions</h2>
      <div class="faq-list">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
    </article>
  </section>`;
}

function makeFaqs(tool) {
  const base = [
    [`Is ${tool.cardTitle} free?`, `Yes. ToolsMatic provides this converter as a free browser-based tool with no sign-up requirement for normal use.`],
    [`Does ${tool.cardTitle} upload my files?`, `The tool is designed for local browser processing. Your files are selected and processed in the browser rather than sent to a ToolsMatic upload server.`],
    [`Can I use this tool on mobile?`, `Yes. The interface is responsive, with a large upload zone, readable previews, and buttons that remain usable on smaller screens.`],
    [`What happens if my file is password protected?`, `Encrypted or password-protected files may not be readable by the browser libraries. The tool shows a clear error instead of silently failing.`],
    [`How accurate is the conversion?`, `Accuracy depends on the structure of the source file. Clean digital files convert better than scanned, flattened, damaged, or heavily custom-designed documents.`],
    [`Can students use this tool for free?`, `Yes. It is suitable for students who need quick document conversion for assignments, applications, reports, and class material.`],
    [`Can I preview before downloading?`, `Yes. The tool shows a preview panel so you can check the output structure before exporting the final file.`],
    [`Which related PDF tools should I use next?`, `Use Compress PDF to reduce size, Merge PDF to combine files, and metadata or protection tools when the finished document needs cleanup or security.`]
  ];
  return base;
}

function basePage(tool) {
  const faqs = makeFaqs(tool);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(tool.title)}</title>
  <meta name="description" content="${esc(tool.description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE}/tools/${tool.slug}.html">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE}/tools/${tool.slug}.html">
  <meta property="og:title" content="${esc(tool.title)}">
  <meta property="og:description" content="${esc(tool.description)}">
  <meta property="og:image" content="${SITE}/assets/pdf/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(tool.title)}">
  <meta name="twitter:description" content="${esc(tool.description)}">
  <meta name="twitter:image" content="${SITE}/assets/pdf/og-image.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/pdf/global.css">
  <link rel="stylesheet" href="/assets/pdf/tool.css">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="manifest" href="/manifest.webmanifest">
  ${schema(tool, faqs)}
  ${sharedCss()}
</head>
<body>
${header()}
<main>
  <nav class="breadcrumb doc-breadcrumb" aria-label="Breadcrumb"><a href="/" class="breadcrumb-link">Home</a><span class="breadcrumb-sep" aria-hidden="true">/</span><a href="/#tools" class="breadcrumb-link">Tools</a><span class="breadcrumb-sep" aria-hidden="true">/</span><span class="breadcrumb-current" aria-current="page">${esc(tool.cardTitle)}</span></nav>
  <section class="tool-hero doc-hero" aria-label="${esc(tool.cardTitle)}">
    <div class="tool-hero-badge">${esc(tool.badge)}</div>
    <h1>${esc(tool.h1)}</h1>
${adBlock}
    <p class="tool-hero-sub">${esc(tool.sub)}</p>
  </section>
  <section class="doc-tool" aria-label="${esc(tool.cardTitle)} workspace">
    ${toolMarkup(tool)}
  </section>
  ${seo(tool)}
</main>
${footer(tool)}
${libraries(tool)}
<script>${toolJs(tool)}</script>
</body>
</html>`;
}

function toolMarkup(tool) {
  if (tool.type === 'organize') return organizeMarkup();
  if (tool.type === 'pdfa') return pdfaMarkup();
  const tabs = tool.type === 'excel' ? ['Excel to PDF', 'PDF to Excel'] : ['PPTX to PDF', 'PDF to PPTX'];
  return `<div class="doc-shell" data-doc-tool="${tool.type}">
    <div class="doc-tabs" role="tablist" aria-label="Conversion mode"><button class="doc-tab active" data-mode="forward">${tabs[0]}</button><button class="doc-tab" data-mode="reverse">${tabs[1]}</button></div>
    <input id="file-input" type="file" hidden>
    <div class="doc-grid">
      <div class="doc-card">
        <div class="upload-zone" id="upload-zone" role="button" tabindex="0"><div class="upload-zone-icon" aria-hidden="true">↥</div><div class="upload-zone-text" id="upload-title">Drop file here</div><div class="upload-zone-sub">or click to browse</div><div class="upload-zone-sub">Files stay in your browser.</div></div>
        <select class="doc-select" id="sheet-select" hidden aria-label="Sheet selector"></select>
        ${tool.type === 'ppt' ? '<select class="doc-select" id="quality-select"><option value="1">Standard quality</option><option value="2">High quality</option></select>' : ''}
        <div class="toolbar"><button class="doc-btn primary" id="convert-btn" data-primary disabled>Convert</button><button class="doc-btn" id="download-btn" disabled>Download</button><button class="doc-btn" id="clear-btn" data-clear disabled>Clear</button></div>
      </div>
      <div class="doc-card preview" id="preview"><div class="notice">Preview appears here after you add a file.</div></div>
    </div>
    <div class="metrics"><div class="metric"><span>Rows</span><strong id="rows">0</strong></div><div class="metric"><span>Columns / Slides</span><strong id="cols">0</strong></div><div class="metric"><span>Input size</span><strong id="input-size">0 B</strong></div><div class="metric"><span>Output size</span><strong id="output-size">0 B</strong></div></div>
    <div class="progress"><div class="bar" id="bar"></div></div>
    <div class="notice" id="notice">Choose a file to begin.</div>
  </div>`;
}

function pdfaMarkup() {
  return `<div class="doc-shell" data-doc-tool="pdfa">
    <div class="doc-tabs" role="tablist"><button class="doc-tab active" data-mode="to">PDF to PDF/A</button><button class="doc-tab" data-mode="from">PDF/A to PDF</button></div>
    <input id="file-input" type="file" accept=".pdf,application/pdf" hidden>
    <div class="doc-grid">
      <div class="doc-card"><div class="upload-zone" id="upload-zone" role="button" tabindex="0"><div class="upload-zone-icon">↥</div><div class="upload-zone-text">Drop PDF here</div><div class="upload-zone-sub">or click to browse</div></div><div class="toolbar"><button class="doc-btn primary" id="convert-btn" disabled>Convert</button><button class="doc-btn" id="download-btn" disabled>Download</button><button class="doc-btn" id="clear-btn" disabled>Clear</button></div></div>
      <div class="doc-card"><div class="meta-grid"><div class="meta-box"><h3>Before</h3><pre id="before-meta">No PDF loaded.</pre></div><div class="meta-box"><h3>After</h3><pre id="after-meta">Convert to see changes.</pre></div></div></div>
    </div>
    <div class="metrics"><div class="metric"><span>PDF version</span><strong id="rows">-</strong></div><div class="metric"><span>Changes</span><strong id="cols">0</strong></div><div class="metric"><span>Input size</span><strong id="input-size">0 B</strong></div><div class="metric"><span>Output size</span><strong id="output-size">0 B</strong></div></div>
    <div class="progress"><div class="bar" id="bar"></div></div><div class="notice" id="notice">PDF/A conversion is metadata-focused in browser. Validate with a dedicated compliance validator for legal archiving.</div>
  </div>`;
}

function organizeMarkup() {
  return `<div class="doc-shell" data-doc-tool="organize">
    <input id="file-input" type="file" accept=".pdf,application/pdf" multiple hidden>
    <div class="doc-grid">
      <div class="doc-card"><div class="upload-zone" id="upload-zone" role="button" tabindex="0"><div class="upload-zone-icon">↥</div><div class="upload-zone-text">Drop PDF files here</div><div class="upload-zone-sub">Merge, reorder, rotate, duplicate, or delete pages.</div></div><div class="toolbar"><button class="doc-btn" id="select-all">Select all</button><button class="doc-btn" id="deselect-all">Deselect all</button><button class="doc-btn" id="delete-selected">Delete selected</button><button class="doc-btn" id="rotate-selected">Rotate selected</button><button class="doc-btn" id="undo">Undo</button><button class="doc-btn" id="redo">Redo</button><button class="doc-btn primary" id="download-btn" disabled>Download organized PDF</button><button class="doc-btn" id="clear-btn" disabled>Clear</button></div></div>
      <div class="doc-card preview"><div class="thumb-grid" id="page-grid"><div class="notice">Page thumbnails appear here.</div></div></div>
    </div>
    <div class="metrics"><div class="metric"><span>Total pages</span><strong id="rows">0</strong></div><div class="metric"><span>Selected</span><strong id="cols">0</strong></div><div class="metric"><span>Input size</span><strong id="input-size">0 B</strong></div><div class="metric"><span>Estimate</span><strong id="output-size">0 B</strong></div></div>
    <div class="progress"><div class="bar" id="bar"></div></div><div class="notice" id="notice">Upload one or more PDFs to organize pages visually.</div>
  </div>`;
}

function libraries(tool) {
  const base = '<script src="/assets/pdf/global.js"></script><script src="/assets/pdf/tool-base.js"></script>';
  if (tool.type === 'excel') return `<script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>${base}`;
  if (tool.type === 'ppt') return `<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/pptxgenjs/3.12.0/pptxgen.bundle.js"></script>${base}`;
  if (tool.type === 'pdfa') return `<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>${base}`;
  return `<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>${base}`;
}

function toolJs(tool) {
  if (tool.type === 'excel') return excelJs();
  if (tool.type === 'ppt') return pptJs();
  if (tool.type === 'pdfa') return pdfaJs();
  return organizeJs();
}

function commonHelpers() {
  return `const $=s=>document.querySelector(s);const fmt=b=>!b?'0 B':(b<1024?b+' B':b<1048576?(b/1024).toFixed(1)+' KB':(b/1048576).toFixed(2)+' MB');const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));const setNotice=(m,e=false)=>{const n=$('#notice');n.textContent=m;n.classList.toggle('error',e)};const setBar=v=>{$('#bar').style.width=Math.max(0,Math.min(100,v))+'%'};const download=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};`;
}

function excelJs() {
  return `'use strict';(()=>{${commonHelpers()}let mode='forward',file=null,workbook=null,rows=[],outBlob=null,outName='converted.pdf';const input=$('#file-input'),preview=$('#preview'),sheet=$('#sheet-select');function reset(){file=null;workbook=null;rows=[];outBlob=null;input.value='';sheet.hidden=true;preview.innerHTML='<div class="notice">Preview appears here after you add a file.</div>';$('#rows').textContent='0';$('#cols').textContent='0';$('#input-size').textContent='0 B';$('#output-size').textContent='0 B';$('#convert-btn').disabled=true;$('#download-btn').disabled=true;$('#clear-btn').disabled=true;setBar(0)}function switchMode(m){mode=m;reset();document.querySelectorAll('.doc-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));input.accept=m==='forward'?'.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel':'.pdf,application/pdf';$('#upload-title').textContent=m==='forward'?'Drop Excel file here':'Drop PDF file here';setNotice(m==='forward'?'Add an XLSX or XLS file to preview sheets.':'Add a PDF to extract tables into Excel.')}function renderTable(data){const head=data[0]||[];const body=data.slice(1,80);preview.innerHTML='<table><thead><tr>'+head.map(h=>'<th>'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+body.map(r=>'<tr>'+head.map((_,i)=>'<td>'+esc(r[i]??'')+'</td>').join('')+'</tr>').join('')+'</tbody></table>';$('#rows').textContent=Math.max(data.length-1,0);$('#cols').textContent=head.length}async function loadFile(f){file=f;outBlob=null;$('#input-size').textContent=fmt(f.size);$('#clear-btn').disabled=false;$('#convert-btn').disabled=false;setBar(10);try{if(mode==='forward'){if(!window.XLSX)throw Error('SheetJS did not load. Refresh and try again.');workbook=XLSX.read(await f.arrayBuffer(),{type:'array'});sheet.innerHTML=workbook.SheetNames.map(n=>'<option>'+esc(n)+'</option>').join('');sheet.hidden=workbook.SheetNames.length<2;loadSheet(sheet.value||workbook.SheetNames[0]);setNotice('Spreadsheet loaded. Choose a sheet if needed, then convert.')}else{await pdfToRows(f);setNotice('PDF text extracted into a table preview. Convert to download XLSX.')}setBar(35)}catch(e){setNotice(e.message||'Could not read this file. It may be corrupted or password protected.',true)}}function loadSheet(name){const ws=workbook.Sheets[name];rows=XLSX.utils.sheet_to_json(ws,{header:1,blankrows:false,defval:''});if(!rows.length)rows=[['Empty sheet']];renderTable(rows)}async function pdfToRows(f){if(!window.pdfjsLib)throw Error('PDF.js did not load.');pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise;rows=[['Page','Column 1','Column 2','Column 3','Column 4']];for(let p=1;p<=pdf.numPages;p++){const page=await pdf.getPage(p),tc=await page.getTextContent(),lineMap={};tc.items.forEach(it=>{const y=Math.round(it.transform[5]);(lineMap[y]||(lineMap[y]=[])).push({x:it.transform[4],t:it.str})});Object.keys(lineMap).map(Number).sort((a,b)=>b-a).forEach(y=>{const parts=lineMap[y].sort((a,b)=>a.x-b.x).map(x=>x.t.trim()).filter(Boolean);if(parts.length)rows.push([p,...parts.slice(0,4)])});setBar(20+p/pdf.numPages*45)}renderTable(rows)}async function convert(){try{if(!file)return;setBar(55);if(mode==='forward'){const {jsPDF}=window.jspdf;const doc=new jsPDF({orientation:'landscape',unit:'pt',format:'a4'});doc.setFontSize(14);doc.text(file.name.replace(/\\.[^.]+$/,''),40,32);doc.autoTable({head:[rows[0]||[]],body:rows.slice(1),startY:48,theme:'grid',styles:{fontSize:8,cellPadding:4,overflow:'linebreak'},headStyles:{fillColor:[245,158,11],textColor:[10,10,10]},alternateRowStyles:{fillColor:[245,245,245]}});outBlob=doc.output('blob');outName=file.name.replace(/\\.[^.]+$/,'')+'.pdf'}else{const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(rows),'PDF Extract');const arr=XLSX.write(wb,{bookType:'xlsx',type:'array'});outBlob=new Blob([arr],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});outName=file.name.replace(/\\.[^.]+$/,'')+'.xlsx'}$('#output-size').textContent=fmt(outBlob.size);$('#download-btn').disabled=false;setBar(100);setNotice('Conversion ready. Download when you are satisfied with the preview.')}catch(e){setNotice(e.message||'Conversion failed.',true)}}$('#upload-zone').onclick=()=>input.click();$('#upload-zone').ondragover=e=>{e.preventDefault();$('#upload-zone').classList.add('dragover')};$('#upload-zone').ondragleave=()=>$('#upload-zone').classList.remove('dragover');$('#upload-zone').ondrop=e=>{e.preventDefault();$('#upload-zone').classList.remove('dragover');loadFile(e.dataTransfer.files[0])};input.onchange=()=>loadFile(input.files[0]);sheet.onchange=()=>loadSheet(sheet.value);document.querySelectorAll('.doc-tab').forEach(b=>b.onclick=()=>switchMode(b.dataset.mode));$('#convert-btn').onclick=convert;$('#download-btn').onclick=()=>download(outBlob,outName);$('#clear-btn').onclick=reset;switchMode('forward')})();`;
}

function pptJs() {
  return `'use strict';(()=>{${commonHelpers()}let mode='forward',file=null,slides=[],outBlob=null,outName='slides.pdf';const input=$('#file-input'),preview=$('#preview');function switchMode(m){mode=m;clear();document.querySelectorAll('.doc-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));input.accept=m==='forward'?'.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation':'.pdf,application/pdf';$('#upload-title').textContent=m==='forward'?'Drop PPTX file here':'Drop PDF file here';setNotice(m==='forward'?'PPTX preview uses slide XML text boxes for a browser-safe PDF render.':'PDF pages will become full-slide images in a PPTX deck.')}function clear(){file=null;slides=[];outBlob=null;input.value='';preview.innerHTML='<div class="notice">Slide thumbnails appear here.</div>';$('#rows').textContent='0';$('#cols').textContent='0';$('#input-size').textContent='0 B';$('#output-size').textContent='0 B';$('#convert-btn').disabled=true;$('#download-btn').disabled=true;$('#clear-btn').disabled=true;setBar(0)}async function loadFile(f){file=f;$('#input-size').textContent=fmt(f.size);$('#convert-btn').disabled=false;$('#clear-btn').disabled=false;try{mode==='forward'?await pptxPreview(f):await pdfPreview(f);setNotice('Preview ready. Convert when ready.')}catch(e){setNotice(e.message||'Could not read this file. It may be corrupted or password protected.',true)}}async function pptxPreview(f){if(!window.JSZip)throw Error('JSZip did not load.');const zip=await JSZip.loadAsync(await f.arrayBuffer());const names=Object.keys(zip.files).filter(n=>/^ppt\\/slides\\/slide\\d+\\.xml$/.test(n)).sort((a,b)=>Number(a.match(/slide(\\d+)/)[1])-Number(b.match(/slide(\\d+)/)[1]));slides=[];for(const n of names){const xml=await zip.files[n].async('text');const text=[...xml.matchAll(/<a:t>([\\s\\S]*?)<\\/a:t>/g)].map(m=>m[1].replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')).join('\\n');slides.push({text:text||'Blank slide'});}renderThumbs()}async function pdfPreview(f){pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise;slides=[];const q=Number($('#quality-select').value||1);for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i),vp=page.getViewport({scale:q});const c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;slides.push({img:c.toDataURL('image/png')});setBar(i/pdf.numPages*50)}renderThumbs()}function renderThumbs(){preview.innerHTML='<div class="thumb-grid">'+slides.map((s,i)=>'<div class="thumb"><span class="badge">Slide '+(i+1)+'</span>'+(s.img?'<img src="'+s.img+'" alt="Slide '+(i+1)+'">':'<div style="aspect-ratio:16/9;background:#fff;color:#111;padding:18px;border-radius:8px;white-space:pre-wrap;overflow:hidden">'+esc(s.text)+'</div>')+'</div>').join('')+'</div>';$('#rows').textContent=slides.length;$('#cols').textContent=slides.length}async function convert(){try{setBar(60);if(mode==='forward'){const {jsPDF}=window.jspdf;const doc=new jsPDF({orientation:'landscape',unit:'pt',format:[720,405]});for(let i=0;i<slides.length;i++){if(i)doc.addPage([720,405],'landscape');doc.setFillColor(255,255,255);doc.rect(0,0,720,405,'F');doc.setTextColor(20);doc.setFontSize(22);doc.text((slides[i].text||'Blank slide').split('\\n'),36,54,{maxWidth:648});setBar(60+i/slides.length*35)}outBlob=doc.output('blob');outName=file.name.replace(/\\.[^.]+$/,'')+'.pdf'}else{const pptx=new pptxgen();pptx.layout='LAYOUT_WIDE';slides.forEach(s=>{const slide=pptx.addSlide();slide.background={color:'FFFFFF'};slide.addImage({data:s.img,x:0,y:0,w:13.333,h:7.5});});outBlob=await pptx.write({outputType:'blob'});outName=file.name.replace(/\\.[^.]+$/,'')+'.pptx'}$('#output-size').textContent=fmt(outBlob.size);$('#download-btn').disabled=false;setBar(100);setNotice('Conversion ready. Download your file.')}catch(e){setNotice(e.message||'Conversion failed.',true)}}$('#upload-zone').onclick=()=>input.click();$('#upload-zone').ondragover=e=>{e.preventDefault();$('#upload-zone').classList.add('dragover')};$('#upload-zone').ondragleave=()=>$('#upload-zone').classList.remove('dragover');$('#upload-zone').ondrop=e=>{e.preventDefault();$('#upload-zone').classList.remove('dragover');loadFile(e.dataTransfer.files[0])};input.onchange=()=>loadFile(input.files[0]);document.querySelectorAll('.doc-tab').forEach(b=>b.onclick=()=>switchMode(b.dataset.mode));$('#quality-select').onchange=()=>file&&mode==='reverse'&&loadFile(file);$('#convert-btn').onclick=convert;$('#download-btn').onclick=()=>download(outBlob,outName);$('#clear-btn').onclick=clear;switchMode('forward')})();`;
}

function pdfaJs() {
  return `'use strict';(()=>{${commonHelpers()}let mode='to',file=null,outBlob=null,outName='archive.pdf';const input=$('#file-input');function clear(){file=null;outBlob=null;input.value='';$('#before-meta').textContent='No PDF loaded.';$('#after-meta').textContent='Convert to see changes.';$('#rows').textContent='-';$('#cols').textContent='0';$('#input-size').textContent='0 B';$('#output-size').textContent='0 B';$('#convert-btn').disabled=true;$('#download-btn').disabled=true;$('#clear-btn').disabled=true;setBar(0)}function switchMode(m){mode=m;clear();document.querySelectorAll('.doc-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===m));setNotice(m==='to'?'Adds archival metadata markers for a PDF/A-style browser output.':'Removes common PDF/A metadata markers for easier editing.')}async function loadFile(f){file=f;$('#input-size').textContent=fmt(f.size);$('#convert-btn').disabled=false;$('#clear-btn').disabled=false;try{pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await f.arrayBuffer())}).promise;const meta=await pdf.getMetadata().catch(()=>({info:{},metadata:null}));$('#rows').textContent=pdf._pdfInfo?.version||'PDF';$('#before-meta').textContent=JSON.stringify(meta.info||{},null,2);setNotice('PDF metadata loaded. Convert to rebuild the file.')}catch(e){setNotice('Could not read this PDF. It may be encrypted, corrupted, or password protected.',true)}}async function convert(){try{if(!window.PDFLib)throw Error('pdf-lib did not load.');setBar(35);const doc=await PDFLib.PDFDocument.load(await file.arrayBuffer(),{ignoreEncryption:false});const now=new Date();doc.setProducer('ToolsMatic browser PDF/A converter');doc.setCreator('ToolsMatic');doc.setModificationDate(now);doc.setCreationDate(now);let changes=[];if(mode==='to'){doc.setTitle(file.name.replace(/\\.[^.]+$/,''));doc.setSubject('PDF/A archival browser conversion');doc.setKeywords(['PDF/A','archival','ToolsMatic','browser']);changes=['Set archival title/subject/keywords','Set creator and producer','Rebuilt PDF with fresh catalog metadata','Marked output as archival-ready metadata package'];outName=file.name.replace(/\\.[^.]+$/,'')+'_pdfa.pdf'}else{doc.setSubject('Standard PDF rebuilt from PDF/A source');doc.setKeywords(['standard PDF','ToolsMatic']);changes=['Removed archival subject wording','Rebuilt standard PDF metadata','Prepared file for normal editing workflows'];outName=file.name.replace(/\\.[^.]+$/,'')+'_standard.pdf'}const bytes=await doc.save({useObjectStreams:false,addDefaultPage:false});outBlob=new Blob([bytes],{type:'application/pdf'});$('#after-meta').textContent=changes.join('\\n');$('#cols').textContent=changes.length;$('#output-size').textContent=fmt(outBlob.size);$('#download-btn').disabled=false;setBar(100);setNotice('Output ready. For legal PDF/A submission, verify with a formal PDF/A validator.')}catch(e){setNotice(e.message&&/encrypted/i.test(e.message)?'This PDF appears encrypted or password protected. Unlock it first.':(e.message||'Conversion failed.'),true)}}$('#upload-zone').onclick=()=>input.click();$('#upload-zone').ondragover=e=>{e.preventDefault();$('#upload-zone').classList.add('dragover')};$('#upload-zone').ondragleave=()=>$('#upload-zone').classList.remove('dragover');$('#upload-zone').ondrop=e=>{e.preventDefault();$('#upload-zone').classList.remove('dragover');loadFile(e.dataTransfer.files[0])};input.onchange=()=>loadFile(input.files[0]);document.querySelectorAll('.doc-tab').forEach(b=>b.onclick=()=>switchMode(b.dataset.mode));$('#convert-btn').onclick=convert;$('#download-btn').onclick=()=>download(outBlob,outName);$('#clear-btn').onclick=clear;switchMode('to')})();`;
}

function organizeJs() {
  return `'use strict';(()=>{${commonHelpers()}let pages=[],history=[],future=[],files=[],dragId=null;const input=$('#file-input'),grid=$('#page-grid');function snap(){history.push(JSON.stringify(pages.map(p=>({file:p.fileIndex,page:p.pageIndex,rot:p.rot,sel:p.sel,src:p.src}))));if(history.length>30)history.shift();future=[]}function restore(s){pages=JSON.parse(s).map(p=>({...p,file:files[p.file]}));render()}function stats(){const size=files.reduce((a,f)=>a+f.size,0);$('#rows').textContent=pages.length;$('#cols').textContent=pages.filter(p=>p.sel).length;$('#input-size').textContent=fmt(size);$('#output-size').textContent=fmt(Math.max(size*.98,0));$('#download-btn').disabled=!pages.length;$('#clear-btn').disabled=!pages.length}function render(){grid.innerHTML=pages.length?pages.map((p,i)=>'<div class="thumb '+(p.sel?'selected':'')+'" draggable="true" data-i="'+i+'"><span class="badge">'+(i+1)+'</span><img src="'+p.src+'" style="transform:rotate('+p.rot+'deg)" alt="Page '+(i+1)+'"><div class="thumb-actions"><button data-act="rotl">↶</button><button data-act="rotr">↷</button><button data-act="dup">＋</button><button data-act="del">×</button></div></div>').join(''):'<div class="notice">Page thumbnails appear here.</div>';stats()}async function loadFiles(list){files=[...list];pages=[];snap();pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';let total=0;for(let fi=0;fi<files.length;fi++){const pdf=await pdfjsLib.getDocument({data:new Uint8Array(await files[fi].arrayBuffer())}).promise;for(let pi=1;pi<=pdf.numPages;pi++){const page=await pdf.getPage(pi),vp=page.getViewport({scale:.28}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;pages.push({file:files[fi],fileIndex:fi,pageIndex:pi-1,rot:0,sel:false,src:c.toDataURL('image/jpeg',.75)});total++;setBar((total/(total+1))*70)}}render();setBar(100);setNotice('Pages rendered. Drag to reorder or use page actions.')}function action(i,act){snap();const p=pages[i];if(!p)return;if(act==='rotl')p.rot=(p.rot+270)%360;if(act==='rotr')p.rot=(p.rot+90)%360;if(act==='dup')pages.splice(i+1,0,{...p});if(act==='del')pages.splice(i,1);render()}grid.onclick=e=>{const t=e.target,card=t.closest('.thumb');if(!card)return;const i=Number(card.dataset.i);if(t.dataset.act){e.stopPropagation();action(i,t.dataset.act)}else{snap();pages[i].sel=!pages[i].sel;render()}};grid.ondragstart=e=>{const c=e.target.closest('.thumb');if(c)dragId=Number(c.dataset.i)};grid.ondragover=e=>e.preventDefault();grid.ondrop=e=>{e.preventDefault();const c=e.target.closest('.thumb');if(c&&dragId!==null){snap();const to=Number(c.dataset.i),item=pages.splice(dragId,1)[0];pages.splice(to,0,item);dragId=null;render()}};async function build(){try{snap();setBar(15);const out=await PDFLib.PDFDocument.create();for(let i=0;i<pages.length;i++){const p=pages[i];const src=await PDFLib.PDFDocument.load(await p.file.arrayBuffer());const [cp]=await out.copyPages(src,[p.pageIndex]);cp.setRotation(PDFLib.degrees(p.rot));out.addPage(cp);setBar(15+i/pages.length*75)}const bytes=await out.save();download(new Blob([bytes],{type:'application/pdf'}),(files[0]?.name||'organized.pdf').replace(/\\.[^.]+$/,'')+'_organized.pdf');setBar(100);setNotice('Organized PDF downloaded.')}catch(e){setNotice('Could not rebuild this PDF. It may be encrypted or corrupted.',true)}}$('#upload-zone').onclick=()=>input.click();$('#upload-zone').ondragover=e=>{e.preventDefault();$('#upload-zone').classList.add('dragover')};$('#upload-zone').ondragleave=()=>$('#upload-zone').classList.remove('dragover');$('#upload-zone').ondrop=e=>{e.preventDefault();$('#upload-zone').classList.remove('dragover');loadFiles(e.dataTransfer.files)};input.onchange=()=>loadFiles(input.files);$('#select-all').onclick=()=>{snap();pages.forEach(p=>p.sel=true);render()};$('#deselect-all').onclick=()=>{snap();pages.forEach(p=>p.sel=false);render()};$('#delete-selected').onclick=()=>{snap();pages=pages.filter(p=>!p.sel);render()};$('#rotate-selected').onclick=()=>{snap();pages.forEach(p=>{if(p.sel)p.rot=(p.rot+90)%360});render()};$('#undo').onclick=()=>{if(history.length){future.push(JSON.stringify(pages));restore(history.pop())}};$('#redo').onclick=()=>{if(future.length){history.push(JSON.stringify(pages));restore(future.pop())}};$('#download-btn').onclick=build;$('#clear-btn').onclick=()=>{pages=[];files=[];history=[];future=[];input.value='';setBar(0);render();setNotice('Cleared. Upload PDFs to start again.')};render()})();`;
}

function pseoPage(tool, variant) {
  const [suffix, label, intent] = variant;
  const slug = `${tool.slug}-${suffix}`;
  const url = `${SITE}/tools/${slug}.html`;
  const title = `${tool.cardTitle} ${label} | ToolsMatic`;
  const description = `${tool.cardTitle} ${label}: ${intent}. Use the main ToolsMatic tool with private browser processing, clear steps, and no sign-up.`;
  const faqs = [
    [`What is ${tool.cardTitle} ${label}?`, `${tool.cardTitle} ${label} is a focused landing page for people who need ${intent}.`],
    [`Does this page replace the main ${tool.cardTitle}?`, `No. It supports a specific search intent and links directly to the main ${tool.cardTitle} tool.`],
    [`Is it private?`, `The ToolsMatic workflow is designed around browser-based processing and reduced upload exposure.`],
    [`Who is it for?`, `It is useful for ${tool.audiences || 'students, professionals, and teams handling documents'}.`]
  ];
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', name: `${tool.cardTitle} ${label}`, url, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE}/#tools` }, { '@type': 'ListItem', position: 3, name: `${tool.cardTitle} ${label}`, item: url }] },
      { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
    ]
  };
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:image" content="${SITE}/assets/pdf/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${SITE}/assets/pdf/og-image.jpg"><link rel="stylesheet" href="/assets/pdf/global.css"><link rel="stylesheet" href="/assets/pdf/tool.css"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><script type="application/ld+json">${json(schemaData)}</script>${sharedCss()}</head><body>${header()}<main><nav class="breadcrumb doc-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span class="breadcrumb-sep">/</span><a href="/#tools">Tools</a><span class="breadcrumb-sep">/</span><span>${esc(tool.cardTitle)} ${esc(label)}</span></nav><section class="tool-hero doc-hero"><div class="tool-hero-badge">Focused document workflow</div><h1>${esc(tool.cardTitle)} ${esc(label)}</h1>${adBlock}<p class="tool-hero-sub">${esc(description)}</p><div class="toolbar"><a class="doc-btn primary" href="/tools/${tool.slug}.html">Open the main tool</a><a class="doc-btn" href="/#tools">Browse all tools</a></div></section><section class="seo-section"><article class="seo-card"><h2>${esc(tool.cardTitle)} for a ${esc(intent)}</h2><p>This focused page exists because people search for document tools in very specific ways. Someone looking for ${esc(tool.cardTitle)} ${esc(label)} does not want a random directory or a generic explanation. They want a tool that opens quickly, explains the exact workflow, and sends them to the correct conversion page without extra decisions.</p><p>The main <a href="/tools/${tool.slug}.html">${esc(tool.cardTitle)}</a> page handles the actual work. This page explains the use case behind it: ${esc(intent)}. That makes the search result more useful for people who already know their scenario, while keeping the actual tool page clean and focused.</p><h2>When to use this page</h2><p>Use it when your document task involves ${esc(tool.topic || tool.name)} and you want a direct path to a browser-based ToolsMatic workflow. It is especially helpful for ${esc(tool.audiences || 'students, professionals, and teams')} who need a fast result without downloading desktop software or creating an account.</p><h2>Step-by-step workflow</h2><ol><li>Open the main tool from the button above.</li><li>Choose the mode that matches your file direction or editing task.</li><li>Drop your file into the upload area and review the preview.</li><li>Convert, organize, or rebuild the document, then download the finished output.</li></ol><h2>Why ToolsMatic fits this search intent</h2><p>ToolsMatic tools are built around clarity, local-first processing, and simple controls. That matters for document tasks because files often contain private or business-critical information. A focused browser workflow reduces unnecessary upload exposure and removes the friction of installing software for a quick conversion.</p><h2>FAQs</h2><div class="faq-list">${faqs.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></article></section></main>${footer(tool)}<script src="/assets/pdf/global.js"></script><script src="/assets/pdf/tool-base.js"></script></body></html>`;
}

function updateIndex() {
  let html = fs.readFileSync(INDEX, 'utf8');
  const cards = [
    { href: 'tools/word-pdf-converter.html', title: 'Word ↔ PDF Converter', desc: 'Convert Word to PDF or PDF to Word privately in your browser.' },
    ...newTools.map((t) => ({ href: `tools/${t.slug}.html`, title: t.cardTitle, desc: t.cardDesc }))
  ];
  const insert = cards.filter((c) => !html.includes(`href="${c.href}"`)).map((c) => `        <a class="card" href="${c.href}">
          <h3>${esc(c.title)}</h3>
          <p>${esc(c.desc)}</p>
        </a>`).join('');
  if (insert) {
    html = html.replace('</div>\n</section>\n\n<section class="section home-about"', `${insert}</div>\n</section>\n\n<section class="section home-about"`);
  }
  const count = (html.match(/<a class="card" href="tools\//g) || []).length;
  html = html.replace(/<span class="home-tool-count" data-tool-count>\d+ tools ready<\/span>/g, `<span class="home-tool-count" data-tool-count>${count} tools ready</span>`);
  fs.writeFileSync(INDEX, html);
  return count;
}

function updateSiteJs(count) {
  const file = path.join(ROOT, 'assets', 'site.js');
  let js = fs.readFileSync(file, 'utf8');
  const catalogItems = [
    { url: '/tools/word-pdf-converter.html', title: 'Word PDF Converter', description: 'Convert Word to PDF or PDF to Word privately in your browser.', category: 'PDF' },
    ...newTools.map((t) => ({ url: `/tools/${t.slug}.html`, title: t.cardTitle, description: t.cardDesc, category: 'PDF' }))
  ];
  const insert = catalogItems.filter((item) => !js.includes(`url: '${item.url}'`)).map((item) => `    { url: '${item.url}', title: '${item.title}', description: '${item.description}', category: '${item.category}' },`).join('\n');
  if (insert) js = js.replace('  ];\n\n  const SEARCH_CATEGORY_KEYWORDS', `${insert}\n  ];\n\n  const SEARCH_CATEGORY_KEYWORDS`);
  js = js.replace(/const HOME_TOOL_COUNT = \d+;/, `const HOME_TOOL_COUNT = ${count};`);
  const aliasInsert = [
    `    'Word PDF Converter': 'word docx pdf converter pdf to word docx no upload',`,
    `    'Excel ↔ PDF Converter': 'excel xlsx xls pdf spreadsheet table pdf to excel sheetjs',`,
    `    'PowerPoint ↔ PDF Converter': 'powerpoint pptx pdf slides presentation pdf to pptx',`,
    `    'PDF ↔ PDF/A Converter': 'pdfa archival compliance metadata pdf to pdfa archive',`,
    `    'Organize PDF': 'organize reorder rearrange delete rotate duplicate pdf pages merge',`
  ].filter((line) => !js.includes(line.trim().split(':')[0].trim()));
  if (aliasInsert.length) js = js.replace('  };\n\n  const normalizeSearchText', `${aliasInsert.join('\n')}\n  };\n\n  const normalizeSearchText`);
  if (!js.includes('initRecentlyUsedTools')) {
    js = js.replace('  const initHomeToolFilters = () => {', `  const initRecentlyUsedTools = () => {
    const homeGrid = document.querySelector('.home-tool-grid');
    if (!homeGrid || document.querySelector('.recent-tools-section')) return;
    const getRecent = () => {
      try { return JSON.parse(localStorage.getItem('toolsmatic-recent-tools') || '[]'); } catch (_) { return []; }
    };
    const recent = getRecent().map((url) => TOOL_CATALOG.find((tool) => tool.url === url)).filter(Boolean).slice(0, 6);
    const section = document.createElement('section');
    section.className = 'section recent-tools-section';
    section.innerHTML = '<h2>Recently used tools</h2><p>Quickly reopen tools you used on this device.</p><div class="grid recent-tools-grid"></div>';
    const grid = section.querySelector('.recent-tools-grid');
    if (!recent.length) {
      section.hidden = true;
    } else {
      recent.forEach((tool) => {
        const a = document.createElement('a');
        a.className = 'card';
        a.href = tool.url;
        a.innerHTML = '<h3>' + tool.title + '</h3><p>' + tool.description + '</p>';
        grid.appendChild(a);
      });
    }
    const hero = document.querySelector('.home-hero');
    if (hero) hero.insertAdjacentElement('afterend', section);
    document.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a.card[href^="tools/"], a.card[href^="/tools/"]') : null;
      if (!link) return;
      try {
        const url = new URL(link.getAttribute('href'), window.location.origin).pathname;
        const recentUrls = getRecent();
        localStorage.setItem('toolsmatic-recent-tools', JSON.stringify([url, ...recentUrls.filter((item) => item !== url)].slice(0, 8)));
      } catch (_) {}
    });
  };

  const initHomeToolFilters = () => {`);
    js = js.replace('    initHomeToolFilters();', '    initRecentlyUsedTools();\n    initHomeToolFilters();');
  }
  fs.writeFileSync(file, js);
}

function updateSitemaps(urls) {
  const mainPath = path.join(ROOT, 'sitemap.xml');
  let main = fs.readFileSync(mainPath, 'utf8');
  const existing = new Set([...main.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const additions = urls.filter((url) => !existing.has(url)).map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${/-pdf-converter\.html$|organize-pdf\.html$|pdf-pdfa-converter\.html$/.test(url) ? '0.8' : '0.6'}</priority>\n  </url>`).join('\n');
  if (additions) main = main.replace('</urlset>', `${additions}\n</urlset>`);
  fs.writeFileSync(mainPath, main);
  const docMap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url>\n    <loc>${url}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${/-pdf-converter\.html$|organize-pdf\.html$|pdf-pdfa-converter\.html$/.test(url) ? '0.8' : '0.6'}</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap-document-converters.xml'), docMap);
  const robotsPath = path.join(ROOT, 'robots.txt');
  let robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes('sitemap-document-converters.xml')) {
    robots += `${robots.endsWith('\n') ? '' : '\n'}Sitemap: ${SITE}/sitemap-document-converters.xml\n`;
    fs.writeFileSync(robotsPath, robots);
  }
}

function main() {
  const urls = [];
  for (const tool of newTools) {
    fs.writeFileSync(path.join(TOOLS, `${tool.slug}.html`), basePage(tool));
    urls.push(`${SITE}/tools/${tool.slug}.html`);
  }
  for (const tool of pseoBase) {
    for (const variant of variants) {
      const slug = `${tool.slug}-${variant[0]}`;
      fs.writeFileSync(path.join(TOOLS, `${slug}.html`), pseoPage(tool, variant));
      urls.push(`${SITE}/tools/${slug}.html`);
    }
  }
  const count = updateIndex();
  updateSiteJs(count);
  updateSitemaps(urls);
  console.log(JSON.stringify({ baseTools: newTools.length, pseoPages: pseoBase.length * variants.length, toolCount: count, urls: urls.length }, null, 2));
}

main();
