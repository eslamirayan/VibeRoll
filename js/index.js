const selectedVibes     = new Set();
const selectedPlatforms = new Set();
const selectedGenres    = new Set();

// ─── VIBE CARDS RENDERN ───────────────────────────────────────────────
function renderVibes() {
  const grid = document.getElementById('vibeGrid');
  grid.innerHTML = '';
  vibes.forEach(v => {
    const card = document.createElement('div');
    card.className = 'vibe-card';
    card.dataset.id = v.id;
    card.innerHTML = `
      <span class="vibe-icon">${v.icon}</span>
      <div class="vibe-info">
        <div class="vibe-name">${v.label}</div>
        <div class="vibe-desc">${v.desc}</div>
      </div>
    `;
    card.addEventListener('click', () => toggleVibe(v.id, card));
    grid.appendChild(card);
  });
}

function toggleVibe(id, card) {
  if (selectedVibes.has(id)) {
    selectedVibes.delete(id);
    card.classList.remove('selected');
  } else {
    selectedVibes.add(id);
    card.classList.add('selected');
  }
  updateRollBtn();
}

// ─── PLATFORM BUTTONS RENDERN ─────────────────────────────────────────
function renderPlatforms() {
  const row = document.getElementById('platformRow');
  row.innerHTML = '';
  platforms.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'platform-btn';
    btn.textContent = p.label;
    btn.dataset.id = p.id;
    btn.addEventListener('click', () => togglePlatform(p.id, btn));
    row.appendChild(btn);
  });
}

function togglePlatform(id, btn) {
  if (selectedPlatforms.has(id)) {
    selectedPlatforms.delete(id);
    btn.classList.remove('selected');
  } else {
    selectedPlatforms.add(id);
    btn.classList.add('selected');
  }
}

// ─── GENRE PILLS RENDERN ──────────────────────────────────────────────
function renderGenres() {
  const wrap = document.getElementById('genrePills');
  wrap.innerHTML = '';
  genres.forEach(g => {
    const pill = document.createElement('button');
    pill.className = 'genre-pill';
    pill.textContent = g.charAt(0).toUpperCase() + g.slice(1);
    pill.dataset.id = g;
    pill.addEventListener('click', () => toggleGenre(g, pill));
    wrap.appendChild(pill);
  });
}

function toggleGenre(id, pill) {
  if (selectedGenres.has(id)) {
    selectedGenres.delete(id);
    pill.classList.remove('selected');
  } else {
    selectedGenres.add(id);
    pill.classList.add('selected');
  }
}

// ─── ROLL BUTTON STATUS ───────────────────────────────────────────────
function updateRollBtn() {
  const btn  = document.getElementById('rollBtn');
  const hint = document.getElementById('rollHint');
  const hasVibe = selectedVibes.size > 0;
  btn.disabled = !hasVibe;
  hint.textContent = hasVibe
    ? `${filterGames({ vibes: [...selectedVibes] }).length} Games passen zu deiner Auswahl`
    : 'Wähle mindestens einen Vibe';
}

// ─── ZUR ERGEBNISSEITE ────────────────────────────────────────────────
function goToResult() {
  const multiplayerOnly = document.getElementById('multiplayerToggle').checked;
  const filters = {
    vibes:         [...selectedVibes],
    platforms:     [...selectedPlatforms],
    genres:        [...selectedGenres],
    multiplayerOnly
  };
  const game = getRandomGame(filters);
  if (!game) {
    alert('Keine Games gefunden! Versuche weniger Filter.');
    return;
  }
  localStorage.setItem('viberoll_result', JSON.stringify(game));
  localStorage.setItem('viberoll_filters', JSON.stringify(filters));
  window.location.href = 'results.html';
}

// ─── TOP PICKS RENDERN ────────────────────────────────────────────────
function renderTopPicks() {
  const grid = document.getElementById('picksGrid');
  const topGames = [...games]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  topGames.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.onclick = () => {
      localStorage.setItem('viberoll_result', JSON.stringify(game));
      window.location.href = 'results.html';
    };
    card.innerHTML = `
      <div class="game-card-thumb" data-title="${game.title}" data-emoji="🎮"></div>
      <div class="game-card-body">
        <div class="game-card-title">${game.title}</div>
        <div class="game-card-meta">
          <span class="rating">★ ${game.rating}</span> · ${game.genre[0]}
        </div>
        <div class="game-card-tags">
          ${game.vibe.slice(0,2).map(v => `<span class="tag tag-accent">${v}</span>`).join('')}
          <span class="tag">${game.platform.join(', ')}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ─── NAV TOGGLE (MOBIL) ──────────────────────────────────────────────
document.getElementById('navToggle').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// ─── INIT ─────────────────────────────────────────────────────────────
renderVibes();
renderPlatforms();
renderGenres();
renderTopPicks();
updateRollBtn();
loadAllCovers();