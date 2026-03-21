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

    // Prefer explicit anchor for deterministic placement on tool pages
    const explicitAnchor = document.getElementById('tool-feedback-anchor');
    if (explicitAnchor) {
      const container = document.createElement('section');
      container.className = 'section';
      container.innerHTML = suggestionsHTML;
      explicitAnchor.insertAdjacentElement('beforebegin', container);
      loadSuggestions();
      return;
    }

    // Fallback: insert before first section or before footer if no section exists
    const firstSection = document.querySelector('main .section');
    if (firstSection) {
      const container = document.createElement('section');
      container.className = 'section';
      container.innerHTML = suggestionsHTML;
      firstSection.insertAdjacentElement('beforebegin', container);
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

  window.toolsMatic = { 
    showToast, 
    handoffAndGo, 
    consumeHandoff,
    submitSuggestion,
    likeSuggestion
  };
  // Back-compat alias for pages using `ToolsMatic` casing
  window.ToolsMatic = window.toolsMatic;
  const boot = () => {
    if (typeof reduceAndReplaceBanners === 'function') reduceAndReplaceBanners();
    if (typeof ensureAdManagerInlineScript === 'function') ensureAdManagerInlineScript();
    if (typeof ensureMbiAdScript === 'function') ensureMbiAdScript();
    if (typeof ensureLegacyAdScript === 'function') ensureLegacyAdScript();
    if (typeof ensureAds === 'function') ensureAds();
    bindKeyboard();
    initThemeToggle();
    initSuggestions();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
