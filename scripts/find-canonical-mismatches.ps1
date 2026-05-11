$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$toolsDir = Join-Path $root 'tools'
$baseUrl = 'https://toolsmatic.me/tools/'

$files = Get-ChildItem -Path $toolsDir -Filter '*.html'
$mismatched = @()

foreach ($file in $files) {
  $content = [System.IO.File]::ReadAllText($file.FullName)
  if ($content -match '<link\s+rel="canonical"\s+href="([^"]+)"') {
    $canonical = $Matches[1]
    $selfUrl = $baseUrl + $file.Name
    if ($canonical -ne $selfUrl) {
      $mismatched += [pscustomobject]@{
        File = $file.Name
        Canonical = $canonical
        Expected = $selfUrl
      }
    }
  }
}

Write-Host "Total files checked: $($files.Count)"
Write-Host "Mismatched canonicals: $($mismatched.Count)"
Write-Host ""

foreach ($m in $mismatched) {
  Write-Host "$($m.File)"
  Write-Host "  canonical: $($m.Canonical)"
  Write-Host "  expected:  $($m.Expected)"
  Write-Host ""
}
