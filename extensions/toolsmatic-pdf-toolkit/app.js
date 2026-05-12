(function () {
  const tools = window.TOOLSMATIC_PDF_TOOLS || [];
  const els = {
    search: document.getElementById('toolSearch'),
    categories: document.getElementById('categoryTabs'),
    list: document.getElementById('toolList'),
    frame: document.getElementById('toolFrame'),
    title: document.getElementById('toolTitle'),
    category: document.getElementById('toolCategory'),
    description: document.getElementById('toolDescription'),
    favorite: document.getElementById('favoriteTool'),
    openCurrent: document.getElementById('openCurrent'),
    reload: document.getElementById('reloadTool'),
    theme: document.getElementById('themeToggle')
  };

  let activeCategory = 'All';
  let activeTool = tools[0];
  const storage = {
    async get(key, fallback) {
      if (globalThis.chrome && chrome.storage && chrome.storage.local) {
        return new Promise(resolve => chrome.storage.local.get(key, result => resolve(result[key] ?? fallback)));
      }
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    async set(key, value) {
      if (globalThis.chrome && chrome.storage && chrome.storage.local) {
        return new Promise(resolve => chrome.storage.local.set({ [key]: value }, resolve));
      }
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  function slugFromHash() {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    return params.get('tool');
  }

  function toolUrl(slug) {
    return `sandbox/tools/${slug}.html`;
  }

  function categories() {
    return ['All', ...Array.from(new Set(tools.map(tool => tool.category))).sort()];
  }

  function filteredTools() {
    const query = els.search.value.trim().toLowerCase();
    return tools.filter(tool => {
      const categoryMatch = activeCategory === 'All' || tool.category === activeCategory;
      const textMatch = !query || `${tool.title} ${tool.description} ${tool.category}`.toLowerCase().includes(query);
      return categoryMatch && textMatch;
    });
  }

  function renderCategories() {
    els.categories.innerHTML = '';
    categories().forEach(category => {
      const button = document.createElement('button');
      button.className = `chip${category === activeCategory ? ' active' : ''}`;
      button.type = 'button';
      button.textContent = category;
      button.addEventListener('click', () => {
        activeCategory = category;
        render();
      });
      els.categories.append(button);
    });
  }

  function renderList() {
    els.list.innerHTML = '';
    filteredTools().forEach(tool => {
      const button = document.createElement('button');
      button.className = `tool-link${activeTool && tool.slug === activeTool.slug ? ' active' : ''}`;
      button.type = 'button';
      button.innerHTML = `<strong>${tool.title}</strong><span>${tool.category} - ${tool.description}</span>`;
      button.addEventListener('click', () => loadTool(tool.slug));
      els.list.append(button);
    });
  }

  async function updateFavoriteLabel() {
    const favorites = await storage.get('favorites', []);
    const saved = activeTool && favorites.includes(activeTool.slug);
    els.favorite.textContent = saved ? 'Saved favorite' : 'Save favorite';
  }

  async function loadTool(slug) {
    activeTool = tools.find(tool => tool.slug === slug) || tools[0];
    if (!activeTool) return;
    location.hash = `tool=${activeTool.slug}`;
    els.title.textContent = activeTool.title;
    els.category.textContent = activeTool.category;
    els.description.textContent = activeTool.description;
    els.frame.src = toolUrl(activeTool.slug);
    const recent = await storage.get('recent', []);
    const nextRecent = [activeTool.slug, ...recent.filter(item => item !== activeTool.slug)].slice(0, 8);
    await storage.set('recent', nextRecent);
    await updateFavoriteLabel();
    renderList();
  }

  async function toggleFavorite() {
    if (!activeTool) return;
    const favorites = await storage.get('favorites', []);
    const next = favorites.includes(activeTool.slug)
      ? favorites.filter(slug => slug !== activeTool.slug)
      : [activeTool.slug, ...favorites].slice(0, 12);
    await storage.set('favorites', next);
    await updateFavoriteLabel();
  }

  function render() {
    renderCategories();
    renderList();
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    els.theme.textContent = theme === 'light' ? 'Light' : 'Dark';
    storage.set('theme', theme);
  }

  els.search.addEventListener('input', renderList);
  els.favorite.addEventListener('click', toggleFavorite);
  els.openCurrent.addEventListener('click', () => {
    if (!activeTool) return;
    window.open(toolUrl(activeTool.slug), '_blank', 'noopener');
  });
  els.reload.addEventListener('click', () => {
    if (els.frame.src) els.frame.src = els.frame.src;
  });
  els.theme.addEventListener('click', async () => {
    const current = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(current);
  });
  window.addEventListener('hashchange', () => loadTool(slugFromHash()));

  (async function boot() {
    setTheme(await storage.get('theme', 'dark'));
    render();
    loadTool(slugFromHash() || 'compress-pdf');
  })();
})();