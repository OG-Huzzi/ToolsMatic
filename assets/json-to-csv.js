(() => {
  const root = document.querySelector('.jtc-page');
  if (!root) return;

  const els = {
    workspace: document.getElementById('jtc-workspace'),
    modeJson: document.getElementById('jtc-mode-json'),
    modeCsv: document.getElementById('jtc-mode-csv'),
    delimiter: document.getElementById('jtc-delimiter'),
    excelMode: document.getElementById('jtc-excel-mode'),
    csvHeaders: document.getElementById('jtc-csv-headers'),
    csvTypes: document.getElementById('jtc-csv-types'),
    columnsToggle: document.getElementById('jtc-columns-toggle'),
    loadSample: document.getElementById('jtc-load-sample'),
    clear: document.getElementById('jtc-clear'),
    toolbarCopy: document.getElementById('jtc-toolbar-copy'),
    inputTitle: document.getElementById('jtc-input-title'),
    inputCopy: document.getElementById('jtc-input-copy'),
    input: document.getElementById('jtc-input'),
    browseFile: document.getElementById('jtc-browse-file'),
    fileInput: document.getElementById('jtc-file-input'),
    copyInput: document.getElementById('jtc-copy-input'),
    dropzone: document.getElementById('jtc-dropzone'),
    urlBlock: document.getElementById('jtc-url-block'),
    urlInput: document.getElementById('jtc-url-input'),
    fetchUrl: document.getElementById('jtc-fetch-url'),
    outputTitle: document.getElementById('jtc-output-title'),
    outputCopy: document.getElementById('jtc-output-copy'),
    output: document.getElementById('jtc-output'),
    outputStatus: document.getElementById('jtc-output-status'),
    copyOutput: document.getElementById('jtc-copy-output'),
    downloadOutput: document.getElementById('jtc-download-output'),
    tabPreview: document.getElementById('jtc-tab-preview'),
    tabNotes: document.getElementById('jtc-tab-notes'),
    previewWrap: document.getElementById('jtc-preview-wrap'),
    notesWrap: document.getElementById('jtc-notes-wrap'),
    notesGrid: document.getElementById('jtc-notes-grid'),
    columnCard: document.getElementById('jtc-column-card'),
    columnCopy: document.getElementById('jtc-column-copy'),
    columnList: document.getElementById('jtc-column-list'),
    columnsAll: document.getElementById('jtc-columns-all'),
    columnsNone: document.getElementById('jtc-columns-none'),
    columnsReset: document.getElementById('jtc-columns-reset'),
    issues: document.getElementById('jtc-issues'),
    helperNotes: document.getElementById('jtc-helper-notes'),
    statRows: document.getElementById('jtc-stat-rows'),
    statColumns: document.getElementById('jtc-stat-columns'),
    statInputSize: document.getElementById('jtc-stat-input-size'),
    statOutputSize: document.getElementById('jtc-stat-output-size'),
    statSource: document.getElementById('jtc-stat-source'),
    statValidation: document.getElementById('jtc-stat-validation')
  };

  const sampleJson = JSON.stringify([
    {
      id: 1,
      profile: {
        name: 'Ada',
        role: 'Engineer',
        address: { city: 'Delhi', postalCode: '110001' }
      },
      active: true,
      tags: ['alpha', 'beta']
    },
    {
      id: 2,
      profile: {
        name: 'Mira',
        role: 'Analyst',
        address: { city: 'Mumbai', postalCode: '400001' }
      },
      active: false,
      tags: ['gamma']
    }
  ], null, 2);

  const sampleCsv = [
    'id,name,city,active',
    '1,Ada,Delhi,true',
    '2,Mira,Mumbai,false',
    '3,Lin,Bengaluru,true'
  ].join('\n');

  const state = {
    mode: 'json-to-csv',
    columnsCollapsed: false,
    currentColumns: [],
    columnMeta: {},
    currentOutput: '',
    downloadName: 'converted.csv',
    blobUrl: null,
    activeSubtab: 'preview',
    inputTimer: null
  };

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const formatBytes = (value) => {
    const bytes = Number(value) || 0;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const showToast = (message, variant = 'info') => {
    if (window.toolsMatic && typeof window.toolsMatic.showToast === 'function') {
      window.toolsMatic.showToast(message, variant);
    }
  };

  const setStatus = (text) => {
    els.outputStatus.textContent = text;
  };

  const getDelimiterValue = () => (els.delimiter.value === 'tab' ? '\t' : els.delimiter.value);
  const getDelimiterLabel = () => (getDelimiterValue() === '\t' ? 'Tab' : getDelimiterValue());

  const revokeBlobUrl = () => {
    if (state.blobUrl) {
      URL.revokeObjectURL(state.blobUrl);
      state.blobUrl = null;
    }
  };

  const updateDownloadBlob = (content) => {
    revokeBlobUrl();
    const payload = state.mode === 'json-to-csv' && els.excelMode.checked ? `\ufeff${content}` : content;
    const type = state.mode === 'json-to-csv' ? 'text/csv' : 'application/json';
    state.blobUrl = URL.createObjectURL(new Blob([payload], { type }));
  };

  const countDelimiter = (line, delimiter) => {
    let count = 0;
    let inQuotes = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"') {
        if (inQuotes && line[index + 1] === '"') {
          index += 1;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (!inQuotes && char === delimiter) {
        count += 1;
      }
    }
    return count;
  };

  const detectDelimiter = (text) => {
    const candidates = [',', ';', '\t', '|'];
    const lines = text.split(/\r?\n/).filter((line) => line.trim()).slice(0, 8);
    if (!lines.length) return ',';

    let best = ',';
    let bestScore = -Infinity;

    candidates.forEach((candidate) => {
      const counts = lines.map((line) => countDelimiter(line, candidate));
      const positive = counts.filter((value) => value > 0);
      if (!positive.length) return;
      const spread = Math.max(...counts) - Math.min(...counts);
      const score = positive.length * 100 - spread;
      if (score > bestScore) {
        bestScore = score;
        best = candidate;
      }
    });

    return best;
  };

  const parseCsv = (text, delimiter) => {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let index = 0; index < text.length; index += 1) {
      const char = text[index];
      const next = text[index + 1];

      if (inQuotes) {
        if (char === '"') {
          if (next === '"') {
            field += '"';
            index += 1;
          } else {
            inQuotes = false;
          }
        } else {
          field += char;
        }
        continue;
      }

      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        row.push(field);
        field = '';
      } else if (char === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (char === '\r') {
        if (next === '\n') continue;
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }

    if (inQuotes) {
      throw new Error('CSV contains an unclosed quoted field.');
    }

    row.push(field);
    rows.push(row);
    return rows.filter((entry) => entry.length > 1 || entry[0] !== '');
  };

  const normalizeCsvValue = (value) => {
    const trimmed = value.trim();
    if (!els.csvTypes.checked) return trimmed;
    if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === 'true';
    if (/^null$/i.test(trimmed)) return null;
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
    return trimmed;
  };

  const isPlainObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

  const flattenValue = (value, path, output) => {
    if (Array.isArray(value)) {
      if (!value.length) {
        output[path || 'value'] = '';
        return;
      }
      if (value.every((item) => item == null || ['string', 'number', 'boolean'].includes(typeof item))) {
        output[path || 'value'] = value.join(' | ');
        return;
      }
      value.forEach((item, index) => {
        const nextPath = path ? `${path}[${index}]` : `[${index}]`;
        flattenValue(item, nextPath, output);
      });
      return;
    }

    if (isPlainObject(value)) {
      const keys = Object.keys(value);
      if (!keys.length) {
        output[path || 'value'] = '';
        return;
      }
      keys.forEach((key) => {
        const nextPath = path ? `${path}.${key}` : key;
        flattenValue(value[key], nextPath, output);
      });
      return;
    }

    output[path || 'value'] = value == null ? '' : value;
  };

  const flattenRecord = (record) => {
    const output = {};
    flattenValue(record, '', output);
    return output;
  };

  const findBestArray = (node, path = 'root') => {
    let best = null;

    const visit = (value, currentPath) => {
      if (Array.isArray(value)) {
        const objectLike = value.filter((item) => isPlainObject(item) || Array.isArray(item)).length;
        if (objectLike) {
          const score = objectLike * 1000 + value.length;
          if (!best || score > best.score) {
            best = { rows: value, path: currentPath, score };
          }
        }
        value.forEach((item, index) => visit(item, `${currentPath}[${index}]`));
        return;
      }

      if (isPlainObject(value)) {
        Object.keys(value).forEach((key) => visit(value[key], currentPath ? `${currentPath}.${key}` : key));
      }
    };

    visit(node, path);
    return best;
  };

  const extractJsonRows = (value) => {
    if (Array.isArray(value)) {
      return { rows: value, source: 'Using top-level array' };
    }

    if (isPlainObject(value)) {
      const best = findBestArray(value);
      if (best) {
        const cleanedPath = best.path.replace(/^root\.?/, '') || 'root';
        return { rows: best.rows, source: `Detected row array at ${cleanedPath}` };
      }
      return { rows: [value], source: 'Using top-level object as a single row' };
    }

    return { rows: [{ value }], source: 'Using single primitive value as one row' };
  };

  const normalizeJsonInput = (text) => {
    const source = text.trim();
    if (!source) {
      return { ok: false, issues: [], rows: [], columns: [], source: 'Waiting for JSON input' };
    }

    try {
      const parsed = JSON.parse(source);
      const extracted = extractJsonRows(parsed);
      const flattenedRows = extracted.rows.map((row) => flattenRecord(row));
      const columns = [];

      flattenedRows.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (!columns.includes(key)) columns.push(key);
        });
      });

      return {
        ok: true,
        rows: flattenedRows,
        source: extracted.source,
        columns,
        issues: [{
          type: 'ok',
          title: 'JSON parsed successfully',
          message: `${flattenedRows.length} row(s) and ${columns.length} detected column(s).`
        }]
      };
    } catch (error) {
      return {
        ok: false,
        rows: [],
        columns: [],
        source: 'JSON could not be parsed',
        issues: [{
          type: 'error',
          title: 'JSON parse error',
          message: error && error.message ? error.message : 'Unable to parse JSON.'
        }]
      };
    }
  };

  const serializeCsvValue = (value, delimiter) => {
    const text = value == null ? '' : String(value);
    const needsQuotes = els.excelMode.checked || text.includes(delimiter) || /["\r\n]/.test(text) || /^\s|\s$/.test(text);
    const escaped = text.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const serializeCsv = (headers, rows, delimiter) => {
    const lineEnding = els.excelMode.checked ? '\r\n' : '\n';
    const lines = [headers.map((header) => serializeCsvValue(header, delimiter)).join(delimiter)];
    rows.forEach((row) => {
      lines.push(row.map((cell) => serializeCsvValue(cell, delimiter)).join(delimiter));
    });
    return lines.join(lineEnding);
  };

  const mergeColumnMeta = (columns) => {
    const next = {};
    columns.forEach((column) => {
      const existing = state.columnMeta[column];
      next[column] = {
        enabled: existing ? existing.enabled : true,
        label: existing ? existing.label : column
      };
    });
    state.columnMeta = next;
  };

  const buildCsvFromJson = (normalized) => {
    mergeColumnMeta(normalized.columns);

    const activeColumns = normalized.columns.filter((column) => state.columnMeta[column] && state.columnMeta[column].enabled);
    if (!activeColumns.length) {
      return {
        output: '',
        previewHeaders: [],
        previewRows: [],
        issues: [{
          type: 'error',
          title: 'No columns selected',
          message: 'Turn on at least one detected key in the column picker to generate CSV output.'
        }],
        notes: [
          { title: 'Column control', body: `0 of ${normalized.columns.length} detected column(s) are currently included.` },
          { title: 'Next step', body: 'Select one or more columns in the sidebar and the CSV output will rebuild instantly.' }
        ],
        source: normalized.source,
        rowCount: normalized.rows.length,
        columnCount: 0,
        validation: 'JSON valid'
      };
    }
    const headers = activeColumns.map((column) => state.columnMeta[column].label || column);
    const rows = normalized.rows.map((row) => activeColumns.map((column) => (row[column] == null ? '' : row[column])));
    const output = serializeCsv(headers, rows, getDelimiterValue());

    return {
      output,
      previewHeaders: headers,
      previewRows: rows,
      issues: normalized.issues,
      notes: [
        { title: 'Delimiter', body: `Output uses ${getDelimiterLabel()} as the field separator.` },
        { title: 'Column control', body: `${activeColumns.length} of ${normalized.columns.length} detected column(s) are currently included.` },
        { title: 'Flattening rule', body: 'Nested objects flatten with dot notation and arrays are expanded or joined into spreadsheet-safe values.' }
      ],
      source: normalized.source,
      rowCount: normalized.rows.length,
      columnCount: headers.length,
      validation: 'JSON valid'
    };
  };

  const buildJsonFromCsv = (text) => {
    const source = text.trim();
    if (!source) {
      return {
        output: '',
        previewHeaders: [],
        previewRows: [],
        issues: [],
        notes: [],
        source: 'Waiting for CSV input',
        rowCount: 0,
        columnCount: 0,
        validation: 'Ready'
      };
    }

    const chosenDelimiter = getDelimiterValue();
    const detectedDelimiter = detectDelimiter(source);
    let delimiter = chosenDelimiter;
    let rows;
    let autoDetected = false;

    try {
      rows = parseCsv(source, chosenDelimiter);
      if (rows.length && rows[0].length === 1 && detectedDelimiter !== chosenDelimiter) {
        rows = parseCsv(source, detectedDelimiter);
        delimiter = detectedDelimiter;
        autoDetected = true;
      }
    } catch (primaryError) {
      try {
        rows = parseCsv(source, detectedDelimiter);
        delimiter = detectedDelimiter;
        autoDetected = true;
      } catch (fallbackError) {
        return {
          output: '',
          previewHeaders: [],
          previewRows: [],
          issues: [{
            type: 'error',
            title: 'CSV parse error',
            message: fallbackError && fallbackError.message ? fallbackError.message : 'Unable to parse CSV.'
          }],
          notes: [{
            title: 'Delimiter hint',
            body: `The selected delimiter was ${getDelimiterLabel()}. If the file came from another locale, try a different delimiter.`
          }],
          source: 'CSV could not be parsed',
          rowCount: 0,
          columnCount: 0,
          validation: 'CSV invalid'
        };
      }
    }

    const hasHeaderRow = els.csvHeaders.checked;
    const headers = hasHeaderRow
      ? rows[0].map((header, index) => header.trim() || `column_${index + 1}`)
      : Array.from({ length: rows[0]?.length || 0 }, (_, index) => `column_${index + 1}`);
    const dataRows = hasHeaderRow ? rows.slice(1) : rows;

    const objects = dataRows.map((row, rowIndex) => {
      if (row.length !== headers.length) {
        throw new Error(`Row ${rowIndex + 1 + (hasHeaderRow ? 1 : 0)} has ${row.length} field(s), expected ${headers.length}.`);
      }

      const nextObject = {};
      headers.forEach((header, index) => {
        nextObject[header] = normalizeCsvValue(row[index] == null ? '' : row[index]);
      });
      return nextObject;
    });

    return {
      output: JSON.stringify(objects, null, 2),
      previewHeaders: headers,
      previewRows: objects.map((row) => headers.map((header) => (row[header] == null ? '' : row[header]))),
      issues: [{
        type: 'ok',
        title: 'CSV parsed successfully',
        message: `${objects.length} JSON object(s) were created from ${headers.length} column(s).`
      }],
      notes: [
        { title: 'Detected delimiter', body: `${delimiter === '\t' ? 'Tab' : delimiter}${autoDetected ? ' was auto-detected from the CSV input.' : ' is being used to parse the CSV input.'}` },
        { title: 'Header rule', body: hasHeaderRow ? 'The first row is treated as the header row.' : 'Generic headers were generated because header mode is turned off.' },
        { title: 'Type inference', body: els.csvTypes.checked ? 'Numbers, booleans, and null values are converted into proper JSON types.' : 'Every CSV cell stays as text in the JSON output.' }
      ],
      source: autoDetected ? 'CSV parsed with auto-detected delimiter' : 'CSV parsed with selected delimiter',
      rowCount: objects.length,
      columnCount: headers.length,
      validation: 'CSV valid'
    };
  };

  const renderIssues = (issues) => {
    if (!issues.length) {
      els.issues.innerHTML = '<div class="jtc-issue ok"><strong>No issues</strong><p>The current input is ready to convert.</p></div>';
      return;
    }

    els.issues.innerHTML = issues.map((issue) => {
      const cls = issue.type === 'error' ? 'jtc-issue error' : 'jtc-issue ok';
      return `<div class="${cls}"><strong>${escapeHtml(issue.title)}</strong><p>${escapeHtml(issue.message)}</p></div>`;
    }).join('');
  };

  const renderNotes = (notes) => {
    if (!notes.length) {
      els.notesGrid.innerHTML = '<div class="jtc-note"><strong>Waiting for data</strong><span>Structure notes appear here after the current input is analyzed.</span></div>';
      return;
    }

    els.notesGrid.innerHTML = notes.map((note) => {
      return `<div class="jtc-note"><strong>${escapeHtml(note.title)}</strong><span>${escapeHtml(note.body)}</span></div>`;
    }).join('');
  };

  const renderPreview = (headers, rows) => {
    if (!headers.length || !rows.length) {
      els.previewWrap.innerHTML = '<div class="jtc-preview-empty">The first 10 converted rows will appear here after a successful transform.</div>';
      return;
    }

    const previewRows = rows.slice(0, 10);
    const headHtml = `<thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>`;
    const bodyHtml = `<tbody>${previewRows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    els.previewWrap.innerHTML = `<table class="jtc-preview-table">${headHtml}${bodyHtml}</table>`;
  };

  const setStatCard = (card, strongText, bodyText, variant) => {
    card.querySelector('strong').textContent = strongText;
    card.querySelector('span').textContent = bodyText;
    card.classList.remove('is-warning', 'is-error');
    if (variant) card.classList.add(variant);
  };

  const renderColumnPicker = () => {
    if (state.mode !== 'json-to-csv') {
      els.columnCopy.textContent = 'Reverse mode does not need header selection, so this sidebar becomes a quick reference instead of an editing surface.';
      els.columnList.innerHTML = '<div class="jtc-column-empty">CSV to JSON mode uses the selected delimiter, header toggle, and type inference settings. Switch back to JSON to CSV to include or exclude fields before export.</div>';
      return;
    }

    els.columnCopy.textContent = 'Choose which detected keys should become CSV columns and rename headers before export.';

    if (!state.currentColumns.length) {
      els.columnList.innerHTML = '<div class="jtc-column-empty">Columns appear here after JSON is parsed. The sidebar stays empty until the tool can detect a valid structure.</div>';
      return;
    }

    els.columnList.innerHTML = state.currentColumns.map((column) => {
      const meta = state.columnMeta[column] || { enabled: true, label: column };
      return [
        '<div class="jtc-column-item">',
        `<label class="jtc-column-toggle"><input type="checkbox" data-column-toggle="${escapeHtml(column)}"${meta.enabled ? ' checked' : ''}><span>${escapeHtml(meta.label || column)}</span></label>`,
        `<div class="jtc-column-key">${escapeHtml(column)}</div>`,
        `<label class="jtc-label" style="margin-top:12px;" for="rename-${escapeHtml(column)}">Custom header</label>`,
        `<input id="rename-${escapeHtml(column)}" class="jtc-input" type="text" data-column-rename="${escapeHtml(column)}" value="${escapeHtml(meta.label || column)}">`,
        '</div>'
      ].join('');
    }).join('');

    els.columnList.querySelectorAll('[data-column-toggle]').forEach((input) => {
      input.addEventListener('change', function () {
        const key = this.getAttribute('data-column-toggle');
        if (!state.columnMeta[key]) return;
        state.columnMeta[key].enabled = this.checked;
        runConversion();
      });
    });

    els.columnList.querySelectorAll('[data-column-rename]').forEach((input) => {
      input.addEventListener('input', function () {
        const key = this.getAttribute('data-column-rename');
        if (!state.columnMeta[key]) return;
        state.columnMeta[key].label = this.value || key;
        runConversion();
      });
    });
  };

  const updateModeUi = () => {
    const jsonMode = state.mode === 'json-to-csv';
    els.modeJson.classList.toggle('active', jsonMode);
    els.modeCsv.classList.toggle('active', !jsonMode);
    document.querySelectorAll('.jtc-csv-only').forEach((node) => { node.hidden = jsonMode; });
    els.urlBlock.hidden = !jsonMode;
    els.inputTitle.textContent = jsonMode ? 'Input JSON' : 'Input CSV';
    els.outputTitle.textContent = jsonMode ? 'CSV Output' : 'JSON Output';
    els.inputCopy.textContent = jsonMode
      ? 'Paste raw JSON here. Nested objects are flattened into dot-notation columns automatically.'
      : 'Paste CSV here. The parser respects headers, quoted fields, delimiter choices, and type inference.';
    els.outputCopy.textContent = jsonMode
      ? 'Copy the result, preview the first rows, or download a spreadsheet-friendly file.'
      : 'The JSON output updates instantly so you can inspect structure without opening another converter.';
    els.toolbarCopy.textContent = jsonMode
      ? 'Paste JSON on the left and the CSV output updates on the right instantly. Switch to reverse mode any time to parse CSV back into clean JSON.'
      : 'Paste CSV on the left and the JSON output updates on the right instantly. Switch back to JSON mode to flatten API responses into spreadsheet-ready rows.';
    els.loadSample.textContent = jsonMode ? 'Load JSON sample' : 'Load CSV sample';
    els.downloadOutput.textContent = jsonMode ? 'Download .csv' : 'Download .json';
    els.input.placeholder = jsonMode
      ? '[{"id":1,"user":{"name":"Ada","city":"Delhi"}}]'
      : 'id,name,active\\n1,Ada,true\\n2,Mira,false';
    renderColumnPicker();
  };

  const syncNotesPanel = () => {
    const showPreview = state.activeSubtab === 'preview';
    els.tabPreview.classList.toggle('active', showPreview);
    els.tabNotes.classList.toggle('active', !showPreview);
    els.previewWrap.hidden = !showPreview;
    els.notesWrap.hidden = showPreview;
  };

  const buildHelperNotes = (result) => {
    const modeText = state.mode === 'json-to-csv' ? 'JSON to CSV' : 'CSV to JSON';
    const nextAction = state.mode === 'json-to-csv'
      ? 'Review the preview table, trim unwanted columns, then copy or download the CSV.'
      : 'Review the JSON structure, confirm header handling, then copy or download the parsed output.';
    els.helperNotes.innerHTML = [
      `<div class="jtc-note"><strong>Current mode</strong><span>${escapeHtml(modeText)} with ${escapeHtml(getDelimiterLabel())} as the active delimiter.</span></div>`,
      `<div class="jtc-note"><strong>Current footprint</strong><span>${escapeHtml(`${result.rowCount || 0} row(s) and ${result.columnCount || 0} column(s) are present in the converted result.`)}</span></div>`,
      `<div class="jtc-note"><strong>Next best action</strong><span>${escapeHtml(nextAction)}</span></div>`
    ].join('');
  };

  const runConversion = () => {
    const source = els.input.value;
    els.input.classList.remove('jtc-invalid');
    let result;

    try {
      if (!source.trim()) {
        result = {
          output: '',
          previewHeaders: [],
          previewRows: [],
          issues: [],
          notes: [],
          source: 'Waiting for input',
          rowCount: 0,
          columnCount: 0,
          validation: 'Ready'
        };
        if (state.mode === 'json-to-csv') {
          state.currentColumns = [];
          state.columnMeta = {};
        }
      } else if (state.mode === 'json-to-csv') {
        const normalized = normalizeJsonInput(source);
        state.currentColumns = normalized.columns.slice();
        if (!normalized.ok) {
          result = {
            output: '',
            previewHeaders: [],
            previewRows: [],
            issues: normalized.issues,
            notes: [{
              title: 'Fix the JSON first',
              body: 'The CSV output cannot be generated until the JSON parses cleanly. Once it is valid the tool will map keys to columns automatically.'
            }],
            source: normalized.source,
            rowCount: 0,
            columnCount: 0,
            validation: 'JSON invalid'
          };
          els.input.classList.add('jtc-invalid');
        } else {
          result = buildCsvFromJson(normalized);
        }
      } else {
        result = buildJsonFromCsv(source);
        state.currentColumns = [];
      }
    } catch (error) {
      result = {
        output: '',
        previewHeaders: [],
        previewRows: [],
        issues: [{
          type: 'error',
          title: 'Conversion error',
          message: error && error.message ? error.message : 'Something went wrong while converting.'
        }],
        notes: [{
          title: 'Fallback',
          body: 'Try checking the input shape or changing the delimiter before converting again.'
        }],
        source: 'Conversion failed',
        rowCount: 0,
        columnCount: 0,
        validation: 'Error'
      };
    }

    state.currentOutput = result.output || '';
    state.downloadName = state.mode === 'json-to-csv' ? 'converted.csv' : 'converted.json';
    els.output.value = state.currentOutput;
    setStatus(state.currentOutput
      ? `Converted ${result.rowCount || 0} row(s) into ${state.mode === 'json-to-csv' ? 'CSV' : 'JSON'}.`
      : `Ready. Add ${state.mode === 'json-to-csv' ? 'JSON' : 'CSV'} to start converting.`);

    renderIssues(result.issues || []);
    renderNotes(result.notes || []);
    renderPreview(result.previewHeaders || [], result.previewRows || []);
    renderColumnPicker();
    buildHelperNotes(result);

    setStatCard(els.statRows, String(result.rowCount || 0), 'Rows available in the converted dataset');
    setStatCard(els.statColumns, String(result.columnCount || 0), 'Columns in the current output');
    setStatCard(els.statInputSize, formatBytes(els.input.value.length), 'Current input size');
    setStatCard(els.statOutputSize, formatBytes(state.currentOutput.length), 'Current output size');
    setStatCard(els.statSource, result.source || 'Waiting', 'Detected structure or parsing path');
    setStatCard(
      els.statValidation,
      result.validation || 'Ready',
      'Validation status for the current input',
      /invalid|error/i.test(result.validation || '') ? 'is-error' : null
    );

    updateDownloadBlob(state.currentOutput || '');
  };

  const scheduleRun = () => {
    window.clearTimeout(state.inputTimer);
    state.inputTimer = window.setTimeout(runConversion, 120);
  };

  const copyText = async (text, successMessage, emptyMessage) => {
    if (!text) {
      setStatus(emptyMessage);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setStatus(successMessage);
      showToast('Copied', 'success');
    } catch (_) {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      setStatus(successMessage);
    }
  };

  const downloadOutput = () => {
    if (!state.currentOutput || !state.blobUrl) {
      setStatus('Nothing to download yet.');
      return;
    }
    const link = document.createElement('a');
    link.href = state.blobUrl;
    link.download = state.downloadName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setStatus(`Downloaded ${state.downloadName}.`);
  };

  const handleFile = async (file) => {
    if (!file) return;
    const text = await file.text();
    els.input.value = text;
    if (/\.csv$/i.test(file.name)) {
      state.mode = 'csv-to-json';
    } else if (/\.json$/i.test(file.name)) {
      state.mode = 'json-to-csv';
    }
    updateModeUi();
    runConversion();
    setStatus(`Loaded ${file.name}.`);
  };

  const fetchJsonUrl = async () => {
    const url = els.urlInput.value.trim();
    if (!url) {
      setStatus('Add a JSON API URL first.');
      return;
    }
    try {
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Request failed with status ${response.status}.`);
      els.input.value = await response.text();
      runConversion();
      setStatus('Fetched JSON from the provided URL.');
    } catch (_) {
      setStatus('Unable to fetch that URL. It may block browser access or return non-JSON content.');
      showToast('URL fetch failed', 'error');
    }
  };

  const setMode = (mode) => {
    state.mode = mode;
    updateModeUi();
    runConversion();
  };

  const setColumnsEnabled = (value) => {
    Object.keys(state.columnMeta).forEach((key) => {
      state.columnMeta[key].enabled = value;
    });
    runConversion();
  };

  const resetColumnLabels = () => {
    Object.keys(state.columnMeta).forEach((key) => {
      state.columnMeta[key].label = key;
    });
    runConversion();
  };

  const initEvents = () => {
    els.modeJson.addEventListener('click', () => setMode('json-to-csv'));
    els.modeCsv.addEventListener('click', () => setMode('csv-to-json'));
    els.columnsToggle.addEventListener('click', function () {
      state.columnsCollapsed = !state.columnsCollapsed;
      els.workspace.classList.toggle('columns-collapsed', state.columnsCollapsed);
      this.textContent = state.columnsCollapsed ? 'Show columns' : 'Hide columns';
    });
    els.loadSample.addEventListener('click', () => {
      els.input.value = state.mode === 'json-to-csv' ? sampleJson : sampleCsv;
      runConversion();
      setStatus('Sample loaded.');
    });
    els.clear.addEventListener('click', () => {
      els.input.value = '';
      els.output.value = '';
      els.urlInput.value = '';
      els.fileInput.value = '';
      state.currentColumns = [];
      state.columnMeta = {};
      runConversion();
      setStatus('Workspace cleared.');
    });
    els.input.addEventListener('input', scheduleRun);
    els.delimiter.addEventListener('change', runConversion);
    els.excelMode.addEventListener('change', runConversion);
    els.csvHeaders.addEventListener('change', runConversion);
    els.csvTypes.addEventListener('change', runConversion);
    els.copyInput.addEventListener('click', () => copyText(els.input.value, 'Input copied to clipboard.', 'There is no input to copy yet.'));
    els.copyOutput.addEventListener('click', () => copyText(state.currentOutput, 'Output copied to clipboard.', 'There is no converted output yet.'));
    els.downloadOutput.addEventListener('click', downloadOutput);
    els.browseFile.addEventListener('click', () => els.fileInput.click());
    els.fileInput.addEventListener('change', (event) => handleFile(event.target.files && event.target.files[0]));
    ['dragenter', 'dragover'].forEach((eventName) => {
      els.dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        els.dropzone.classList.add('dragging');
      });
    });
    ['dragleave', 'dragend', 'drop'].forEach((eventName) => {
      els.dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        els.dropzone.classList.remove('dragging');
      });
    });
    els.dropzone.addEventListener('drop', (event) => handleFile(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]));
    els.dropzone.addEventListener('click', () => els.fileInput.click());
    els.dropzone.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        els.fileInput.click();
      }
    });
    els.fetchUrl.addEventListener('click', fetchJsonUrl);
    els.urlInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        fetchJsonUrl();
      }
    });
    els.tabPreview.addEventListener('click', () => {
      state.activeSubtab = 'preview';
      syncNotesPanel();
    });
    els.tabNotes.addEventListener('click', () => {
      state.activeSubtab = 'notes';
      syncNotesPanel();
    });
    els.columnsAll.addEventListener('click', () => setColumnsEnabled(true));
    els.columnsNone.addEventListener('click', () => setColumnsEnabled(false));
    els.columnsReset.addEventListener('click', resetColumnLabels);
    window.addEventListener('beforeunload', revokeBlobUrl);
  };

  updateModeUi();
  syncNotesPanel();
  els.input.value = sampleJson;
  initEvents();
  runConversion();
})();
