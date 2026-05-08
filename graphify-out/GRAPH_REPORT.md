# Graph Report - D:\ToolsMatic  (2026-05-08)

## Corpus Check
- 11 files · ~5,323,364 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 151 nodes · 254 edges · 18 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `runConversion()` - 18 edges
2. `boot()` - 17 edges
3. `initGlobalToolSeo()` - 8 edges
4. `isToolPage()` - 7 edges
5. `setStatus()` - 6 edges
6. `buildCsvFromJson()` - 6 edges
7. `buildJsonFromCsv()` - 6 edges
8. `getDelimiterLabel()` - 5 edges
9. `decorateSiteShell()` - 5 edges
10. `initRelatedTools()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `showToast()` --calls--> `notify()`  [INFERRED]
  D:\ToolsMatic\assets\pdf\global.js → D:\ToolsMatic\assets\pdf\tool-base.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.16
Nodes (7): collectValidFiles(), ensureProgressStructure(), hideProgress(), readFileAsArrayBuffer(), showProgress(), updateProgress(), validatePDFHeader()

### Community 1 - "Community 1"
Cohesion: 0.17
Nodes (9): ensureNodeId(), getSectionSummary(), handoffAndGo(), logTracking(), makeSectionCollapsible(), setHandoff(), slugify(), trackEvent() (+1 more)

### Community 2 - "Community 2"
Cohesion: 0.19
Nodes (8): extractJsonRows(), findBestArray(), flattenRecord(), flattenValue(), isPlainObject(), normalizeJsonInput(), revokeBlobUrl(), updateDownloadBlob()

### Community 3 - "Community 3"
Cohesion: 0.19
Nodes (8): decodeHtml(), escapeHtml(), extractCards(), makeSeoBlock(), metaDescription(), replaceOrInsertHead(), updateFirstH1(), updateUrlFields()

### Community 4 - "Community 4"
Cohesion: 0.19
Nodes (14): bindKeyboard(), boot(), decorateAdSlots(), decorateSiteShell(), enhanceFooter(), initAnalyticsTracking(), initHomeExperience(), initResponsiveAds() (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.2
Nodes (5): getToastContainer(), normalizePath(), setActiveNavLink(), showToast(), notify()

### Community 6 - "Community 6"
Cohesion: 0.2
Nodes (11): formatBytes(), renderColumnPicker(), renderIssues(), renderNotes(), renderPreview(), resetColumnLabels(), runConversion(), setColumnsEnabled() (+3 more)

### Community 7 - "Community 7"
Cohesion: 0.24
Nodes (10): buildCsvFromJson(), buildHelperNotes(), buildJsonFromCsv(), detectDelimiter(), escapeHtml(), getDelimiterLabel(), getDelimiterValue(), mergeColumnMeta() (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.31
Nodes (7): Add-AdAfterFirstH1(), Add-HtmlExtensions(), Ensure-Dir(), Remove-FakeRatingSchema(), Set-Or-Insert-HeadTag(), Transform-Html(), Write-ZipBinary()

### Community 9 - "Community 9"
Cohesion: 0.22
Nodes (9): collectFaqEntities(), ensureBreadcrumbNav(), escapeHtml(), getHomeCategory(), hasSchemaType(), initGlobalToolSeo(), initRelatedTools(), injectJsonLd() (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (7): ensureToastHost(), getUserId(), initSuggestions(), likeSuggestion(), loadSuggestions(), showToast(), submitSuggestion()

### Community 11 - "Community 11"
Cohesion: 0.4
Nodes (6): copyText(), downloadOutput(), fetchJsonUrl(), handleFile(), setStatus(), showToast()

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (4): hasCoarsePointer(), initInteractiveMotion(), initScrollReveal(), prefersReducedMotion()

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

### Community 15 - "Community 15"
Cohesion: 1.0
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 1.0
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 13`** (1 nodes): `extract.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `sw.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (1 nodes): `popunder-manager.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (1 nodes): `generate-seo-variants.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (1 nodes): `normalize-banner-ads.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `notify()` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `runConversion()` connect `Community 6` to `Community 2`, `Community 11`, `Community 7`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._