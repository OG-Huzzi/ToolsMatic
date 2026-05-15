const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TOOLS = path.join(ROOT, 'tools');
const SITE = 'https://toolsmatic.me';
const TODAY = '2026-05-14';

const tools = [
  ['change-csv-separator', 'Change CSV Separator', 'Convert CSV delimiters between comma, semicolon, tab, and pipe.', 'Data', 'csv-separator'],
  ['csv-rows-to-columns', 'CSV Rows to Columns', 'Transpose CSV rows into columns instantly.', 'Data', 'transpose'],
  ['csv-to-tsv', 'CSV to TSV', 'Convert comma-separated CSV into tab-separated TSV.', 'Data', 'csv-to-tsv'],
  ['csv-to-xml', 'CSV to XML', 'Convert CSV rows into clean XML records.', 'Data', 'csv-to-xml'],
  ['csv-to-yaml', 'CSV to YAML', 'Convert CSV tables into readable YAML arrays.', 'Data', 'csv-to-yaml'],
  ['find-incomplete-csv-records', 'Find Incomplete CSV Records', 'Detect CSV rows with missing or extra columns.', 'Data', 'csv-incomplete'],
  ['insert-csv-columns', 'Insert CSV Columns', 'Add a new column to every CSV row with a default value.', 'Data', 'insert-column'],
  ['swap-csv-columns', 'Swap CSV Columns', 'Swap two CSV columns by index.', 'Data', 'swap-columns'],
  ['tsv-to-json', 'TSV to JSON', 'Convert TSV data into JSON objects.', 'Data', 'tsv-to-json'],
  ['escape-json', 'Escape JSON', 'Escape text safely for JSON strings.', 'Developer', 'escape-json'],
  ['json-comparison', 'JSON Comparison', 'Compare two JSON documents and highlight differences.', 'Developer', 'json-compare'],
  ['json-to-xml', 'JSON to XML', 'Convert JSON objects and arrays into XML.', 'Developer', 'json-to-xml'],
  ['stringify-json', 'Stringify JSON', 'Turn JSON into an escaped JavaScript string.', 'Developer', 'stringify-json'],
  ['duplicate-list-items', 'Duplicate List Items', 'Repeat every line in a list a chosen number of times.', 'Writing', 'duplicate-lines'],
  ['find-most-popular-list-items', 'Find Most Popular List Items', 'Count repeated list items and sort by frequency.', 'Writing', 'popular-lines'],
  ['find-unique-list-items', 'Find Unique List Items', 'Remove duplicate lines while preserving order.', 'Writing', 'unique-lines'],
  ['group-list-items', 'Group List Items', 'Group list lines into fixed-size chunks.', 'Writing', 'group-lines'],
  ['reverse-list-items', 'Reverse List Items', 'Reverse the order of list lines.', 'Writing', 'reverse-lines'],
  ['rotate-list-items', 'Rotate List Items', 'Move list items forward or backward by a custom offset.', 'Writing', 'rotate-lines'],
  ['shuffle-list-items', 'Shuffle List Items', 'Randomly shuffle list lines locally.', 'Writing', 'shuffle-lines'],
  ['sort-list-items', 'Sort List Items', 'Sort list lines alphabetically or numerically.', 'Writing', 'sort-lines'],
  ['truncate-list-items', 'Truncate List Items', 'Limit every line to a maximum length.', 'Writing', 'truncate-lines'],
  ['unwrap-list-items', 'Unwrap List Items', 'Join wrapped lines into one clean paragraph.', 'Writing', 'unwrap-lines'],
  ['wrap-list-items', 'Wrap List Items', 'Wrap long text into readable line lengths.', 'Writing', 'wrap-lines'],
  ['arithmetic-sequence-generator', 'Arithmetic Sequence Generator', 'Generate arithmetic sequences with start, step, and count.', 'Everyday', 'arithmetic'],
  ['byte-converter', 'Byte Converter', 'Convert bytes, KB, MB, GB, and TB.', 'Everyday', 'bytes'],
  ['random-number-generator', 'Random Number Generator', 'Generate random numbers in a custom range.', 'Everyday', 'random-number'],
  ['random-port-generator', 'Random Port Generator', 'Generate safe random port numbers for development.', 'Developer', 'random-port'],
  ['sum-calculator', 'Sum Calculator', 'Add numbers from lines, CSV, or pasted text.', 'Everyday', 'sum'],
  ['censor-text', 'Censor Text', 'Mask sensitive words or phrases in pasted text.', 'Writing', 'censor'],
  ['palindrome-generator', 'Palindrome Generator', 'Create palindrome-style mirrored text.', 'Writing', 'create-palindrome'],
  ['extract-substring', 'Extract Substring', 'Extract text between positions or markers.', 'Writing', 'substring'],
  ['hidden-character-detector', 'Hidden Character Detector', 'Reveal invisible Unicode and whitespace characters.', 'Developer', 'hidden-chars'],
  ['join-text-lines', 'Join Text Lines', 'Join lines with a custom separator.', 'Writing', 'join-lines'],
  ['palindrome-checker', 'Palindrome Checker', 'Check if text reads the same backward and forward.', 'Writing', 'palindrome'],
  ['randomize-case', 'Randomize Case', 'Randomly mix uppercase and lowercase letters.', 'Writing', 'random-case'],
  ['remove-duplicate-lines', 'Remove Duplicate Lines', 'Deduplicate text lines with optional case-insensitive mode.', 'Writing', 'unique-lines'],
  ['repeat-text', 'Repeat Text', 'Repeat text a custom number of times.', 'Writing', 'repeat-text'],
  ['reverse-text', 'Reverse Text', 'Reverse characters, words, or lines.', 'Writing', 'reverse-text'],
  ['rot13-converter', 'ROT13 Converter', 'Encode or decode ROT13 text instantly.', 'Developer', 'rot13'],
  ['rotate-text', 'Rotate Text', 'Rotate characters by a custom offset.', 'Writing', 'rotate-text'],
  ['split-text', 'Split Text', 'Split text by a delimiter into clean lines.', 'Writing', 'split-text'],
  ['text-replacer', 'Text Replacer', 'Find and replace text with plain or regex mode.', 'Writing', 'replace-text'],
  ['text-to-morse', 'Text to Morse Code', 'Convert text into Morse code and back.', 'Writing', 'morse'],
  ['truncate-text', 'Truncate Text', 'Trim text to a length with suffix control.', 'Writing', 'truncate-text'],
  ['unicode-inspector', 'Unicode Inspector', 'Inspect Unicode code points for every character.', 'Developer', 'unicode'],
  ['leap-year-checker', 'Leap Year Checker', 'Check whether years are leap years.', 'Everyday', 'leap-year'],
  ['days-to-hours-converter', 'Days to Hours Converter', 'Convert days into hours, minutes, and seconds.', 'Everyday', 'days-hours'],
  ['hours-to-days-converter', 'Hours to Days Converter', 'Convert hours into days and remaining hours.', 'Everyday', 'hours-days'],
  ['seconds-to-time-converter', 'Seconds to Time Converter', 'Convert seconds into HH:MM:SS time.', 'Everyday', 'seconds-time'],
  ['time-to-decimal-converter', 'Time to Decimal Converter', 'Convert HH:MM time into decimal hours.', 'Everyday', 'time-decimal'],
  ['time-to-seconds-converter', 'Time to Seconds Converter', 'Convert HH:MM:SS into total seconds.', 'Everyday', 'time-seconds'],
  ['unix-timestamp-converter', 'Unix Timestamp Converter', 'Convert Unix timestamps to readable dates and back.', 'Developer', 'unix'],
  ['crontab-guru', 'Crontab Guru', 'Explain common cron expressions in plain English.', 'Developer', 'cron'],
  ['discord-timestamp-generator', 'Discord Timestamp Generator', 'Generate Discord timestamp tags from a date and time.', 'Developer', 'discord-time'],
  ['time-between-dates', 'Time Between Dates', 'Calculate the exact gap between two dates.', 'Everyday', 'date-diff'],
  ['truncate-clock-time', 'Truncate Clock Time', 'Round clock time down to the nearest interval.', 'Everyday', 'truncate-clock'],
  ['xml-beautifier', 'XML Beautifier', 'Format messy XML into readable indentation.', 'Developer', 'xml-beautify'],
  ['xml-validator', 'XML Validator', 'Validate XML syntax and show parsing errors clearly.', 'Developer', 'xml-validate']
].map(([slug, title, description, category, op]) => ({ slug, title, description, category, op }));

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function page(tool) {
  const url = `${SITE}/tools/${tool.slug}.html`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebApplication', name: tool.title, url, description: tool.description, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` }, { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE}/#tools` }, { '@type': 'ListItem', position: 3, name: tool.title, item: url }] },
      { '@type': 'FAQPage', mainEntity: [
        { '@type': 'Question', name: `Is ${tool.title} free?`, acceptedAnswer: { '@type': 'Answer', text: `Yes. ${tool.title} is free and runs in your browser.` } },
        { '@type': 'Question', name: `Does ${tool.title} upload my data?`, acceptedAnswer: { '@type': 'Answer', text: 'No. The tool processes text locally in your browser.' } },
        { '@type': 'Question', name: `Can I use ${tool.title} on mobile?`, acceptedAnswer: { '@type': 'Answer', text: 'Yes. The layout is responsive and works on phones, tablets, and desktops.' } }
      ] }
    ]
  };
  return `<!DOCTYPE html><html lang="en"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(tool.title)} – Free Online Browser Tool | ToolsMatic</title>
  <meta name="description" content="${esc(tool.description)} Free, private, no sign-up, and browser-based on ToolsMatic.">
  <meta name="robots" content="index, follow"><link rel="canonical" href="${url}">
  <meta property="og:type" content="website"><meta property="og:url" content="${url}"><meta property="og:title" content="${esc(tool.title)} – ToolsMatic"><meta property="og:description" content="${esc(tool.description)}"><meta property="og:image" content="${SITE}/assets/pdf/og-image.jpg">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(tool.title)} – ToolsMatic"><meta name="twitter:description" content="${esc(tool.description)}"><meta name="twitter:image" content="${SITE}/assets/pdf/og-image.jpg">
  <link rel="stylesheet" href="/assets/styles.css"><link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>
  <style>.omni-shell{max-width:1100px;margin:0 auto;padding:90px 20px 70px}.tool-panel{display:grid;gap:16px;padding:22px;border:1px solid var(--border);border-radius:24px;background:var(--surface)}.tool-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.tool-area{min-height:340px;width:100%;resize:vertical;padding:16px;border:1px solid var(--border);border-radius:18px;background:var(--bg);color:var(--text);font:14px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace}.option-row{display:flex;flex-wrap:wrap;gap:10px}.option-row input,.option-row select{min-height:42px;padding:0 12px;border:1px solid var(--border);border-radius:12px;background:var(--bg);color:var(--text)}.tool-btn{min-height:44px;padding:0 16px;border:1px solid var(--border);border-radius:999px;background:var(--surface-2);color:var(--text);font-weight:800;cursor:pointer}.tool-btn.primary{background:linear-gradient(135deg,var(--accent),#60a5fa);color:#06131f}.metrics{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.metric{padding:12px;border:1px solid var(--border);border-radius:16px;background:var(--bg)}.metric span{display:block;color:var(--muted);font-size:12px}.metric strong{display:block;font-size:20px}.seo-card{margin-top:28px;padding:24px;border:1px solid var(--border);border-radius:24px;background:var(--surface)}.seo-card h2,.seo-card h3{margin-top:20px}.seo-card p,.seo-card li{color:var(--muted)}@media(max-width:760px){.tool-grid,.metrics{grid-template-columns:1fr}}</style>
</head><body><header><nav class="nav"><a class="brand" href="/"><span class="brand-dot"></span><span>ToolsMatic</span></a><div class="nav-links"><a href="/#tools" class="nav-btn">All tools</a><button id="theme-toggle" class="theme-toggle" title="Toggle dark/light mode">🌙</button></div></nav></header>
<main class="omni-shell"><nav class="breadcrumbs"><a href="/">Home</a> / <a href="/#tools">Tools</a> / <span>${esc(tool.title)}</span></nav><section class="hero"><h1>${esc(tool.title)}</h1><section class="ad-slot ad-slot-primary pdf-ad-slot" aria-label="Advertisement"><script>atOptions={'key':'e61a3745429623f25315f86052a3ab7b','format':'iframe','height':90,'width':728,'params':{}};</script><script src="https://fixesconsessionconsession.com/e61a3745429623f25315f86052a3ab7b/invoke.js"></script></section><p>${esc(tool.description)} Everything runs locally in your browser with no account required.</p></section>
<section class="tool-panel" data-op="${tool.op}"><div class="option-row"><input id="opt-a" placeholder="Option A / number / delimiter"><input id="opt-b" placeholder="Option B / number / replacement"><select id="mode"><option value="default">Default</option><option value="case">Case-insensitive</option><option value="numeric">Numeric</option><option value="regex">Regex</option></select><button class="tool-btn primary" id="run" data-primary>Run tool</button><button class="tool-btn" id="copy">Copy output</button><button class="tool-btn" id="clear" data-clear>Clear</button></div><div class="tool-grid"><textarea id="input" class="tool-area" placeholder="Paste input here..."></textarea><textarea id="output" class="tool-area" placeholder="Output appears here..." readonly></textarea></div><div class="metrics"><div class="metric"><span>Input chars</span><strong id="m1">0</strong></div><div class="metric"><span>Output chars</span><strong id="m2">0</strong></div><div class="metric"><span>Lines</span><strong id="m3">0</strong></div><div class="metric"><span>Status</span><strong id="m4">Ready</strong></div></div></section>
<article class="seo-card"><h2>What is ${esc(tool.title)}?</h2><p>${esc(tool.title)} is a focused ToolsMatic utility for people who need ${esc(tool.description.toLowerCase())} It is built for quick browser work: paste input, adjust the visible options when needed, and copy the result. No sign-up, no upload step, and no heavyweight desktop app.</p><h2>Why this browser tool is useful</h2><p>Small formatting and conversion tasks happen constantly during writing, development, data cleanup, SEO work, support, and operations. A fast single-purpose tool saves time because it removes setup. ToolsMatic keeps the controls visible, the output easy to inspect, and the page responsive on mobile and desktop.</p><h2>How to use it</h2><ol><li>Paste text, CSV, XML, numbers, dates, or list content into the input box.</li><li>Use Option A and Option B when the selected operation needs a delimiter, index, count, replacement, or interval.</li><li>Click Run tool, review the output, then copy it into your project.</li></ol><h2>Privacy</h2><p>The tool runs in JavaScript inside your browser. Your pasted content is not uploaded to a ToolsMatic server. That makes it suitable for drafts, internal snippets, logs, lists, and data cleanup tasks that should stay on your device.</p><h2>FAQs</h2><details><summary>Is ${esc(tool.title)} free?</summary><p>Yes, it is free to use in the browser.</p></details><details><summary>Does it work on mobile?</summary><p>Yes, the layout stacks cleanly on smaller screens.</p></details><details><summary>Can I process sensitive text?</summary><p>The operation runs locally, but you should still avoid pasting secrets into any browser page unless you trust the environment.</p></details></article></main><footer><div class="footer-inner"><div><strong>ToolsMatic</strong><p>Fast browser utilities for real work.</p></div><a href="/about.html">About</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/contact.html">Contact</a></div></footer><script src="/assets/site.js"></script><script>${runtimeJs()}</script></body></html>`;
}

