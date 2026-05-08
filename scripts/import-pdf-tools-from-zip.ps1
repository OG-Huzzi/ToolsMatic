param(
  [string]$SourceZip = 'C:\Users\DELL\Documents\New project.zip'
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $PSScriptRoot
$Site = 'https://toolsmatic.me'
$Today = '2026-05-08'
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

Add-Type -AssemblyName System.IO.Compression.FileSystem

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) {
    New-Item -ItemType Directory -Path $Path -Force | Out-Null
  }
}

function Read-ZipText($zip, [string]$entryName) {
  $entry = $zip.GetEntry($entryName)
  if (-not $entry) { throw "Missing zip entry: $entryName" }
  $reader = New-Object System.IO.StreamReader($entry.Open())
  try { return $reader.ReadToEnd() } finally { $reader.Close() }
}

function Write-ZipBinary($zip, [string]$entryName, [string]$targetPath) {
  $entry = $zip.GetEntry($entryName)
  if (-not $entry) { throw "Missing zip entry: $entryName" }
  Ensure-Dir (Split-Path -Parent $targetPath)
  $inputStream = $entry.Open()
  $outputStream = [System.IO.File]::Create($targetPath)
  try { $inputStream.CopyTo($outputStream) } finally { $outputStream.Close(); $inputStream.Close() }
}

function Set-Or-Insert-HeadTag([string]$Html, [string]$Pattern, [string]$Replacement) {
  if ([regex]::IsMatch($Html, $Pattern, 'IgnoreCase')) {
    return [regex]::Replace($Html, $Pattern, $Replacement, 'IgnoreCase')
  }
  return $Html -replace '</head>', ("  $Replacement`n</head>")
}

function Remove-FakeRatingSchema([string]$Html) {
  $out = $Html
  $out = [regex]::Replace($out, ',\s*"aggregateRating"\s*:\s*\{[^{}]*\}', '', 'IgnoreCase')
  $out = [regex]::Replace($out, ',\s*"review"\s*:\s*\[[\s\S]*?\]\s*(?=,\s*"|\s*\})', '', 'IgnoreCase')
  $out = [regex]::Replace($out, ',\s*"ratingValue"\s*:\s*"[^"]*"', '', 'IgnoreCase')
  $out = [regex]::Replace($out, ',\s*"ratingCount"\s*:\s*"[^"]*"', '', 'IgnoreCase')
  return $out
}

