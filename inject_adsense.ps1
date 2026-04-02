# inject_adsense.ps1
# Adds AdSense script + meta tag to every HTML file that is missing them.

$adsenseScript = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6119998481340838" crossorigin="anonymous"></script>'
$adSenseMeta   = '<meta name="google-adsense-account" content="ca-pub-6119998481340838">'

# Anchor: the closing tag of the Google Analytics block
$anchor = 'gtag(''config'', ''G-9VEPDS13HT'');
  </script>'

$replacement = "gtag('config', 'G-9VEPDS13HT');
  </script>
  $adsenseScript
  $adSenseMeta"

# Collect all HTML files in root and tools/ subfolder
$files = Get-ChildItem -Path "D:\ToolsMatic" -Filter "*.html" -Recurse

$updated = 0
$skipped = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    $hasScript = $content -match [regex]::Escape('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6119998481340838')
    $hasMeta   = $content -match [regex]::Escape('google-adsense-account')

    if ($hasScript -and $hasMeta) {
        Write-Host "SKIP (already has both): $($file.Name)" -ForegroundColor Gray
        $skipped++
        continue
    }

    # Build what to inject — only what is missing
    $inject = ""
    if (-not $hasScript) { $inject += "`n  $adsenseScript" }
    if (-not $hasMeta)   { $inject += "`n  $adSenseMeta" }

    # Insert after the gtag closing </script>
    $anchorPattern = "(gtag\('config',\s*'G-9VEPDS13HT'\);\s*</script>)"
    if ($content -match $anchorPattern) {
        $newContent = $content -replace $anchorPattern, "`$1$inject"
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "UPDATED: $($file.Name)" -ForegroundColor Green
        $updated++
    } else {
        Write-Host "WARNING - gtag anchor not found, skipping: $($file.Name)" -ForegroundColor Yellow
        $skipped++
    }
}

Write-Host ""
Write-Host "Done. Updated: $updated | Skipped: $skipped" -ForegroundColor Cyan
