const activeFilters = {
  vibes:     new Set(),
  platforms: new Set(),
  genres:    new Set(),
  diff:      new Set(),
  multiplayer: false,
  search:    ''
};

const difficulties = [
  { id: 'easy',   label: 'Einfach' },
  { id: 'medium', label: 'Mittel'  },
  { id: 'hard',   label: 'Schwer'  }
];

// ─── FILTER LISTE RENDERN ─────────────────────────────────────────────
function renderFilterList(containerId, items, filterSet) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = '';
  items.forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'filter-item';
    btn.innerHTML = `<span class="filter-dot"></span>${item.label || item}`;
    btn.addEventListener('click', () => {
      const id = item.id || item;
      if (filterSet.has(id)) {
        filterSet.delete(id);
        btn.classList.remove('active');
      } else {
        filterSet.add(id);
        btn.classList.add('active');
      }
      applyFilters();
    });
    wrap.appendChild(btn);
  });
}

// ─── ALLE FILTER RENDERN ──────────────────────────────────────────────
function renderAllFilters() {
  renderFilterList('filterVibes',     vibes,        activeFilters.vibes);
  renderFilterList('filterPlatforms', platforms,    activeFilters.platforms);
  renderFilterList(
    'filterGenres',
    genres.map(g => ({ id: g, label: g.charAt(0).toUpperCase() + g.slice(1) })),
    activeFilters.genres
  );
  renderFilterList('filterDiff', difficulties, activeFilters.diff);
}

// ─── GAMES GRID RENDERN ───────────────────────────────────────────────
function renderGamesGrid(gamesList) {
  const grid    = document.getElementById('gamesGrid');
  const noRes   = document.getElementById('noResults');
  const count   = document.getElementById('resultCount');
  if (!grid) return;

  grid.innerHTML = '';
  count.textContent = `${gamesList.length} Game${gamesList.length !== 1 ? 's' : ''}`;

  if (gamesList.length === 0) {
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';

  const thumbEmojis = {
    action: '⚔️', rpg: '🧙', shooter: '🔫', strategy: '♟️',
    simulation: '🌾', puzzle: '🧩', platformer: '🏃', horror: '👻',
    sport: '⚽', racing: '🏎️', indie: '🎨', sandbox: '⛏️',
    roguelite: '🎲', party: '🎉', adventure: '🗺️'
  };

  gamesList.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.onclick = () => {
      localStorage.setItem('viberoll_result', JSON.stringify(game));
      window.location.href = 'results.html';
    };
    card.innerHTML = `
      <div class="game-card-thumb" data-title="${game.title}" data-emoji="${thumbEmojis[game.genre[0]] || '🎮'}"></div>
      <div class="game-card-body">
        <div class="game-card-title">${game.title}</div>
        <div class="game-card-meta">
          <span class="rating">★ ${game.rating}</span> · ${game.genre[0]}
        </div>
        <div class="game-card-tags">
          ${game.vibe.slice(0, 2).map(v => `<span class="tag tag-accent">${v}</span>`).join('')}
          ${game.multiplayer ? '<span class="tag">Multiplayer</span>' : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─── FILTER ANWENDEN ──────────────────────────────────────────────────
function applyFilters() {
  const sortVal = document.getElementById('sortSelect')?.value || 'rating';

  let filtered = filterGames({
    vibes:         [...activeFilters.vibes],
    platforms:     [...activeFilters.platforms],
    genres:        [...activeFilters.genres],
    multiplayerOnly: activeFilters.multiplayer,
    search:        activeFilters.search
  });

  // Schwierigkeit extra filtern
  if (activeFilters.diff.size > 0) {
    filtered = filtered.filter(g => activeFilters.diff.has(g.difficulty));
  }

  // Sortieren
  filtered.sort((a, b) => {
    if (sortVal === 'rating') return b.rating - a.rating;
    if (sortVal === 'title')  return a.title.localeCompare(b.title);
    if (sortVal === 'year')   return b.releaseYear - a.releaseYear;
    return 0;
  });

  renderGamesGrid(filtered);
  loadAllCovers();
}

// ─── FILTER ZURÜCKSETZEN ──────────────────────────────────────────────
function resetFilters() {
  activeFilters.vibes.clear();
  activeFilters.platforms.clear();
  activeFilters.genres.clear();
  activeFilters.diff.clear();
  activeFilters.multiplayer = false;
  activeFilters.search = '';

  document.querySelectorAll('.filter-item').forEach(el => el.classList.remove('active'));
  const mp = document.getElementById('multiplayerFilter');
  if (mp) mp.checked = false;
  const si = document.getElementById('searchInput');
  if (si) si.value = '';

  applyFilters();
}

// ─── EVENT LISTENERS ──────────────────────────────────────────────────
document.getElementById('searchInput')?.addEventListener('input', e => {
  activeFilters.search = e.target.value;
  applyFilters();
});

document.getElementById('multiplayerFilter')?.addEventListener('change', e => {
  activeFilters.multiplayer = e.target.checked;
  applyFilters();
});

document.getElementById('navToggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// ─── INIT ─────────────────────────────────────────────────────────────
renderAllFilters();
applyFilters();