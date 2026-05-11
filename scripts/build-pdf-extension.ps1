param(
  [string]$OutputRoot = "extensions\toolsmatic-pdf-toolkit"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$outRoot = Join-Path $repoRoot $OutputRoot
$sandboxTools = Join-Path $outRoot "sandbox\tools"
$vendorDir = Join-Path $outRoot "vendor"
$assetsPdfDir = Join-Path $outRoot "assets\pdf"
$iconsDir = Join-Path $outRoot "icons"
$distDir = Join-Path $repoRoot "dist"
$zipPath = Join-Path $distDir "toolsmatic-pdf-toolkit-extension.zip"

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path | Out-Null
  }
}

function Write-Utf8NoBom([string]$Path, [string]$Content) {
  $encoding = [System.Text.UTF8Encoding]::new($false)
  [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

function Download-IfMissing([string]$Url, [string]$Path) {
  if (Test-Path -LiteralPath $Path) { return }
  $localFallback = Join-Path $repoRoot ("extension\vendor\" + (Split-Path -Leaf $Path))
  if (Test-Path -LiteralPath $localFallback) {
    Copy-Item -LiteralPath $localFallback -Destination $Path -Force
    return
  }
  Write-Host "Downloading $Url"
  Invoke-WebRequest -UseBasicParsing -Uri $Url -OutFile $Path
}

$tools = @(
  @{ slug="merge-pdf"; title="Merge PDF"; category="Organize"; description="Combine PDFs in the browser without uploading files." },
  @{ slug="split-pdf"; title="Split PDF"; category="Organize"; description="Extract ranges or split large documents into smaller PDFs." },
  @{ slug="remove-pages"; title="Remove PDF Pages"; category="Organize"; description="Delete unwanted pages from a PDF locally." },
  @{ slug="extract-pages"; title="Extract PDF Pages"; category="Organize"; description="Save selected pages as a new PDF." },
  @{ slug="reorder-pages"; title="Reorder PDF Pages"; category="Organize"; description="Drag pages into the right order and export a clean file." },
  @{ slug="rotate-pdf"; title="Rotate PDF"; category="Organize"; description="Rotate pages clockwise or counterclockwise." },
  @{ slug="crop-pdf"; title="Crop PDF"; category="Edit"; description="Trim margins and crop PDF pages visually." },
  @{ slug="watermark-pdf"; title="Watermark PDF"; category="Edit"; description="Add text watermarks for drafts, reviews, or brand marks." },
  @{ slug="page-numbers-pdf"; title="Add Page Numbers"; category="Edit"; description="Number PDF pages with simple positioning controls." },
  @{ slug="flatten-pdf"; title="Flatten PDF"; category="Edit"; description="Flatten annotations and fields for safer sharing." },
  @{ slug="sign-pdf"; title="Sign PDF"; category="Edit"; description="Add signatures locally without sending documents to a server." },
  @{ slug="fill-pdf-form"; title="Fill PDF Form"; category="Edit"; description="Fill common PDF form fields and export a completed file." },
  @{ slug="redact-pdf"; title="Redact PDF"; category="Edit"; description="Cover sensitive content before sharing." },
  @{ slug="annotate-pdf"; title="Annotate PDF"; category="Edit"; description="Highlight, mark up, and review PDF pages." },
  @{ slug="compare-pdf"; title="Compare PDF"; category="Review"; description="Compare documents and inspect differences." },
  @{ slug="compress-pdf"; title="Compress PDF"; category="Optimize"; description="Reduce PDF file size for email and uploads." },
  @{ slug="repair-pdf"; title="Repair PDF"; category="Optimize"; description="Try to rebuild broken or damaged PDF files." },
  @{ slug="add-pdf-margins"; title="Add PDF Margins"; category="Optimize"; description="Add clean margins for printing, notes, and binding." },
  @{ slug="resize-pdf-pages"; title="Resize PDF Pages"; category="Optimize"; description="Resize pages for print formats and consistent layouts." },
  @{ slug="grayscale-pdf"; title="Grayscale PDF"; category="Optimize"; description="Convert color PDFs to grayscale for printing and smaller files." },
  @{ slug="remove-pdf-metadata"; title="Remove PDF Metadata"; category="Privacy"; description="Strip hidden metadata before sending a PDF." },
  @{ slug="edit-pdf-metadata"; title="Edit PDF Metadata"; category="Privacy"; description="Update title, author, subject, and keyword metadata." },
  @{ slug="protect-pdf"; title="Protect PDF"; category="Security"; description="Add password protection to PDF files." },
  @{ slug="unlock-pdf"; title="Unlock PDF"; category="Security"; description="Remove known-password restrictions from PDFs you own." },
  @{ slug="jpg-to-pdf"; title="JPG to PDF"; category="Convert"; description="Turn images into a clean PDF document." },
  @{ slug="pdf-to-jpg"; title="PDF to JPG"; category="Convert"; description="Export PDF pages as JPG images." },
  @{ slug="pdf-webp-converter"; title="PDF WebP Converter"; category="Convert"; description="Convert PDF pages and WebP assets for browser workflows." },
  @{ slug="txt-to-pdf"; title="Text to PDF"; category="Convert"; description="Convert plain text into a printable PDF." },
  @{ slug="html-to-pdf"; title="HTML to PDF"; category="Convert"; description="Render HTML snippets into downloadable PDFs." },
  @{ slug="pdf-to-base64"; title="PDF to Base64"; category="Developer"; description="Encode PDF files as Base64 for developers." },
  @{ slug="pdf-text-converter"; title="PDF Text Converter"; category="Developer"; description="Extract or convert PDF text for quick reuse." },
  @{ slug="pdf-reader"; title="PDF Reader"; category="Read"; description="Open and inspect PDFs inside the extension." },
  @{ slug="add-pdf-headers"; title="Add PDF Headers"; category="Edit"; description="Add headers to PDF pages for reports and documents." },
  @{ slug="extract-pdf-images"; title="Extract PDF Images"; category="Convert"; description="Pull embedded images from PDFs locally." }
)

Ensure-Dir $outRoot
Ensure-Dir $sandboxTools
Ensure-Dir $vendorDir
Ensure-Dir $assetsPdfDir
Ensure-Dir $iconsDir
Ensure-Dir $distDir

Copy-Item -LiteralPath (Join-Path $repoRoot "assets\pdf\*") -Destination $assetsPdfDir -Recurse -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "favicon.svg") -Destination (Join-Path $iconsDir "icon.svg") -Force

Download-IfMissing "https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js" (Join-Path $vendorDir "pdf-lib.min.js")
Download-IfMissing "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" (Join-Path $vendorDir "pdf.min.js")
Download-IfMissing "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js" (Join-Path $vendorDir "pdf.worker.min.js")
Download-IfMissing "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" (Join-Path $vendorDir "jszip.min.js")
Download-IfMissing "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" (Join-Path $vendorDir "jspdf.umd.min.js")
Download-IfMissing "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" (Join-Path $vendorDir "html2canvas.min.js")
Download-IfMissing "https://unpkg.com/pdf-lib-plus-encrypt/dist/pdf-lib-plus-encrypt.min.js" (Join-Path $vendorDir "pdf-lib-plus-encrypt.min.js")

$toolDataJson = ($tools | ConvertTo-Json -Depth 5)
$toolDataJs = @"
window.TOOLSMATIC_PDF_TOOLS = $toolDataJson;
"@
Write-Utf8NoBom (Join-Path $outRoot "tools-data.js") $toolDataJs

$sandboxPages = @()
foreach ($tool in $tools) {
  $source = Join-Path $repoRoot ("tools\" + $tool.slug + ".html")
  if (-not (Test-Path -LiteralPath $source)) {
    Write-Warning "Missing source page: $source"
    continue
  }

  $html = Get-Content -Raw -LiteralPath $source
  $html = [regex]::Replace($html, '(?is)\s*<!-- Google tag \(gtag\.js\) -->\s*<script[^>]*googletagmanager[^>]*></script>\s*<script>.*?</script>\s*', '')
  $html = [regex]::Replace($html, '(?im)^\s*<link[^>]+fonts\.googleapis\.com[^>]*>\s*$', '')
  $html = [regex]::Replace($html, '(?im)^\s*<link[^>]+fonts\.gstatic\.com[^>]*>\s*$', '')
  $html = [regex]::Replace($html, '(?im)^\s*<link[^>]+rel=["'']manifest["''][^>]*>\s*$', '')
  $html = [regex]::Replace($html, '(?is)\s*<section[^>]*>\s*<iframe[^>]+fixesconsessionconsession\.com/e61a3745429623f25315f86052a3ab7b/invoke\.js[^>]*></iframe>\s*</section>\s*', '')
  $html = [regex]::Replace($html, '(?is)\s*<iframe[^>]+fixesconsessionconsession\.com/e61a3745429623f25315f86052a3ab7b/invoke\.js[^>]*></iframe>\s*', '')
  $html = $html.Replace("https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js", "/vendor/pdf-lib.min.js")
  $html = $html.Replace("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js", "/vendor/pdf.min.js")
  $html = $html.Replace("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js", "/vendor/jszip.min.js")
  $html = $html.Replace("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "/vendor/jspdf.umd.min.js")
  $html = $html.Replace("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", "/vendor/html2canvas.min.js")
  $html = $html.Replace("https://unpkg.com/pdf-lib-plus-encrypt/dist/pdf-lib-plus-encrypt.min.js", "/vendor/pdf-lib-plus-encrypt.min.js")
  $html = $html.Replace("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js", "/vendor/pdf.worker.min.js")
  $html = [regex]::Replace($html, "pdfjsLib\.GlobalWorkerOptions\.workerSrc\s*=\s*'https://cdnjs\.cloudflare\.com/ajax/libs/pdf\.js/'\s*\+\s*'3\.11\.174/pdf\.worker\.min\.js';", "pdfjsLib.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.js';")
  $html = [regex]::Replace($html, '(?i)</head>', "  <link rel=`"stylesheet`" href=`"/extension-overrides.css`">`r`n</head>", 1)

  $target = Join-Path $sandboxTools ($tool.slug + ".html")
  Write-Utf8NoBom $target $html
  $sandboxPages += ("sandbox/tools/" + $tool.slug + ".html")
}

$manifest = [ordered]@{
  manifest_version = 3
  name = "ToolsMatic PDF Toolkit"
  short_name = "ToolsMatic PDF"
  version = "1.0.0"
  description = "Private browser PDF tools for merging, splitting, compressing, signing, converting, editing, securing, and optimizing PDF files locally."
  minimum_chrome_version = "114"
  offline_enabled = $true
  homepage_url = "https://toolsmatic.me/tools/compress-pdf.html"
  permissions = @("storage")
  host_permissions = @()
  action = [ordered]@{
    default_title = "ToolsMatic PDF Toolkit"
    default_popup = "popup.html"
    default_icon = [ordered]@{
      "16" = "icons/icon.svg"
      "48" = "icons/icon.svg"
      "128" = "icons/icon.svg"
    }
  }
  icons = [ordered]@{
    "16" = "icons/icon.svg"
    "48" = "icons/icon.svg"
    "128" = "icons/icon.svg"
  }
  options_page = "app.html"
  sandbox = [ordered]@{
    pages = $sandboxPages
  }
  content_security_policy = [ordered]@{
    extension_pages = "script-src 'self'; object-src 'self'; img-src 'self' data:; style-src 'self';"
    sandbox = "sandbox allow-scripts allow-forms allow-downloads allow-popups; script-src 'self' 'unsafe-inline' blob:; worker-src 'self' blob:; child-src 'self' blob:; connect-src 'self' blob:; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; media-src 'self' blob: data:;"
  }
}
Write-Utf8NoBom (Join-Path $outRoot "manifest.json") ($manifest | ConvertTo-Json -Depth 8)

$extensionOverridesCss = @"
:root { color-scheme: dark; }
html { background: #08131f; }
body { min-width: 0 !important; overflow-x: hidden !important; }
.site-header,
.topbar,
.footer,
.site-footer,
.tool-related,
.related-tools,
.seo-related,
.page-footer,
footer { display: none !important; }
main, .page-shell, .tool-page, .tool-wrap, .container {
  max-width: 100% !important;
  width: 100% !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.tool-hero, .hero, .pdf-hero { margin-top: 0 !important; }
a[href^="/"], a[href^="https://toolsmatic.me"] { cursor: pointer; }
"@
Write-Utf8NoBom (Join-Path $outRoot "extension-overrides.css") $extensionOverridesCss

$appHtml = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ToolsMatic PDF Toolkit</title>
  <link rel="stylesheet" href="app.css">
</head>
<body>
  <header class="app-header">
    <a class="brand" href="app.html" aria-label="ToolsMatic PDF Toolkit home">
      <span class="brand-dot"></span>
      <span>ToolsMatic PDF</span>
    </a>
    <div class="header-actions">
      <button class="ghost-btn" id="openCurrent" type="button">Open tool tab</button>
      <button class="ghost-btn" id="reloadTool" type="button">Reload</button>
      <button class="theme-btn" id="themeToggle" type="button" aria-label="Toggle theme">☾</button>
    </div>
  </header>

  <section class="sponsor-strip" aria-label="Featured banner">
    <a id="sponsorLink" href="https://toolsmatic.me/tools/compress-pdf.html" target="_blank" rel="noopener noreferrer">
      <span class="sponsor-kicker">Featured</span>
      <strong>Need more tools?</strong>
      <span>Open the full ToolsMatic web toolkit for text, image, code, color, SEO, and PDF utilities.</span>
    </a>
  </section>

  <main class="app-layout">
    <aside class="sidebar" aria-label="PDF tools">
      <div class="search-box">
        <label for="toolSearch">Search PDF tools</label>
        <input id="toolSearch" type="search" placeholder="Merge, compress, sign, convert...">
      </div>
      <div class="quick-row" id="categoryTabs" aria-label="Tool categories"></div>
      <nav class="tool-list" id="toolList" aria-label="PDF tool list"></nav>
    </aside>

    <section class="workspace" aria-live="polite">
      <div class="workspace-top">
        <div>
          <p class="eyebrow" id="toolCategory">PDF Toolkit</p>
          <h1 id="toolTitle">Loading tool</h1>
          <p id="toolDescription">Private PDF tools that run locally in your browser.</p>
        </div>
        <button class="primary-btn" id="favoriteTool" type="button">Save favorite</button>
      </div>
      <iframe id="toolFrame" title="PDF tool workspace" sandbox="allow-scripts allow-forms allow-downloads allow-popups"></iframe>
    </section>
  </main>

  <script src="tools-data.js"></script>
  <script src="app.js"></script>
</body>
</html>
"@
Write-Utf8NoBom (Join-Path $outRoot "app.html") $appHtml

$appCss = @"
:root {
  --bg: #07111d;
  --panel: #0c1a2a;
  --panel-2: #102337;
  --text: #eff7ff;
  --muted: #9fb1c4;
  --line: rgba(133, 226, 255, .18);
  --accent: #61dcf2;
  --accent-2: #6ea8ff;
  --shadow: 0 24px 80px rgba(0, 0, 0, .35);
}
[data-theme="light"] {
  --bg: #f4f8fb;
  --panel: #ffffff;
  --panel-2: #edf5fb;
  --text: #102033;
  --muted: #516274;
  --line: rgba(22, 48, 74, .14);
  --accent: #0891b2;
  --accent-2: #2563eb;
  --shadow: 0 22px 60px rgba(32, 54, 76, .14);
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-width: 340px;
  min-height: 100vh;
  color: var(--text);
  background:
    radial-gradient(circle at 12% 18%, rgba(97, 220, 242, .20), transparent 28rem),
    radial-gradient(circle at 88% 0%, rgba(110, 168, 255, .18), transparent 24rem),
    linear-gradient(135deg, var(--bg), #0c1726 54%, var(--bg));
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
button, input { font: inherit; }
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px clamp(16px, 3vw, 34px);
  border-bottom: 1px solid var(--line);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(18px);
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--text);
  text-decoration: none;
  font-weight: 900;
  letter-spacing: .16em;
  text-transform: uppercase;
}
.brand-dot {
  width: 13px;
  height: 13px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  box-shadow: 0 0 22px var(--accent);
}
.header-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.ghost-btn, .theme-btn, .primary-btn {
  border: 1px solid var(--line);
  color: var(--text);
  background: color-mix(in srgb, var(--panel) 82%, transparent);
  border-radius: 999px;
  padding: 11px 15px;
  cursor: pointer;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
}
.theme-btn { width: 44px; height: 44px; padding: 0; }
.primary-btn {
  border: 0;
  color: #06111c;
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}
button:hover { transform: translateY(-1px); border-color: color-mix(in srgb, var(--accent) 55%, var(--line)); }
.sponsor-strip {
  width: min(1180px, calc(100vw - 28px));
  margin: 16px auto 0;
}
.sponsor-strip a {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 58px;
  padding: 12px 18px;
  border: 1px solid var(--line);
  border-radius: 20px;
  color: var(--text);
  text-decoration: none;
  background:
    linear-gradient(90deg, rgba(97, 220, 242, .13), rgba(110, 168, 255, .06)),
    color-mix(in srgb, var(--panel) 88%, transparent);
  box-shadow: var(--shadow);
}
.sponsor-kicker {
  color: #06111c;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .12em;
}
.app-layout {
  display: grid;
  grid-template-columns: minmax(290px, 360px) minmax(0, 1fr);
  gap: 18px;
  width: min(1500px, calc(100vw - 28px));
  margin: 18px auto;
}
.sidebar, .workspace {
  border: 1px solid var(--line);
  border-radius: 28px;
  background: color-mix(in srgb, var(--panel) 90%, transparent);
  box-shadow: var(--shadow);
}
.sidebar {
  position: sticky;
  top: 90px;
  align-self: start;
  padding: 18px;
  max-height: calc(100vh - 112px);
  overflow: auto;
}
.search-box label {
  display: block;
  margin: 0 0 8px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .08em;
}
.search-box input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 14px 15px;
  color: var(--text);
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  outline: none;
}
.quick-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 14px 0;
}
.chip {
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--muted);
  background: transparent;
  padding: 8px 11px;
  cursor: pointer;
}
.chip.active {
  color: #06111c;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  border-color: transparent;
  font-weight: 900;
}
.tool-list { display: grid; gap: 9px; }
.tool-link {
  display: grid;
  gap: 4px;
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 13px 14px;
  color: var(--text);
  text-align: left;
  background: color-mix(in srgb, var(--bg) 56%, transparent);
  cursor: pointer;
}
.tool-link strong { font-size: 15px; }
.tool-link span { color: var(--muted); font-size: 12px; }
.tool-link.active {
  border-color: color-mix(in srgb, var(--accent) 70%, transparent);
  background: linear-gradient(135deg, rgba(97, 220, 242, .16), rgba(110, 168, 255, .09));
}
.workspace {
  min-width: 0;
  overflow: hidden;
}
.workspace-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 20px;
  border-bottom: 1px solid var(--line);
}
.eyebrow {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .16em;
}
h1 { margin: 0; font-size: clamp(28px, 4vw, 46px); letter-spacing: -.04em; }
#toolDescription { margin: 8px 0 0; max-width: 780px; color: var(--muted); font-size: 16px; line-height: 1.5; }
#toolFrame {
  display: block;
  width: 100%;
  height: calc(100vh - 245px);
  min-height: 760px;
  border: 0;
  background: #08131f;
}
@media (max-width: 900px) {
  .app-header { position: static; align-items: flex-start; flex-direction: column; }
  .app-layout { grid-template-columns: 1fr; }
  .sidebar { position: static; max-height: none; }
  .workspace-top { flex-direction: column; }
  #toolFrame { height: 80vh; min-height: 680px; }
  .sponsor-strip a { align-items: flex-start; flex-direction: column; }
}
@media (max-width: 560px) {
  .header-actions { width: 100%; }
  .ghost-btn, .primary-btn { flex: 1; }
  .brand { letter-spacing: .12em; }
}
"@
Write-Utf8NoBom (Join-Path $outRoot "app.css") $appCss

$appJs = @"
(function () {
  const tools = window.TOOLSMATIC_PDF_TOOLS || [];
  const els = {
    search: document.getElementById('toolSearch'),
    categories: document.getElementById('categoryTabs'),
    list: document.getElementById('toolList'),
    frame: document.getElementById('toolFrame'),
    title: document.getElementById('toolTitle'),
    category: document.getElementById('toolCategory'),
    description: document.getElementById('toolDescription'),
    favorite: document.getElementById('favoriteTool'),
    openCurrent: document.getElementById('openCurrent'),
    reload: document.getElementById('reloadTool'),
    theme: document.getElementById('themeToggle')
  };

  let activeCategory = 'All';
  let activeTool = tools[0];
  const storage = {
    async get(key, fallback) {
      if (globalThis.chrome && chrome.storage && chrome.storage.local) {
        return new Promise(resolve => chrome.storage.local.get(key, result => resolve(result[key] ?? fallback)));
      }
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    async set(key, value) {
      if (globalThis.chrome && chrome.storage && chrome.storage.local) {
        return new Promise(resolve => chrome.storage.local.set({ [key]: value }, resolve));
      }
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  function slugFromHash() {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    return params.get('tool');
  }

  function toolUrl(slug) {
    return `sandbox/tools/${slug}.html`;
  }

  function categories() {
    return ['All', ...Array.from(new Set(tools.map(tool => tool.category))).sort()];
  }

  function filteredTools() {
    const query = els.search.value.trim().toLowerCase();
    return tools.filter(tool => {
      const categoryMatch = activeCategory === 'All' || tool.category === activeCategory;
      const textMatch = !query || `${tool.title} ${tool.description} ${tool.category}`.toLowerCase().includes(query);
      return categoryMatch && textMatch;
    });
  }

  function renderCategories() {
    els.categories.innerHTML = '';
    categories().forEach(category => {
      const button = document.createElement('button');
      button.className = `chip${category === activeCategory ? ' active' : ''}`;
      button.type = 'button';
      button.textContent = category;
      button.addEventListener('click', () => {
        activeCategory = category;
        render();
      });
      els.categories.append(button);
    });
  }

  function renderList() {
    els.list.innerHTML = '';
    filteredTools().forEach(tool => {
      const button = document.createElement('button');
      button.className = `tool-link${activeTool && tool.slug === activeTool.slug ? ' active' : ''}`;
      button.type = 'button';
      button.innerHTML = `<strong>${tool.title}</strong><span>${tool.category} • ${tool.description}</span>`;
      button.addEventListener('click', () => loadTool(tool.slug));
      els.list.append(button);
    });
  }

  async function updateFavoriteLabel() {
    const favorites = await storage.get('favorites', []);
    const saved = activeTool && favorites.includes(activeTool.slug);
    els.favorite.textContent = saved ? 'Saved favorite' : 'Save favorite';
  }

  async function loadTool(slug) {
    activeTool = tools.find(tool => tool.slug === slug) || tools[0];
    if (!activeTool) return;
    location.hash = `tool=${activeTool.slug}`;
    els.title.textContent = activeTool.title;
    els.category.textContent = activeTool.category;
    els.description.textContent = activeTool.description;
    els.frame.src = toolUrl(activeTool.slug);
    const recent = await storage.get('recent', []);
    const nextRecent = [activeTool.slug, ...recent.filter(item => item !== activeTool.slug)].slice(0, 8);
    await storage.set('recent', nextRecent);
    await updateFavoriteLabel();
    renderList();
  }

  async function toggleFavorite() {
    if (!activeTool) return;
    const favorites = await storage.get('favorites', []);
    const next = favorites.includes(activeTool.slug)
      ? favorites.filter(slug => slug !== activeTool.slug)
      : [activeTool.slug, ...favorites].slice(0, 12);
    await storage.set('favorites', next);
    await updateFavoriteLabel();
  }

  function render() {
    renderCategories();
    renderList();
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    els.theme.textContent = theme === 'light' ? '☀' : '☾';
    storage.set('theme', theme);
  }

  els.search.addEventListener('input', renderList);
  els.favorite.addEventListener('click', toggleFavorite);
  els.openCurrent.addEventListener('click', () => {
    if (!activeTool) return;
    window.open(toolUrl(activeTool.slug), '_blank', 'noopener');
  });
  els.reload.addEventListener('click', () => {
    if (els.frame.src) els.frame.src = els.frame.src;
  });
  els.theme.addEventListener('click', async () => {
    const current = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(current);
  });
  window.addEventListener('hashchange', () => loadTool(slugFromHash()));

  (async function boot() {
    setTheme(await storage.get('theme', 'dark'));
    render();
    loadTool(slugFromHash() || 'compress-pdf');
  })();
})();
"@
Write-Utf8NoBom (Join-Path $outRoot "app.js") $appJs

$popupHtml = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ToolsMatic PDF Toolkit</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <header>
    <span class="dot"></span>
    <strong>ToolsMatic PDF</strong>
  </header>
  <input id="search" type="search" placeholder="Find a PDF tool">
  <div id="tools"></div>
  <button id="openApp" type="button">Open full toolkit</button>
  <script src="tools-data.js"></script>
  <script src="popup.js"></script>
</body>
</html>
"@
Write-Utf8NoBom (Join-Path $outRoot "popup.html") $popupHtml

$popupCss = @"
:root { color-scheme: dark; }
* { box-sizing: border-box; }
body {
  width: 360px;
  margin: 0;
  padding: 14px;
  color: #eff7ff;
  background: radial-gradient(circle at top left, rgba(97,220,242,.24), transparent 16rem), #08131f;
  font: 14px/1.45 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; letter-spacing: .12em; text-transform: uppercase; }
.dot { width: 11px; height: 11px; border-radius: 50%; background: linear-gradient(135deg, #61dcf2, #6ea8ff); box-shadow: 0 0 18px #61dcf2; }
input {
  width: 100%;
  border: 1px solid rgba(133,226,255,.2);
  border-radius: 16px;
  padding: 12px;
  color: #eff7ff;
  background: #07111d;
  outline: none;
}
#tools { display: grid; gap: 8px; max-height: 420px; overflow: auto; margin: 12px 0; }
.tool {
  border: 1px solid rgba(133,226,255,.16);
  border-radius: 14px;
  padding: 11px;
  color: #eff7ff;
  background: #0c1a2a;
  text-align: left;
  cursor: pointer;
}
.tool span { display: block; color: #9fb1c4; font-size: 12px; margin-top: 2px; }
#openApp {
  width: 100%;
  border: 0;
  border-radius: 16px;
  padding: 12px;
  color: #06111c;
  font-weight: 900;
  background: linear-gradient(135deg, #61dcf2, #6ea8ff);
  cursor: pointer;
}
"@
Write-Utf8NoBom (Join-Path $outRoot "popup.css") $popupCss

$popupJs = @"
(function () {
  const tools = window.TOOLSMATIC_PDF_TOOLS || [];
  const list = document.getElementById('tools');
  const search = document.getElementById('search');
  const openApp = document.getElementById('openApp');

  function openTool(slug) {
    const url = chrome.runtime.getURL(`app.html#tool=${slug}`);
    chrome.tabs.create({ url });
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    list.innerHTML = '';
    tools
      .filter(tool => !query || `${tool.title} ${tool.category} ${tool.description}`.toLowerCase().includes(query))
      .slice(0, 16)
      .forEach(tool => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tool';
        button.innerHTML = `<strong>${tool.title}</strong><span>${tool.category}</span>`;
        button.addEventListener('click', () => openTool(tool.slug));
        list.append(button);
      });
  }

  search.addEventListener('input', render);
  openApp.addEventListener('click', () => chrome.tabs.create({ url: chrome.runtime.getURL('app.html') }));
  render();
})();
"@
Write-Utf8NoBom (Join-Path $outRoot "popup.js") $popupJs

$privacyHtml = @"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Privacy Policy - ToolsMatic PDF Toolkit</title>
  <link rel="stylesheet" href="app.css">
</head>
<body>
  <main class="workspace" style="width:min(900px,calc(100vw - 28px));margin:24px auto;padding:28px;">
    <p class="eyebrow">Privacy</p>
    <h1>ToolsMatic PDF Toolkit Privacy Policy</h1>
    <p>The extension processes PDF files locally in your browser. Files are not uploaded to ToolsMatic servers by the extension.</p>
    <p>The extension uses Chrome storage only for preferences such as theme, favorites, and recent tools. It does not collect analytics, browsing history, document content, or personal files.</p>
    <p>External links in the banner or help sections open normal web pages in a browser tab. Those pages are governed by their own privacy policies.</p>
  </main>
</body>
</html>
"@
Write-Utf8NoBom (Join-Path $outRoot "privacy.html") $privacyHtml

$readme = @"
# ToolsMatic PDF Toolkit Extension

Production MV3 extension package for Chrome and Microsoft Edge.

## What it includes

- 34 packaged PDF tools copied from the ToolsMatic website.
- Sandboxed PDF tool pages so existing inline tool scripts can run safely.
- Local vendor libraries for PDF.js, pdf-lib, JSZip, jsPDF, html2canvas, and pdf-lib-plus-encrypt.
- A clean searchable launcher with categories, favorites, recent tools, theme toggle, and a single banner placement.
- No remote executable JavaScript inside extension pages.

## Monetization note

Chrome MV3 extensions should not execute remotely hosted ad JavaScript. This package uses a static featured banner slot in the extension shell. Use direct sponsorship, affiliate links, or an extension-compliant ad provider that does not inject remote executable code. Do not paste normal website ad network scripts into extension pages unless the provider explicitly supports Chrome extensions and Chrome Web Store policy.

## Load in Chrome

1. Open `chrome://extensions`.
2. Turn on Developer mode.
3. Click Load unpacked.
4. Select `extensions/toolsmatic-pdf-toolkit`.

## Load in Edge

1. Open `edge://extensions`.
2. Turn on Developer mode.
3. Click Load unpacked.
4. Select `extensions/toolsmatic-pdf-toolkit`.

## Store upload

Upload `dist/toolsmatic-pdf-toolkit-extension.zip` to the Chrome Web Store or Microsoft Edge Add-ons dashboard.

## Rebuild

Run:

```powershell
.\scripts\build-pdf-extension.ps1
```

The build script refreshes the extension pages from the website PDF tools and keeps vendor libraries local.
"@
Write-Utf8NoBom (Join-Path $outRoot "README.md") $readme

$storeListing = @"
# Store Listing Draft

## Name
ToolsMatic PDF Toolkit

## Short Description
Private PDF tools for merging, splitting, compressing, converting, signing, securing, and editing PDFs locally in your browser.

## Long Description
ToolsMatic PDF Toolkit brings a full set of practical PDF utilities into Chrome and Edge. Merge documents, split pages, compress files, convert images, add signatures, edit metadata, protect PDFs, remove metadata, crop pages, rotate pages, extract images, and more without opening a heavy desktop editor.

Most tools run directly in your browser using local JavaScript libraries. Your selected files stay on your device while you work, making the extension useful for students, office workers, freelancers, teachers, developers, and anyone who needs fast PDF tasks without account friction.

The interface is built for speed: search tools instantly, open common PDF actions in one click, save favorites, and keep a recent tools list. The extension works offline after installation for the included client-side features.

## Privacy Practices
The extension does not collect, sell, or transfer user files. PDF processing happens locally. Chrome storage is used only for extension preferences such as theme, favorites, and recent tools.

## Permissions Explanation
Storage permission is used to remember favorites, recent tools, and theme preference.
"@
Write-Utf8NoBom (Join-Path $outRoot "STORE_LISTING.md") $storeListing

if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}
Compress-Archive -Path (Join-Path $outRoot "*") -DestinationPath $zipPath -Force

Write-Host "Built extension: $outRoot"
Write-Host "Packaged zip: $zipPath"
Write-Host "Sandbox tools: $($sandboxPages.Count)"
