(() => {




  const ensureToastHost = () => {
    let host = document.querySelector('.toast-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toast-host';
      document.body.appendChild(host);
    }
    return host;
  };

  const showToast = (message, variant = 'info') => {
    const host = ensureToastHost();
    const toast = document.createElement('div');
    toast.className = `toast toast-${variant}`;
    toast.textContent = message;
    host.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 250);
    }, 2200);
  };

  const bindKeyboard = () => {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        const primary = document.querySelector('[data-primary]');
        if (primary) { e.preventDefault(); primary.click(); }
      }
      if (e.key === 'Escape') {
        if (document.body.classList.contains('tool-finder-open')) return;
        const clearBtn = document.querySelector('[data-clear]');
        if (clearBtn) { e.preventDefault(); clearBtn.click(); }
      }
    });
  };

  const initThemeToggle = () => {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;
    const sunIcon = '\u2600\uFE0F';
    const moonIcon = '\u{1F319}';
    const isLight = localStorage.getItem('mt-theme') === 'light';
    if (isLight) {
      document.documentElement.classList.add('light-mode');
      toggleBtn.textContent = moonIcon;
    } else {
      toggleBtn.textContent = sunIcon;
    }
    toggleBtn.addEventListener('click', () => {
      const isLightMode = document.documentElement.classList.toggle('light-mode');
      localStorage.setItem('mt-theme', isLightMode ? 'light' : 'dark');
      toggleBtn.textContent = isLightMode ? moonIcon : sunIcon;
      if (window.toolsMatic) window.toolsMatic.showToast(isLightMode ? 'Light mode on' : 'Dark mode on', 'info');
    });
  };

  const initResponsiveNav = () => {
    const nav = document.querySelector('header .nav');
    const navLinks = nav?.querySelector('.nav-links');
    if (!nav || !navLinks) return;

    nav.classList.add('has-mobile-menu');

    if (!navLinks.id) {
      navLinks.id = 'site-navigation';
    }

    let toggleBtn = nav.querySelector('.nav-toggle');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'nav-toggle';
      toggleBtn.setAttribute('aria-controls', navLinks.id);
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open navigation menu');
      toggleBtn.innerHTML = '<span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-text">Menu</span>';

      const brand = nav.querySelector('.brand');
      if (brand) {
        brand.insertAdjacentElement('afterend', toggleBtn);
      } else {
        nav.prepend(toggleBtn);
      }
    }

    const closeMenu = () => {
      navLinks.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Open navigation menu');
    };

    const openMenu = () => {
      navLinks.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      toggleBtn.setAttribute('aria-label', 'Close navigation menu');
    };

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  };

  const GA_MEASUREMENT_ID = 'G-9VEPDS13HT';
  const SCROLL_TRACK_THRESHOLD = 0.05;
  const SCROLL_TRACK_PERCENT_LABEL = '5_percent';

  const analyticsState = {
    lastPageKey: `${window.location.pathname}${window.location.search}${window.location.hash}`,
    scroll50Sent: false,
    engagementSent: false,
    pageStartTs: Date.now(),
    interactedFields: new WeakSet()
  };

  const getToolNameForTracking = () => {
    const pageH1 = document.querySelector('main h1')?.textContent?.trim();
    if (pageH1) return pageH1;
    const slug = (window.location.pathname.split('/').pop() || 'unknown').replace(/\.html$/i, '');
    return slug.replace(/[-_]+/g, ' ').trim() || 'unknown';
  };

  const logTracking = (eventName, payload) => {
    try {
      console.log('[GA4]', eventName, payload || {});
    } catch (_) {
      // no-op
    }
  };

  const trackEvent = (eventName, payload = {}) => {
    logTracking(eventName, payload);
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', eventName, payload);
  };

  const trackPageView = (source = 'navigation') => {
    const payload = {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      source
    };
    trackEvent('page_view', payload);
  };

  const initAnalyticsTracking = () => {
    const gaScripts = document.querySelectorAll(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`);
    if (gaScripts.length > 1) {
      console.warn('[GA4] Duplicate gtag.js scripts detected on this page:', gaScripts.length);
    }

    if (gaScripts.length === 0) {
      console.warn('[GA4] Missing expected gtag.js script for measurement ID:', GA_MEASUREMENT_ID);
    }

    if (typeof window.gtag !== 'function') {
      console.warn('[GA4] gtag is not available on this page.');
    }

    const routeChanged = (source) => {
      const currentKey = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (currentKey === analyticsState.lastPageKey) return;
      analyticsState.lastPageKey = currentKey;
      analyticsState.scroll50Sent = false;
      analyticsState.engagementSent = false;
      analyticsState.pageStartTs = Date.now();
      trackPageView(source);
    };

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function patchedPushState(...args) {
      const result = originalPushState.apply(this, args);
      window.dispatchEvent(new Event('toolsmatic:route-change'));
      return result;
    };

    history.replaceState = function patchedReplaceState(...args) {
      const result = originalReplaceState.apply(this, args);
      window.dispatchEvent(new Event('toolsmatic:route-change'));
      return result;
    };

    window.addEventListener('popstate', () => routeChanged('popstate'));
    window.addEventListener('hashchange', () => routeChanged('hashchange'));
    window.addEventListener('toolsmatic:route-change', () => routeChanged('history'));

    const isToolActionButton = (button) => {
      if (!button) return false;
      if (button.matches('[data-primary]')) return true;
      const id = (button.id || '').toLowerCase();
      const text = (button.innerText || button.textContent || '').trim().toLowerCase();
      if (id === 'theme-toggle' || button.classList.contains('nav-toggle')) return false;
      if (/\b(generate|convert|format|validate|test|check|calculate|compress|minify|encode|decode|create|analyze|inspect|run|submit)\b/.test(text)) {
        return true;
      }
      if (/^(btn-|generate|convert|format|validate|test|check|calculate|compress|minify|encode|decode|create|analyze|inspect|run)/.test(id)) {
        return true;
      }
      return false;
    };

    document.addEventListener('click', (event) => {
      const eventTarget = event.target instanceof Element ? event.target : null;
      const button = eventTarget?.closest('button');
      if (!button) return;

      const label = (button.innerText || button.textContent || button.id || 'button').trim().slice(0, 120);
      trackEvent('button_click', {
        event_label: label,
        page_path: window.location.pathname
      });

      if (isToolActionButton(button)) {
        trackEvent('tool_used', {
          event_label: getToolNameForTracking(),
          action_label: label,
          page_path: window.location.pathname
        });
      }
    });

    const onInputUsage = (event) => {
      const eventTarget = event.target instanceof Element ? event.target : null;
      const field = eventTarget?.closest('input, textarea, select');
      if (!field || analyticsState.interactedFields.has(field)) return;
      analyticsState.interactedFields.add(field);

      trackEvent('input_used', {
        input_type: field.type || field.tagName.toLowerCase(),
        input_name: field.name || field.id || 'unnamed',
        page_path: window.location.pathname
      });
    };

    document.addEventListener('input', onInputUsage, true);
    document.addEventListener('change', onInputUsage, true);

    const checkScrollDepth = () => {
      if (analyticsState.scroll50Sent) return;
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const ratio = window.scrollY / scrollHeight;
      if (ratio >= SCROLL_TRACK_THRESHOLD) {
        analyticsState.scroll50Sent = true;
        trackEvent('scroll_5_percent', {
          event_label: SCROLL_TRACK_PERCENT_LABEL,
          scroll_threshold_percent: 5,
          page_path: window.location.pathname
        });
      }
    };

    window.addEventListener('scroll', checkScrollDepth, { passive: true });

    let lastActivityTs = Date.now();
    const markActivity = () => {
      lastActivityTs = Date.now();
    };

    ['click', 'keydown', 'scroll', 'touchstart'].forEach((name) => {
      window.addEventListener(name, markActivity, { passive: true });
    });

    const sendEngagementFallback = (source) => {
      if (analyticsState.engagementSent) return;
      const elapsed = Date.now() - analyticsState.pageStartTs;
      if (elapsed < 10000) return;
      analyticsState.engagementSent = true;
      trackEvent('user_engagement', {
        engagement_time_msec: elapsed,
        event_label: source,
        page_path: window.location.pathname
      });
    };

    window.setInterval(() => {
      const isActive = Date.now() - lastActivityTs < 30000;
      if (isActive) sendEngagementFallback('activity_timer');
    }, 15000);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        sendEngagementFallback('visibility_hidden');
      }
    });
  };

  const isToolPage = () => /^\/tools\/.+\.html$/i.test(window.location.pathname || '');
  const isHomePage = () => {
    const path = (window.location.pathname || '').toLowerCase();
    return path === '/' || path === '/index.html' || path.endsWith('/index.html');
  };
  const prefersReducedMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasCoarsePointer = () => window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const slugify = (value) => (value || 'section')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'section';

  const ensureNodeId = (node, fallback, index = 0) => {
    if (!node) return '';
    if (!node.id) {
      node.id = `${fallback}-${index + 1}-${slugify(node.textContent || fallback)}`;
    }
    return node.id;
  };

  const decorateSiteShell = () => {
    const body = document.body;
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');

    body.classList.add('site-shell');
    if (isHomePage()) {
      body.classList.add('page-home');
    } else if (isToolPage()) {
      body.classList.add('page-tool');
    } else {
      body.classList.add('page-standard');
    }

    if (header) header.classList.add('site-header');
    if (main) main.classList.add('site-main');
    if (footer) footer.classList.add('site-footer');

    if (!prefersReducedMotion() && !document.querySelector('.site-orb')) {
      const fragment = document.createDocumentFragment();
      ['a', 'b', 'c'].forEach((suffix) => {
        const orb = document.createElement('div');
        orb.className = `site-orb site-orb-${suffix}`;
        fragment.appendChild(orb);
      });
      body.prepend(fragment);
    }
  };

  const decorateAdSlots = () => {
    const candidates = new Set();

    document.querySelectorAll('main div, main section, aside div').forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      if (node.classList.contains('ad-slot')) return;
      if (node.querySelector('.ad-slot-label')) return;
      if (node.closest('.suggestions-section')) return;

      const directScripts = Array.from(node.children).filter((child) => child.tagName === 'SCRIPT');
      const hasAdScript = directScripts.some((script) => {
        const scriptText = `${script.src || ''} ${script.textContent || ''}`;
        return /atOptions|fixesconsessionconsession/i.test(scriptText);
      });
      const hasIframe = !!node.querySelector('iframe');
      if (!hasAdScript && !hasIframe) return;

      const compactText = (node.textContent || '').replace(/\s+/g, ' ').trim();
      if (compactText.length > 120 && !hasIframe) return;

      candidates.add(node);
    });

    candidates.forEach((node) => {
      node.classList.add('ad-slot');
      if (node.closest('.hero')) {
        node.classList.add('ad-slot-inline');
      }
    });
  };

  const initResponsiveAds = () => {
    const syncSlot = (slot) => {
      if (!(slot instanceof HTMLElement)) return;

      const frame = slot.querySelector('iframe');
      if (!(frame instanceof HTMLIFrameElement)) return;

      let wrapper = slot.querySelector('.ad-slot-frame');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'ad-slot-frame';
        frame.insertAdjacentElement('beforebegin', wrapper);
        wrapper.appendChild(frame);
      } else if (!wrapper.contains(frame)) {
        wrapper.appendChild(frame);
      }

      const baseWidth = Number(frame.getAttribute('width')) || frame.offsetWidth || 728;
      const baseHeight = Number(frame.getAttribute('height')) || frame.offsetHeight || 90;
      const mobileViewport = window.innerWidth <= 768;

      slot.style.setProperty('--ad-base-width', `${baseWidth}px`);
      slot.style.setProperty('--ad-base-height', `${baseHeight}px`);

      if (!mobileViewport) {
        slot.style.setProperty('--ad-scale', '1');
        slot.style.setProperty('--ad-render-height', `${baseHeight}px`);
        return;
      }

      const slotPadding = 24;
      const availableWidth = Math.max(240, slot.clientWidth - slotPadding);
      const scale = Math.min(1, availableWidth / baseWidth);
      const renderHeight = Math.max(56, Math.round(baseHeight * scale));

      slot.style.setProperty('--ad-scale', scale.toFixed(4));
      slot.style.setProperty('--ad-render-height', `${renderHeight}px`);
    };

    document.querySelectorAll('.ad-slot-primary').forEach((slot) => {
      if (!(slot instanceof HTMLElement)) return;
      if (slot.dataset.adResponsiveBound === 'true') {
        syncSlot(slot);
        return;
      }

      slot.dataset.adResponsiveBound = 'true';
      syncSlot(slot);

      const observer = new MutationObserver(() => syncSlot(slot));
      observer.observe(slot, { childList: true, subtree: true });
      window.addEventListener('resize', () => syncSlot(slot), { passive: true });
    });
  };

  const initScrollReveal = () => {
    const targets = [...new Set([
      ...document.querySelectorAll('.home-intro, .page-intro, .hero, .home-toolbar, .tool-stage, .section, .tool-shell, .card, .ad-slot, .rail-card, .about-section, .team-section, .value-card')
    ])];

    targets.forEach((target) => target.classList.add('scroll-reveal'));

    const disableRevealAnimation = prefersReducedMotion()
      || hasCoarsePointer()
      || window.innerWidth <= 768
      || !('IntersectionObserver' in window);

    if (disableRevealAnimation) {
      targets.forEach((target) => target.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });

    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        target.classList.add('is-visible');
      }
      observer.observe(target);
    });
  };

  const bindTilt = (element, intensity = 7) => {
    if (!element || element.dataset.tiltBound === 'true') return;
    element.dataset.tiltBound = 'true';

    const reset = () => {
      element.style.removeProperty('--tilt-x');
      element.style.removeProperty('--tilt-y');
      element.style.removeProperty('--glow-x');
      element.style.removeProperty('--glow-y');
    };

    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * intensity;
      const rotateY = (x - 0.5) * intensity;

      element.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
      element.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
      element.style.setProperty('--glow-x', `${(x * 100).toFixed(2)}%`);
      element.style.setProperty('--glow-y', `${(y * 100).toFixed(2)}%`);
    });

    element.addEventListener('pointerleave', reset);
    element.addEventListener('pointercancel', reset);
  };

  const initInteractiveMotion = () => {
    if (prefersReducedMotion() || hasCoarsePointer()) return;

    document.querySelectorAll('.page-home .card, .page-home .hero, .page-home .home-toolbar, .page-tool .tool-stage, .page-tool .rail-card, .page-standard .page-intro')
      .forEach((element) => bindTilt(element, element.classList.contains('hero') ? 4 : 7));
  };

  const TOOL_CATALOG = [
    { url: '/tools/word-counter.html', title: 'Word Counter', description: 'Count words and characters in real time.', category: 'Writing' },
    { url: '/tools/character-counter.html', title: 'Character Counter', description: 'Track limits, dense sections, and live writing metrics instantly.', category: 'Writing' },
    { url: '/tools/password-generator.html', title: 'Password Generator', description: 'Create strong, customizable passwords instantly.', category: 'Developer' },
    { url: '/tools/quote-generator.html', title: 'Quote Generator', description: 'Surface a fresh, motivating quote on demand.', category: 'Writing' },
    { url: '/tools/typing-speed-test.html', title: 'Typing Speed Test', description: 'Measure WPM, accuracy, consistency, and weak keys in one clean screen.', category: 'Writing' },
    { url: '/tools/ascii-art-generator.html', title: 'ASCII Art Generator', description: 'Turn text into ASCII banners with nine fonts.', category: 'Writing' },
    { url: '/tools/case-converter.html', title: 'Case Converter', description: 'Flip text between lower, upper, title, and sentence case.', category: 'Writing' },
    { url: '/tools/gradient-generator.html', title: 'Gradient Generator', description: 'Blend colors and angles to export CSS gradients.', category: 'Design' },
    { url: '/tools/contrast-checker.html', title: 'Contrast Checker', description: 'Test WCAG ratios, generate accessible pairs, copy CSS tokens.', category: 'Design' },
    { url: '/tools/json-formatter.html', title: 'JSON Formatter', description: 'Clean and indent messy JSON for quick reviews.', category: 'Developer' },
    { url: '/tools/hash-generator.html', title: 'Hash Generator', description: 'Generate, verify, compare, and batch-hash digests in one place.', category: 'Developer' },
    { url: '/tools/base64-encoder.html', title: 'Base64 Encoder', description: 'Encode strings without leaving your browser.', category: 'Developer' },
    { url: '/tools/number-converter.html', title: 'Number Converter', description: 'Convert decimal, binary, hex, and octal values instantly.', category: 'Developer' },
    { url: '/tools/image-compressor.html', title: 'Image Compressor', description: 'Shrink image weight while keeping clarity.', category: 'Design' },
    { url: '/tools/qr-code-maker.html', title: 'QR Code Maker', description: 'Create scannable QR codes for links and text.', category: 'Design' },
    { url: '/tools/jwt-inspector.html', title: 'JWT Inspector', description: 'Decode JWTs locally, inspect claims, and flag expirations.', category: 'Developer' },
    { url: '/tools/markdown-previewer.html', title: 'Markdown Previewer', description: 'Preview Markdown without installing anything.', category: 'Writing' },
    { url: '/tools/regex-tester.html', title: 'Regex Tester', description: 'Test patterns against sample data on the fly.', category: 'Developer' },
    { url: '/tools/uuid-maker.html', title: 'UUID Maker', description: 'Generate collision-resistant identifiers instantly.', category: 'Developer' },
    { url: '/tools/url-encoder.html', title: 'URL Encoder', description: 'Encode and decode URLs safely.', category: 'Developer' },
    { url: '/tools/color-picker.html', title: 'Color Picker', description: 'Grab hex and RGB values from a simple picker.', category: 'Design' },
    { url: '/tools/unit-converter.html', title: 'Unit Converter', description: 'Convert length, weight, and temperature quickly.', category: 'Everyday' },
    { url: '/tools/timezone-converter.html', title: 'Timezone Converter', description: 'Compare times across cities with zero setup.', category: 'Everyday' },
    { url: '/tools/pomodoro-timer.html', title: 'Pomodoro Timer', description: 'Focus with a calm timer, tasks, stats, and ambient audio.', category: 'Everyday' },
    { url: '/tools/stopwatch-timer.html', title: 'Stopwatch & Timer', description: 'Track laps, countdowns, and up to four named timers in one place.', category: 'Everyday' },
    { url: '/tools/team-balancer.html', title: 'Team Balancer', description: 'Split players into fair teams by skill with snake draft balancing, drag-and-drop edits, and export options.', category: 'Everyday' },
    { url: '/tools/text-diff-checker.html', title: 'Text Diff Checker', description: 'Spot differences between two text blocks.', category: 'Writing' },
    { url: '/tools/lorem-ipsum-generator.html', title: 'Lorem Ipsum Generator', description: 'Create filler copy for mockups.', category: 'Writing' },
    { url: '/tools/reaction-time-test.html', title: 'Reaction Time Test', description: 'Benchmark reflexes with 5 rounds, false-start detection, and shareable results.', category: 'Everyday' },
    { url: '/tools/csv-to-json.html', title: 'CSV to JSON', description: 'Turn CSV rows into JSON objects locally.', category: 'Data' },
    { url: '/tools/json-to-csv.html', title: 'JSON to CSV', description: 'Flatten nested JSON into clean CSV, or reverse it back instantly.', category: 'Data' },
    { url: '/tools/csv-inspector.html', title: 'CSV Inspector', description: 'Validate CSV shape, preview rows, and export JSON.', category: 'Data' },
    { url: '/tools/html-minifier.html', title: 'HTML Minifier', description: 'Minify HTML before shipping.', category: 'Developer' },
    { url: '/tools/css-minifier.html', title: 'CSS Minifier', description: 'Minify, format, validate, and inspect CSS in one place.', category: 'Developer' },
    { url: '/tools/slug-generator.html', title: 'Slug Generator', description: 'Build cleaner SEO URLs with bulk mode, path previews, and redirect export.', category: 'Developer' },
    { url: '/tools/meta-tag-generator.html', title: 'Meta Tag Generator', description: 'Create search snippets, social cards, robots tags, and JSON-LD faster.', category: 'Developer' },
    { url: '/tools/robots-txt-generator.html', title: 'Robots.txt Generator', description: 'Create and test crawler rules with presets, imports, and live path checks.', category: 'Developer' },
    { url: '/tools/sitemap-generator.html', title: 'Sitemap Generator', description: 'Generate XML and HTML sitemaps with audits and robots.txt helper output.', category: 'Developer' },
    { url: '/tools/open-graph-generator.html', title: 'Open Graph Generator', description: 'Build share-ready Open Graph tags for social previews.', category: 'Developer' },
    { url: '/tools/twitter-card-generator.html', title: 'Twitter Card Generator', description: 'Create X and Twitter card tags with clean preview metadata.', category: 'Developer' },
    { url: '/tools/wifi-qr-code-generator.html', title: 'WiFi QR Code Generator', description: 'Generate scannable WiFi QR codes for easy network sharing.', category: 'Design' },
    { url: '/tools/merge-pdf.html', title: 'Merge PDF', description: 'Combine multiple PDFs into one private browser file.', category: 'PDF' },
    { url: '/tools/split-pdf.html', title: 'Split PDF', description: 'Divide a PDF into separate files or page ranges.', category: 'PDF' },
    { url: '/tools/remove-pages.html', title: 'Remove PDF Pages', description: 'Delete unwanted pages from a PDF locally.', category: 'PDF' },
    { url: '/tools/extract-pages.html', title: 'Extract PDF Pages', description: 'Pull selected pages into a new PDF document.', category: 'PDF' },
    { url: '/tools/reorder-pages.html', title: 'Reorder PDF Pages', description: 'Rearrange PDF pages with a visual workflow.', category: 'PDF' },
    { url: '/tools/rotate-pdf.html', title: 'Rotate PDF', description: 'Fix sideways or upside-down PDF pages quickly.', category: 'PDF' },
    { url: '/tools/crop-pdf.html', title: 'Crop PDF', description: 'Trim margins and clean scanned PDF pages.', category: 'PDF' },
    { url: '/tools/watermark-pdf.html', title: 'Watermark PDF', description: 'Add text or image watermarks to PDF files.', category: 'PDF' },
    { url: '/tools/page-numbers-pdf.html', title: 'Add PDF Page Numbers', description: 'Insert page numbers with flexible placement.', category: 'PDF' },
    { url: '/tools/flatten-pdf.html', title: 'Flatten PDF', description: 'Make form fields and annotations permanent.', category: 'PDF' },
    { url: '/tools/sign-pdf.html', title: 'Sign PDF', description: 'Draw, type, and place signatures in your browser.', category: 'PDF' },
    { url: '/tools/fill-pdf-form.html', title: 'PDF Form Filler', description: 'Fill PDF forms without uploading documents.', category: 'PDF' },
    { url: '/tools/redact-pdf.html', title: 'Redact PDF', description: 'Hide sensitive text and areas in PDF files.', category: 'PDF' },
    { url: '/tools/annotate-pdf.html', title: 'Annotate PDF', description: 'Highlight, underline, draw, and comment on PDFs.', category: 'PDF' },
    { url: '/tools/compare-pdf.html', title: 'Compare PDF', description: 'Compare two PDF versions side by side.', category: 'PDF' },
    { url: '/tools/jpg-to-pdf.html', title: 'JPG to PDF', description: 'Convert images into a clean PDF document.', category: 'PDF' },
    { url: '/tools/pdf-to-jpg.html', title: 'PDF to JPG', description: 'Export PDF pages as image files.', category: 'PDF' },
    { url: '/tools/pdf-webp-converter.html', title: 'PDF WebP Converter', description: 'Convert between PDF pages and WebP images.', category: 'PDF' },
    { url: '/tools/txt-to-pdf.html', title: 'TXT to PDF', description: 'Turn plain text files into formatted PDFs.', category: 'PDF' },
    { url: '/tools/pdf-to-base64.html', title: 'PDF to Base64', description: 'Encode PDFs as Base64 strings for web use.', category: 'PDF' },
    { url: '/tools/protect-pdf.html', title: 'Protect PDF', description: 'Add password protection to PDF documents.', category: 'PDF' },
    { url: '/tools/unlock-pdf.html', title: 'Unlock PDF', description: 'Remove PDF passwords when you have access.', category: 'PDF' },
    { url: '/tools/compress-pdf.html', title: 'Compress PDF', description: 'Reduce PDF file size with local processing.', category: 'PDF' },
    { url: '/tools/pdf-reader.html', title: 'PDF Reader', description: 'View PDFs with search, zoom, and thumbnails.', category: 'PDF' },
    { url: '/tools/add-pdf-headers.html', title: 'Add PDF Headers', description: 'Add headers, labels, dates, or exhibit text.', category: 'PDF' },
    { url: '/tools/add-pdf-margins.html', title: 'Add PDF Margins', description: 'Create printable margins for binding or notes.', category: 'PDF' },
    { url: '/tools/edit-pdf-metadata.html', title: 'Edit PDF Metadata', description: 'Update PDF title, author, subject, and keywords.', category: 'PDF' },
    { url: '/tools/extract-pdf-images.html', title: 'Extract PDF Images', description: 'Pull embedded images and assets from PDFs.', category: 'PDF' },
    { url: '/tools/grayscale-pdf.html', title: 'Grayscale PDF', description: 'Convert PDF pages to black-and-white output.', category: 'PDF' },
    { url: '/tools/html-to-pdf.html', title: 'HTML to PDF', description: 'Convert HTML snippets into PDF documents.', category: 'PDF' },
    { url: '/tools/pdf-text-converter.html', title: 'PDF Text Converter', description: 'Extract readable text from PDF documents.', category: 'PDF' },
    { url: '/tools/remove-pdf-metadata.html', title: 'Remove PDF Metadata', description: 'Sanitize hidden PDF metadata for privacy.', category: 'PDF' },
    { url: '/tools/repair-pdf.html', title: 'Repair PDF', description: 'Try to recover damaged or corrupted PDF files.', category: 'PDF' },
    { url: '/tools/resize-pdf-pages.html', title: 'Resize PDF Pages', description: 'Scale PDF pages to A4, Letter, or custom size.', category: 'PDF' },
    { url: '/tools/word-pdf-converter.html', title: 'Word PDF Converter', description: 'Convert Word to PDF or PDF to Word privately in your browser.', category: 'PDF' },
    { url: '/tools/excel-pdf-converter.html', title: 'Excel PDF Converter', description: 'Convert spreadsheets to PDF or extract PDF tables into Excel locally.', category: 'PDF' },
    { url: '/tools/pptx-pdf-converter.html', title: 'PowerPoint PDF Converter', description: 'Convert presentation slides to PDF or PDF pages back into PPTX.', category: 'PDF' },
    { url: '/tools/pdf-pdfa-converter.html', title: 'PDF PDF/A Converter', description: 'Prepare archival PDF/A metadata or convert PDF/A back to standard PDF.', category: 'PDF' },
    { url: '/tools/organize-pdf.html', title: 'Organize PDF', description: 'Reorder, rotate, duplicate, delete, and merge PDF pages visually.', category: 'PDF' },
    { url: '/tools/merge-pdf-free.html', title: 'Merge PDF Free', description: 'A focused free PDF merging workflow.', category: 'PDF' },
    { url: '/tools/compress-pdf-free.html', title: 'Compress PDF Free', description: 'A focused free PDF compression workflow.', category: 'PDF' },

    { url: '/tools/change-csv-separator.html', title: 'Change CSV Separator', description: 'Convert CSV delimiters between comma, semicolon, tab, and pipe.', category: 'Data' },
    { url: '/tools/csv-rows-to-columns.html', title: 'CSV Rows to Columns', description: 'Transpose CSV rows into columns instantly.', category: 'Data' },
    { url: '/tools/csv-to-tsv.html', title: 'CSV to TSV', description: 'Convert comma-separated CSV into tab-separated TSV.', category: 'Data' },
    { url: '/tools/csv-to-xml.html', title: 'CSV to XML', description: 'Convert CSV rows into clean XML records.', category: 'Data' },
    { url: '/tools/csv-to-yaml.html', title: 'CSV to YAML', description: 'Convert CSV tables into readable YAML arrays.', category: 'Data' },
    { url: '/tools/find-incomplete-csv-records.html', title: 'Find Incomplete CSV Records', description: 'Detect CSV rows with missing or extra columns.', category: 'Data' },
    { url: '/tools/insert-csv-columns.html', title: 'Insert CSV Columns', description: 'Add a new column to every CSV row with a default value.', category: 'Data' },
    { url: '/tools/swap-csv-columns.html', title: 'Swap CSV Columns', description: 'Swap two CSV columns by index.', category: 'Data' },
    { url: '/tools/tsv-to-json.html', title: 'TSV to JSON', description: 'Convert TSV data into JSON objects.', category: 'Data' },
    { url: '/tools/escape-json.html', title: 'Escape JSON', description: 'Escape text safely for JSON strings.', category: 'Developer' },
    { url: '/tools/json-comparison.html', title: 'JSON Comparison', description: 'Compare two JSON documents and highlight differences.', category: 'Developer' },
    { url: '/tools/json-to-xml.html', title: 'JSON to XML', description: 'Convert JSON objects and arrays into XML.', category: 'Developer' },
    { url: '/tools/stringify-json.html', title: 'Stringify JSON', description: 'Turn JSON into an escaped JavaScript string.', category: 'Developer' },
    { url: '/tools/duplicate-list-items.html', title: 'Duplicate List Items', description: 'Repeat every line in a list a chosen number of times.', category: 'Writing' },
    { url: '/tools/find-most-popular-list-items.html', title: 'Find Most Popular List Items', description: 'Count repeated list items and sort by frequency.', category: 'Writing' },
    { url: '/tools/find-unique-list-items.html', title: 'Find Unique List Items', description: 'Remove duplicate lines while preserving order.', category: 'Writing' },
    { url: '/tools/group-list-items.html', title: 'Group List Items', description: 'Group list lines into fixed-size chunks.', category: 'Writing' },
    { url: '/tools/reverse-list-items.html', title: 'Reverse List Items', description: 'Reverse the order of list lines.', category: 'Writing' },
    { url: '/tools/rotate-list-items.html', title: 'Rotate List Items', description: 'Move list items forward or backward by a custom offset.', category: 'Writing' },
    { url: '/tools/shuffle-list-items.html', title: 'Shuffle List Items', description: 'Randomly shuffle list lines locally.', category: 'Writing' },
    { url: '/tools/sort-list-items.html', title: 'Sort List Items', description: 'Sort list lines alphabetically or numerically.', category: 'Writing' },
    { url: '/tools/truncate-list-items.html', title: 'Truncate List Items', description: 'Limit every line to a maximum length.', category: 'Writing' },
    { url: '/tools/unwrap-list-items.html', title: 'Unwrap List Items', description: 'Join wrapped lines into one clean paragraph.', category: 'Writing' },
    { url: '/tools/wrap-list-items.html', title: 'Wrap List Items', description: 'Wrap long text into readable line lengths.', category: 'Writing' },
    { url: '/tools/arithmetic-sequence-generator.html', title: 'Arithmetic Sequence Generator', description: 'Generate arithmetic sequences with start, step, and count.', category: 'Everyday' },
    { url: '/tools/byte-converter.html', title: 'Byte Converter', description: 'Convert bytes, KB, MB, GB, and TB.', category: 'Everyday' },
    { url: '/tools/random-number-generator.html', title: 'Random Number Generator', description: 'Generate random numbers in a custom range.', category: 'Everyday' },
    { url: '/tools/random-port-generator.html', title: 'Random Port Generator', description: 'Generate safe random port numbers for development.', category: 'Developer' },
    { url: '/tools/sum-calculator.html', title: 'Sum Calculator', description: 'Add numbers from lines, CSV, or pasted text.', category: 'Everyday' },
    { url: '/tools/censor-text.html', title: 'Censor Text', description: 'Mask sensitive words or phrases in pasted text.', category: 'Writing' },
    { url: '/tools/palindrome-generator.html', title: 'Palindrome Generator', description: 'Create palindrome-style mirrored text.', category: 'Writing' },
    { url: '/tools/extract-substring.html', title: 'Extract Substring', description: 'Extract text between positions or markers.', category: 'Writing' },
    { url: '/tools/hidden-character-detector.html', title: 'Hidden Character Detector', description: 'Reveal invisible Unicode and whitespace characters.', category: 'Developer' },
    { url: '/tools/join-text-lines.html', title: 'Join Text Lines', description: 'Join lines with a custom separator.', category: 'Writing' },
    { url: '/tools/palindrome-checker.html', title: 'Palindrome Checker', description: 'Check if text reads the same backward and forward.', category: 'Writing' },
    { url: '/tools/randomize-case.html', title: 'Randomize Case', description: 'Randomly mix uppercase and lowercase letters.', category: 'Writing' },
    { url: '/tools/remove-duplicate-lines.html', title: 'Remove Duplicate Lines', description: 'Deduplicate text lines with optional case-insensitive mode.', category: 'Writing' },
    { url: '/tools/repeat-text.html', title: 'Repeat Text', description: 'Repeat text a custom number of times.', category: 'Writing' },
    { url: '/tools/reverse-text.html', title: 'Reverse Text', description: 'Reverse characters, words, or lines.', category: 'Writing' },
    { url: '/tools/rot13-converter.html', title: 'ROT13 Converter', description: 'Encode or decode ROT13 text instantly.', category: 'Developer' },
    { url: '/tools/rotate-text.html', title: 'Rotate Text', description: 'Rotate characters by a custom offset.', category: 'Writing' },
    { url: '/tools/split-text.html', title: 'Split Text', description: 'Split text by a delimiter into clean lines.', category: 'Writing' },
    { url: '/tools/text-replacer.html', title: 'Text Replacer', description: 'Find and replace text with plain or regex mode.', category: 'Writing' },
    { url: '/tools/text-to-morse.html', title: 'Text to Morse Code', description: 'Convert text into Morse code and back.', category: 'Writing' },
    { url: '/tools/truncate-text.html', title: 'Truncate Text', description: 'Trim text to a length with suffix control.', category: 'Writing' },
    { url: '/tools/unicode-inspector.html', title: 'Unicode Inspector', description: 'Inspect Unicode code points for every character.', category: 'Developer' },
    { url: '/tools/leap-year-checker.html', title: 'Leap Year Checker', description: 'Check whether years are leap years.', category: 'Everyday' },
    { url: '/tools/days-to-hours-converter.html', title: 'Days to Hours Converter', description: 'Convert days into hours, minutes, and seconds.', category: 'Everyday' },
    { url: '/tools/hours-to-days-converter.html', title: 'Hours to Days Converter', description: 'Convert hours into days and remaining hours.', category: 'Everyday' },
    { url: '/tools/seconds-to-time-converter.html', title: 'Seconds to Time Converter', description: 'Convert seconds into HH:MM:SS time.', category: 'Everyday' },
    { url: '/tools/time-to-decimal-converter.html', title: 'Time to Decimal Converter', description: 'Convert HH:MM time into decimal hours.', category: 'Everyday' },
    { url: '/tools/time-to-seconds-converter.html', title: 'Time to Seconds Converter', description: 'Convert HH:MM:SS into total seconds.', category: 'Everyday' },
    { url: '/tools/unix-timestamp-converter.html', title: 'Unix Timestamp Converter', description: 'Convert Unix timestamps to readable dates and back.', category: 'Developer' },
    { url: '/tools/crontab-guru.html', title: 'Crontab Guru', description: 'Explain common cron expressions in plain English.', category: 'Developer' },
    { url: '/tools/discord-timestamp-generator.html', title: 'Discord Timestamp Generator', description: 'Generate Discord timestamp tags from a date and time.', category: 'Developer' },
    { url: '/tools/time-between-dates.html', title: 'Time Between Dates', description: 'Calculate the exact gap between two dates.', category: 'Everyday' },
    { url: '/tools/truncate-clock-time.html', title: 'Truncate Clock Time', description: 'Round clock time down to the nearest interval.', category: 'Everyday' },
    { url: '/tools/xml-beautifier.html', title: 'XML Beautifier', description: 'Format messy XML into readable indentation.', category: 'Developer' },
    { url: '/tools/xml-validator.html', title: 'XML Validator', description: 'Validate XML syntax and show parsing errors clearly.', category: 'Developer' },

    { url: '/tools/image-resizer.html', title: 'Image Resizer', description: 'Resize JPG, PNG, and WebP images by exact pixels or percentage with live preview and local export.', category: 'Design' },
    { url: '/tools/image-cropper.html', title: 'Image Cropper', description: 'Crop images precisely with x/y coordinates, width, height, aspect presets, and instant browser preview.', category: 'Design' },
    { url: '/tools/image-rotator.html', title: 'Image Rotator', description: 'Rotate and flip images locally, then export clean PNG, JPG, or WebP output.', category: 'Design' },
    { url: '/tools/image-color-editor.html', title: 'Image Color Editor', description: 'Adjust brightness, contrast, saturation, grayscale, invert, sepia, and hue in your browser.', category: 'Design' },
    { url: '/tools/image-opacity-editor.html', title: 'Image Opacity Editor', description: 'Change image opacity and export transparent PNG files without uploading the image.', category: 'Design' },
    { url: '/tools/transparent-image-maker.html', title: 'Transparent Image Maker', description: 'Turn a selected color range transparent with tolerance controls and instant PNG export.', category: 'Design' },
    { url: '/tools/image-background-remover.html', title: 'Image Background Remover', description: 'Remove solid or near-solid image backgrounds locally using color sampling and tolerance controls.', category: 'Design' },
    { url: '/tools/image-splitter.html', title: 'Image Splitter', description: 'Split one image into rows and columns, preview every tile, and download the result as a ZIP.', category: 'Design' },
    { url: '/tools/jpg-to-png-converter.html', title: 'JPG to PNG Converter', description: 'Convert JPG images to PNG locally with preview, transparency-safe export, and file size feedback.', category: 'Design' },
    { url: '/tools/image-ocr-to-text.html', title: 'Image OCR to Text', description: 'Extract readable text from images in the browser using OCR with copy and download output.', category: 'Design' },
    { url: '/tools/browser-image-editor.html', title: 'Browser Image Editor', description: 'A local image editor for crop, resize, rotate, filters, opacity, and quick format export.', category: 'Design' },
    { url: '/tools/pro-image-editor.html', title: 'Pro Image Editor', description: 'Edit images with crop, resize, rotate, draw, text, filters, undo, redo, and private export.', category: 'Design' },
  ];

  const HOME_TOOL_COUNT = 151;

  const SEARCH_CATEGORY_KEYWORDS = {
    PDF: 'pdf document file page pages merge split compress shrink reduce sign signature watermark protect unlock password metadata image jpg webp text repair rotate crop annotate redact form reader headers margins word docx excel xlsx xls spreadsheet powerpoint pptx slides pdfa archival organize reorder',
    Writing: 'text words characters count writing markdown quote ascii case lorem ipsum diff typing paragraph sentence copy social caption essay',
    Developer: 'developer code json regex jwt token base64 url uuid hash checksum html css minify format validate encode decode seo robots sitemap metadata open graph twitter card slug password',
    Design: 'design color colours palette picker gradient contrast wcag qr code image compress visual foreground background accessibility image resize crop rotate opacity transparent background remover ocr split converter editor image resize crop rotate opacity transparent background remover ocr split converter editor image resize crop rotate opacity transparent background remover ocr split converter editor image resize crop rotate opacity transparent background remover ocr split converter editor pro image editor photo editor online no upload browser image editor crop resize rotate draw text shapes filters private export',
    Everyday: 'everyday timer stopwatch pomodoro focus timezone time zone unit converter measurement productivity reaction reflex team balancer generator group splitter sports classroom esports hackathon corporate basketball soccer snake draft skill fair teams',
    Data: 'data csv json table spreadsheet rows columns delimiter inspect convert flatten export'
  };

  const TOOL_SEARCH_ALIASES = {
    'Word Counter': 'count words word count essay length paragraph sentence reading time writing stats',
    'Character Counter': 'character count char limit remaining twitter x instagram linkedin sms meta description density',
    'Password Generator': 'random password memorable passphrase secure strong login credentials',
    'Typing Speed Test': 'wpm keyboard accuracy typing test words per minute',
    'ASCII Art Generator': 'text art banner ascii font terminal',
    'Case Converter': 'uppercase lowercase title case sentence case capitalize text cleanup',
    'Gradient Generator': 'css gradient background linear radial conic color stops',
    'Contrast Checker': 'wcag accessibility color contrast ratio readable text',
    'JSON Formatter': 'format json beautify minify validate repair tree schema compare',
    'Hash Generator': 'sha md5 checksum digest hmac verify file hash',
    'Base64 Encoder': 'encode decode base64 string data uri',
    'Image Compressor': 'compress image reduce image size jpg png webp optimize',
    'Pro Image Editor': 'photo editor image editor crop resize rotate flip draw text shapes icons filters annotate screenshot product photo social media no upload private browser editor',
    'QR Code Maker': 'qr generator qr code url link scan',
    'JWT Inspector': 'jwt decoder token claims bearer auth inspect validate',
    'Markdown Previewer': 'markdown preview md html render editor',
    'Regex Tester': 'regular expression test pattern match pcre javascript regex',
    'UUID Maker': 'uuid guid random id identifier v4 v7',
    'URL Encoder': 'url encode decode percent encoding uri component',
    'Color Picker': 'hex rgb hsl color picker palette',
    'Unit Converter': 'convert units length weight temperature volume speed',
    'Timezone Converter': 'time zone converter city world clock utc meeting',
    'Pomodoro Timer': 'focus timer productivity sessions break task',
    'Stopwatch & Timer': 'stopwatch countdown timer lap multi timer',
    'Team Balancer': 'team generator team maker random teams skill levels snake draft groups sports classroom esports hackathon corporate basketball soccer fair teams',
    'Text Diff Checker': 'compare text diff changes difference revisions',
    'CSV to JSON': 'csv json convert rows columns spreadsheet',
    'JSON to CSV': 'json csv convert flatten table spreadsheet',
    'HTML Minifier': 'minify html compress markup',
    'CSS Minifier': 'minify css beautify format validate prefixes',
    'Slug Generator': 'seo slug url permalink clean url',
    'Meta Tag Generator': 'seo title description meta tags social preview',
    'Robots.txt Generator': 'robots txt crawl rules search engine',
    'Sitemap Generator': 'xml sitemap urls indexing search console',
    'Compress PDF': 'reduce pdf size shrink pdf file smaller email upload',
    'Merge PDF': 'combine pdf join pdf multiple files',
    'Split PDF': 'separate pdf extract pages divide pdf',
    'Remove PDF Pages': 'delete pdf pages remove page',
    'Extract PDF Pages': 'save selected pdf pages extract range',
    'Reorder PDF Pages': 'organize pdf pages rearrange order',
    'Rotate PDF': 'rotate pdf page sideways fix orientation',
    'Crop PDF': 'trim pdf margins crop scanned pages',
    'Watermark PDF': 'add watermark draft confidential brand',
    'Sign PDF': 'signature sign document draw type sign',
    'Protect PDF': 'password protect pdf encrypt secure',
    'Unlock PDF': 'remove pdf password unlock',
    'PDF Reader': 'view pdf search zoom thumbnails open pdf',
    'PDF Text Converter': 'extract text from pdf convert pdf text',
    'JPG to PDF': 'image to pdf photo to pdf',
    'PDF to JPG': 'pdf to image export pages',
    'PDF WebP Converter': 'webp pdf convert image pages',
    'Word PDF Converter': 'word docx pdf converter pdf to word docx no upload',
    'Excel ↔ PDF Converter': 'excel xlsx xls pdf spreadsheet table pdf to excel sheetjs',
    'PowerPoint ↔ PDF Converter': 'powerpoint pptx pdf slides presentation pdf to pptx',
    'PDF ↔ PDF/A Converter': 'pdfa archival compliance metadata pdf to pdfa archive',
    'Organize PDF': 'organize reorder rearrange delete rotate duplicate pdf pages merge',
  };

  const normalizeSearchText = (value) => (value || '')
    .toString()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const editDistance = (a, b) => {
    if (!a || !b) return Math.max(a.length, b.length);
    if (Math.abs(a.length - b.length) > 2) return 99;
    const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j += 1) dp[0][j] = j;
    for (let i = 1; i <= a.length; i += 1) {
      for (let j = 1; j <= b.length; j += 1) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return dp[a.length][b.length];
  };

  const isCloseSearchToken = (token, haystack) => {
    if (!token || token.length < 4) return false;
    return haystack.split(' ').some((word) => word.length >= 4 && editDistance(token, word) <= (token.length > 6 ? 2 : 1));
  };

  const getToolSearchText = (tool) => normalizeSearchText([
    tool.title,
    tool.description,
    tool.category,
    tool.url,
    TOOL_SEARCH_ALIASES[tool.title],
    SEARCH_CATEGORY_KEYWORDS[tool.category]
  ].filter(Boolean).join(' '));

  const scoreToolMatch = (tool, rawQuery, activeCategory = 'All') => {
    const query = normalizeSearchText(rawQuery);
    const title = normalizeSearchText(tool.title);
    const category = normalizeSearchText(tool.category);
    const searchText = getToolSearchText(tool);
    let score = 0;

    if (activeCategory !== 'All' && tool.category !== activeCategory) return -1;
    if (!query) return activeCategory === 'All' ? 1 : 12;

    const tokens = query.split(' ').filter(Boolean);
    if (title === query) score += 120;
    if (title.startsWith(query)) score += 90;
    if (title.includes(query)) score += 65;
    if (category === query) score += 45;
    if (searchText.includes(query)) score += 35;

    tokens.forEach((token) => {
      if (title.includes(token)) score += 26;
      else if (category.includes(token)) score += 18;
      else if (searchText.includes(token)) score += 12;
      else if (isCloseSearchToken(token, searchText)) score += 6;
      else score -= 18;
    });

    return score;
  };

  const getToolSearchResults = (query, activeCategory = 'All', limit = 10) => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) {
      return TOOL_CATALOG
        .filter((tool) => activeCategory === 'All' || tool.category === activeCategory)
        .slice(0, limit);
    }
    return TOOL_CATALOG
      .map((tool) => ({ tool, score: scoreToolMatch(tool, normalizedQuery, activeCategory) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.tool.title.localeCompare(b.tool.title))
      .slice(0, limit)
      .map((item) => item.tool);
  };

  const getToolCategories = () => ['All', ...Array.from(new Set(TOOL_CATALOG.map((tool) => tool.category))).sort()];

  const initGlobalToolFinder = () => {
    const navLinks = document.querySelector('header .nav-links');
    if (!navLinks || document.body.dataset.toolFinderReady === 'true') return;
    document.body.dataset.toolFinderReady = 'true';

    const allToolsLink = navLinks.querySelector('.nav-btn');
    let headerSearch = navLinks.querySelector('.nav-search');
    if (!headerSearch) {
      headerSearch = document.createElement('label');
      headerSearch.className = 'nav-search smart-tool-search';

      const searchLabel = document.createElement('span');
      searchLabel.className = 'sr-only';
      searchLabel.textContent = 'Search tools';

      const searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.placeholder = `Search ${HOME_TOOL_COUNT} tools...`;
      searchInput.setAttribute('aria-label', 'Search tools');
      searchInput.autocomplete = 'off';

      const shortcut = document.createElement('span');
      shortcut.className = 'nav-search-shortcut';
      shortcut.textContent = 'Ctrl K';

      headerSearch.append(searchLabel, searchInput, shortcut);
      navLinks.insertBefore(headerSearch, allToolsLink || navLinks.firstChild);
    } else {
      headerSearch.classList.add('smart-tool-search');
      if (!headerSearch.querySelector('.nav-search-shortcut')) {
        const shortcut = document.createElement('span');
        shortcut.className = 'nav-search-shortcut';
        shortcut.textContent = 'Ctrl K';
        headerSearch.appendChild(shortcut);
      }
    }

    const searchInput = headerSearch.querySelector('input[type="search"]');
    if (!searchInput) return;
    searchInput.placeholder = `Search ${HOME_TOOL_COUNT} tools...`;

    const finder = document.createElement('div');
    finder.className = 'tool-finder';
    finder.innerHTML = `
      <div class="tool-finder-panel" role="dialog" aria-modal="true" aria-label="Search ToolsMatic tools">
        <div class="tool-finder-top">
          <div>
            <span class="tool-finder-kicker">Tool Finder</span>
            <h2>Find any tool instantly</h2>
          </div>
          <button class="tool-finder-close" type="button" aria-label="Close tool finder">&times;</button>
        </div>
        <label class="tool-finder-input-wrap">
          <span class="sr-only">Search all tools</span>
          <input class="tool-finder-input" type="search" placeholder="Try: make PDF smaller, format JSON, color contrast..." autocomplete="off">
        </label>
        <div class="tool-finder-results" role="listbox" aria-label="Tool search results"></div>
        <div class="tool-finder-help">Use Up / Down to move, Enter to open, Esc to close.</div>
      </div>
    `;
    document.body.appendChild(finder);

    const dropdown = document.createElement('div');
    dropdown.className = 'nav-search-dropdown';
    dropdown.setAttribute('role', 'listbox');
    dropdown.setAttribute('aria-label', 'Tool search suggestions');
    headerSearch.appendChild(dropdown);

    const paletteInput = finder.querySelector('.tool-finder-input');
    const paletteResults = finder.querySelector('.tool-finder-results');
    const closeButton = finder.querySelector('.tool-finder-close');
    const activeCategory = 'All';
    let activeIndex = 0;

    const setRecentTool = (tool) => {
      try {
        const recent = JSON.parse(localStorage.getItem('toolsmatic-recent-tools') || '[]');
        const next = [tool.url, ...recent.filter((url) => url !== tool.url)].slice(0, 8);
        localStorage.setItem('toolsmatic-recent-tools', JSON.stringify(next));
      } catch (e) {}
    };

    const openTool = (tool) => {
      if (!tool) return;
      setRecentTool(tool);
      window.location.href = tool.url;
    };

    const buildResultButton = (tool, index, source) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tool-search-result${index === activeIndex ? ' is-active' : ''}`;
      button.setAttribute('role', 'option');
      button.innerHTML = `
        <span class="tool-search-result-main">
          <strong>${tool.title}</strong>
          <span>${tool.description}</span>
        </span>
        <em>${tool.category}</em>
      `;
      button.addEventListener('mouseenter', () => {
        activeIndex = index;
        const scope = source === 'dropdown' ? dropdown : paletteResults;
        scope.querySelectorAll('.tool-search-result').forEach((node, nodeIndex) => {
          node.classList.toggle('is-active', nodeIndex === activeIndex);
        });
      });
      button.addEventListener('click', () => openTool(tool));
      return button;
    };

    const renderDropdown = () => {
      const query = searchInput.value.trim();
      const results = getToolSearchResults(query, activeCategory, 6);
      dropdown.innerHTML = '';
      if (!results.length) {
        const empty = document.createElement('div');
        empty.className = 'tool-search-empty';
        empty.textContent = 'No exact match. Try a task like "compress PDF" or "format code".';
        dropdown.appendChild(empty);
      } else {
        results.forEach((tool, index) => dropdown.appendChild(buildResultButton(tool, index, 'dropdown')));
      }
      dropdown.classList.add('is-open');
    };

    const renderResults = (source = 'palette') => {
      const query = (source === 'dropdown' ? searchInput.value : paletteInput.value).trim();
      const results = getToolSearchResults(query, activeCategory, 12);
      paletteResults.innerHTML = '';
      activeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));
      if (!results.length) {
        const empty = document.createElement('div');
        empty.className = 'tool-search-empty';
        empty.textContent = 'No matching tools yet. Try "pdf", "json", "color", "timer", or "seo".';
        paletteResults.appendChild(empty);
        return;
      }
      results.forEach((tool, index) => paletteResults.appendChild(buildResultButton(tool, index, 'palette')));
    };

    const renderPalette = () => {
      renderResults('palette');
    };

    const openPalette = (query = '') => {
      finder.classList.add('is-open');
      document.body.classList.add('tool-finder-open');
      paletteInput.value = query || searchInput.value || '';
      activeIndex = 0;
      renderPalette();
      setTimeout(() => paletteInput.focus(), 0);
    };

    const closePalette = () => {
      finder.classList.remove('is-open');
      document.body.classList.remove('tool-finder-open');
    };

    const moveActive = (direction, source) => {
      const query = (source === 'dropdown' ? searchInput.value : paletteInput.value).trim();
      const results = getToolSearchResults(query, activeCategory, source === 'dropdown' ? 6 : 12);
      if (!results.length) return;
      activeIndex = (activeIndex + direction + results.length) % results.length;
      if (source === 'dropdown') renderDropdown();
      else renderResults('palette');
    };

    const submitActive = (source) => {
      const query = (source === 'dropdown' ? searchInput.value : paletteInput.value).trim();
      const results = getToolSearchResults(query, activeCategory, source === 'dropdown' ? 6 : 12);
      openTool(results[activeIndex] || results[0]);
    };

    searchInput.addEventListener('input', () => {
      activeIndex = 0;
      renderDropdown();
      if (finder.classList.contains('is-open')) {
        paletteInput.value = searchInput.value;
        renderPalette();
      }
    });
    searchInput.addEventListener('focus', renderDropdown);
    searchInput.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') return;
      if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1, 'dropdown'); }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1, 'dropdown'); }
      if (e.key === 'Enter') { e.preventDefault(); submitActive('dropdown'); }
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        dropdown.classList.remove('is-open');
      }
    });

    paletteInput.addEventListener('input', () => {
      activeIndex = 0;
      renderPalette();
    });
    paletteInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveActive(1, 'palette'); }
      if (e.key === 'ArrowUp') { e.preventDefault(); moveActive(-1, 'palette'); }
      if (e.key === 'Enter') { e.preventDefault(); submitActive('palette'); }
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closePalette();
      }
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openPalette();
      } else if (e.key === 'Escape' && (finder.classList.contains('is-open') || dropdown.classList.contains('is-open'))) {
        e.preventDefault();
        e.stopImmediatePropagation();
        dropdown.classList.remove('is-open');
        closePalette();
      }
    });

    document.addEventListener('click', (e) => {
      if (!headerSearch.contains(e.target)) dropdown.classList.remove('is-open');
      if (e.target === finder) closePalette();
    });
    closeButton.addEventListener('click', closePalette);
  };

  const getHomeCategory = (title) => {
    const key = (title || '').trim().toLowerCase();
    if (key.includes('pdf') || key.includes('jpg to pdf') || key.includes('txt to pdf')) {
      return 'PDF';
    }

    const categoryMap = {
      'word counter': 'Writing',
      'character counter': 'Writing',
      'quote generator': 'Writing',
      'typing speed test': 'Writing',
      'ascii art generator': 'Writing',
      'case converter': 'Writing',
      'markdown previewer': 'Writing',
      'text diff checker': 'Writing',
      'lorem ipsum generator': 'Writing',
      'password generator': 'Developer',
      'json formatter': 'Developer',
      'hash generator': 'Developer',
      'base64 encoder': 'Developer',
      'number converter': 'Developer',
      'slug generator': 'Developer',
      'meta tag generator': 'Developer',
      'robots.txt generator': 'Developer',
      'sitemap generator': 'Developer',
      'open graph generator': 'Developer',
      'twitter card generator': 'Developer',
      'jwt inspector': 'Developer',
      'regex tester': 'Developer',
      'uuid maker': 'Developer',
      'url encoder': 'Developer',
      'html minifier': 'Developer',
      'css minifier': 'Developer',
      'csv to json': 'Data',
      'json to csv': 'Data',
      'csv inspector': 'Data',
      'gradient generator': 'Design',
      'contrast checker': 'Design',
      'image compressor': 'Design',
      'qr code maker': 'Design',
      'wifi qr code generator': 'Design',
      'color picker': 'Design',
      'unit converter': 'Everyday',
      'timezone converter': 'Everyday',
      'pomodoro timer': 'Everyday',
      'stopwatch & timer': 'Everyday'
    };
    return categoryMap[key] || 'Utility';
  };

  const initHomeExperience = () => {
    if (!isHomePage()) return;

    const main = document.querySelector('main');
    const hero = main?.querySelector('.hero');
    if (!main || !hero) return;

    hero.classList.add('home-hero');
    main.querySelector('.home-intro')?.remove();
    main.querySelector('.home-toolbar')?.remove();

    const cards = Array.from(hero.querySelectorAll('.card'));
    const displayedToolCount = cards.length || HOME_TOOL_COUNT;
    document.querySelectorAll('[data-tool-count]').forEach((node) => {
      node.textContent = `${displayedToolCount} tools ready`;
    });
    let grids = Array.from(hero.querySelectorAll('.grid'));

    cards.forEach((card, index) => {
      const title = card.querySelector('h3')?.textContent?.trim() || `Tool ${index + 1}`;
      const description = card.querySelector('p')?.textContent?.trim() || '';
      const catalogTool = TOOL_CATALOG.find((tool) => normalizeSearchText(tool.title) === normalizeSearchText(title));
      const category = catalogTool?.category || getHomeCategory(title);
      card.dataset.category = category;
      card.dataset.search = catalogTool ? getToolSearchText(catalogTool) : normalizeSearchText(`${title} ${description} ${category}`);

      if (!card.querySelector('.card-meta')) {
        const meta = document.createElement('div');
        meta.className = 'card-meta';

        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = category;

        const arrow = document.createElement('span');
        arrow.className = 'card-arrow';
        arrow.textContent = 'Open tool';

        meta.append(pill, arrow);
        card.appendChild(meta);
      }
    });

    hero.querySelectorAll('.home-grid-label').forEach((label) => label.remove());
    hero.querySelectorAll('.grid').forEach((grid) => grid.remove());

    if (cards.length) {
      const grid = document.createElement('div');
      grid.className = 'grid home-grid home-tool-grid';
      cards.forEach((card) => grid.appendChild(card));
      hero.appendChild(grid);
      grids = [grid];
    }

    const readRecentTools = () => {
      try {
        return JSON.parse(localStorage.getItem('toolsmatic-recent-tools') || '[]');
      } catch (_) {
        return [];
      }
    };

    const writeRecentTool = (url) => {
      if (!url) return;
      const normalizedUrl = new URL(url, window.location.origin).pathname;
      const recent = readRecentTools();
      localStorage.setItem('toolsmatic-recent-tools', JSON.stringify([
        normalizedUrl,
        ...recent.filter((item) => item !== normalizedUrl)
      ].slice(0, 8)));
    };

    const recentTools = readRecentTools()
      .map((url) => TOOL_CATALOG.find((tool) => tool.url === url))
      .filter(Boolean)
      .slice(0, 6);

    if (recentTools.length && !main.querySelector('.recent-tools-section')) {
      const recentSection = document.createElement('section');
      recentSection.className = 'section recent-tools-section';
      recentSection.innerHTML = '<h2>Recently used tools</h2><p>Quickly reopen the tools you used on this device.</p><div class="grid recent-tools-grid"></div>';
      const recentGrid = recentSection.querySelector('.recent-tools-grid');
      recentTools.forEach((tool) => {
        const link = document.createElement('a');
        link.className = 'card';
        link.href = tool.url;
        link.innerHTML = `<h3>${tool.title}</h3><p>${tool.description}</p>`;
        recentGrid.appendChild(link);
      });
      hero.insertAdjacentElement('afterend', recentSection);
    }

    cards.forEach((card) => {
      if (card.dataset.recentBound) return;
      card.dataset.recentBound = 'true';
      card.addEventListener('click', () => writeRecentTool(card.getAttribute('href')));
    });

    const navLinks = document.querySelector('header .nav-links');
    const allToolsLink = navLinks?.querySelector('.nav-btn');
    let headerSearch = navLinks?.querySelector('.nav-search');

    if (!headerSearch && navLinks) {
      headerSearch = document.createElement('label');
      headerSearch.className = 'nav-search';

      const searchLabel = document.createElement('span');
      searchLabel.className = 'sr-only';
      searchLabel.textContent = 'Search tools';

      const searchInput = document.createElement('input');
      searchInput.type = 'search';
      searchInput.placeholder = 'Search tools...';
      searchInput.setAttribute('aria-label', 'Search tools');
      searchInput.autocomplete = 'off';

      headerSearch.append(searchLabel, searchInput);
      navLinks.insertBefore(headerSearch, allToolsLink || navLinks.firstChild);
    }

    const searchInput = headerSearch?.querySelector('input[type="search"]');
    let activeHomeCategory = 'All';

    let categoryStrip = main.querySelector('.home-category-strip');
    if (!categoryStrip) {
      categoryStrip = document.createElement('section');
      categoryStrip.className = 'home-category-strip';
      categoryStrip.setAttribute('aria-label', 'Filter tools by category');
      categoryStrip.innerHTML = '<span class="home-category-strip-label">Browse by category</span><div class="home-category-buttons"></div>';
      const breadcrumbs = main.querySelector('.home-breadcrumbs');
      if (breadcrumbs) breadcrumbs.insertAdjacentElement('afterend', categoryStrip);
      else main.insertBefore(categoryStrip, hero);
    }

    const categoryButtons = categoryStrip.querySelector('.home-category-buttons');
    const homeCategories = ['All', ...Array.from(new Set(cards.map((card) => card.dataset.category).filter(Boolean))).sort()];

    const renderHomeCategoryButtons = () => {
      if (!categoryButtons) return;
      categoryButtons.innerHTML = '';
      homeCategories.forEach((category) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `home-category-button${category === activeHomeCategory ? ' is-active' : ''}`;
        button.textContent = category;
        button.setAttribute('aria-pressed', String(category === activeHomeCategory));
        button.addEventListener('click', () => {
          activeHomeCategory = category;
          renderHomeCategoryButtons();
          applyFilters();
        });
        categoryButtons.appendChild(button);
      });
    };

    let emptyState = hero.querySelector('.home-empty-state');
    if (!emptyState) {
      emptyState = document.createElement('div');
      emptyState.className = 'home-empty-state';
      emptyState.textContent = 'No tools match that search yet. Try a broader keyword.';
      hero.appendChild(emptyState);
    }

    const applyFilters = () => {
      const query = normalizeSearchText((searchInput?.value || '').trim());
      let visibleCount = 0;

      cards.forEach((card) => {
        const matchesQuery = !query || (card.dataset.search || '').includes(query);
        const matchesCategory = activeHomeCategory === 'All' || card.dataset.category === activeHomeCategory;
        const isVisible = matchesQuery && matchesCategory;
        card.classList.toggle('is-hidden', !isVisible);
        if (isVisible) visibleCount += 1;
      });

      grids.forEach((grid) => {
        const label = grid.previousElementSibling;
        const hasVisibleCards = !!grid.querySelector('.card:not(.is-hidden)');
        grid.classList.toggle('is-empty', !hasVisibleCards);
        if (label && label.classList.contains('home-grid-label')) {
          label.classList.toggle('is-hidden', !hasVisibleCards);
        }
      });

      const isFiltering = Boolean(query) || activeHomeCategory !== 'All';
      document.body.classList.toggle('home-filtering', isFiltering);
      emptyState.classList.toggle('is-active', visibleCount === 0);
    };

    if (searchInput && !searchInput.dataset.homeFilterBound) {
      searchInput.dataset.homeFilterBound = 'true';
      searchInput.addEventListener('input', applyFilters);
    }

    renderHomeCategoryButtons();
    applyFilters();
  };

  const getSectionSummary = (section) => {
    const text = Array.from(section.querySelectorAll('p, li'))
      .map((node) => (node.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .join(' ');

    if (!text) return '';
    return text.length > 140 ? `${text.slice(0, 140).trim()}...` : text;
  };

  const expandCollapsibleSection = (section) => {
    if (!section || !section.classList.contains('is-collapsible')) return;
    section.classList.remove('is-collapsed');
    const toggle = section.querySelector('.section-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
  };

  const collapseCollapsibleSection = (section) => {
    if (!section || !section.classList.contains('is-collapsible')) return;
    section.classList.add('is-collapsed');
    const toggle = section.querySelector('.section-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  };

  const makeSectionCollapsible = (section, index, collapsedByDefault) => {
    if (!section || section.classList.contains('is-collapsible')) return;
    if (section.querySelector('.suggestions-section')) return;

    const hasInteractiveControls = !!section.querySelector('input, textarea, select, canvas, form, [contenteditable="true"]');
    const buttonCount = section.querySelectorAll('button').length;
    if (hasInteractiveControls || buttonCount > 2) return;

    const heading = section.querySelector('h2, h3, h4');
    const title = heading?.textContent?.trim() || `Section ${index + 1}`;
    const summary = getSectionSummary(section);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'section-toggle';
    toggle.setAttribute('aria-expanded', collapsedByDefault ? 'false' : 'true');

    const copy = document.createElement('span');
    copy.className = 'section-toggle-copy';

    const kicker = document.createElement('span');
    kicker.className = 'section-toggle-kicker';
    kicker.textContent = 'Guide section';

    const titleNode = document.createElement('span');
    titleNode.className = 'section-toggle-title';
    titleNode.textContent = title;

    copy.append(kicker, titleNode);

    if (summary) {
      const summaryNode = document.createElement('span');
      summaryNode.className = 'section-toggle-summary';
      summaryNode.textContent = summary;
      copy.appendChild(summaryNode);
    }

    const icon = document.createElement('span');
    icon.className = 'section-toggle-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '+';

    toggle.append(copy, icon);

    const panel = document.createElement('div');
    panel.className = 'section-panel';

    const inner = document.createElement('div');
    inner.className = 'section-panel-inner';

    while (section.firstChild) {
      inner.appendChild(section.firstChild);
    }

    if (heading) {
      heading.classList.add('section-toggle-source');
    }

    panel.appendChild(inner);
    section.append(toggle, panel);
    section.classList.add('is-collapsible');
    if (collapsedByDefault) section.classList.add('is-collapsed');

    toggle.addEventListener('click', () => {
      const isCollapsed = section.classList.contains('is-collapsed');
      if (isCollapsed) {
        expandCollapsibleSection(section);
      } else {
        collapseCollapsibleSection(section);
      }
    });
  };

  const createRailCard = (kickerText, titleText, bodyNode) => {
    const card = document.createElement('div');
    card.className = 'rail-card';

    const kicker = document.createElement('div');
    kicker.className = 'rail-card-kicker';
    kicker.textContent = kickerText;

    const title = document.createElement('h3');
    title.textContent = titleText;

    card.append(kicker, title, bodyNode);
    return card;
  };

  const initToolPageExperience = () => {
    if (!isToolPage()) return;
    return;
  };

  const initStandardPageExperience = () => {
    if (isHomePage() || isToolPage()) return;

    const main = document.querySelector('main');
    if (!main) return;

    let intro = main.querySelector('.page-intro');
    if (!intro) {
      const directHeading = Array.from(main.children).find((child) => child.tagName === 'H1');
      if (directHeading) {
        const introNodes = [directHeading];
        let sibling = directHeading.nextElementSibling;
        while (sibling && sibling.tagName === 'P' && introNodes.length < 3) {
          introNodes.push(sibling);
          sibling = sibling.nextElementSibling;
        }
        intro = document.createElement('section');
        intro.className = 'page-intro';
        directHeading.insertAdjacentElement('beforebegin', intro);
        introNodes.forEach((node) => intro.appendChild(node));
      }
    }

    if (!intro) {
      intro = Array.from(main.querySelectorAll('.section')).find((section) => section.querySelector('h1')) || null;
      if (intro) intro.classList.add('page-intro');
    }

    const introHeading = intro?.querySelector('h1');
    const introParagraph = intro?.querySelector('p');
    if (introHeading) {
      introHeading.classList.add('page-intro-title');
      introHeading.removeAttribute('style');
    }
    if (introParagraph) {
      introParagraph.classList.add('page-intro-description');
      introParagraph.removeAttribute('style');
    }
  };

  const hasSchemaType = (type) => {
    const re = new RegExp(`"@type"\\s*:\\s*"${type}"`, 'i');
    return [...document.querySelectorAll('script[type="application/ld+json"]')]
      .some((node) => re.test(node.textContent || ''));
  };

  const injectJsonLd = (id, payload) => {
    if (!payload || document.getElementById(id)) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(payload, null, 2);
    document.head.appendChild(script);
  };

  const normalizeToolName = () => {
    const h1 = document.querySelector('main h1')?.textContent?.trim();
    if (h1) return h1;
    const last = (window.location.pathname.split('/').pop() || 'Tool').replace('.html', '');
    return last.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const ensureBreadcrumbNav = (toolName) => {
    if (document.querySelector('nav[aria-label="Breadcrumb"]')) return;
    const main = document.querySelector('main');
    if (!main) return;

    if (!document.getElementById('tm-breadcrumb-style')) {
      const style = document.createElement('style');
      style.id = 'tm-breadcrumb-style';
      style.textContent = `
        .tm-breadcrumb-nav {
          margin: 10px 0 8px;
          font-size: .95rem;
          color: var(--muted);
          text-align: center;
        }
        .tm-breadcrumb-nav a {
          color: var(--accent);
          text-decoration: none;
        }
        .tm-breadcrumb-nav span { opacity: .85; }
      `;
      document.head.appendChild(style);
    }

    const nav = document.createElement('nav');
    nav.className = 'tm-breadcrumb-nav';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.innerHTML = `<a href="/">Home</a> <span>&rsaquo;</span> <a href="/">Tools</a> <span>&rsaquo;</span> <span>${escapeHtml(toolName)}</span>`;
    main.insertAdjacentElement('afterbegin', nav);
  };

  const collectFaqEntities = () => {
    const entities = [];
    const seen = new Set();

    const pushEntity = (question, answer) => {
      const q = (question || '').trim();
      const a = (answer || '').trim();
      if (!q || !a) return;
      const key = q.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      entities.push({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      });
    };

    document.querySelectorAll('details').forEach((details) => {
      const summary = details.querySelector('summary');
      if (!summary) return;
      const question = summary.textContent;
      const clone = details.cloneNode(true);
      const cloneSummary = clone.querySelector('summary');
      if (cloneSummary) cloneSummary.remove();
      const answer = clone.textContent;
      pushEntity(question, answer);
    });

    document.querySelectorAll('.faq-item').forEach((item) => {
      const question = item.querySelector('.faq-question')?.textContent || '';
      const answer = item.querySelector('.faq-answer')?.textContent || item.querySelector('p')?.textContent || '';
      pushEntity(question, answer);
    });

    if (!entities.length) {
      const heading = [...document.querySelectorAll('h2,h3')]
        .find((node) => /faq|frequently asked questions/i.test(node.textContent || ''));
      if (heading) {
        let current = heading.nextElementSibling;
        while (current && entities.length < 10) {
          if (/^H3$/i.test(current.tagName) && current.nextElementSibling && /^P$/i.test(current.nextElementSibling.tagName)) {
            pushEntity(current.textContent, current.nextElementSibling.textContent);
          }
          current = current.nextElementSibling;
        }
      }
    }

    return entities.slice(0, 12);
  };

  const initGlobalToolSeo = () => {
    if (!isToolPage()) return;

    const toolName = normalizeToolName();
    const origin = window.location.origin || 'https://toolsmatic.me';
    const url = `${origin}${window.location.pathname}`;

    ensureBreadcrumbNav(toolName);

    if (!hasSchemaType('BreadcrumbList')) {
      injectJsonLd('tm-auto-breadcrumb-schema', {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: `${origin}/tools` },
          { '@type': 'ListItem', position: 3, name: toolName, item: url }
        ]
      });
    }

    if (!hasSchemaType('FAQPage')) {
      let mainEntity = collectFaqEntities();
      if (!mainEntity.length) {
        mainEntity = [
          {
            '@type': 'Question',
            name: `What does ${toolName} do?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${toolName} helps you complete common web utility workflows quickly in your browser.`
            }
          },
          {
            '@type': 'Question',
            name: `Is ${toolName} free?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Yes, ${toolName} is free to use on ToolsMatic.`
            }
          },
          {
            '@type': 'Question',
            name: `Does ${toolName} process data locally?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Most tool operations run in your browser for speed and privacy.`
            }
          }
        ];
      }

      injectJsonLd('tm-auto-faq-schema', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity
      });
    }
  };

  const handoffKey = 'toolsmatic-handoff';

  const setHandoff = (payload) => {
    try {
      sessionStorage.setItem(handoffKey, JSON.stringify({ ...payload, ts: Date.now() }));
    } catch (_) {
      // ignore storage issues
    }
  };

  const consumeHandoff = (expectedKind) => {
    try {
      const raw = sessionStorage.getItem(handoffKey);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (expectedKind && data.kind !== expectedKind) return null;
      sessionStorage.removeItem(handoffKey);
      return data;
    } catch (_) {
      return null;
    }
  };

  const handoffAndGo = ({ target, kind = 'text', value, slot }) => {
    if (!target || !value) return;
    setHandoff({ kind, value, slot });
    window.location.href = target;
  };

  // Suggestions Feature
  const initSuggestions = () => {
    if (!isToolPage()) return;
    if (document.querySelector('.suggestions-section')) return;
    const toolName = document.querySelector('h1')?.textContent || 'this tool';
    const suggestionsHTML = `
      <div class="suggestions-section">
        <h2>ðŸ’¡ Suggestions & Feedback</h2>
        <p>Help us improve ${toolName}! Share your ideas below.</p>
        
        <div class="suggestion-form">
          <input type="text" id="suggestionName" placeholder="Your name *" maxlength="50" required>
          <textarea id="suggestionText" placeholder="Share your suggestion or feedback here... *" rows="3" maxlength="500" required></textarea>
          <button class="btn btn-primary" onclick="window.toolsMatic.submitSuggestion()">
            <i class="fas fa-paper-plane"></i> Submit Suggestion
          </button>
        </div>

        <div class="suggestions-list" id="suggestionsList"></div>
      </div>
    `;

    // Always append feedback at the end so the tool UI remains first
    // and suggestions stay last on every tool page.
    const main = document.querySelector('main');
    if (main) {
      const container = document.createElement('section');
      container.className = 'section';
      container.innerHTML = suggestionsHTML;
      main.appendChild(container);
      loadSuggestions();
    } else {
      const footer = document.querySelector('footer');
      if (footer) {
        const section = document.createElement('section');
        section.className = 'section';
        section.innerHTML = suggestionsHTML;
        footer.insertAdjacentElement('beforebegin', section);
        loadSuggestions();
      }
    }
  };

  const loadSuggestions = () => {
    const toolPath = window.location.pathname;
    const suggestions = JSON.parse(localStorage.getItem('toolsmatic-suggestions') || '{}');
    const toolSuggestions = suggestions[toolPath] || [];
    
    const container = document.getElementById('suggestionsList');
    if (!container) return;

    if (toolSuggestions.length === 0) {
      container.innerHTML = '<p class="no-suggestions">No suggestions yet. Be the first to share your ideas!</p>';
      return;
    }

    container.innerHTML = toolSuggestions
      .sort((a, b) => b.likes - a.likes)
      .map((sug, index) => `
        <div class="suggestion-item">
          <div class="suggestion-header">
            <strong>${escapeHtml(sug.name)}</strong>
            <span class="suggestion-date">${new Date(sug.timestamp).toLocaleDateString()}</span>
          </div>
          <p class="suggestion-text">${escapeHtml(sug.text)}</p>
          <button class="suggestion-like-btn ${sug.likedBy?.includes(getUserId()) ? 'liked' : ''}" 
                  onclick="window.toolsMatic.likeSuggestion(${index})">
            <i class="fas fa-heart"></i> <span>${sug.likes || 0}</span>
          </button>
        </div>
      `).join('');
  };

  const submitSuggestion = () => {
    const name = document.getElementById('suggestionName')?.value.trim();
    const text = document.getElementById('suggestionText')?.value.trim();

    if (!name) {
      showToast('Please enter your name', 'error');
      return;
    }

    if (!text) {
      showToast('Please enter your suggestion', 'error');
      return;
    }

    const toolPath = window.location.pathname;
    const suggestions = JSON.parse(localStorage.getItem('toolsmatic-suggestions') || '{}');
    
    if (!suggestions[toolPath]) {
      suggestions[toolPath] = [];
    }

    suggestions[toolPath].push({
      name,
      text,
      timestamp: Date.now(),
      likes: 0,
      likedBy: []
    });

    localStorage.setItem('toolsmatic-suggestions', JSON.stringify(suggestions));
    
    document.getElementById('suggestionName').value = '';
    document.getElementById('suggestionText').value = '';
    
    showToast('Thank you for your suggestion!', 'success');
    loadSuggestions();
  };

  const likeSuggestion = (index) => {
    const toolPath = window.location.pathname;
    const suggestions = JSON.parse(localStorage.getItem('toolsmatic-suggestions') || '{}');
    const toolSuggestions = suggestions[toolPath] || [];
    
    if (!toolSuggestions[index]) return;

    const userId = getUserId();
    const suggestion = toolSuggestions[index];
    
    if (!suggestion.likedBy) suggestion.likedBy = [];
    
    if (suggestion.likedBy.includes(userId)) {
      suggestion.likedBy = suggestion.likedBy.filter(id => id !== userId);
      suggestion.likes = Math.max(0, (suggestion.likes || 0) - 1);
      showToast('Like removed', 'info');
    } else {
      suggestion.likedBy.push(userId);
      suggestion.likes = (suggestion.likes || 0) + 1;
      showToast('Thanks for the like!', 'success');
    }

    suggestions[toolPath] = toolSuggestions;
    localStorage.setItem('toolsmatic-suggestions', JSON.stringify(suggestions));
    loadSuggestions();
  };

  const getUserId = () => {
    let userId = localStorage.getItem('toolsmatic-userid');
    if (!userId) {
      userId = 'user-' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('toolsmatic-userid', userId);
    }
    return userId;
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const enhanceFooter = () => {
    const footer = document.querySelector('footer');
    if (!footer || footer.dataset.footerEnhanced === 'true') return;
    footer.dataset.footerEnhanced = 'true';

    const clone = footer.cloneNode(true);
    clone.querySelectorAll('a, button, nav').forEach((node) => node.remove());

    let copy = clone.textContent
      .replace(/[Ã‚]+/g, ' ')
      .replace(/[â€¢Â·]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!copy || copy.length < 12) {
      copy = 'ToolsMatic - Fast, privacy-first utilities for the web.';
    }

    footer.classList.add('footer-shell');
    footer.innerHTML = '';

    const copyEl = document.createElement('div');
    copyEl.className = 'footer-copy';
    copyEl.textContent = copy;

    const actions = document.createElement('nav');
    actions.className = 'footer-actions';
    actions.setAttribute('aria-label', 'Footer links');

    [
      { href: '/about.html', label: 'About' },
      { href: '/terms.html', label: 'Terms' },
      { href: '/privacy.html', label: 'Privacy Policy' },
      { href: '/contact.html', label: 'Contact' }
    ].forEach(({ href, label }) => {
      const link = document.createElement('a');
      link.className = 'footer-link';
      link.href = href;
      link.textContent = label;
      actions.appendChild(link);
    });

    footer.appendChild(copyEl);
    footer.appendChild(actions);
  };
  const initRelatedTools = () => {
    if (!isToolPage()) return;
    const currentPath = window.location.pathname;
    const toolName = normalizeToolName();
    const category = getHomeCategory(toolName);
    
    // Find related tools (same category, not the current tool)
    const related = TOOL_CATALOG.filter(t => t.category === category && !t.url.includes(currentPath));
    
    // Fallback if not enough in category
    if (related.length < 3) {
      const others = TOOL_CATALOG.filter(t => !t.url.includes(currentPath) && !related.includes(t));
      others.sort(() => 0.5 - Math.random());
      related.push(...others.slice(0, 3 - related.length));
    }
    
    // Pick exactly 3
    related.sort(() => 0.5 - Math.random());
    const selected = related.slice(0, 3);
    
    const relatedHTML = `
      <div class="related-tools-section" style="margin-top: 10px;">
        <h2 style="margin-bottom: 15px; font-size: 22px;">Related Tools</h2>
        <p style="margin-bottom: 25px;">People who use this tool also use these related utilities.</p>
        <div class="grid">
          ${selected.map(t => `
            <a class="card" href="${t.url}">
              <h3>${t.title}</h3>
              <p>${t.description}</p>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    // Inject before suggestions or footer
    const suggestions = document.querySelector('.suggestions-section');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    const container = document.createElement('section');
    container.className = 'section';
    container.innerHTML = relatedHTML;
    
    if (suggestions && suggestions.parentElement) {
      suggestions.parentElement.insertAdjacentElement('beforebegin', container);
    } else if (footer) {
      footer.insertAdjacentElement('beforebegin', container);
    } else if (main) {
      main.appendChild(container);
    }
    
    // Update Schema dynamically for Google
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => {
      try {
        const json = JSON.parse(script.textContent);
        if (json['@type'] === 'SoftwareApplication' || json['@type'] === 'WebApplication') {
          json.isRelatedTo = selected.map(t => ({
            "@type": "SoftwareApplication",
            "name": t.title,
            "url": "https://toolsmatic.me" + t.url
          }));
          script.textContent = JSON.stringify(json, null, 2);
        }
      } catch (e) {}
    });
  };

  const initStarRatings = () => {
    const ratingCard = document.querySelector('.rating-card');
    if (!ratingCard) return;

    const starsContainer = ratingCard.querySelector('.star-rating');
    if (!starsContainer) return;
    const stars = starsContainer.querySelectorAll('.star');
    const valueDisplay = ratingCard.querySelector('.rating-value');
    const countDisplay = ratingCard.querySelector('.rating-count');
    
    const toolSlug = starsContainer.getAttribute('data-slug');
    const storageKey = `rated-toolsmatic-${toolSlug}`;
    
    let seedRating = parseFloat(valueDisplay.textContent) || 4.8;
    let seedCount = parseInt(countDisplay.textContent, 10) || 120;
    
    const userRating = localStorage.getItem(storageKey);
    
    stars.forEach(star => {
      star.style.cursor = 'pointer';
      star.style.transition = 'transform 0.15s ease, color 0.15s ease, text-shadow 0.15s ease';
    });

    function highlightStars(ratingValue) {
      stars.forEach(star => {
        const starValue = parseInt(star.getAttribute('data-value'), 10);
        if (starValue <= ratingValue) {
          star.style.color = '#f59e0b';
          star.style.textShadow = '0 0 10px rgba(245, 158, 11, 0.4)';
        } else {
          star.style.color = 'var(--border, #e5e7eb)';
          star.style.textShadow = 'none';
        }
      });
    }

    function resetStars() {
      if (localStorage.getItem(storageKey)) {
        highlightStars(parseInt(localStorage.getItem(storageKey), 10));
      } else {
        highlightStars(0);
      }
    }

    if (userRating) {
      const ratedVal = parseInt(userRating, 10);
      highlightStars(ratedVal);
      const feedback = ratingCard.querySelector('.rating-feedback');
      if (feedback) {
        feedback.innerHTML = `You rated this tool <strong>${ratedVal} ★</strong>. Thank you for your feedback! <br><span style="font-size:0.85em;color:var(--muted);font-weight:normal;">Average: ${seedRating}/5 (${seedCount} votes)</span>`;
      }
    } else {
      stars.forEach(star => {
        star.addEventListener('mouseover', () => {
          const starValue = parseInt(star.getAttribute('data-value'), 10);
          highlightStars(starValue);
          star.style.transform = 'scale(1.25)';
        });
        
        star.addEventListener('mouseout', () => {
          resetStars();
          star.style.transform = 'scale(1)';
        });
        
        star.addEventListener('click', () => {
          const starValue = parseInt(star.getAttribute('data-value'), 10);
          localStorage.setItem(storageKey, starValue.toString());
          const newCount = seedCount + 1;
          const newRating = ((seedRating * seedCount) + starValue) / newCount;
          const roundedRating = Math.round(newRating * 100) / 100;
          
          starsContainer.style.transform = 'scale(1.1)';
          setTimeout(() => {
            starsContainer.style.transform = 'scale(1)';
          }, 150);
          
          highlightStars(starValue);
          const feedback = ratingCard.querySelector('.rating-feedback');
          if (feedback) {
            feedback.innerHTML = `You rated this tool <strong>${starValue} ★</strong>. Thank you for your feedback! <br><span style="font-size:0.85em;color:var(--muted);font-weight:normal;">Average: ${roundedRating}/5 (${newCount} votes)</span>`;
          }
          
          // Recreate stars without listeners to freeze state
          stars.forEach(s => {
            const clone = s.cloneNode(true);
            s.parentNode.replaceChild(clone, s);
          });
        });
      });
    }
  };

  window.toolsMatic = { 
    showToast, 
    handoffAndGo, 
    consumeHandoff,
    submitSuggestion,
    likeSuggestion,
    trackEvent
  };
  // Back-compat alias for pages using `ToolsMatic` casing
  window.ToolsMatic = window.toolsMatic;
  const boot = () => {
    if (typeof reduceAndReplaceBanners === 'function') reduceAndReplaceBanners();
    if (typeof ensureAdManagerInlineScript === 'function') ensureAdManagerInlineScript();
    if (typeof ensureMbiAdScript === 'function') ensureMbiAdScript();
    if (typeof ensureLegacyAdScript === 'function') ensureLegacyAdScript();
    decorateSiteShell();
    initResponsiveNav();
    initGlobalToolFinder();
    bindKeyboard();
    initThemeToggle();
    initAnalyticsTracking();
    initGlobalToolSeo();
    initRelatedTools();
    initSuggestions();
    initStandardPageExperience();
    initHomeExperience();
    initToolPageExperience();
    decorateAdSlots();
    initResponsiveAds();
    initScrollReveal();
    initInteractiveMotion();
    initStarRatings();
    enhanceFooter();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
