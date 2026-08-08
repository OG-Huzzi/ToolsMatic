$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$publicDirs = @(
  $root,
  (Join-Path $root 'tools'),
  (Join-Path $root 'guides'),
  (Join-Path $root 'blog'),
  (Join-Path $root 'alternatives'),
  (Join-Path $root 'hubs'),
  (Join-Path $root 'glossary')
) | Where-Object { Test-Path $_ }

$sectionPattern = '(?is)\s*<section\b(?=[^>]*\bad-slot\b)[^>]*>.*?</section>'
$rawAdPattern = '(?is)\s*<script>\s*(?:var\s+)?atOptions\s*=.*?</script>\s*<script\s+src=["''][^"'']*(?:fixesconsessionconsession|adsbygoogle)[^"'']*["''][^>]*>\s*</script>'
$adScriptPattern = '(?is)\s*<script\b[^>]*src=["''][^"'']*(?:fixesconsessionconsession|adsbygoogle)[^"'']*["''][^>]*>\s*</script>'
$adMetaPattern = '(?is)\s*<meta\b[^>]*(?:google-adsense|google-adsense-account)[^>]*>'

$files = foreach ($dir in $publicDirs) { Get-ChildItem -Path $dir -File -Filter '*.html' }
$changed = 0
$failed = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
  if ($file.Name -eq 'SEO_CONTENT_TEMPLATE.html') { continue }
  $html = [System.IO.File]::ReadAllText($file.FullName)
  if ($html -notmatch 'ad-slot|fixesconsessionconsession|adsbygoogle|atOptions|google-adsense') { continue }
  $clean = [regex]::Replace($html, $sectionPattern, '')
  $clean = [regex]::Replace($clean, $rawAdPattern, '')
  $clean = [regex]::Replace($clean, $adScriptPattern, '')
  $clean = [regex]::Replace($clean, $adMetaPattern, '')
  if ($clean -ne $html) {
    try {
      [System.IO.File]::WriteAllText($file.FullName, $clean)
      $changed++
    } catch {
      $failed.Add($file.FullName)
    }
  }
}

[pscustomobject]@{
  Checked = ($files | Where-Object { $_.Name -ne 'SEO_CONTENT_TEMPLATE.html' }).Count
  Changed = $changed
  RemainingBannerScripts = $failed.Count
}

if ($failed.Count -gt 0) {
  'Files that could not be updated:'
  $failed
}
