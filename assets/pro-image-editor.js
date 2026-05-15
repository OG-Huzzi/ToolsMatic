(() => {
  const $ = (selector) => document.querySelector(selector);
  const state = {
    editor: null,
    fileName: 'toolsmatic-image',
    originalBytes: 0,
    loaded: false,
    lastAction: 'Ready'
  };

  const starterSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760" viewBox="0 0 1280 760">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#07111f"/>
          <stop offset=".55" stop-color="#163245"/>
          <stop offset="1" stop-color="#0f766e"/>
        </linearGradient>
        <radialGradient id="orb" cx=".5" cy=".5" r=".5">
          <stop stop-color="#67e8f9" stop-opacity=".8"/>
          <stop offset="1" stop-color="#67e8f9" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1280" height="760" rx="44" fill="url(#g)"/>
      <circle cx="1030" cy="160" r="170" fill="url(#orb)" opacity=".55"/>
      <circle cx="220" cy="590" r="190" fill="url(#orb)" opacity=".28"/>
      <text x="92" y="355" fill="#f8fbff" font-family="Arial, sans-serif" font-size="80" font-weight="800">ToolsMatic</text>
      <text x="96" y="430" fill="#d5f7ff" font-family="Arial, sans-serif" font-size="34">Drop an image above to start editing privately.</text>
    </svg>
  `);

  const starterUrl = `data:image/svg+xml;charset=utf-8,${starterSvg}`;

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit += 1;
    }
    return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
  };

  const dataUrlBytes = (dataUrl) => {
    const base64 = String(dataUrl || '').split(',')[1] || '';
    return Math.max(0, Math.round((base64.length * 3) / 4));
  };

  const setText = (id, value) => {
    const node = $(id);
    if (node) node.textContent = value;
  };

  const setStatus = (message) => {
    state.lastAction = message;
    setText('#pro-editor-status', message);
  };

  const notify = (message, variant = 'info') => {
    if (window.toolsMatic?.showToast) {
      window.toolsMatic.showToast(message, variant);
    } else {
      setStatus(message);
    }
  };

  const updateMetrics = () => {
    if (!state.editor) return;
    let size = { width: 0, height: 0 };
    try {
      size = state.editor.getCanvasSize();
    } catch (_) {
      // The editor can briefly report no canvas while loading.
    }

    let outputBytes = 0;
    try {
      outputBytes = dataUrlBytes(state.editor.toDataURL({ format: 'png', quality: 0.92 }));
    } catch (_) {
      outputBytes = 0;
    }

    setText('#pro-metric-original', formatBytes(state.originalBytes));
    setText('#pro-metric-output', outputBytes ? formatBytes(outputBytes) : 'Preview');
    setText('#pro-metric-size', `${Math.round(size.width || 0)} x ${Math.round(size.height || 0)}`);
    setText('#pro-metric-action', state.lastAction);
  };

  const resizeEditor = () => {
    if (!state.editor?.ui) return;
    try {
      state.editor.ui.resizeEditor();
    } catch (_) {
      // Resize can fail before the TUI UI is fully mounted.
    }
  };

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      notify('Choose a valid JPG, PNG, WebP, GIF still, or SVG image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        state.fileName = file.name.replace(/\.[^.]+$/, '') || 'toolsmatic-image';
        state.originalBytes = file.size || 0;
        setStatus('Loading image...');
        await state.editor.loadImageFromURL(String(reader.result), file.name);
        state.editor.clearUndoStack();
        state.loaded = true;
        resizeEditor();
        setStatus('Image loaded');
        updateMetrics();
        notify('Image loaded locally. Nothing was uploaded.', 'success');
      } catch (error) {
        console.error(error);
        notify('The image could not be loaded. Try a smaller image or another format.', 'error');
      }
    };
    reader.readAsDataURL(file);
  };

  const downloadDataUrl = (dataUrl, filename) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportImage = () => {
    if (!state.editor) return;
    const formatSelect = $('#pro-export-format');
    const qualityInput = $('#pro-export-quality');
    const format = formatSelect?.value || 'png';
    const quality = Math.max(0.1, Math.min(1, Number(qualityInput?.value || 92) / 100));
    const mime = format === 'jpg' ? 'jpeg' : format;
    const dataUrl = state.editor.toDataURL({ format: mime, quality });
    downloadDataUrl(dataUrl, `${state.fileName}-edited.${format}`);
    setStatus(`Exported ${format.toUpperCase()}`);
    updateMetrics();
  };

  const runAction = async (action) => {
    if (!state.editor) return;
    try {
      switch (action) {
        case 'undo':
          await state.editor.undo(1);
          setStatus('Undo complete');
          break;
        case 'redo':
          await state.editor.redo(1);
          setStatus('Redo complete');
          break;
        case 'rotate-left':
          await state.editor.rotate(-90);
          setStatus('Rotated left');
          break;
        case 'rotate-right':
          await state.editor.rotate(90);
          setStatus('Rotated right');
          break;
        case 'flip-x':
          await state.editor.flipX();
          setStatus('Flipped horizontally');
          break;
        case 'flip-y':
          await state.editor.flipY();
          setStatus('Flipped vertically');
          break;
        case 'add-text':
          await state.editor.addText('Edit me', {
            styles: {
              fill: '#ffffff',
              fontSize: 64,
              fontWeight: 'bold'
            }
          });
          setStatus('Text added');
          break;
        case 'draw':
          state.editor.startDrawingMode('FREE_DRAWING', { width: 8, color: '#67e8f9' });
          setStatus('Draw mode on');
          break;
        case 'stop-draw':
          state.editor.stopDrawingMode();
          setStatus('Draw mode off');
          break;
        case 'shape':
          await state.editor.addShape('rect', {
            fill: 'transparent',
            stroke: '#67e8f9',
            strokeWidth: 8,
            width: 260,
            height: 160
          });
          setStatus('Shape added');
          break;
        case 'grayscale':
          await state.editor.applyFilter('Grayscale');
          setStatus('Grayscale filter applied');
          break;
        case 'sepia':
          await state.editor.applyFilter('Sepia');
          setStatus('Sepia filter applied');
          break;
        case 'sharpen':
          await state.editor.applyFilter('Sharpen');
          setStatus('Sharpen filter applied');
          break;
        case 'reset':
          await state.editor.loadImageFromURL(starterUrl, 'ToolsMatic starter');
          state.fileName = 'toolsmatic-image';
          state.originalBytes = 0;
          state.editor.clearUndoStack();
          setStatus('Canvas reset');
          break;
        default:
          return;
      }
      resizeEditor();
      updateMetrics();
    } catch (error) {
      console.error(error);
      notify('That action could not be applied to the current image.', 'error');
    }
  };

  const bindDragDrop = () => {
    const drop = $('#pro-editor-drop');
    const input = $('#pro-editor-file');
    if (!drop || !input) return;

    input.addEventListener('change', () => loadFile(input.files?.[0]));

    ['dragenter', 'dragover'].forEach((name) => {
      drop.addEventListener(name, (event) => {
        event.preventDefault();
        drop.classList.add('is-dragging');
      });
    });

    ['dragleave', 'drop'].forEach((name) => {
      drop.addEventListener(name, (event) => {
        event.preventDefault();
        drop.classList.remove('is-dragging');
      });
    });

    drop.addEventListener('drop', (event) => {
      loadFile(event.dataTransfer?.files?.[0]);
    });
  };

  const init = async () => {
    if (!window.tui?.ImageEditor || !$('#pro-image-editor')) {
      setStatus('Editor library failed to load');
      return;
    }

    state.editor = new window.tui.ImageEditor('#pro-image-editor', {
      includeUI: {
        loadImage: {
          path: starterUrl,
          name: 'ToolsMatic starter'
        },
        menu: ['crop', 'resize', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'filter'],
        initMenu: 'filter',
        menuBarPosition: window.innerWidth < 760 ? 'bottom' : 'bottom'
      },
      cssMaxWidth: 1100,
      cssMaxHeight: 620,
      usageStatistics: false
    });

    bindDragDrop();
    document.querySelectorAll('[data-pro-action]').forEach((button) => {
      button.addEventListener('click', () => runAction(button.dataset.proAction));
    });
    $('#pro-export')?.addEventListener('click', exportImage);
    window.addEventListener('resize', resizeEditor, { passive: true });
    setTimeout(() => {
      resizeEditor();
      updateMetrics();
    }, 250);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
