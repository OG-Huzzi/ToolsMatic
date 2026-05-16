(() => {
  const app = document.getElementById('team-balancer-app');
  if (!app) return;

  const $ = (selector) => app.querySelector(selector);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const toast = (message, variant = 'info') => {
    if (window.toolsMatic?.showToast) window.toolsMatic.showToast(message, variant);
  };

  const state = {
    players: [
      { id: uid(), name: 'Aarav', skill: 9 },
      { id: uid(), name: 'Maya', skill: 8 },
      { id: uid(), name: 'Noah', skill: 7 },
      { id: uid(), name: 'Isha', skill: 6 },
      { id: uid(), name: 'Kabir', skill: 5 },
      { id: uid(), name: 'Zara', skill: 4 },
      { id: uid(), name: 'Liam', skill: 3 },
      { id: uid(), name: 'Riya', skill: 2 }
    ],
    teams: [],
    dragged: null
  };

  const els = {
    name: $('#player-name'),
    skill: $('#player-skill'),
    skillValue: $('#skill-value'),
    add: $('#add-player'),
    bulk: $('#bulk-names'),
    bulkSkill: $('#bulk-skill'),
    addBulk: $('#add-bulk'),
    playerList: $('#player-list'),
    mode: $('#balance-mode'),
    teamCount: $('#team-count'),
    teamSize: $('#team-size'),
    generate: $('#generate-teams'),
    shuffle: $('#shuffle-teams'),
    copy: $('#copy-teams'),
    downloadText: $('#download-text'),
    downloadPng: $('#download-png'),
    clear: $('#clear-all'),
    teams: $('#team-results'),
    score: $('#balance-score'),
    scoreFill: $('#balance-score-fill'),
    summary: $('#team-summary')
  };

  const skillClass = (skill) => {
    if (skill <= 3) return 'skill-low';
    if (skill <= 7) return 'skill-mid';
    return 'skill-high';
  };

  const average = (players) => {
    if (!players.length) return 0;
    return players.reduce((sum, player) => sum + Number(player.skill || 0), 0) / players.length;
  };

  const computeBalanceScore = () => {
    if (!state.teams.length) return 0;
    const averages = state.teams.map((team) => average(team.players));
    const range = Math.max(...averages) - Math.min(...averages);
    return Math.max(0, Math.round((1 - Math.min(range / 10, 1)) * 100));
  };

  const teamLetter = (index) => {
    let n = index;
    let name = '';
    do {
      name = String.fromCharCode(65 + (n % 26)) + name;
      n = Math.floor(n / 26) - 1;
    } while (n >= 0);
    return `Team ${name}`;
  };

  const renderPlayers = () => {
    if (!state.players.length) {
      els.playerList.innerHTML = '<p class="team-empty">Add names above or paste a list to start balancing teams.</p>';
      return;
    }

    els.playerList.innerHTML = state.players.map((player) => `
      <article class="team-balancer-player" data-player-id="${player.id}">
        <span class="skill-dot ${skillClass(player.skill)}" aria-hidden="true"></span>
        <input class="team-balancer-input" value="${escapeHtml(player.name)}" aria-label="Player name">
        <select class="team-balancer-select" aria-label="Skill level">
          ${Array.from({ length: 10 }, (_, index) => {
            const value = index + 1;
            return `<option value="${value}"${value === Number(player.skill) ? ' selected' : ''}>Skill ${value}</option>`;
          }).join('')}
        </select>
        <button class="team-balancer-btn team-balancer-btn-danger" type="button" data-remove-player="${player.id}">Remove</button>
      </article>
    `).join('');

    els.playerList.querySelectorAll('.team-balancer-player').forEach((row) => {
      const player = state.players.find((item) => item.id === row.dataset.playerId);
      if (!player) return;
      const input = row.querySelector('input');
      const select = row.querySelector('select');
      input.addEventListener('input', () => {
        player.name = input.value.trim() || 'Unnamed player';
      });
      select.addEventListener('change', () => {
        player.skill = Number(select.value);
        renderPlayers();
        if (state.teams.length) generateTeams(false);
      });
    });

    els.playerList.querySelectorAll('[data-remove-player]').forEach((button) => {
      button.addEventListener('click', () => {
        state.players = state.players.filter((player) => player.id !== button.dataset.removePlayer);
        state.teams = state.teams.map((team) => ({
          ...team,
          players: team.players.filter((player) => player.id !== button.dataset.removePlayer)
        }));
        renderPlayers();
        renderTeams();
      });
    });
  };

  const escapeHtml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const addPlayer = () => {
    const name = els.name.value.trim();
    if (!name) {
      toast('Add a player name first.', 'warning');
      return;
    }
    state.players.push({ id: uid(), name, skill: Number(els.skill.value) });
    els.name.value = '';
    renderPlayers();
    toast('Player added.', 'success');
  };

  const addBulkPlayers = () => {
    const names = els.bulk.value.split(/\r?\n|,/).map((name) => name.trim()).filter(Boolean);
    if (!names.length) {
      toast('Paste at least one name.', 'warning');
      return;
    }
    const skill = Number(els.bulkSkill.value);
    names.forEach((name) => state.players.push({ id: uid(), name, skill }));
    els.bulk.value = '';
    renderPlayers();
    toast(`${names.length} players added.`, 'success');
  };

  const getTeamCount = () => {
    const playerCount = state.players.length;
    if (playerCount === 0) return 0;
    if (els.mode.value === 'size') {
      return Math.max(1, Math.ceil(playerCount / Math.max(1, Number(els.teamSize.value) || 1)));
    }
    return Math.max(1, Math.min(playerCount, Number(els.teamCount.value) || 2));
  };

  const generateTeams = (shuffleTies = true) => {
    if (state.players.length < 2) {
      toast('Add at least two players to create teams.', 'warning');
      return;
    }

    const teamCount = getTeamCount();
    const ranked = [...state.players]
      .map((player) => ({ ...player, tieBreaker: shuffleTies ? Math.random() : 0 }))
      .sort((a, b) => b.skill - a.skill || a.tieBreaker - b.tieBreaker || a.name.localeCompare(b.name));

    const teams = Array.from({ length: teamCount }, (_, index) => ({
      id: uid(),
      name: state.teams[index]?.name || teamLetter(index),
      players: []
    }));

    ranked.forEach((player, index) => {
      const round = Math.floor(index / teamCount);
      const position = index % teamCount;
      const teamIndex = round % 2 === 0 ? position : teamCount - 1 - position;
      teams[teamIndex].players.push({ id: player.id, name: player.name, skill: Number(player.skill) });
    });

    state.teams = teams;
    renderTeams();
    toast('Teams balanced with snake draft distribution.', 'success');
  };

  const renderTeams = () => {
    if (!state.teams.length) {
      els.teams.innerHTML = '<p class="team-empty">Generated teams will appear here with averages, balance score, and drag-and-drop editing.</p>';
      els.score.textContent = '0%';
      els.scoreFill.style.width = '0%';
      els.summary.textContent = `${state.players.length} players ready. Choose team count or team size, then generate.`;
      return;
    }

    const score = computeBalanceScore();
    els.score.textContent = `${score}%`;
    els.scoreFill.style.width = `${score}%`;
    els.summary.textContent = `${state.players.length} players split into ${state.teams.length} teams. Lower average gaps create a higher balance score.`;

    els.teams.innerHTML = state.teams.map((team, index) => {
      const avg = average(team.players);
      const width = Math.round((avg / 10) * 100);
      return `
        <section class="team-card" data-team-index="${index}" style="animation-delay:${index * 55}ms">
          <div class="team-card-header">
            <input class="team-name-input" value="${escapeHtml(team.name)}" aria-label="Team name">
            <span class="team-average">Avg ${avg.toFixed(1)}</span>
          </div>
          <div class="team-skill-bar" aria-label="Average skill">
            <span class="team-skill-fill" style="width:${width}%"></span>
          </div>
          <div class="team-balancer-team-list">
            ${team.players.length ? team.players.map((player) => `
              <div class="player-chip" draggable="true" data-player-id="${player.id}" data-team-index="${index}">
                <span class="skill-dot ${skillClass(player.skill)}" aria-hidden="true"></span>
                <strong>${escapeHtml(player.name)}</strong>
                <span>${player.skill}/10</span>
              </div>
            `).join('') : '<p class="team-empty">Drop players here.</p>'}
          </div>
        </section>
      `;
    }).join('');

    bindTeamEditing();
  };

  const bindTeamEditing = () => {
    els.teams.querySelectorAll('.team-name-input').forEach((input) => {
      const teamCard = input.closest('.team-card');
      input.addEventListener('input', () => {
        state.teams[Number(teamCard.dataset.teamIndex)].name = input.value.trim() || teamLetter(Number(teamCard.dataset.teamIndex));
      });
    });

    els.teams.querySelectorAll('.player-chip').forEach((chip) => {
      chip.addEventListener('dragstart', (event) => {
        state.dragged = {
          playerId: chip.dataset.playerId,
          fromTeam: Number(chip.dataset.teamIndex)
        };
        event.dataTransfer.effectAllowed = 'move';
      });
      chip.addEventListener('dragend', () => {
        state.dragged = null;
        els.teams.querySelectorAll('.team-card').forEach((card) => card.classList.remove('is-drag-over'));
      });
    });

    els.teams.querySelectorAll('.team-card').forEach((card) => {
      card.addEventListener('dragover', (event) => {
        event.preventDefault();
        card.classList.add('is-drag-over');
      });
      card.addEventListener('dragleave', () => card.classList.remove('is-drag-over'));
      card.addEventListener('drop', (event) => {
        event.preventDefault();
        card.classList.remove('is-drag-over');
        if (!state.dragged) return;
        const targetTeam = Number(card.dataset.teamIndex);
        movePlayer(state.dragged.playerId, state.dragged.fromTeam, targetTeam);
      });
    });
  };

  const movePlayer = (playerId, fromTeam, targetTeam) => {
    if (fromTeam === targetTeam) return;
    const source = state.teams[fromTeam];
    const target = state.teams[targetTeam];
    if (!source || !target) return;
    const player = source.players.find((item) => item.id === playerId);
    if (!player) return;
    source.players = source.players.filter((item) => item.id !== playerId);
    target.players.push(player);
    renderTeams();
  };

  const resultsText = () => state.teams.map((team) => {
    const players = team.players.map((player) => `- ${player.name} (${player.skill}/10)`).join('\n') || '- No players';
    return `${team.name} - average skill ${average(team.players).toFixed(1)}\n${players}`;
  }).join('\n\n') + `\n\nBalance score: ${computeBalanceScore()}%`;

  const copyResults = async () => {
    if (!state.teams.length) generateTeams(false);
    try {
      await navigator.clipboard.writeText(resultsText());
      toast('Team results copied.', 'success');
    } catch (_) {
      toast('Clipboard permission was blocked.', 'warning');
    }
  };

  const downloadText = () => {
    if (!state.teams.length) generateTeams(false);
    const blob = new Blob([resultsText()], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'balanced-teams.txt';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const downloadPng = () => {
    if (!state.teams.length) generateTeams(false);
    const width = 1200;
    const cardWidth = 540;
    const lineHeight = 34;
    const rows = Math.ceil(state.teams.length / 2);
    const maxPlayers = Math.max(4, ...state.teams.map((team) => team.players.length));
    const cardHeight = 120 + maxPlayers * lineHeight;
    const height = 170 + rows * (cardHeight + 32);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#06111f';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#eff8ff';
    ctx.font = '800 44px Arial';
    ctx.fillText('Balanced Teams', 48, 70);
    ctx.font = '600 24px Arial';
    ctx.fillStyle = '#9fb2c7';
    ctx.fillText(`Balance score: ${computeBalanceScore()}%`, 48, 110);

    state.teams.forEach((team, index) => {
      const x = 48 + (index % 2) * (cardWidth + 28);
      const y = 145 + Math.floor(index / 2) * (cardHeight + 32);
      roundRect(ctx, x, y, cardWidth, cardHeight, 28, '#0d1f35');
      ctx.fillStyle = '#5eead4';
      ctx.font = '800 28px Arial';
      ctx.fillText(team.name, x + 28, y + 48);
      ctx.fillStyle = '#cbd8e6';
      ctx.font = '700 20px Arial';
      ctx.fillText(`Average ${average(team.players).toFixed(1)}/10`, x + 28, y + 82);
      ctx.font = '600 20px Arial';
      team.players.forEach((player, playerIndex) => {
        ctx.fillStyle = player.skill <= 3 ? '#fb7185' : player.skill <= 7 ? '#facc15' : '#34d399';
        ctx.beginPath();
        ctx.arc(x + 34, y + 120 + playerIndex * lineHeight, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#eff8ff';
        ctx.fillText(`${player.name} - ${player.skill}/10`, x + 54, y + 127 + playerIndex * lineHeight);
      });
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'balanced-teams.png';
    link.click();
  };

  const roundRect = (ctx, x, y, width, height, radius, color) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  };

  const clearAll = () => {
    state.players = [];
    state.teams = [];
    renderPlayers();
    renderTeams();
    toast('Team Balancer reset.', 'info');
  };

  els.skill.addEventListener('input', () => {
    els.skillValue.textContent = els.skill.value;
  });
  els.add.addEventListener('click', addPlayer);
  els.name.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addPlayer();
  });
  els.addBulk.addEventListener('click', addBulkPlayers);
  els.generate.addEventListener('click', () => generateTeams(false));
  els.shuffle.addEventListener('click', () => generateTeams(true));
  els.copy.addEventListener('click', copyResults);
  els.downloadText.addEventListener('click', downloadText);
  els.downloadPng.addEventListener('click', downloadPng);
  els.clear.addEventListener('click', clearAll);
  els.mode.addEventListener('change', () => {
    app.dataset.mode = els.mode.value;
  });

  renderPlayers();
  renderTeams();
})();
