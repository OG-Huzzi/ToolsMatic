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

1. Open chrome://extensions.
2. Turn on Developer mode.
3. Click Load unpacked.
4. Select extensions/toolsmatic-pdf-toolkit.

## Load in Edge

1. Open edge://extensions.
2. Turn on Developer mode.
3. Click Load unpacked.
4. Select extensions/toolsmatic-pdf-toolkit.

## Store upload

Upload dist/toolsmatic-pdf-toolkit-extension.zip to the Chrome Web Store or Microsoft Edge Add-ons dashboard.

## Rebuild

Run:

`powershell
.\scripts\build-pdf-extension.ps1
`

The build script refreshes the extension pages from the website PDF tools and keeps vendor libraries local.