(function () {
  const tools = window.TOOLSMATIC_PDF_TOOLS || [];
  const list = document.getElementById('tools');
  const search = document.getElementById('search');
  const openApp = document.getElementById('openApp');

  function openTool(slug) {
    const url = chrome.runtime.getURL(`app.html#tool=${slug}`);
    chrome.tabs.create({ url });
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    list.innerHTML = '';
    tools
      .filter(tool => !query || `${tool.title} ${tool.category} ${tool.description}`.toLowerCase().includes(query))
      .slice(0, 16)
      .forEach(tool => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'tool';
        button.innerHTML = `<strong>${tool.title}</strong><span>${tool.category}</span>`;
        button.addEventListener('click', () => openTool(tool.slug));
        list.append(button);
      });
  }

  search.addEventListener('input', render);
  openApp.addEventListener('click', () => chrome.tabs.create({ url: chrome.runtime.getURL('app.html') }));
  render();
})();