# Graph Report - D:\ToolsMatic  (2026-05-07)

## Corpus Check
- 7 files · ~2,919,652 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 111 nodes · 203 edges · 15 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
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
- `runConversion()` --calls--> `setStatus()`  [EXTRACTED]
  D:\ToolsMatic\assets\json-to-csv.js → D:\ToolsMatic\assets\json-to-csv.js  _Bridges community 8 → community 4_
- `buildHelperNotes()` --calls--> `getDelimiterLabel()`  [EXTRACTED]
  D:\ToolsMatic\assets\json-to-csv.js → D:\ToolsMatic\assets\json-to-csv.js  _Bridges community 6 → community 10_
- `runConversion()` --calls--> `updateDownloadBlob()`  [EXTRACTED]
  D:\ToolsMatic\assets\json-to-csv.js → D:\ToolsMatic\assets\json-to-csv.js  _Bridges community 1 → community 4_
- `runConversion()` --calls--> `buildCsvFromJson()`  [EXTRACTED]
  D:\ToolsMatic\assets\json-to-csv.js → D:\ToolsMatic\assets\json-to-csv.js  _Bridges community 6 → community 4_
- `runConversion()` --calls--> `buildHelperNotes()`  [EXTRACTED]
  D:\ToolsMatic\assets\json-to-csv.js → D:\ToolsMatic\assets\json-to-csv.js  _Bridges community 10 → community 4_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.17
Nodes (9): ensureNodeId(), getSectionSummary(), handoffAndGo(), logTracking(), makeSectionCollapsible(), setHandoff(), slugify(), trackEvent() (+1 more)

### Community 1 - "Community 1"
Cohesion: 0.19
Nodes (8): extractJsonRows(), findBestArray(), flattenRecord(), flattenValue(), isPlainObject(), normalizeJsonInput(), revokeBlobUrl(), updateDownloadBlob()

### Community 2 - "Community 2"
Cohesion: 0.19
Nodes (8): decodeHtml(), escapeHtml(), extractCards(), makeSeoBlock(), metaDescription(), replaceOrInsertHead(), updateFirstH1(), updateUrlFields()

### Community 3 - "Community 3"
Cohesion: 0.19
Nodes (14): bindKeyboard(), boot(), decorateAdSlots(), decorateSiteShell(), enhanceFooter(), initAnalyticsTracking(), initHomeExperience(), initResponsiveAds() (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.2
Nodes (11): formatBytes(), renderColumnPicker(), renderIssues(), renderNotes(), renderPreview(), resetColumnLabels(), runConversion(), setColumnsEnabled() (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (9): collectFaqEntities(), ensureBreadcrumbNav(), escapeHtml(), getHomeCategory(), hasSchemaType(), initGlobalToolSeo(), initRelatedTools(), injectJsonLd() (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.32
Nodes (8): buildCsvFromJson(), buildJsonFromCsv(), detectDelimiter(), getDelimiterLabel(), getDelimiterValue(), mergeColumnMeta(), parseCsv(), serializeCsv()

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (7): ensureToastHost(), getUserId(), initSuggestions(), likeSuggestion(), loadSuggestions(), showToast(), submitSuggestion()

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (6): copyText(), downloadOutput(), fetchJsonUrl(), handleFile(), setStatus(), showToast()

### Community 9 - "Community 9"
Cohesion: 0.67
Nodes (4): hasCoarsePointer(), initInteractiveMotion(), initScrollReveal(), prefersReducedMotion()

### Community 10 - "Community 10"
Cohesion: 1.0
Nodes (2): buildHelperNotes(), escapeHtml()

### Community 11 - "Community 11"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Community 12"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 10`** (2 nodes): `buildHelperNotes()`, `escapeHtml()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 11`** (1 nodes): `extract.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (1 nodes): `sw.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `popunder-manager.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `generate-seo-variants.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `runConversion()` connect `Community 4` to `Community 8`, `Community 1`, `Community 10`, `Community 6`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `boot()` connect `Community 3` to `Community 0`, `Community 9`, `Community 5`, `Community 7`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `initGlobalToolSeo()` connect `Community 5` to `Community 0`, `Community 3`?**
  _High betweenness centrality (0.002) - this node is a cross-community bridge._