function Add-HtmlExtensions([string]$Html) {
  $out = $Html
  foreach ($dir in @('tools', 'alternatives', 'hubs', 'glossary')) {
    $out = [regex]::Replace($out, "https://toolsmatic\.me/$dir/([a-z0-9-]+)(?=([`"'<#?,\s]))", "https://toolsmatic.me/$dir/`$1.html", 'IgnoreCase')
    $out = [regex]::Replace($out, "(?<=[`"'])/$dir/([a-z0-9-]+)(?=([`"'#?]))", "/$dir/`$1.html", 'IgnoreCase')
  }
  return $out
}

function Add-AdAfterFirstH1([string]$Html) {
  if ($Html -match 'e61a3745429623f25315f86052a3ab7b') { return $Html }
  $ad = @'
    <section class="ad-slot ad-slot-primary pdf-ad-slot" aria-label="Advertisement">
      <script>
        atOptions = {
          'key' : 'e61a3745429623f25315f86052a3ab7b',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      </script>
      <script src="https://fixesconsessionconsession.com/e61a3745429623f25315f86052a3ab7b/invoke.js"></script>
    </section>
'@
  return [regex]::Replace($Html, '</h1>', "</h1>`n$ad", 'IgnoreCase', [timespan]::FromSeconds(1))
}

function Transform-Html([string]$Html, [string]$OutputRelative) {
  $relNoSlash = $OutputRelative -replace '\\', '/'
  $url = "$Site/$relNoSlash"
  $out = $Html

  $out = $out -replace 'HuzziPDF', 'ToolsMatic'
  $out = $out -replace 'huzzipdf\.com', 'toolsmatic.me'
  $out = $out -replace 'Huzzi<span[^>]*>PDF</span>', 'ToolsMatic'
  $out = [regex]::Replace($out, '<span class="header-logo-text">[\s\S]*?</span>\s*</a>', '<span class="header-logo-text">ToolsMatic</span></a>', 'IgnoreCase')
  $out = $out -replace 'aria-label="ToolsMatic Home"', 'aria-label="ToolsMatic Home"'

  $out = $out -replace '/assets/css/global\.css', '/assets/pdf/global.css'
  $out = $out -replace '/assets/css/tool\.css', '/assets/pdf/tool.css'
  $out = $out -replace '/assets/js/global\.js', '/assets/pdf/global.js'
  $out = $out -replace '/assets/js/tool-base\.js', '/assets/pdf/tool-base.js'
  $out = $out -replace '/assets/images/og-image\.jpg', '/assets/pdf/og-image.jpg'
  $out = $out -replace '/site\.webmanifest', '/manifest.webmanifest'
  $out = $out -replace '/pages/about\.html', '/about.html'
  $out = $out -replace '/pages/contact\.html', '/contact.html'
  $out = $out -replace '/pages/privacy-policy\.html', '/privacy.html'
  $out = $out -replace '/pages/terms-of-service\.html', '/terms.html'

  $out = [regex]::Replace($out, '<link\s+rel="alternate"[^>]*>\s*', '', 'IgnoreCase')
  $out = Add-HtmlExtensions $out
  $out = Set-Or-Insert-HeadTag $out '<link\s+rel="canonical"\s+href="[^"]*"\s*/?>' "<link rel=`"canonical`" href=`"$url`">"
  $out = Set-Or-Insert-HeadTag $out '<meta\s+property="og:url"\s+content="[^"]*"\s*/?>' "<meta property=`"og:url`" content=`"$url`">"
  $out = Set-Or-Insert-HeadTag $out '<meta\s+name="twitter:url"\s+content="[^"]*"\s*/?>' "<meta name=`"twitter:url`" content=`"$url`">"
  $out = $out -replace '"url"\s*:\s*"https://toolsmatic\.me/[^"]+"', ('"url": "' + $url + '"')
  $out = $out -replace '"item"\s*:\s*"https://toolsmatic\.me/tools"', '"item": "https://toolsmatic.me/#tools"'
  $out = $out -replace '"item"\s*:\s*"https://toolsmatic\.me/#tools\.html"', '"item": "https://toolsmatic.me/#tools"'
  $out = Remove-FakeRatingSchema $out
  $out = Add-AdAfterFirstH1 $out
  return $out
}

function Add-SitemapUrls([string[]]$Urls) {
  [xml]$xml = Get-Content (Join-Path $Root 'sitemap.xml') -Raw
  $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
  $ns.AddNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9')
  $existing = @{}
  foreach ($loc in $xml.SelectNodes('//s:loc', $ns)) {
    $existing[$loc.InnerText] = $true
  }
  $added = 0
  foreach ($url in ($Urls | Sort-Object -Unique)) {
    if ($existing.ContainsKey($url)) { continue }
    $urlNode = $xml.CreateElement('url', $xml.DocumentElement.NamespaceURI)
    $locNode = $xml.CreateElement('loc', $xml.DocumentElement.NamespaceURI)
    $locNode.InnerText = $url
    $lastmodNode = $xml.CreateElement('lastmod', $xml.DocumentElement.NamespaceURI)
    $lastmodNode.InnerText = $Today
    $changeNode = $xml.CreateElement('changefreq', $xml.DocumentElement.NamespaceURI)
    $changeNode.InnerText = 'monthly'
    $priorityNode = $xml.CreateElement('priority', $xml.DocumentElement.NamespaceURI)
    $priorityNode.InnerText = if ($url -match '/tools/[^/]+\.html$' -and $url -notmatch '-(fast|free|mac|mobile|private|legal|bulk|custom|dates|exhibits|formatting|binding|bleed|hole-punch|notes|printing|books|collaboration|high-res|ipad|no-software|proofreading|students|teachers|code|confidential|contracts|drafts|financial|invoices|versions|100kb|archiving|discord|email|lossless|portfolios|scanned|images|kindle|scans|author|creator|keywords|subject|title|chapters|invoice|multiple|tax|assets|photos|presentation|zip|flatten|job|lease|medical|w9|forms|prevent-editing|signatures|black-and-white|size|text|clean|css|reports|album|order|receipts|academic|bates|dark-mode|large-files|search|thumbnails|zoom|extract|llms|data-uri|iframe|json|no-upload|web|business|high-quality|without-software|bank|copying|hr|government|names|ssn|blank|cover|mistakes|anonymous|privacy|sanitize|presentations|recovery|save|a4-to-letter|aspect|letter-to-a4|scale|landscape|upside-down|color|draw|half|single|logs|scripts|bank-statement|editing|forgotten|copyright|draft|logo|opacity)\.html$') { '0.8' } else { '0.6' }
    [void]$urlNode.AppendChild($locNode)
    [void]$urlNode.AppendChild($lastmodNode)
    [void]$urlNode.AppendChild($changeNode)
    [void]$urlNode.AppendChild($priorityNode)
    [void]$xml.DocumentElement.AppendChild($urlNode)
    $added++
  }
  $settings = New-Object System.Xml.XmlWriterSettings
  $settings.Encoding = $Utf8NoBom
  $settings.Indent = $true
  $settings.NewLineChars = "`r`n"
  $writer = [System.Xml.XmlWriter]::Create((Join-Path $Root 'sitemap.xml'), $settings)
  try { $xml.Save($writer) } finally { $writer.Close() }
  return $added
}

$zip = [System.IO.Compression.ZipFile]::OpenRead($SourceZip)
try {
  Ensure-Dir (Join-Path $Root 'assets\pdf')
  Ensure-Dir (Join-Path $Root 'tools')
  Ensure-Dir (Join-Path $Root 'alternatives')
  Ensure-Dir (Join-Path $Root 'hubs')
  Ensure-Dir (Join-Path $Root 'glossary')

  Write-ZipBinary $zip 'New project/assets/css/global.css' (Join-Path $Root 'assets\pdf\global.css')
  Write-ZipBinary $zip 'New project/assets/css/tool.css' (Join-Path $Root 'assets\pdf\tool.css')
  Write-ZipBinary $zip 'New project/assets/js/global.js' (Join-Path $Root 'assets\pdf\global.js')
  Write-ZipBinary $zip 'New project/assets/js/tool-base.js' (Join-Path $Root 'assets\pdf\tool-base.js')
  Write-ZipBinary $zip 'New project/assets/images/og-image.jpg' (Join-Path $Root 'assets\pdf\og-image.jpg')

  $cssOverride = @'

/* ToolsMatic PDF import theme overrides */
:root {
  --bg-base: #071523;
  --bg-card: rgba(8, 19, 32, 0.92);
  --bg-card-hover: rgba(11, 27, 45, 0.96);
  --border: rgba(124, 217, 255, 0.18);
  --border-hover: rgba(94, 234, 212, 0.42);
  --accent: #5eead4;
  --accent-hover: #60a5fa;
  --accent-glow: rgba(94, 234, 212, 0.18);
  --text-primary: #eef7ff;
  --text-secondary: #b5c7d8;
  --text-muted: #7f93a8;
}
.header-logo-text,.logo{letter-spacing:.14em;text-transform:uppercase;font-weight:800}
.header,.footer{background:rgba(5,14,24,.9);border-color:rgba(124,217,255,.16)}
.pdf-ad-slot{max-width:900px;margin:18px auto 26px;padding:10px;display:flex;justify-content:center;overflow:hidden;border-radius:18px;border:1px solid rgba(124,217,255,.14);background:rgba(4,12,22,.72)}
@media (max-width:768px){.pdf-ad-slot{width:min(100%,728px);margin:14px auto 20px;transform-origin:top center}}
'@
  Add-Content -LiteralPath (Join-Path $Root 'assets\pdf\global.css') -Value $cssOverride -Encoding UTF8

  $htmlEntries = $zip.Entries | Where-Object {
    ($_.FullName -like 'New project/tools/*.html' -or
     $_.FullName -like 'New project/alternatives/*.html' -or
     $_.FullName -like 'New project/hubs/*.html' -or
     $_.FullName -like 'New project/glossary/*.html') -and $_.Name
  }

  $indexableUrls = New-Object System.Collections.Generic.List[string]
  $written = 0
  foreach ($entry in $htmlEntries) {
    $relative = $entry.FullName -replace '^New project/', ''
    $target = Join-Path $Root ($relative -replace '/', '\')
    $html = Read-ZipText $zip $entry.FullName
    $transformed = Transform-Html $html $relative
    [System.IO.File]::WriteAllText($target, $transformed, $Utf8NoBom)
    $written++
    if ($transformed -notmatch 'noindex' -and $transformed -notmatch 'Coming Soon' -and $relative -notmatch '^tools/form-filler') {
      $indexableUrls.Add("$Site/$($relative -replace '\\','/')")
    }
  }

  $added = Add-SitemapUrls $indexableUrls.ToArray()
  "PDF assets imported: 5"
  "PDF HTML pages written: $written"
  "Indexable PDF URLs added to sitemap: $added"
}
finally {
  $zip.Dispose()
}