function runtimeJs() {
  return `(()=>{const $=s=>document.querySelector(s),inp=$('#input'),out=$('#output'),a=$('#opt-a'),b=$('#opt-b'),mode=$('#mode'),op=document.querySelector('[data-op]').dataset.op;const lines=s=>s.split(/\\r?\\n/);const csv=s=>lines(s).filter(Boolean).map(r=>r.split(a.value||','));const set=v=>{out.value=String(v??'');stats('Done')};const stats=t=>{$('#m1').textContent=inp.value.length;$('#m2').textContent=out.value.length;$('#m3').textContent=lines(inp.value).filter(Boolean).length;$('#m4').textContent=t||'Ready'};const xmlEsc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));const morse={a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};function run(){try{const x=inp.value,L=lines(x),A=a.value,B=b.value;let r='';switch(op){case'csv-separator':r=csv(x).map(row=>row.join(B||'\\t')).join('\\n');break;case'transpose':{const m=csv(x),w=Math.max(...m.map(r=>r.length));r=Array.from({length:w},(_,i)=>m.map(row=>row[i]||'').join(A||',')).join('\\n');break}case'csv-to-tsv':r=csv(x).map(row=>row.join('\\t')).join('\\n');break;case'csv-to-xml':{const m=csv(x),h=m.shift()||[];r='<rows>\\n'+m.map(row=>'  <row>\\n'+h.map((k,i)=>'    <'+(k||'col'+i).replace(/\\W+/g,'_')+'>'+xmlEsc(row[i]||'')+'</'+(k||'col'+i).replace(/\\W+/g,'_')+'>').join('\\n')+'\\n  </row>').join('\\n')+'\\n</rows>';break}case'csv-to-yaml':{const m=csv(x),h=m.shift()||[];r=m.map(row=>'- '+h.map((k,i)=>'\\n  '+(k||'col'+i)+': '+JSON.stringify(row[i]||'')).join('')).join('\\n');break}case'csv-incomplete':{const m=csv(x),n=(m[0]||[]).length;r=m.map((row,i)=>row.length===n?'':'Line '+(i+1)+': expected '+n+', found '+row.length).filter(Boolean).join('\\n')||'No incomplete rows found.';break}case'insert-column':{const idx=Number(A||0);r=csv(x).map(row=>{row.splice(idx,0,B||'');return row.join(',')}).join('\\n');break}case'swap-columns':{const i=Number(A||0),j=Number(B||1);r=csv(x).map(row=>{[row[i],row[j]]=[row[j]||'',row[i]||''];return row.join(',')}).join('\\n');break}case'tsv-to-json':{const m=lines(x).filter(Boolean).map(r=>r.split('\\t')),h=m.shift()||[];r=JSON.stringify(m.map(row=>Object.fromEntries(h.map((k,i)=>[k,row[i]||'']))),null,2);break}case'escape-json':r=JSON.stringify(x).slice(1,-1);break;case'json-compare':r=JSON.stringify(JSON.parse(x))===JSON.stringify(JSON.parse(B||'{}'))?'JSON matches':'JSON differs';break;case'json-to-xml':{const obj=JSON.parse(x);const to=(v,k='root')=>Array.isArray(v)?v.map(i=>to(i,k)).join(''):v&&typeof v==='object'?'<'+k+'>'+Object.entries(v).map(([kk,vv])=>to(vv,kk)).join('')+'</'+k+'>':'<'+k+'>'+xmlEsc(v)+'</'+k+'>';r=to(obj);break}case'stringify-json':r=JSON.stringify(JSON.stringify(JSON.parse(x)));break;case'duplicate-lines':r=L.flatMap(line=>Array(Number(A||2)).fill(line)).join('\\n');break;case'popular-lines':{const m=new Map();L.filter(Boolean).forEach(l=>m.set(l,(m.get(l)||0)+1));r=[...m.entries()].sort((a,b)=>b[1]-a[1]).map(([k,v])=>v+' × '+k).join('\\n');break}case'unique-lines':{const seen=new Set();r=L.filter(l=>{const k=mode.value==='case'?l.toLowerCase():l;if(seen.has(k))return false;seen.add(k);return true}).join('\\n');break}case'group-lines':{const n=Number(A||3);r=L.reduce((acc,l,i)=>(acc+(i&&i%n===0?'\\n---\\n':'')+l+'\\n'),'').trim();break}case'reverse-lines':r=L.reverse().join('\\n');break;case'rotate-lines':{const n=Number(A||1),arr=[...L];r=arr.slice(n).concat(arr.slice(0,n)).join('\\n');break}case'shuffle-lines':r=[...L].sort(()=>Math.random()-.5).join('\\n');break;case'sort-lines':r=[...L].sort((x,y)=>mode.value==='numeric'?Number(x)-Number(y):x.localeCompare(y)).join('\\n');break;case'truncate-lines':r=L.map(l=>l.slice(0,Number(A||40))).join('\\n');break;case'unwrap-lines':r=L.map(l=>l.trim()).filter(Boolean).join(' ');break;case'wrap-lines':{const n=Number(A||80);r=x.split(/\\s+/).reduce((acc,w)=>{const p=acc.split('\\n').pop();return acc+(p&&p.length+w.length+1>n?'\\n':' ')+w},'').trim();break}case'arithmetic':{const start=Number(A||0),step=Number(B||1),count=Number(x||10);r=Array.from({length:count},(_,i)=>start+i*step).join('\\n');break}case'bytes':{const n=Number(x||0);r=n+' bytes\\n'+(n/1024)+' KB\\n'+(n/1048576)+' MB\\n'+(n/1073741824)+' GB';break}case'random-number':{const min=Number(A||0),max=Number(B||100),count=Number(x||1);r=Array.from({length:count},()=>Math.floor(Math.random()*(max-min+1))+min).join('\\n');break}case'random-port':r=String(Math.floor(Math.random()*(65535-1024+1))+1024);break;case'sum':r=String((x.match(/-?\\d+(\\.\\d+)?/g)||[]).reduce((s,n)=>s+Number(n),0));break;case'censor':r=x.replace(new RegExp(A||'secret',mode.value==='case'?'gi':'g'),B||'***');break;case'create-palindrome':r=x+x.split('').reverse().join('');break;case'substring':r=A&&B?x.split(A)[1]?.split(B)[0]||'':x.slice(Number(A||0),Number(B||x.length));break;case'hidden-chars':r=[...x].map(ch=>ch+' U+'+ch.codePointAt(0).toString(16).toUpperCase().padStart(4,'0')).join('\\n');break;case'join-lines':r=L.join(A||', ');break;case'palindrome':{const c=x.toLowerCase().replace(/[^a-z0-9]/g,'');r=c===c.split('').reverse().join('')?'Palindrome':'Not a palindrome';break}case'random-case':r=[...x].map(ch=>Math.random()>.5?ch.toUpperCase():ch.toLowerCase()).join('');break;case'repeat-text':r=Array(Number(A||3)).fill(x).join(B||'\\n');break;case'reverse-text':r=x.split('').reverse().join('');break;case'rot13':r=x.replace(/[a-z]/gi,c=>String.fromCharCode((c<='Z'?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26));break;case'rotate-text':{const n=Number(A||1),arr=[...x];r=arr.slice(n).concat(arr.slice(0,n)).join('');break}case'split-text':r=x.split(A||',').map(s=>s.trim()).join('\\n');break;case'replace-text':r=mode.value==='regex'?x.replace(new RegExp(A,'g'),B):x.split(A).join(B);break;case'morse':r=x.includes('.')||x.includes('-')?x.split(' ').map(code=>Object.keys(morse).find(k=>morse[k]===code)||' ').join(''):[...x.toLowerCase()].map(ch=>morse[ch]||' ').join(' ');break;case'truncate-text':r=x.slice(0,Number(A||160))+(x.length>Number(A||160)?(B||'...'):'');break;case'unicode':r=[...x].map(ch=>ch+' U+'+ch.codePointAt(0).toString(16).toUpperCase()).join('\\n');break;case'leap-year':{const y=Number(x||new Date().getFullYear());r=(y%4===0&&y%100!==0)||y%400===0?'Leap year':'Not a leap year';break}case'days-hours':r=Number(x||0)*24+' hours';break;case'hours-days':r=(Number(x||0)/24)+' days';break;case'seconds-time':{const s=Number(x||0);r=[Math.floor(s/3600),Math.floor(s%3600/60),s%60].map(v=>String(v).padStart(2,'0')).join(':');break}case'time-decimal':{const [h,m]=x.split(':').map(Number);r=String(h+(m||0)/60);break}case'time-seconds':{const p=x.split(':').map(Number);r=String((p[0]||0)*3600+(p[1]||0)*60+(p[2]||0));break}case'unix':{const n=Number(x||Date.now()/1000);r=new Date(n*1000).toISOString();break}case'cron':{const p=x.trim().split(/\\s+/);r=p.length===5?'Cron: minute '+p[0]+', hour '+p[1]+', day '+p[2]+', month '+p[3]+', weekday '+p[4]:'Enter 5-part cron expression';break}case'discord-time':{const d=x?new Date(x):new Date();const ts=Math.floor(d.getTime()/1000);r='<t:'+ts+':F>\\n<t:'+ts+':R>';break}case'date-diff':{const d1=new Date(x),d2=new Date(A||new Date());const ms=Math.abs(d2-d1);r=Math.floor(ms/86400000)+' days\\n'+Math.floor(ms/3600000)+' hours';break}case'truncate-clock':{const [h,m]=x.split(':').map(Number),step=Number(A||15);r=String(h).padStart(2,'0')+':'+String(Math.floor((m||0)/step)*step).padStart(2,'0');break}case'xml-beautify':{const xml=new XMLSerializer().serializeToString(new DOMParser().parseFromString(x,'application/xml'));r=xml.replace(/></g,'>\\n<');break}case'xml-validate':{const doc=new DOMParser().parseFromString(x,'application/xml');r=doc.querySelector('parsererror')?.textContent||'XML is valid';break}default:r=x}set(r)}catch(e){set('Error: '+e.message);stats('Error')}}$('#run').onclick=run;inp.oninput=()=>stats('Ready');$('#copy').onclick=()=>navigator.clipboard.writeText(out.value);$('#clear').onclick=()=>{inp.value='';out.value='';stats('Ready')};stats('Ready')})();`;
}

