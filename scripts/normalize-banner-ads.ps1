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

$adBlock = @'
    <section class="ad-slot ad-slot-primary pdf-ad-slot" aria-label="Advertisement">
      <script>atOptions={'key':'e61a3745429623f25315f86052a3ab7b','format':'iframe','height':90,'width':728,'params':{}};</script>
      <script src="https://fixesconsessionconsession.com/e61a3745429623f25315f86052a3ab7b/invoke.js"></script>
    </section>
'@

$sectionPattern = '(?is)\s*<section\b(?=[^>]*\bad-slot\b)[^>]*>.*?fixesconsessionconsession\.com/e61a3745429623f25315f86052a3ab7b/invoke\.js.*?</section>'
$rawPattern = '(?is)\s*<script>\s*atOptions\s*=\s*\{.*?e61a3745429623f25315f86052a3ab7b.*?\};\s*</script>\s*<script\s+src="https://fixesconsessionconsession\.com/e61a3745429623f25315f86052a3ab7b/invoke\.js"></script>'

$files = foreach ($dir in $publicDirs) {
  Get-ChildItem -Path $dir -File -Filter '*.html'
}

$changed = 0
$skipped = 0

foreach ($file in $files) {
  if ($file.Name -eq 'SEO_CONTENT_TEMPLATE.html') {
    $skipped++
    continue
  }

  $html = [System.IO.File]::ReadAllText($file.FullName)
  $clean = [regex]::Replace($html, $sectionPattern, '')
  $clean = [regex]::Replace($clean, $rawPattern, '')

  if ($clean -match '</h1>') {
    $updated = [regex]::Replace($clean, '</h1>', "</h1>`r`n$adBlock", 1)
  } elseif ($clean -match '<main\b[^>]*>') {
    $updated = [regex]::Replace($clean, '(<main\b[^>]*>)', "`$1`r`n$adBlock", 1)
  } elseif ($clean -match '<body\b[^>]*>') {
    $updated = [regex]::Replace($clean, '(<body\b[^>]*>)', "`$1`r`n$adBlock", 1)
  } elseif ($clean -match '<meta\s+name="description"[^>]*>') {
    $updated = [regex]::Replace($clean, '(<meta\s+name="description"[^>]*>)', "`$1`r`n$adBlock", 1)
  } else {
    $skipped++
    continue
  }

  if ($updated -ne $html) {
    if ($file.IsReadOnly) {
      $file.IsReadOnly = $false
    }
    [System.IO.File]::WriteAllText($file.FullName, $updated)
    $changed++
  }
}

$missing = New-Object System.Collections.Generic.List[string]
$duplicates = New-Object System.Collections.Generic.List[string]

foreach ($file in $files) {
  if ($file.Name -eq 'SEO_CONTENT_TEMPLATE.html') {
    continue
  }

  $html = [System.IO.File]::ReadAllText($file.FullName)
  $count = ([regex]::Matches($html, 'fixesconsessionconsession\.com/e61a3745429623f25315f86052a3ab7b/invoke\.js')).Count

  if ($count -eq 0) {
    $missing.Add($file.FullName)
  } elseif ($count -gt 1) {
    $duplicates.Add("$($file.FullName) [$count]")
  }
}

[pscustomobject]@{
  Checked = ($files | Where-Object { $_.Name -ne 'SEO_CONTENT_TEMPLATE.html' }).Count
  Changed = $changed
  Skipped = $skipped
  MissingAds = $missing.Count
  DuplicateAds = $duplicates.Count
}

if ($missing.Count -gt 0) {
  'Missing ad pages:'
  $missing
}

if ($duplicates.Count -gt 0) {
  'Duplicate ad pages:'
  $duplicates
}
