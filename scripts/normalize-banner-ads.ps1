$ErrorActionPreference = 'Stop'

# Advertising is intentionally disabled. Keep this maintenance entry point as a
# safe cleanup so future generated pages cannot reintroduce ad markup.
$script = Join-Path $PSScriptRoot 'remove-ads.ps1'
if (-not (Test-Path $script)) { throw "Missing ad cleanup script: $script" }
& $script
