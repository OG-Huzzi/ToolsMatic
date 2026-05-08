if (typeof pdfjsLib !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
}

(function () {
  const MAX_PDF_SIZE = 524288000;

  function notify(message, type = "warning") {
    if (typeof window.showToast === "function") {
      window.showToast(message, type);
    }
  }

  function isValidPDF(file) {
    return Boolean(
      file &&
        typeof file.type === "string" &&
        file.type === "application/pdf" &&
        typeof file.size === "number" &&
        file.size > 0 &&
        file.size < MAX_PDF_SIZE
    );
  }

  function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        reject(new TypeError("Expected a File or Blob."));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Failed to read file."));
      reader.readAsArrayBuffer(file);
    });
  }

  function validatePDFHeader(arrayBuffer) {
    if (!(arrayBuffer instanceof ArrayBuffer) || arrayBuffer.byteLength < 4) {
      return false;
    }

    const bytes = new Uint8Array(arrayBuffer, 0, 4);
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
  }

  async function collectValidFiles(files, options = {}) {
    const fileArray = Array.from(files || []);
    const validator = typeof options.validator === "function" ? options.validator : isValidPDF;
    const validateHeader = Boolean(options.validateHeader);
    const validFiles = [];

    for (const file of fileArray) {
      let isValid = Boolean(await Promise.resolve(validator(file, options)));

      if (isValid && validateHeader) {
        try {
          const buffer = await readFileAsArrayBuffer(file);
          isValid = validatePDFHeader(buffer);
        } catch (error) {
          isValid = false;
        }
      }

      if (!isValid) {
        if (typeof options.onInvalidFile === "function") {
          options.onInvalidFile(file);
        } else {
          notify(`Skipped unsupported file: ${file.name || "Unnamed file"}.`, "warning");
        }

        continue;
      }

      validFiles.push(file);

      if (options.maxFiles && validFiles.length >= options.maxFiles) {
        break;
      }
    }

    return validFiles;
  }

  function initDropZone(zoneEl, onFilesAdded, options = {}) {
    if (!zoneEl || typeof onFilesAdded !== "function") {
      return () => {};
    }

    const handleDragOver = (event) => {
      event.preventDefault();
      zoneEl.classList.add("dragover");
    };

    const handleDragLeave = (event) => {
      if (zoneEl.contains(event.relatedTarget)) {
        return;
      }

      zoneEl.classList.remove("dragover");
    };

    const handleDrop = async (event) => {
      event.preventDefault();
      zoneEl.classList.remove("dragover");

      const validFiles = await collectValidFiles(event.dataTransfer.files, options);

      if (!validFiles.length) {
        return;
      }

      zoneEl.classList.add("has-files");
      onFilesAdded(validFiles);
    };

    zoneEl.addEventListener("dragover", handleDragOver);
    zoneEl.addEventListener("dragenter", handleDragOver);
    zoneEl.addEventListener("dragleave", handleDragLeave);
    zoneEl.addEventListener("drop", handleDrop);

    if (options.inputEl instanceof HTMLInputElement) {
      zoneEl.addEventListener("click", () => options.inputEl.click());
    }

    return () => {
      zoneEl.removeEventListener("dragover", handleDragOver);
      zoneEl.removeEventListener("dragenter", handleDragOver);
      zoneEl.removeEventListener("dragleave", handleDragLeave);
      zoneEl.removeEventListener("drop", handleDrop);
    };
  }

  function initFileInput(inputEl, onFilesAdded, options = {}) {
    if (!(inputEl instanceof HTMLInputElement) || typeof onFilesAdded !== "function") {
      return () => {};
    }

    const handleChange = async () => {
      const validFiles = await collectValidFiles(inputEl.files, options);

      if (validFiles.length) {
        onFilesAdded(validFiles);
      }

      inputEl.value = "";
    };

    inputEl.addEventListener("change", handleChange);

    return () => {
      inputEl.removeEventListener("change", handleChange);
    };
  }

  function getReorderPayload(listEl) {
    return Array.from(listEl.children)
      .filter((child) => !child.classList.contains("reorder-indicator"))
      .map((element, index) => ({
        element,
        index,
        key: element.dataset.key || element.dataset.id || element.id || String(index),
      }));
  }

  function initDragReorder(listEl, onReorder) {
    if (!listEl || typeof onReorder !== "function") {
      return () => {};
    }

    let draggedItem = null;
    let touchItem = null;

    const indicator = document.createElement("div");
    indicator.className = "reorder-indicator";
    indicator.style.height = "3px";
    indicator.style.borderRadius = "999px";
    indicator.style.margin = "4px 0";
    indicator.style.background = "var(--accent, #F59E0B)";

    const setItemsDraggable = () => {
      Array.from(listEl.children).forEach((item) => {
        if (item === indicator) {
          return;
        }

        item.setAttribute("draggable", "true");
      });
    };

    const getItems = () =>
      Array.from(listEl.children).filter((item) => item !== indicator && item.nodeType === Node.ELEMENT_NODE);

    const getDirectChild = (target) => {
      let current = target instanceof Element ? target : null;

      while (current && current.parentElement !== listEl) {
        current = current.parentElement;
      }

      return current && current.parentElement === listEl ? current : null;
    };

    const getInsertionPoint = (clientY) => {
      const items = getItems().filter((item) => item !== draggedItem && item !== touchItem);

      return items.reduce(
        (closest, item) => {
          const box = item.getBoundingClientRect();
          const offset = clientY - box.top - box.height / 2;

          if (offset < 0 && offset > closest.offset) {
            return { offset, element: item };
          }

          return closest;
        },
        { offset: Number.NEGATIVE_INFINITY, element: null }
      ).element;
    };

    const emitReorder = () => {
      onReorder(getReorderPayload(listEl));
    };

    const handleDragStart = (event) => {
      const item = getDirectChild(event.target);

      if (!item || item === indicator) {
        return;
      }

      draggedItem = item;
      item.classList.add("dragging");

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", item.dataset.key || item.id || "");
      }
    };

    const handleDragOver = (event) => {
      if (!draggedItem) {
        return;
      }

      event.preventDefault();
      const nextItem = getInsertionPoint(event.clientY);

      if (nextItem) {
        listEl.insertBefore(indicator, nextItem);
      } else {
        listEl.appendChild(indicator);
      }
    };

    const finalizeDrag = () => {
      if (!draggedItem) {
        indicator.remove();
        return;
      }

      if (indicator.parentNode === listEl) {
        listEl.insertBefore(draggedItem, indicator);
      }

      draggedItem.classList.remove("dragging");
      draggedItem = null;
      indicator.remove();
      emitReorder();
    };

    const handleTouchStart = (event) => {
      const item = getDirectChild(event.target);

      if (!item || item === indicator) {
        return;
      }

      touchItem = item;
      touchItem.classList.add("dragging");
    };

    const handleTouchMove = (event) => {
      if (!touchItem) {
        return;
      }

      const touch = event.touches[0];

      if (!touch) {
        return;
      }

      event.preventDefault();

      const nextItem = getInsertionPoint(touch.clientY);

      if (nextItem) {
        listEl.insertBefore(indicator, nextItem);
      } else {
        listEl.appendChild(indicator);
      }
    };

    const handleTouchEnd = () => {
      if (!touchItem) {
        indicator.remove();
        return;
      }

      if (indicator.parentNode === listEl) {
        listEl.insertBefore(touchItem, indicator);
      }

      touchItem.classList.remove("dragging");
      touchItem = null;
      indicator.remove();
      emitReorder();
    };

    const observer = new MutationObserver(setItemsDraggable);
    observer.observe(listEl, { childList: true });
    setItemsDraggable();

    const handleDrop = (event) => {
      event.preventDefault();
      finalizeDrag();
    };

    listEl.addEventListener("dragstart", handleDragStart);
    listEl.addEventListener("dragover", handleDragOver);
    listEl.addEventListener("drop", handleDrop);
    listEl.addEventListener("dragend", finalizeDrag);
    listEl.addEventListener("touchstart", handleTouchStart, { passive: true });
    listEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    listEl.addEventListener("touchend", handleTouchEnd);
    listEl.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      observer.disconnect();
      indicator.remove();
      listEl.removeEventListener("dragstart", handleDragStart);
      listEl.removeEventListener("dragover", handleDragOver);
      listEl.removeEventListener("drop", handleDrop);
      listEl.removeEventListener("dragend", finalizeDrag);
      listEl.removeEventListener("touchstart", handleTouchStart);
      listEl.removeEventListener("touchmove", handleTouchMove);
      listEl.removeEventListener("touchend", handleTouchEnd);
      listEl.removeEventListener("touchcancel", handleTouchEnd);
    };
  }

  async function renderPDFThumbnail(arrayBuffer, canvasEl, pageNum = 1) {
    if (!(canvasEl instanceof HTMLCanvasElement)) {
      return false;
    }

    const context = canvasEl.getContext("2d");

    const drawPlaceholder = (label) => {
      if (!context) {
        return false;
      }

      canvasEl.width = 180;
      canvasEl.height = 240;
      context.fillStyle = "#111111";
      context.fillRect(0, 0, canvasEl.width, canvasEl.height);
      context.strokeStyle = "#2A2A2A";
      context.strokeRect(10, 10, canvasEl.width - 20, canvasEl.height - 20);
      context.fillStyle = "#A1A1AA";
      context.font = '600 14px "Inter", sans-serif';
      context.textAlign = "center";
      context.fillText(label, canvasEl.width / 2, canvasEl.height / 2);
      return false;
    };

    if (typeof pdfjsLib === "undefined" || !(arrayBuffer instanceof ArrayBuffer)) {
      return drawPlaceholder("Preview unavailable");
    }

    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.3 });

      canvasEl.width = Math.max(1, Math.floor(viewport.width));
      canvasEl.height = Math.max(1, Math.floor(viewport.height));

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      if (typeof pdf.destroy === "function") {
        pdf.destroy();
      }

      return true;
    } catch (error) {
      return drawPlaceholder("Preview failed");
    }
  }

  function ensureProgressStructure(wrapEl) {
    if (!wrapEl) {
      return null;
    }

    let label = wrapEl.querySelector(".progress-label");
    let track = wrapEl.querySelector(".progress-track");
    let bar = wrapEl.querySelector(".progress-bar");

    if (!label) {
      label = document.createElement("div");
      label.className = "progress-label";
      label.textContent = "Preparing...";
      wrapEl.appendChild(label);
    }

    if (!track) {
      track = document.createElement("div");
      track.className = "progress-track";
      wrapEl.appendChild(track);
    }

    if (!bar) {
      bar = document.createElement("div");
      bar.className = "progress-bar";
      track.appendChild(bar);
    }

    return { label, bar };
  }

  function showProgress(wrapEl) {
    const structure = ensureProgressStructure(wrapEl);

    if (!structure) {
      return;
    }

    wrapEl.classList.add("is-visible");
  }

  function updateProgress(wrapEl, percent, label) {
    const structure = ensureProgressStructure(wrapEl);

    if (!structure) {
      return;
    }

    const clampedPercent = Math.max(0, Math.min(100, Number(percent) || 0));
    showProgress(wrapEl);
    structure.bar.style.width = `${clampedPercent}%`;
    structure.bar.setAttribute("aria-valuenow", String(clampedPercent));

    if (typeof label === "string" && label.trim()) {
      structure.label.textContent = label.trim();
    }
  }

  function hideProgress(wrapEl) {
    const structure = ensureProgressStructure(wrapEl);

    if (!structure) {
      return;
    }

    structure.bar.style.width = "0%";
    wrapEl.classList.remove("is-visible");
  }

  function formatFileSize(bytes) {
    const size = Number(bytes);

    if (!Number.isFinite(size) || size < 0) {
      return "0 B";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${Math.round(size / 1024)} KB`;
    }

    if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  function cleanupBlobURL(url) {
    if (typeof url === "string" && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }

  function cleanupArrayBuffers(buffers) {
    if (Array.isArray(buffers)) {
      for (let index = 0; index < buffers.length; index += 1) {
        buffers[index] = null;
      }
      return;
    }

    if (buffers && typeof buffers === "object") {
      Object.keys(buffers).forEach((key) => {
        buffers[key] = null;
      });
    }
  }

  window.isValidPDF = isValidPDF;
  window.readFileAsArrayBuffer = readFileAsArrayBuffer;
  window.validatePDFHeader = validatePDFHeader;
  window.initDropZone = initDropZone;
  window.initFileInput = initFileInput;
  window.initDragReorder = initDragReorder;
  window.renderPDFThumbnail = renderPDFThumbnail;
  window.showProgress = showProgress;
  window.updateProgress = updateProgress;
  window.hideProgress = hideProgress;
  window.formatFileSize = formatFileSize;
  window.cleanupBlobURL = cleanupBlobURL;
  window.cleanupArrayBuffers = cleanupArrayBuffers;
})();