function addCards() {
  const indexPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  const cards = tools.filter(t => !html.includes(`tools/${t.slug}.html`)).map(t => `        <a class="card" href="tools/${t.slug}.html">
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.description)}</p>
        </a>`).join('');
  if (cards) {
    html = html.replace(/<\/div>\s*<\/section>\s*<section class="section home-about"/, `${cards}</div>\n</section>\n\n<section class="section home-about"`);
  }
  const count = (html.match(/<a class="card" href="tools\//g) || []).length;
  html = html.replace(/<span class="home-tool-count" data-tool-count>\d+ tools ready<\/span>/g, `<span class="home-tool-count" data-tool-count>${count} tools ready</span>`);
  fs.writeFileSync(indexPath, html);
  return count;
}

function updateSiteJs(count) {
  const file = path.join(ROOT, 'assets', 'site.js');
  let js = fs.readFileSync(file, 'utf8');
  const insert = tools.filter(t => !js.includes(`url: '/tools/${t.slug}.html'`)).map(t => `    { url: '/tools/${t.slug}.html', title: '${t.title.replace(/'/g, "\\'")}', description: '${t.description.replace(/'/g, "\\'")}', category: '${t.category}' },`).join('\n');
  if (insert) {
    js = js.replace(/\s{2}\];\s*const HOME_TOOL_COUNT/, `\n${insert}\n  ];\n\n  const HOME_TOOL_COUNT`);
  }
  js = js.replace(/const HOME_TOOL_COUNT = \d+;/, `const HOME_TOOL_COUNT = ${count};`);
  fs.writeFileSync(file, js);
}

function updateSitemaps() {
  const urls = tools.map(t => `${SITE}/tools/${t.slug}.html`);
  let main = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const existing = new Set([...main.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]));
  const add = urls.filter(u => !existing.has(u)).map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n');
  if (add) fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), main.replace('</urlset>', `${add}\n</urlset>`));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, 'sitemap-omni-browser-tools.xml'), xml);
  const robotsPath = path.join(ROOT, 'robots.txt');
  let robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes('sitemap-omni-browser-tools.xml')) {
    robots += `${robots.endsWith('\n') ? '' : '\n'}Sitemap: ${SITE}/sitemap-omni-browser-tools.xml\n`;
    fs.writeFileSync(robotsPath, robots);
  }
}

for (const tool of tools) {
  const target = path.join(TOOLS, `${tool.slug}.html`);
  if (!fs.existsSync(target)) fs.writeFileSync(target, page(tool));
}
const count = addCards();
updateSiteJs(count);
updateSitemaps();
console.log(JSON.stringify({ pages: tools.length, toolCount: count }, null, 2));
