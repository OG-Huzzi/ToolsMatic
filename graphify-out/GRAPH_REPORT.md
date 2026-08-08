# Graph Report - D:\ToolsMatic  (2026-08-07)

## Corpus Check
- 31 files · ~4,030,517 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 341 nodes · 594 edges · 28 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]

## God Nodes (most connected - your core abstractions)
1. `boot()` - 19 edges
2. `runConversion()` - 18 edges
3. `basePage()` - 12 edges
4. `textPage()` - 10 edges
5. `head()` - 9 edges
6. `imagePage()` - 9 edges
7. `initGlobalToolSeo()` - 8 edges
8. `esc()` - 8 edges
9. `isToolPage()` - 7 edges
10. `toast()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `notify()` --calls--> `showToast()`  [INFERRED]
  D:\ToolsMatic\assets\pro-image-editor.js → D:\ToolsMatic\assets\pdf\global.js
- `toast()` --calls--> `showToast()`  [INFERRED]
  D:\ToolsMatic\assets\team-balancer.js → D:\ToolsMatic\assets\pdf\global.js
- `highlightStars()` --calls--> `initStarRatings()`  [INFERRED]
  D:\ToolsMatic\assets\ratings.js → D:\ToolsMatic\assets\site.js
- `showToast()` --calls--> `notify()`  [INFERRED]
  D:\ToolsMatic\assets\pdf\global.js → D:\ToolsMatic\assets\pdf\tool-base.js
- `renderPDFThumbnail()` --calls--> `render()`  [INFERRED]
  D:\ToolsMatic\assets\pdf\tool-base.js → D:\ToolsMatic\extensions\toolsmatic-pdf-toolkit\popup.js

## Communities

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (51): highlightStars(), resetStars(), bindKeyboard(), boot(), collectFaqEntities(), decorateAdSlots(), decorateSiteShell(), enhanceFooter() (+43 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (35): buildCsvFromJson(), buildHelperNotes(), buildJsonFromCsv(), copyText(), detectDelimiter(), downloadOutput(), escapeHtml(), extractJsonRows() (+27 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (14): getToastContainer(), normalizePath(), setActiveNavLink(), showToast(), render(), collectValidFiles(), ensureProgressStructure(), hideProgress() (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (24): basePage(), commonHelpers(), esc(), excelJs(), footer(), header(), json(), libraries() (+16 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (16): addBulkPlayers(), addPlayer(), bindTeamEditing(), clearAll(), computeBalanceScore(), copyResults(), downloadPng(), downloadText() (+8 more)

### Community 5 - "Community 5"
Cohesion: 0.26
Nodes (18): ad(), esc(), footer(), head(), header(), imagePage(), imageRuntime(), imageSeo() (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.23
Nodes (17): comparisonTable(), faqHtml(), footer(), head(), header(), jsonLd(), linksHtml(), mainArticle() (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.31
Nodes (14): $(), bindDragDrop(), dataUrlBytes(), downloadDataUrl(), exportImage(), formatBytes(), init(), loadFile() (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.19
Nodes (8): decodeHtml(), escapeHtml(), extractCards(), makeSeoBlock(), metaDescription(), replaceOrInsertHead(), updateFirstH1(), updateUrlFields()

### Community 9 - "Community 9"
Cohesion: 0.21
Nodes (8): decodeHtml(), escapeHtml(), extractCards(), makeSeoBlock(), metaDescription(), replaceOrInsertHead(), updateFirstH1(), updateUrlFields()

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (6): consolidatePage(), legacyVariantMap(), listedUrls(), read(), replaceOrInsertHead(), urlsFromXml()

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (9): categories(), filteredTools(), loadTool(), render(), renderCategories(), renderList(), toggleFavorite(), toolUrl() (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.31
Nodes (7): Add-AdAfterFirstH1(), Add-HtmlExtensions(), Ensure-Dir(), Remove-FakeRatingSchema(), Set-Or-Insert-HeadTag(), Transform-Html(), Write-ZipBinary()

### Community 13 - "Community 13"
Cohesion: 0.39
Nodes (5): faqSection(), head(), pseoContent(), schemas(), shell()

### Community 14 - "Community 14"
Cohesion: 0.38
Nodes (3): esc(), page(), runtimeJs()

### Community 15 - "Community 15"
Cohesion: 0.4
Nodes (0): 

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (0): 

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (0): 

### Community 18 - "Community 18"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `Community 18`** (1 nodes): `extract.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (1 nodes): `sw.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 20`** (1 nodes): `popunder-manager.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (1 nodes): `tools-data.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (1 nodes): `find-canonical-mismatches.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (1 nodes): `generate-seo-variants.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (1 nodes): `normalize-banner-ads.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (1 nodes): `remove-ads.ps1`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (1 nodes): `streamline-homepage.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (1 nodes): `verify-site-cleanup.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `showToast()` connect `Community 2` to `Community 4`, `Community 7`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `toast()` connect `Community 4` to `Community 2`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._