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
    const isDark = localStorage.getItem('mt-theme') === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
      toggleBtn.textContent = sunIcon;
    } else {
      toggleBtn.textContent = moonIcon;
    }
    toggleBtn.addEventListener('click', () => {
      const isDarkMode = document.documentElement.classList.toggle('dark-mode');
      localStorage.setItem('mt-theme', isDarkMode ? 'dark' : 'light');
      toggleBtn.textContent = isDarkMode ? sunIcon : moonIcon;
      if (window.toolsMatic) window.toolsMatic.showToast(isDarkMode ? 'Dark mode on' : 'Light mode on', 'info');
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
        return /atOptions|adsbygoogle|highperformanceformat|fixesconsessionconsession/i.test(scriptText);
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
      if (!node.querySelector('.ad-slot-label')) {
        const label = document.createElement('span');
        label.className = 'ad-slot-label';
        label.textContent = 'Sponsored';
        node.insertAdjacentElement('afterbegin', label);
      }
    });
  };

  const initScrollReveal = () => {
    const targets = [...new Set([
      ...document.querySelectorAll('.home-intro, .page-intro, .hero, .home-toolbar, .tool-stage, .section, .tool-shell, .card, .ad-slot, .rail-card, .about-section, .team-section, .value-card')
    ])];

    targets.forEach((target) => target.classList.add('scroll-reveal'));

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
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

    targets.forEach((target) => observer.observe(target));
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

  const getHomeCategory = (title) => {
    const key = (title || '').trim().toLowerCase();
    const categoryMap = {
      'word counter': 'Writing',
      'character counter': 'Writing',
      'quote generator': 'Writing',
      'ascii art generator': 'Writing',
      'case converter': 'Writing',
      'markdown previewer': 'Writing',
      'text diff checker': 'Writing',
      'lorem ipsum generator': 'Writing',
      'password generator': 'Developer',
      'json formatter': 'Developer',
      'hash generator': 'Developer',
      'base64 encoder': 'Developer',
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
    let grids = Array.from(hero.querySelectorAll('.grid'));
    const cardsPerBand = 4;
    const bandLabels = [
      { title: 'Popular picks', subtitle: 'The fastest routes into the tools people use most.' },
      { title: 'Writing and creativity', subtitle: 'Draft, refine, and generate without leaving the browser.' },
      { title: 'Developer essentials', subtitle: 'Formatting, validation, and utility tools for daily technical work.' },
      { title: 'Design workflow', subtitle: 'Color, gradients, visuals, and media helpers for polished output.' },
      { title: 'Content workflow', subtitle: 'Preview and test content-heavy tasks in one place.' },
      { title: 'Web utilities', subtitle: 'Encoding, picking, and converting for browser-first workflows.' },
      { title: 'Everyday helpers', subtitle: 'Small practical utilities for quick comparisons and conversions.' },
      { title: 'Data cleanup', subtitle: 'Transform and inspect structured data with less friction.' }
    ];

    cards.forEach((card, index) => {
      const title = card.querySelector('h3')?.textContent?.trim() || `Tool ${index + 1}`;
      const description = card.querySelector('p')?.textContent?.trim() || '';
      const category = getHomeCategory(title);
      card.dataset.category = category;
      card.dataset.search = `${title} ${description} ${category}`.toLowerCase();

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
      const rebuiltGrids = [];

      for (let index = 0; index < cards.length; index += cardsPerBand) {
        const grid = document.createElement('div');
        grid.className = 'grid home-grid';
        cards.slice(index, index + cardsPerBand).forEach((card) => grid.appendChild(card));
        hero.appendChild(grid);
        rebuiltGrids.push(grid);
      }

      grids = rebuiltGrids;
    }

    grids.forEach((grid, index) => {
      grid.classList.add('home-grid');
      const previous = grid.previousElementSibling;
      if (previous && previous.classList.contains('home-grid-label')) return;

      const band = bandLabels[index] || { title: `More tools ${index + 1}`, subtitle: 'Every feature remains available, just easier to browse.' };
      const label = document.createElement('div');
      label.className = 'home-grid-label';

      const copy = document.createElement('div');
      const kicker = document.createElement('span');
      kicker.textContent = `Band ${index + 1}`;
      const title = document.createElement('strong');
      title.textContent = band.title;
      const subtitle = document.createElement('p');
      subtitle.textContent = band.subtitle;
      copy.append(kicker, title, subtitle);

      label.appendChild(copy);
      grid.insertAdjacentElement('beforebegin', label);
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

    let emptyState = hero.querySelector('.home-empty-state');
    if (!emptyState) {
      emptyState = document.createElement('div');
      emptyState.className = 'home-empty-state';
      emptyState.textContent = 'No tools match that search yet. Try a broader keyword.';
      hero.appendChild(emptyState);
    }

    const applyFilters = () => {
      const query = (searchInput?.value || '').trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach((card) => {
        const isVisible = !query || (card.dataset.search || '').includes(query);
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

      const isFiltering = Boolean(query);
      document.body.classList.toggle('home-filtering', isFiltering);
      emptyState.classList.toggle('is-active', visibleCount === 0);
    };

    if (searchInput && !searchInput.dataset.bound) {
      searchInput.dataset.bound = 'true';
      searchInput.addEventListener('input', applyFilters);
    }

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
        <h2>💡 Suggestions & Feedback</h2>
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
      .replace(/[Â]+/g, ' ')
      .replace(/[•·]/g, ' ')
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
    if (typeof ensureAds === 'function') ensureAds();
    decorateSiteShell();
    initResponsiveNav();
    bindKeyboard();
    initThemeToggle();
    initAnalyticsTracking();
    initGlobalToolSeo();
    initSuggestions();
    initStandardPageExperience();
    initHomeExperience();
    initToolPageExperience();
    decorateAdSlots();
    initScrollReveal();
    initInteractiveMotion();
    enhanceFooter();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
